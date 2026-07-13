'use client'

// components/catalog/DesignModal.tsx
//
// Botón "Crea tu diseño" + modal con el editor de esquí personalizado.
// Hay DOS canvases superpuestos, ambos con tamaño en píxeles EXPLÍCITO:
//  - "design" (designCanvasRef): el diseño real — silueta, acabado de
//    fondo, imágenes y textos del usuario. Es el ÚNICO que se descarga
//    o se envía como imagen compuesta.
//  - "guide" (guideCanvasRef): capa transparente encima, solo con las
//    líneas discontinuas de las zonas nose/tail y el marco de selección.
//    Nunca se exporta ni se envía — es puramente visual/interactivo.
//
// Los elementos que el usuario coloca (`items`) pueden ser de tipo
// 'image' o 'text', ambos comparten posición/escala/rotación y viven
// siempre dentro de una zona (nose o tail).
//
// ── SEGURIDAD ──────────────────────────────────────────────────────────
// 1. Honeypot anti-bot en el formulario de compra.
// 2. Los límites de tamaño/tipo del archivo final se aplican también en
//    el bucket de Supabase (Storage → design-images → Edit bucket).
// 3. Las imágenes del editor NO se suben a Supabase mientras se están
//    editando — viven solo en memoria del navegador. Se suben (el PNG
//    final + cada imagen original) únicamente al pulsar "Enviar pedido".
// ──────────────────────────────────────────────────────────────────────

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  SKI_PATH,
  NOSE_ZONE,
  TAIL_ZONE,
  LOGO_BASE_SIZE,
  TEXT_BASE_FONT_SIZE,
  SKI_BASE_COLOR,
  type Zone,
} from '@/lib/skiShape'

type Acabado = {
  id: string
  nombre: string
  imageUrl: string | null
}

type Product = {
  id: string
  nombre: string
  slug: string
  precio: number
}

type Props = {
  product: Product
  acabados: Acabado[]
}

type Step = 'editor' | 'form' | 'sent'
type ZoneKey = 'nose' | 'tail'
type ItemType = 'image' | 'text'

type PlacedItem = {
  id: string
  type: ItemType
  zone: ZoneKey
  x: number
  y: number
  scale: number
  rotation: number // grados
  // solo para type === 'image'
  img?: HTMLImageElement
  file?: File
  // solo para type === 'text'
  text?: string
  color?: string
}

type OrderForm = {
  nombre: string
  email: string
  telefono: string
  mensaje: string
}

const EMPTY_ORDER_FORM: OrderForm = {
  nombre: '',
  email: '',
  telefono: '',
  mensaje: '',
}

const MAX_UPLOAD_BYTES = 8 * 1024 * 1024 // 8 MB
const DEFAULT_TEXT_COLOR = '#1b130c'

// Alturas de visualización en píxeles reales (nunca 'auto')
const DISPLAY_HEIGHT_NORMAL = 420
const DISPLAY_HEIGHT_ZOOMED = 680

function drawImageCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, zone: Zone) {
  const scale = Math.max(zone.width / img.width, zone.height / img.height)
  const w = img.width * scale
  const h = img.height * scale
  const x = zone.x + (zone.width - w) / 2
  const y = zone.y + (zone.height - h) / 2
  ctx.drawImage(img, x, y, w, h)
}

function zoneOf(key: ZoneKey): Zone {
  return key === 'nose' ? NOSE_ZONE : TAIL_ZONE
}

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

// Extensión (medio-ancho / medio-alto) del elemento, usada para el hit
// test, el arrastre y el marco de selección. Para texto se mide con el
// propio contexto del canvas (measureText no dibuja nada).
function getItemHalfExtents(item: PlacedItem, ctx: CanvasRenderingContext2D | null) {
  if (item.type === 'image') {
    const size = LOGO_BASE_SIZE * item.scale
    return { halfW: size / 2, halfH: size / 2, fontSize: 0 }
  }
  const fontSize = TEXT_BASE_FONT_SIZE * item.scale
  let width = fontSize * (item.text?.length ?? 1) * 0.55
  if (ctx) {
    ctx.font = `600 ${fontSize}px sans-serif`
    width = ctx.measureText(item.text || ' ').width
  }
  return { halfW: width / 2, halfH: (fontSize * 1.15) / 2, fontSize }
}

export default function DesignModal({ product, acabados }: Props) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<Step>('editor')
  const [zoomed, setZoomed] = useState(false)

  // Canvas del diseño real (lo único que se descarga/envía)
  const designCanvasRef = useRef<HTMLCanvasElement>(null)
  // Canvas guía superpuesto (zonas + selección) — solo visual
  const guideCanvasRef = useRef<HTMLCanvasElement>(null)

  const [activeZone, setActiveZone] = useState<ZoneKey>('nose')

  // El esquí se ve desde el primer instante (SKI_BASE_COLOR). El acabado
  // es opcional y, si se elige, cubre TODO el esquí como fondo.
  const [finish, setFinish] = useState<Acabado | null>(null)
  const [finishImgEl, setFinishImgEl] = useState<HTMLImageElement | null>(null)

  // Elementos colocados por el usuario: imágenes y/o textos, cada uno
  // con su zona.
  const [items, setItems] = useState<PlacedItem[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const dragOffsetRef = useRef({ dx: 0, dy: 0 })

  const [newText, setNewText] = useState('')

  const [form, setForm] = useState<OrderForm>(EMPTY_ORDER_FORM)
  const [honeypot, setHoneypot] = useState('')

  // "Ya tengo mi diseño" — si se marca y se sube un archivo, el diseño
  // del editor queda completamente anulado: NO se envía bajo ningún caso.
  const [useOwnDesign, setUseOwnDesign] = useState(false)
  const [ownDesignFile, setOwnDesignFile] = useState<File | null>(null)

  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState(false)

  const selectedItem = items.find((item) => item.id === selectedId) ?? null

  // ── Tamaño de visualización EN PÍXELES EXPLÍCITOS ───────────────────
  const displayHeight = zoomed ? DISPLAY_HEIGHT_ZOOMED : DISPLAY_HEIGHT_NORMAL
  const displayWidth = Math.round((CANVAS_WIDTH / CANVAS_HEIGHT) * displayHeight)

  // ── Cargar imagen del acabado elegido (global, todo el esquí) ──────
  useEffect(() => {
    if (!finish?.imageUrl) { setFinishImgEl(null); return }
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => setFinishImgEl(img)
    img.src = finish.imageUrl
  }, [finish])

  // ── Redibujar el canvas del DISEÑO (lo que se exporta) ──────────────
  useEffect(() => {
    const canvas = designCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    const skiPath = new Path2D(SKI_PATH)

    // Base + acabado (cubre TODO el esquí), clipado a la silueta
    ctx.save()
    ctx.clip(skiPath)
    ctx.fillStyle = SKI_BASE_COLOR
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    if (finishImgEl) {
      drawImageCover(ctx, finishImgEl, { x: 0, y: 0, width: CANVAS_WIDTH, height: CANVAS_HEIGHT })
    }
    ctx.restore()

    // Elementos del usuario (imagen o texto) — clipados a la silueta Y a
    // su zona, así nunca pueden salirse ni del esquí ni de nose/tail.
    items.forEach((item) => {
      const zone = zoneOf(item.zone)

      ctx.save()
      ctx.clip(skiPath)
      ctx.beginPath()
      ctx.rect(zone.x, zone.y, zone.width, zone.height)
      ctx.clip()
      ctx.translate(item.x, item.y)
      ctx.rotate((item.rotation * Math.PI) / 180)

      if (item.type === 'image' && item.img) {
        const size = LOGO_BASE_SIZE * item.scale
        ctx.drawImage(item.img, -size / 2, -size / 2, size, size)
      } else if (item.type === 'text') {
        const fontSize = TEXT_BASE_FONT_SIZE * item.scale
        ctx.font = `600 ${fontSize}px sans-serif`
        ctx.fillStyle = item.color || DEFAULT_TEXT_COLOR
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(item.text || '', 0, 0)
      }

      ctx.restore()
    })

    // Contorno del esquí — sí forma parte del diseño final
    ctx.strokeStyle = 'rgba(27,19,12,0.4)'
    ctx.lineWidth = 2
    ctx.stroke(skiPath)
  }, [finishImgEl, items])

  // ── Redibujar el canvas GUÍA (zonas + selección — nunca se exporta) ─
  useEffect(() => {
    const canvas = guideCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    ;([
      { key: 'nose' as ZoneKey, zone: NOSE_ZONE },
      { key: 'tail' as ZoneKey, zone: TAIL_ZONE },
    ]).forEach(({ key, zone }) => {
      ctx.save()
      ctx.setLineDash([6, 4])
      ctx.strokeStyle = key === activeZone ? '#C4A882' : 'rgba(196,168,130,0.35)'
      ctx.lineWidth = key === activeZone ? 2.5 : 1.5
      ctx.strokeRect(zone.x, zone.y, zone.width, zone.height)
      ctx.restore()
    })

    if (selectedId) {
      const item = items.find((i) => i.id === selectedId)
      if (item) {
        const { halfW, halfH } = getItemHalfExtents(item, ctx)
        ctx.save()
        ctx.translate(item.x, item.y)
        ctx.rotate((item.rotation * Math.PI) / 180)
        ctx.strokeStyle = 'rgba(255,255,255,0.9)'
        ctx.lineWidth = 1.5
        ctx.setLineDash([4, 3])
        ctx.strokeRect(-halfW, -halfH, halfW * 2, halfH * 2)
        ctx.restore()
      }
    }
  }, [activeZone, items, selectedId])

  // ── Selección y arrastre (ratón / táctil vía Pointer Events) ───────
  function getCanvasPos(e: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = guideCanvasRef.current!
    const rect = canvas.getBoundingClientRect()
    const scaleX = CANVAS_WIDTH / rect.width
    const scaleY = CANVAS_HEIGHT / rect.height
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    }
  }

  function handlePointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    const pos = getCanvasPos(e)
    const ctx = guideCanvasRef.current?.getContext('2d') ?? null

    for (let i = items.length - 1; i >= 0; i--) {
      const item = items[i]
      const { halfW, halfH } = getItemHalfExtents(item, ctx)
      const dx = pos.x - item.x
      const dy = pos.y - item.y
      if (Math.abs(dx) <= halfW && Math.abs(dy) <= halfH) {
        setSelectedId(item.id)
        setDragging(true)
        dragOffsetRef.current = { dx, dy }
        guideCanvasRef.current?.setPointerCapture(e.pointerId)
        return
      }
    }
    setSelectedId(null)
  }

  function handlePointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!dragging || !selectedId) return
    const pos = getCanvasPos(e)
    const ctx = guideCanvasRef.current?.getContext('2d') ?? null

    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== selectedId) return item

        const zone = zoneOf(item.zone)
        const { halfW, halfH } = getItemHalfExtents(item, ctx)
        const nx = pos.x - dragOffsetRef.current.dx
        const ny = pos.y - dragOffsetRef.current.dy

        const minX = Math.min(zone.x + halfW, zone.x + zone.width - halfW)
        const maxX = Math.max(zone.x + halfW, zone.x + zone.width - halfW)
        const minY = Math.min(zone.y + halfH, zone.y + zone.height - halfH)
        const maxY = Math.max(zone.y + halfH, zone.y + zone.height - halfH)

        return {
          ...item,
          x: Math.min(Math.max(nx, minX), maxX),
          y: Math.min(Math.max(ny, minY), maxY),
        }
      })
    )
  }

  function handlePointerUp() {
    setDragging(false)
  }

  // ── Añadir imagen a la zona activa ──────────────────────────────
  function handleAddImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecciona un archivo de imagen.')
      e.target.value = ''
      return
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      alert('La imagen es demasiado grande. El tamaño máximo es 8MB.')
      e.target.value = ''
      return
    }

    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      const zone = zoneOf(activeZone)
      const id = makeId()
      setItems((prev) => [
        ...prev,
        {
          id,
          type: 'image',
          zone: activeZone,
          x: zone.x + zone.width / 2,
          y: zone.y + zone.height / 2,
          scale: 1,
          rotation: 0,
          img,
          file, // se conserva el archivo original para enviarlo tal cual al pedido
        },
      ])
      setSelectedId(id)
      URL.revokeObjectURL(url)
    }
    img.onerror = () => {
      alert('No se ha podido cargar esa imagen.')
      URL.revokeObjectURL(url)
    }
    img.src = url
    e.target.value = ''
  }

  // ── Añadir texto a la zona activa ───────────────────────────────
  function handleAddText() {
    const text = newText.trim()
    if (!text) return

    const zone = zoneOf(activeZone)
    const id = makeId()
    setItems((prev) => [
      ...prev,
      {
        id,
        type: 'text',
        zone: activeZone,
        x: zone.x + zone.width / 2,
        y: zone.y + zone.height / 2,
        scale: 1,
        rotation: 0,
        text,
        color: DEFAULT_TEXT_COLOR,
      },
    ])
    setSelectedId(id)
    setNewText('')
  }

  function updateSelectedItem(patch: Partial<Pick<PlacedItem, 'scale' | 'rotation' | 'text' | 'color'>>) {
    if (!selectedId) return
    setItems((prev) =>
      prev.map((item) => (item.id === selectedId ? { ...item, ...patch } : item))
    )
  }

  function removeSelectedItem() {
    if (!selectedId) return
    setItems((prev) => prev.filter((item) => item.id !== selectedId))
    setSelectedId(null)
  }

  // ── Guardar diseño en el ordenador (solo el canvas del diseño) ─────
  function handleDownload() {
    const canvas = designCanvasRef.current
    if (!canvas) return
    canvas.toBlob((blob) => {
      if (!blob) return
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `diseno-${product.slug}.png`
      a.click()
      URL.revokeObjectURL(url)
    }, 'image/png')
  }

  // ── Formulario de compra ────────────────────────────────────────
  function handleFormChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleOwnDesignFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecciona un archivo de imagen.')
      e.target.value = ''
      return
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      alert('La imagen es demasiado grande. El tamaño máximo es 8MB.')
      e.target.value = ''
      return
    }

    setOwnDesignFile(file)
  }

  // Sube cada imagen ORIGINAL colocada en el editor (sin recomprimir),
  // para que el diseñador trabaje con la fuente real, no solo con el
  // PNG compuesto del canvas. Solo se llama cuando se usa el editor
  // (nunca cuando el cliente sube su propio diseño ya terminado).
  async function uploadOriginalImages(): Promise<string[]> {
    const imageItems = items.filter(
      (item): item is PlacedItem & { file: File } => item.type === 'image' && !!item.file
    )

    const urls: string[] = []
    for (const item of imageItems) {
      const extension = (item.file.type.split('/')[1] || 'png').replace('jpeg', 'jpg')
      const fileName = `originals/${Date.now()}-${makeId()}.${extension}`

      const { error } = await supabase.storage
        .from('design-images')
        .upload(fileName, item.file, { contentType: item.file.type || 'image/png' })

      if (error) {
        console.error('Error subiendo imagen original:', error)
        continue
      }

      const { data } = supabase.storage.from('design-images').getPublicUrl(fileName)
      urls.push(data.publicUrl)
    }
    return urls
  }

  async function handleSubmitOrder(e: React.FormEvent) {
    e.preventDefault()

    // ── SEGURIDAD: honeypot ──────────────────────────────────────
    if (honeypot) {
      setStep('sent')
      return
    }

    setSending(true)
    setSendError(false)

    let blob: Blob | null = null
    let contentType = 'image/png'
    let originalUrls: string[] = []

    // Si el usuario marcó "ya tengo mi diseño" Y subió un archivo,
    // el diseño del editor queda TOTALMENTE anulado: ni se lee el
    // canvas ni se suben imágenes originales del editor.
    if (useOwnDesign && ownDesignFile) {
      blob = ownDesignFile
      contentType = ownDesignFile.type || 'image/png'
    } else {
      const canvas = designCanvasRef.current
      if (!canvas) {
        setSending(false)
        setSendError(true)
        return
      }
      blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob((b) => resolve(b), 'image/png')
      )
      originalUrls = await uploadOriginalImages()
    }

    if (!blob) {
      setSending(false)
      setSendError(true)
      return
    }

    const extension = contentType.split('/')[1] || 'png'
    const fileName = `${Date.now()}-diseno-${product.slug}.${extension}`

    const { error: uploadError } = await supabase.storage
      .from('design-images')
      .upload(fileName, blob, { contentType })

    if (uploadError) {
      console.error(uploadError)
      setSending(false)
      setSendError(true)
      return
    }

    const { data: publicUrlData } = supabase.storage
      .from('design-images')
      .getPublicUrl(fileName)

    const { error: insertError } = await supabase.from('message').insert({
      nombre: form.nombre,
      email: form.email,
      telefono: form.telefono || null,
      asunto: `Diseño personalizado — ${product.nombre}`,
      mensaje: form.mensaje || 'Sin notas adicionales.',
      estado: 'nuevo',
      producto_id: product.id,
      tipo: 'diseno',
      imagen_diseno_url: publicUrlData.publicUrl,
      imagenes_originales_urls: originalUrls,
    })

    setSending(false)

    if (insertError) {
      console.error(insertError)
      setSendError(true)
      return
    }

    setStep('sent')
  }

  function closeModal() {
    setOpen(false)
    setStep('editor')
    setSendError(false)
    setHoneypot('')
    setUseOwnDesign(false)
    setOwnDesignFile(null)
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="
          mt-4 inline-flex w-full items-center justify-center gap-2
          border border-[var(--border-hover)] px-8 py-4
          text-sm font-medium tracking-[0.15em] uppercase text-[var(--text-muted)]
          transition-colors hover:border-[var(--accent)] hover:text-[var(--foreground)]
          lg:w-auto
        "
      >
        Crea tu diseño
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--overlay-heavy)] px-3 py-6 sm:px-4 sm:py-8">
          <div className="relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-y-auto rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-4 sm:p-6 lg:p-8">
            <button
              type="button"
              onClick={closeModal}
              className="absolute right-4 top-4 text-xl leading-none text-[var(--text-muted)] transition hover:text-[var(--foreground)] sm:right-5 sm:top-5"
              aria-label="Cerrar"
            >
              ×
            </button>

            <h2
              className="mb-6 text-xl font-light text-[var(--foreground)] sm:text-2xl"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Crea tu diseño
            </h2>

            {step !== 'sent' && (
              <div className="grid gap-8 sm:grid-cols-[auto_1fr]">
                {/* CANVAS — fijo mientras se hace scroll en los controles */}
                <div className="flex flex-col items-center gap-3 sm:sticky sm:top-0 sm:self-start">
                  <div
                    style={{
                      position: 'relative',
                      width: displayWidth,
                      height: displayHeight,
                    }}
                  >
                    <canvas
                      ref={designCanvasRef}
                      width={CANVAS_WIDTH}
                      height={CANVAS_HEIGHT}
                      style={{ width: displayWidth, height: displayHeight }}
                      className="absolute inset-0 rounded-lg border border-[var(--border)]"
                    />
                    <canvas
                      ref={guideCanvasRef}
                      width={CANVAS_WIDTH}
                      height={CANVAS_HEIGHT}
                      onPointerDown={handlePointerDown}
                      onPointerMove={handlePointerMove}
                      onPointerUp={handlePointerUp}
                      onPointerLeave={handlePointerUp}
                      style={{ width: displayWidth, height: displayHeight, touchAction: 'none' }}
                      className="absolute inset-0 cursor-grab rounded-lg active:cursor-grabbing"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => setZoomed((v) => !v)}
                    className="text-xs text-[var(--text-muted)] underline underline-offset-2 transition hover:text-[var(--foreground)]"
                  >
                    {zoomed ? 'Ver tamaño normal' : 'Ver más grande'}
                  </button>

                  <p className="max-w-[220px] text-center text-xs text-[var(--text-muted)]">
                    Toca un elemento para moverlo, rotarlo o escalarlo con el ratón o el dedo.
                  </p>
                </div>

                {/* CONTROLES */}
                <div className="space-y-6">
                  {/* Acabado global del esquí */}
                  <div>
                    <p className="mb-2 text-xs uppercase tracking-[0.2em] text-[var(--accent)]">
                      Acabado del esquí
                    </p>
                    <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
                      {acabados.map((acabado) => (
                        <button
                          key={acabado.id}
                          type="button"
                          title={acabado.nombre}
                          onClick={() => setFinish(acabado)}
                          className={`relative aspect-square overflow-hidden rounded-md border-2 transition ${
                            finish?.id === acabado.id ? 'border-[var(--accent)]' : 'border-[var(--border)]'
                          }`}
                          style={{
                            backgroundImage: acabado.imageUrl ? `url(${acabado.imageUrl})` : undefined,
                            backgroundColor: acabado.imageUrl ? undefined : SKI_BASE_COLOR,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                          }}
                        />
                      ))}
                    </div>
                    <p className="mt-1.5 text-xs text-[var(--text-soft)]">
                      El acabado cubre todo el esquí como fondo.
                    </p>
                  </div>

                  {/* Selector de zona */}
                  <div>
                    <p className="mb-2 text-xs uppercase tracking-[0.2em] text-[var(--accent)]">
                      Añadir contenido en
                    </p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveZone('nose')}
                        className={`flex-1 rounded-lg border px-4 py-2 text-sm transition ${
                          activeZone === 'nose'
                            ? 'border-[var(--accent)] text-[var(--foreground)]'
                            : 'border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--border-hover)]'
                        }`}
                      >
                        Zona Nose
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveZone('tail')}
                        className={`flex-1 rounded-lg border px-4 py-2 text-sm transition ${
                          activeZone === 'tail'
                            ? 'border-[var(--accent)] text-[var(--foreground)]'
                            : 'border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--border-hover)]'
                        }`}
                      >
                        Zona Tail
                      </button>
                    </div>
                  </div>

                  {/* Añadir imagen */}
                  <div>
                    <p className="mb-2 text-xs uppercase tracking-[0.2em] text-[var(--accent)]">
                      Añadir imagen ({activeZone === 'nose' ? 'Nose' : 'Tail'})
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAddImage}
                      className="block w-full text-xs text-[var(--text-muted)] file:mr-3 file:rounded-lg file:border file:border-[var(--border)] file:bg-transparent file:px-3 file:py-2 file:text-xs file:text-[var(--foreground)]"
                    />
                    <p className="mt-1.5 text-xs text-[var(--text-soft)]">
                      Recomendamos imágenes tipo logo en PNG con fondo transparente. Fotos muy
                      saturadas o con mucho detalle puede que no queden bien impresas. El diseño
                      se envía a revisión: si consideramos que una imagen no va a quedar bien, la
                      anularemos y te lo haremos saber.
                    </p>
                  </div>

                  {/* Añadir texto */}
                  <div>
                    <p className="mb-2 text-xs uppercase tracking-[0.2em] text-[var(--accent)]">
                      Añadir texto ({activeZone === 'nose' ? 'Nose' : 'Tail'})
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newText}
                        onChange={(e) => setNewText(e.target.value)}
                        placeholder="Escribe tu texto"
                        maxLength={30}
                        className="w-full rounded-lg border border-[var(--border-hover)] bg-transparent px-3 py-2 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
                      />
                      <button
                        type="button"
                        onClick={handleAddText}
                        disabled={!newText.trim()}
                        className="shrink-0 rounded-lg border border-[var(--border-hover)] px-4 py-2 text-sm text-[var(--foreground)] transition hover:border-[var(--accent)] disabled:opacity-40"
                      >
                        Añadir
                      </button>
                    </div>
                  </div>

                  {/* Elemento seleccionado */}
                  {selectedItem && (
                    <div className="space-y-3 rounded-lg border border-[var(--border)] p-4">
                      <p className="text-xs font-medium text-[var(--foreground)]">
                        {selectedItem.type === 'text' ? 'Texto seleccionado' : 'Imagen seleccionada'}
                      </p>

                      {selectedItem.type === 'text' && (
                        <>
                          <div>
                            <label className="mb-1 block text-xs text-[var(--text-muted)]">
                              Contenido
                            </label>
                            <input
                              type="text"
                              value={selectedItem.text ?? ''}
                              onChange={(e) => updateSelectedItem({ text: e.target.value })}
                              maxLength={30}
                              className="w-full rounded-lg border border-[var(--border-hover)] bg-transparent px-3 py-2 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
                            />
                          </div>
                          <div>
                            <label className="mb-1 block text-xs text-[var(--text-muted)]">
                              Color
                            </label>
                            <input
                              type="color"
                              value={selectedItem.color ?? DEFAULT_TEXT_COLOR}
                              onChange={(e) => updateSelectedItem({ color: e.target.value })}
                              className="h-9 w-16 cursor-pointer rounded border border-[var(--border-hover)] bg-transparent"
                            />
                          </div>
                        </>
                      )}

                      <div>
                        <label className="mb-1 block text-xs text-[var(--text-muted)]">
                          Tamaño
                        </label>
                        <input
                          type="range"
                          min={0.4}
                          max={2.5}
                          step={0.05}
                          value={selectedItem.scale}
                          onChange={(e) => updateSelectedItem({ scale: Number(e.target.value) })}
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-xs text-[var(--text-muted)]">
                          Rotación
                        </label>
                        <input
                          type="range"
                          min={0}
                          max={359}
                          step={1}
                          value={selectedItem.rotation}
                          onChange={(e) => updateSelectedItem({ rotation: Number(e.target.value) })}
                          className="w-full"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={removeSelectedItem}
                        className="text-xs font-medium text-red-400 transition hover:text-red-300"
                      >
                        Eliminar este elemento
                      </button>
                    </div>
                  )}

                  {/* Precio + acciones */}
                  <div className="border-t border-[var(--border)] pt-6">
                    <p className="mb-4 text-xl font-light text-[var(--foreground)]">
                      {product.precio.toLocaleString('es-ES', {
                        style: 'currency',
                        currency: 'EUR',
                      })}
                    </p>

                    <div className="flex flex-col gap-2 sm:flex-row">
                      <button
                        type="button"
                        onClick={handleDownload}
                        className="flex-1 rounded-lg border border-[var(--border-hover)] px-4 py-3 text-sm text-[var(--text-muted)] transition hover:border-[var(--accent)] hover:text-[var(--foreground)]"
                      >
                        Guardar diseño
                      </button>
                      <button
                        type="button"
                        onClick={() => setStep('form')}
                        className="flex-1 rounded-lg bg-[var(--accent)] px-4 py-3 text-sm font-medium text-[var(--surface)] transition hover:bg-[var(--accent-hover)]"
                      >
                        Comprar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 'form' && (
              <div className="fixed inset-0 z-10 flex items-center justify-center bg-[var(--overlay-heavy)] p-3 sm:p-4">
                <form
                  onSubmit={handleSubmitOrder}
                  className="flex max-h-[90vh] w-full max-w-md flex-col overflow-y-auto rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-5 sm:p-6"
                >
                  <h3
                    className="text-lg font-light text-[var(--foreground)]"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    Completa tus datos
                  </h3>
                  <p className="mb-5 mt-1 text-xs text-[var(--text-muted)]">
                    Enviaremos tu diseño junto a tus datos. Nos pondremos en contacto para definir los detalles finales.
                  </p>

                  <div className="space-y-5">
                    <div>
                      <label className="mb-1.5 block text-sm text-[var(--accent)]">Nombre *</label>
                      <input
                        name="nombre"
                        type="text"
                        required
                        value={form.nombre}
                        onChange={handleFormChange}
                        className="w-full rounded-lg border border-[var(--border-hover)] bg-transparent px-4 py-2.5 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm text-[var(--accent)]">Email *</label>
                      <input
                        name="email"
                        type="email"
                        required
                        value={form.email}
                        onChange={handleFormChange}
                        className="w-full rounded-lg border border-[var(--border-hover)] bg-transparent px-4 py-2.5 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm text-[var(--accent)]">Teléfono</label>
                      <input
                        name="telefono"
                        type="tel"
                        value={form.telefono}
                        onChange={handleFormChange}
                        placeholder="+34 600 000 000"
                        className="w-full rounded-lg border border-[var(--border-hover)] bg-transparent px-4 py-2.5 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm text-[var(--accent)]">Notas (opcional)</label>
                      <textarea
                        name="mensaje"
                        value={form.mensaje}
                        onChange={handleFormChange}
                        rows={3}
                        placeholder="Cuéntanos algo más sobre tu diseño..."
                        className="w-full resize-none rounded-lg border border-[var(--border-hover)] bg-transparent px-4 py-2.5 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
                      />
                    </div>

                    {/* Ya tengo mi diseño */}
                    <div className="rounded-lg border border-dashed border-[var(--border-hover)] p-4">
                      <label className="flex items-center gap-2 text-sm text-[var(--foreground)]">
                        <input
                          type="checkbox"
                          checked={useOwnDesign}
                          onChange={(e) => setUseOwnDesign(e.target.checked)}
                        />
                        Ya tengo mi diseño, prefiero subirlo directamente
                      </label>

                      {useOwnDesign && (
                        <div className="mt-3">
                          <p className="mb-2 text-xs text-amber-400">
                            El diseño que has creado en el editor no se enviará: solo se usará
                            el archivo que subas aquí.
                          </p>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleOwnDesignFile}
                            className="block w-full text-xs text-[var(--text-muted)] file:mr-3 file:rounded-lg file:border file:border-[var(--border)] file:bg-transparent file:px-3 file:py-2 file:text-xs file:text-[var(--foreground)]"
                          />
                          {ownDesignFile && (
                            <p className="mt-1 text-xs text-[var(--text-soft)]">
                              {ownDesignFile.name}
                            </p>
                          )}
                        </div>
                      )}

                      <p className="mt-2 text-xs text-[var(--text-soft)]">
                        ¿Buscas inspiración?{' '}
                        <Link href="/galeria" target="_blank" className="underline underline-offset-2 hover:text-[var(--foreground)]">
                          Visita nuestra galería
                        </Link>
                      </p>
                    </div>

                    {/* ── SEGURIDAD: honeypot ── */}
                    <input
                      type="text"
                      name="website"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                      tabIndex={-1}
                      autoComplete="off"
                      style={{
                        position: 'absolute',
                        left: '-9999px',
                        width: '1px',
                        height: '1px',
                        opacity: 0,
                      }}
                      aria-hidden="true"
                    />

                    {sendError && (
                      <p className="text-sm text-red-400">
                        Ha ocurrido un error enviando tu pedido. Inténtalo de nuevo.
                      </p>
                    )}
                  </div>

                  <div className="mt-6 flex gap-3 border-t border-[var(--border)] pt-5">
                    <button
                      type="button"
                      onClick={() => setStep('editor')}
                      className="flex-1 rounded-lg border border-[var(--border-hover)] px-4 py-3 text-sm text-[var(--text-muted)] transition hover:text-[var(--foreground)]"
                    >
                      Volver
                    </button>
                    <button
                      type="submit"
                      disabled={sending || (useOwnDesign && !ownDesignFile)}
                      className="flex-1 rounded-lg bg-[var(--accent)] px-4 py-3 text-sm font-medium text-[var(--surface)] transition hover:bg-[var(--accent-hover)] disabled:opacity-50"
                    >
                      {sending ? 'Enviando...' : 'Enviar pedido'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {step === 'sent' && (
              <div className="flex flex-col items-center gap-4 py-12 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-emerald-400/40 text-2xl text-emerald-400">
                  ✓
                </div>
                <h3
                  className="text-xl font-light text-[var(--foreground)]"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Tu petición ha sido enviada
                </h3>
                <p className="max-w-sm text-sm text-[var(--text-muted)]">
                  Nos pondremos en contacto contigo pronto para definir juntos los últimos detalles de tu diseño.
                </p>
                <button
                  type="button"
                  onClick={closeModal}
                  className="mt-2 rounded-lg border border-[var(--border-hover)] px-6 py-2.5 text-sm text-[var(--foreground)] transition hover:border-[var(--accent)]"
                >
                  Cerrar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}