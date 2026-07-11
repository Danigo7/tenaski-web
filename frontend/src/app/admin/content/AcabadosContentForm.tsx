'use client'

// app/admin/content/AcabadosContentForm.tsx
//
// Gestiona la sección "Acabados" de la Home: el switch on/off, el eyebrow
// y la descripción del bloque, y el alta/baja de cada acabado individual
// (imagen + nombre + descripción breve).

import { useState, useTransition } from 'react'
import Image from 'next/image'
import {
  updateContentBlock,
  createAcabado,
  deleteAcabado,
} from './actions'
import UploadContentImage from './UploadContentImage'
import Switch from './Switch'

type ImageRelation =
  | { id: string; ruta_storage: string }
  | { id: string; ruta_storage: string }[]
  | null
  | undefined

type AcabadoRow = {
  id: string
  nombre: string
  descripcion: string | null
  imagen_id: string | null
  image: ImageRelation
}

type SectionBlock = {
  id: string
  seccion: string
  data: {
    activo?: boolean
    eyebrow?: string
    descripcion?: string
  }
} | null

type Props = {
  block: SectionBlock
  acabados: AcabadoRow[]
}

function getImage(img: ImageRelation): string | null {
  if (!img) return null
  if (Array.isArray(img)) return img[0]?.ruta_storage ?? null
  return img.ruta_storage ?? null
}

export default function AcabadosContentForm({ block, acabados }: Props) {
  const [activo, setActivo] = useState(block?.data?.activo ?? true)
  const [eyebrow, setEyebrow] = useState(block?.data?.eyebrow ?? 'Acabados')
  const [descripcion, setDescripcion] = useState(
    block?.data?.descripcion ??
      'Cada esquí puede personalizarse con distintos acabados de madera.'
  )

  const [isPending, startTransition] = useTransition()
  const [savedMessage, setSavedMessage] = useState(false)

  // ── Nuevo acabado ──────────────────────────────────────────
  const [nuevoNombre, setNuevoNombre] = useState('')
  const [nuevaDescripcion, setNuevaDescripcion] = useState('')
  const [nuevaImagenId, setNuevaImagenId] = useState<string | null>(null)
  const [nuevaImagenPreview, setNuevaImagenPreview] = useState<string | null>(null)
  const [isCreating, startCreating] = useTransition()

  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isDeleting, startDeleting] = useTransition()

  function handleSaveSection() {
    startTransition(async () => {
      await updateContentBlock('acabados_home', {
        activo,
        eyebrow,
        descripcion,
      })
      setSavedMessage(true)
      setTimeout(() => setSavedMessage(false), 2500)
    })
  }

  function handleAddAcabado() {
    if (!nuevoNombre || !nuevaImagenId) return

    startCreating(async () => {
      await createAcabado(nuevoNombre, nuevaDescripcion, nuevaImagenId, acabados.length)
      setNuevoNombre('')
      setNuevaDescripcion('')
      setNuevaImagenId(null)
      setNuevaImagenPreview(null)
    })
  }

  function handleDeleteAcabado(id: string) {
    setDeletingId(id)
    startDeleting(async () => {
      await deleteAcabado(id)
      setDeletingId(null)
    })
  }

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Acabados</h2>
          <p className="mt-1 text-sm text-zinc-400">
            Activa o desactiva la sección y edita su texto introductorio.
          </p>
        </div>

        <Switch checked={activo} onChange={setActivo} />
      </div>

      <div className="mt-8 space-y-8">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-300">
            Eyebrow (etiqueta superior)
          </label>
          <input
            type="text"
            value={eyebrow}
            onChange={(e) => setEyebrow(e.target.value)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-[#E8E4DC] outline-none focus:border-[#C4A882]"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-300">
            Descripción
          </label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-[#E8E4DC] outline-none focus:border-[#C4A882] resize-none"
          />
        </div>
      </div>

      <div className="mt-8 flex items-center gap-4 border-t border-zinc-800 pt-6">
        <button
          type="button"
          onClick={handleSaveSection}
          disabled={isPending}
          className="rounded-lg bg-[#C4A882] px-6 py-2.5 text-sm font-semibold text-[#0F0F0F] transition hover:opacity-90 disabled:opacity-50"
        >
          {isPending ? 'Guardando...' : 'Guardar cambios'}
        </button>

        {savedMessage && (
          <span className="text-sm text-emerald-400">✓ Guardado correctamente</span>
        )}
      </div>

      {/* ── LISTA DE ACABADOS ─────────────────────────────────────── */}
      <div className="mt-10 border-t border-zinc-800 pt-8">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-400">
          Acabados ({acabados.length})
        </h3>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {acabados.map((acabado) => (
            <div
              key={acabado.id}
              className="flex items-center gap-3 rounded-lg border border-zinc-700 bg-zinc-800 p-3"
            >
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md border border-zinc-600">
                {getImage(acabado.image) ? (
                  <Image
                    src={getImage(acabado.image)!}
                    alt={acabado.nombre}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-[10px] text-zinc-500">
                    Sin imagen
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-[#E8E4DC]">
                  {acabado.nombre}
                </p>
                {acabado.descripcion && (
                  <p className="truncate text-xs text-zinc-500">{acabado.descripcion}</p>
                )}
              </div>

              <button
                type="button"
                onClick={() => handleDeleteAcabado(acabado.id)}
                disabled={isDeleting && deletingId === acabado.id}
                className="shrink-0 text-xs font-medium text-red-400 transition hover:text-red-300 disabled:opacity-50"
              >
                {isDeleting && deletingId === acabado.id ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          ))}

          {acabados.length === 0 && (
            <p className="text-sm text-zinc-500">Todavía no hay acabados añadidos.</p>
          )}
        </div>
      </div>

      {/* ── AÑADIR NUEVO ACABADO ──────────────────────────────────── */}
      <div className="mt-8 rounded-lg border border-dashed border-zinc-700 p-5">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-400">
          Añadir acabado
        </h3>

        <div className="mt-4 grid gap-5 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-300">
                Nombre
              </label>
              <input
                type="text"
                value={nuevoNombre}
                onChange={(e) => setNuevoNombre(e.target.value)}
                placeholder="Ej. Roble natural"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-[#E8E4DC] outline-none focus:border-[#C4A882]"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-300">
                Descripción breve
              </label>
              <input
                type="text"
                value={nuevaDescripcion}
                onChange={(e) => setNuevaDescripcion(e.target.value)}
                placeholder="Ej. Veta visible, tacto cálido"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-[#E8E4DC] outline-none focus:border-[#C4A882]"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-zinc-300">
              Imagen del acabado
            </label>

            <div className="relative h-28 w-28 overflow-hidden rounded-lg border border-zinc-700 bg-zinc-800">
              {nuevaImagenPreview ? (
                <Image
                  src={nuevaImagenPreview}
                  alt="Nuevo acabado"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-zinc-500">
                  Sin imagen
                </div>
              )}
            </div>

            <UploadContentImage
              onUploaded={(imageId, ruta) => {
                setNuevaImagenId(imageId)
                setNuevaImagenPreview(ruta)
              }}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleAddAcabado}
          disabled={isCreating || !nuevoNombre || !nuevaImagenId}
          className="mt-5 rounded-lg bg-[#C4A882] px-6 py-2.5 text-sm font-semibold text-[#0F0F0F] transition hover:opacity-90 disabled:opacity-50"
        >
          {isCreating ? 'Añadiendo...' : 'Añadir acabado'}
        </button>
      </div>
    </div>
  )
}