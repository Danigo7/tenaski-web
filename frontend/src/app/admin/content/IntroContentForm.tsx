'use client'

// app/admin/content/IntroContentForm.tsx
//
// Formulario reutilizable para editar el texto de bloques "Intro"
// (por ejemplo, la introducción del catálogo). No maneja imagen ni botón.
// Si todavía no existe fila en la base de datos, se rellena con
// "defaults" (el texto que hoy ves hardcodeado en la página pública).

import { useState, useTransition } from 'react'
import { updateContentBlock } from './actions'

type IntroBlock = {
  id: string
  seccion: string
  data: {
    eyebrow?: string
    titulo?: string
    descripcion?: string
  }
} | null

type IntroDefaults = {
  eyebrow: string
  titulo: string
  descripcion: string
}

type Props = {
  block: IntroBlock
  seccion: string
  titulo: string
  defaults: IntroDefaults
}

export default function IntroContentForm({ block, seccion, titulo, defaults }: Props) {
  const [eyebrow, setEyebrow] = useState(block?.data?.eyebrow ?? defaults.eyebrow)
  const [tituloIntro, setTituloIntro] = useState(block?.data?.titulo ?? defaults.titulo)
  const [descripcion, setDescripcion] = useState(block?.data?.descripcion ?? defaults.descripcion)

  const [isPending, startTransition] = useTransition()
  const [savedMessage, setSavedMessage] = useState(false)

  function handleSave() {
    startTransition(async () => {
      await updateContentBlock(seccion, {
        eyebrow,
        titulo: tituloIntro,
        descripcion,
      })
      setSavedMessage(true)
      setTimeout(() => setSavedMessage(false), 2500)
    })
  }

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
      <h2 className="text-xl font-semibold">{titulo}</h2>
      <p className="mt-1 text-sm text-zinc-400">
        Edita el texto de esta introducción.
      </p>

      <div className="mt-6 space-y-5">
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
            Título
          </label>
          <input
            type="text"
            value={tituloIntro}
            onChange={(e) => setTituloIntro(e.target.value)}
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
            rows={4}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-[#E8E4DC] outline-none focus:border-[#C4A882] resize-none"
          />
        </div>
      </div>

      <div className="mt-8 flex items-center gap-4 border-t border-zinc-800 pt-6">
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending}
          className="rounded-lg bg-[#C4A882] px-6 py-2.5 text-sm font-semibold text-[#0F0F0F] transition hover:opacity-90 disabled:opacity-50"
        >
          {isPending ? 'Guardando...' : 'Guardar cambios'}
        </button>

        {savedMessage && (
          <span className="text-sm text-emerald-400">✓ Guardado correctamente</span>
        )}
      </div>
    </div>
  )
}