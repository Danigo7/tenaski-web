'use client'

// app/admin/content/CTAContentForm.tsx
//
// Formulario reutilizable para editar el texto de cualquier CTA de la web.
// Los bloques CTA no tienen imagen asociada, por eso este formulario
// solo maneja campos de texto. El texto y el enlace del botón no son
// editables: se guardan siempre con el valor por defecto de esta sección.

import { useState, useTransition } from 'react'
import { updateContentBlock } from './actions'

type CTABlock = {
  id: string
  seccion: string
  data: {
    eyebrow?: string
    titulo?: string
    descripcion?: string
    buttonText?: string
    buttonHref?: string
  }
} | null

type CTADefaults = {
  eyebrow: string
  titulo: string
  descripcion: string
  buttonText: string
  buttonHref: string
}

type Props = {
  block: CTABlock
  seccion: string
  titulo: string
  defaults: CTADefaults
}

export default function CTAContentForm({ block, seccion, titulo, defaults }: Props) {
  const [eyebrow, setEyebrow] = useState(block?.data?.eyebrow ?? defaults.eyebrow)
  const [tituloCTA, setTituloCTA] = useState(block?.data?.titulo ?? defaults.titulo)
  const [descripcion, setDescripcion] = useState(block?.data?.descripcion ?? defaults.descripcion)

  // El texto y el enlace del botón no son editables desde el formulario:
  // se mantienen fijos con el valor ya guardado, o el por defecto de esta sección.
  const buttonText = block?.data?.buttonText ?? defaults.buttonText
  const buttonHref = block?.data?.buttonHref ?? defaults.buttonHref

  const [isPending, startTransition] = useTransition()
  const [savedMessage, setSavedMessage] = useState(false)

  function handleSave() {
    startTransition(async () => {
      await updateContentBlock(seccion, {
        eyebrow,
        titulo: tituloCTA,
        descripcion,
        buttonText,
        buttonHref,
      })
      setSavedMessage(true)
      setTimeout(() => setSavedMessage(false), 2500)
    })
  }

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
      <h2 className="text-xl font-semibold">{titulo}</h2>
      <p className="mt-1 text-sm text-zinc-400">
        Edita el texto de esta llamada a la acción.
      </p>

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
            Título
          </label>
          <input
            type="text"
            value={tituloCTA}
            onChange={(e) => setTituloCTA(e.target.value)}
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

      <div className="mt-10 flex items-center gap-4 border-t border-zinc-800 pt-6">
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