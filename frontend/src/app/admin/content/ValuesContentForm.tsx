'use client'

import { useMemo, useState, useTransition } from 'react'
import { updateContentBlock } from './actions'
import Switch from './Switch'

type ValueItem = {
  id: string
  number: string
  titulo: string
  descripcion: string
}

type RawValueItem = {
  number?: string
  titulo?: string
  descripcion?: string
  title?: string
  description?: string
}

type ValuesBlock = {
  id: string
  seccion: string
  data: {
    values?: RawValueItem[]
    activo?: boolean
  }
} | null

type Props = {
  block: ValuesBlock
}

function createValueItem(index: number): ValueItem {
  return {
    id: `value-${Date.now()}-${index}`,
    number: String(index).padStart(2, '0'),
    titulo: '',
    descripcion: '',
  }
}

export default function ValuesContentForm({ block }: Props) {
  const initialValues = useMemo(() => {
    const rawValues = block?.data?.values
    if (!Array.isArray(rawValues) || rawValues.length === 0) {
      return [createValueItem(1)]
    }

    return rawValues.map((item, index) => ({
      id: `value-${index}`,
      number: item.number ?? String(index + 1).padStart(2, '0'),
      titulo: item.titulo ?? item.title ?? '',
      descripcion: item.descripcion ?? item.description ?? '',
    }))
  }, [block?.data?.values])

  const [activo, setActivo] = useState(block?.data?.activo ?? true)
  const [values, setValues] = useState<ValueItem[]>(initialValues)
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)

  function updateValue(index: number, field: keyof Omit<ValueItem, 'id'>, value: string) {
    setValues((prev) =>
      prev.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item
      )
    )
  }

  function removeValue(index: number) {
    setValues((prev) => {
      if (prev.length <= 1) return prev
      return prev
        .filter((_, itemIndex) => itemIndex !== index)
        .map((item, itemIndex) => ({
          ...item,
          number: String(itemIndex + 1).padStart(2, '0'),
        }))
    })
  }

  function addValue() {
    setValues((prev) => [
      ...prev,
      createValueItem(prev.length + 1),
    ])
  }

  function handleSave() {
    startTransition(async () => {
      await updateContentBlock(
        'historia_values',
        {
          activo,
          values: values.map(({ number, titulo, descripcion }) => ({
            number,
            titulo,
            descripcion,
          })),
        },
        null
      )
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    })
  }

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Historia · Values</h2>
          <p className="mt-1 text-sm text-zinc-400">
            Edita la lista de valores que aparece en la página Historia.
          </p>
        </div>

        <Switch checked={activo} onChange={setActivo} />
      </div>

      <div className="mt-6 space-y-6">
        {values.map((value, index) => (
          <div key={value.id} className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-medium text-zinc-300">Valor {value.number}</p>
              <button
                type="button"
                onClick={() => removeValue(index)}
                disabled={values.length <= 1}
                className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs font-semibold text-zinc-200 transition hover:border-red-400 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Eliminar
              </button>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-zinc-300">
                  Título
                </label>
                <input
                  type="text"
                  value={value.titulo}
                  onChange={(e) => updateValue(index, 'titulo', e.target.value)}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-[#E8E4DC] outline-none focus:border-[#C4A882]"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-zinc-300">
                  Descripción
                </label>
                <textarea
                  value={value.descripcion}
                  onChange={(e) => updateValue(index, 'descripcion', e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-[#E8E4DC] outline-none focus:border-[#C4A882] resize-none"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={addValue}
          className="rounded-lg bg-transparent border border-zinc-700 px-4 py-2 text-sm text-zinc-200 transition hover:border-[#C4A882] hover:text-[#C4A882]"
        >
          Añadir valor
        </button>
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

        {saved && <span className="text-sm text-emerald-400">✓ Guardado correctamente</span>}
      </div>
    </div>
  )
}