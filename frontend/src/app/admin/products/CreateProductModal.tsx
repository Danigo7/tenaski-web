'use client'

import { useState, useRef, useCallback } from 'react'
import { createProductWithImages } from './actions'
import { supabase } from '@/lib/supabase/client'

type Props = {
  open: boolean
  onClose: () => void
}

// ─── Tipos internos ────────────────────────────────────────
type ExistingImage = {
  id: string
  nombre_archivo: string
  ruta_storage: string
  texto_alt: string | null
}

type PendingFile = {
  // Archivo local pendiente de subir
  localId: string       // id temporal en UI
  file: File
  preview: string       // object URL para preview
}

// ─── Helpers ───────────────────────────────────────────────
function makeLocalId() {
  return Math.random().toString(36).slice(2)
}

// ═══════════════════════════════════════════════════════════
export default function CreateProductModal({ open, onClose }: Props) {
  // ── Step ──────────────────────────────────────────────────
  const [step, setStep] = useState<1 | 2>(1)

  // ── Step 1: datos del producto ────────────────────────────
  const [formValues, setFormValues] = useState({
    nombre: '',
    precio: '',
    descripcion_corta: '',
    descripcion_larga: '',
    publicado: false,
    destacado: false,
  })

  // ── Step 2: imágenes ──────────────────────────────────────
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([])
  const [existingImages, setExistingImages] = useState<ExistingImage[]>([])
  const [selectedExisting, setSelectedExisting] = useState<Set<string>>(new Set())
  const [loadingExisting, setLoadingExisting] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  // ── Submit global ─────────────────────────────────────────
  const [loading, setLoading] = useState(false)

  // ── Refs ──────────────────────────────────────────────────
  const fileInputRef = useRef<HTMLInputElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  // ──────────────────────────────────────────────────────────
  // Cerrar al clicar el overlay (fuera del panel)
  // ──────────────────────────────────────────────────────────
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) handleClose()
  }

  // Resetear estado al cerrar
  const handleClose = () => {
    setStep(1)
    setFormValues({
      nombre: '',
      precio: '',
      descripcion_corta: '',
      descripcion_larga: '',
      publicado: false,
      destacado: false,
    })
    setPendingFiles([])
    setSelectedExisting(new Set())
    onClose()
  }

  // ──────────────────────────────────────────────────────────
  // STEP 1 → validar y avanzar (NO guarda nada aún)
  // ──────────────────────────────────────────────────────────
  const handleStep1Continue = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Cargar imágenes existentes al entrar al paso 2
    loadExistingImages()
    setStep(2)
  }

  // ──────────────────────────────────────────────────────────
  // Cargar imágenes ya subidas en la BD (para reciclar)
  // ──────────────────────────────────────────────────────────
  const loadExistingImages = async () => {
    setLoadingExisting(true)
    try {
      const { data, error } = await supabase
        .from('image')
        .select('id, nombre_archivo, ruta_storage, texto_alt')
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
        .limit(40)

      if (error) throw error
      setExistingImages(data ?? [])
    } catch (err) {
      console.error('Error cargando imágenes existentes:', err)
    } finally {
      setLoadingExisting(false)
    }
  }

  // ──────────────────────────────────────────────────────────
  // Manejo de archivos nuevos (input + drag & drop)
  // ──────────────────────────────────────────────────────────
  const addFiles = (fileList: FileList | File[]) => {
    const newPending: PendingFile[] = Array.from(fileList).map((file) => ({
      localId: makeLocalId(),
      file,
      preview: URL.createObjectURL(file),
    }))
    setPendingFiles((prev) => [...prev, ...newPending])
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(e.target.files)
      // Resetear input para poder volver a seleccionar los mismos archivos
      e.target.value = ''
    }
  }

  const removePending = (localId: string) => {
    setPendingFiles((prev) => {
      const item = prev.find((f) => f.localId === localId)
      if (item) URL.revokeObjectURL(item.preview)
      return prev.filter((f) => f.localId !== localId)
    })
  }

  // ── Drag & drop ───────────────────────────────────────────
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const dropped = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith('image/')
    )
    if (dropped.length > 0) addFiles(dropped)
  }, [])

  // ── Selección de existentes ───────────────────────────────
  const toggleExisting = (id: string) => {
    setSelectedExisting((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  // ──────────────────────────────────────────────────────────
  // SUBMIT FINAL: sube imágenes → crea producto → crea relaciones
  // Todo en orden, nada se guarda si algo falla antes
  // ──────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    setLoading(true)

    try {

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No autorizado')
        
      // 1. Subir archivos nuevos a Storage e insertar en tabla image
      const uploadedImageIds: string[] = []

      for (const pending of pendingFiles) {
        const fileName = `${Date.now()}-${pending.file.name}`

        // Storage (bucket: product-images)
        const { error: storageError } = await supabase.storage
          .from('product-images')
          .upload(fileName, pending.file)

        if (storageError) throw storageError

        // URL pública
        const { data: urlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName)

        // Insertar en tabla image
        const { data: imgRow, error: imgError } = await supabase
          .from('image')
          .insert({
            nombre_archivo: pending.file.name,
            ruta_storage: urlData.publicUrl,
            uploaded_by: user!.id,
          })
          .select('id')
          .single()

        if (imgError) throw imgError
        uploadedImageIds.push(imgRow.id)
      }

      // 2. IDs totales = nuevas subidas + existentes seleccionadas
      const allImageIds = [
        ...uploadedImageIds,
        ...Array.from(selectedExisting),
      ]

      // 3. Crear producto + relaciones (server action)
      const formData = new FormData()
      formData.set('nombre', formValues.nombre)
      formData.set('precio', formValues.precio)
      formData.set('descripcion_corta', formValues.descripcion_corta)
      formData.set('descripcion_larga', formValues.descripcion_larga)
      if (formValues.publicado) formData.set('publicado', 'on')
      if (formValues.destacado) formData.set('destacado', 'on')
      // Pasar IDs de imágenes al server action
      formData.set('image_ids', JSON.stringify(allImageIds))

      await createProductWithImages(formData)

      handleClose()
    } catch (err) {
      console.error(err)
      alert('Error al guardar el producto. Revisa la consola.')
    } finally {
      setLoading(false)
    }
  }

  // ──────────────────────────────────────────────────────────
  if (!open) return null

  // ──────────────────────────────────────────────────────────
  // RENDER
  // ──────────────────────────────────────────────────────────
  return (
    /* Overlay: clic fuera cierra */
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 p-4 overflow-y-auto"
    >
      {/* Panel: max-height + scroll interno */}
      <div
        className="
          relative w-full max-w-2xl my-auto
          bg-zinc-950 rounded-xl border border-zinc-800
          flex flex-col max-h-[90vh]
        "
      >
        {/* ── HEADER ─────────────────────────────────── */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800 shrink-0">
          <div>
            <h2 className="text-xl font-semibold text-white">
              {step === 1 ? 'Nuevo producto' : 'Imágenes del producto'}
            </h2>
            <p className="text-sm text-zinc-500 mt-0.5">
              {step === 1
                ? 'Paso 1 de 2 — información del esquí'
                : 'Paso 2 de 2 — añade imágenes'}
            </p>
          </div>

          {/* X para cerrar */}
          <button
            onClick={handleClose}
            className="text-zinc-500 hover:text-white transition text-xl leading-none"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        {/* ── CONTENIDO CON SCROLL ───────────────────── */}
        <div className="overflow-y-auto flex-1 p-6">

          {/* ════════════════════════════════════════════
              STEP 1 — Datos del producto
          ════════════════════════════════════════════ */}
          {step === 1 && (
            <form id="step1-form" onSubmit={handleStep1Continue} className="space-y-5">

              <div>
                <label className="text-sm text-zinc-400">Nombre *</label>
                <input
                  name="nombre"
                  required
                  value={formValues.nombre}
                  onChange={(e) =>
                    setFormValues((v) => ({ ...v, nombre: e.target.value }))
                  }
                  className="w-full mt-2 p-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-zinc-600"
                />
              </div>

              <div>
                <label className="text-sm text-zinc-400">Precio (€) *</label>
                <input
                  name="precio"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={formValues.precio}
                  onChange={(e) =>
                    setFormValues((v) => ({ ...v, precio: e.target.value }))
                  }
                  className="w-full mt-2 p-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-zinc-600"
                />
              </div>

              <div>
                <label className="text-sm text-zinc-400">Descripción corta</label>
                <textarea
                  name="descripcion_corta"
                  rows={2}
                  value={formValues.descripcion_corta}
                  onChange={(e) =>
                    setFormValues((v) => ({
                      ...v,
                      descripcion_corta: e.target.value,
                    }))
                  }
                  className="w-full mt-2 p-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-zinc-600 resize-none"
                />
              </div>

              <div>
                <label className="text-sm text-zinc-400">Descripción larga</label>
                <textarea
                  name="descripcion_larga"
                  rows={5}
                  value={formValues.descripcion_larga}
                  onChange={(e) =>
                    setFormValues((v) => ({
                      ...v,
                      descripcion_larga: e.target.value,
                    }))
                  }
                  className="w-full mt-2 p-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-zinc-600 resize-none"
                />
              </div>

              <div className="flex gap-6 text-sm text-zinc-300">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formValues.publicado}
                    onChange={(e) =>
                      setFormValues((v) => ({
                        ...v,
                        publicado: e.target.checked,
                      }))
                    }
                    className="accent-white"
                  />
                  Publicado
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formValues.destacado}
                    onChange={(e) =>
                      setFormValues((v) => ({
                        ...v,
                        destacado: e.target.checked,
                      }))
                    }
                    className="accent-white"
                  />
                  Destacado
                </label>
              </div>
            </form>
          )}

          {/* ════════════════════════════════════════════
              STEP 2 — Imágenes
          ════════════════════════════════════════════ */}
          {step === 2 && (
            <div className="space-y-8">

              {/* ── Zona drag & drop ─────────────────── */}
              <div>
                <p className="text-sm text-zinc-400 mb-3">
                  Sube imágenes nuevas
                </p>

                {/* Input file oculto — se abre con el botón */}
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileInputChange}
                  className="hidden"
                  aria-label="Seleccionar imágenes"
                />

                {/* Zona de drop */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`
                    border-2 border-dashed rounded-xl p-10 text-center cursor-pointer
                    transition-colors select-none
                    ${isDragging
                      ? 'border-white bg-zinc-800 text-white'
                      : 'border-zinc-700 hover:border-zinc-500 text-zinc-500 hover:text-zinc-300'
                    }
                  `}
                >
                  <div className="text-3xl mb-2">🖼</div>
                  <p className="text-sm font-medium">
                    Arrastra imágenes aquí o{' '}
                    <span className="underline">haz clic para seleccionar</span>
                  </p>
                  <p className="text-xs mt-1 opacity-60">PNG, JPG, WEBP…</p>
                </div>

                {/* Preview de archivos seleccionados */}
                {pendingFiles.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    {pendingFiles.map((pf) => (
                      <div key={pf.localId} className="relative group">
                        <img
                          src={pf.preview}
                          alt={pf.file.name}
                          className="w-full aspect-square object-cover rounded-lg border border-zinc-800"
                        />
                        <button
                          type="button"
                          onClick={() => removePending(pf.localId)}
                          className="
                            absolute top-1.5 right-1.5
                            bg-black/70 text-white text-xs rounded-full
                            w-6 h-6 flex items-center justify-center
                            opacity-0 group-hover:opacity-100 transition
                          "
                          aria-label="Eliminar imagen"
                        >
                          ✕
                        </button>
                        <p className="mt-1 text-xs text-zinc-500 truncate">
                          {pf.file.name}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ── Imágenes existentes (reciclar) ───── */}
              <div>
                <p className="text-sm text-zinc-400 mb-3">
                  O reutiliza imágenes ya subidas
                </p>

                {loadingExisting ? (
                  <p className="text-zinc-600 text-sm">Cargando…</p>
                ) : existingImages.length === 0 ? (
                  <p className="text-zinc-600 text-sm">
                    No hay imágenes en la biblioteca.
                  </p>
                ) : (
                  <div className="grid grid-cols-4 gap-2 max-h-52 overflow-y-auto pr-1">
                    {existingImages.map((img) => {
                      const selected = selectedExisting.has(img.id)
                      return (
                        <button
                          key={img.id}
                          type="button"
                          onClick={() => toggleExisting(img.id)}
                          className={`
                            relative rounded-lg overflow-hidden border-2 transition
                            ${selected
                              ? 'border-white'
                              : 'border-transparent opacity-60 hover:opacity-90'
                            }
                          `}
                          aria-label={img.nombre_archivo}
                        >
                          <img
                            src={img.ruta_storage}
                            alt={img.texto_alt ?? img.nombre_archivo}
                            className="w-full aspect-square object-cover"
                          />
                          {selected && (
                            <div className="absolute inset-0 bg-white/10 flex items-center justify-center">
                              <span className="text-white text-xl">✓</span>
                            </div>
                          )}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>

            </div>
          )}
        </div>

        {/* ── FOOTER (sticky) ────────────────────────── */}
        <div className="shrink-0 p-6 border-t border-zinc-800 flex justify-between items-center gap-3">

          {/* Botón cancelar / volver */}
          {step === 1 ? (
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2 text-sm text-zinc-400 hover:text-white transition"
            >
              Cancelar
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-5 py-2 text-sm text-zinc-400 hover:text-white transition"
            >
              ← Volver
            </button>
          )}

          {/* Acción principal */}
          {step === 1 ? (
            <button
              type="submit"
              form="step1-form"
              className="bg-white text-black px-6 py-2 rounded-lg font-medium hover:bg-zinc-200 transition"
            >
              Continuar →
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="bg-white text-black px-6 py-2 rounded-lg font-medium hover:bg-zinc-200 transition disabled:opacity-50"
            >
              {loading ? 'Guardando…' : 'Guardar producto'}
            </button>
          )}

        </div>
      </div>
    </div>
  )
}