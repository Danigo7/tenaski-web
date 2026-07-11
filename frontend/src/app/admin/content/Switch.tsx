'use client'

// app/admin/content/Switch.tsx
//
// Switch on/off reutilizable para activar o desactivar secciones
// desde el panel de contenido. Úsalo en cualquier formulario que
// necesite un toggle de visibilidad.

type Props = {
  checked: boolean
  onChange: (checked: boolean) => void
}

export default function Switch({ checked, onChange }: Props) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex items-center gap-3"
    >
      <span
        className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full border transition-colors duration-300 ${
          checked
            ? 'border-[#C4A882]/60 bg-[#C4A882]'
            : 'border-zinc-700 bg-zinc-800'
        }`}
      >
        <span
          className={`inline-block h-5 w-5 translate-x-1 transform rounded-full bg-[#0F0F0F] shadow-[0_1px_3px_rgba(0,0,0,0.4)] transition-transform duration-300 ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </span>

      <span
        className={`text-xs font-semibold uppercase tracking-wide transition-colors ${
          checked ? 'text-[#C4A882]' : 'text-zinc-500'
        }`}
      >
        {checked ? 'Activo' : 'Inactivo'}
      </span>
    </button>
  )
}