'use client'

type Props = { onClose: () => void }

export default function OrderSentConfirmation({ onClose }: Props) {
  return (
    <div className="flex flex-col items-center gap-4 py-12 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-emerald-400/40 text-2xl text-emerald-400">✓</div>
      <h3 className="text-xl font-light text-[var(--foreground)]" style={{ fontFamily: 'var(--font-display)' }}>Tu petición ha sido enviada</h3>
      <p className="max-w-sm text-sm text-[var(--text-muted)]">Nos pondremos en contacto contigo pronto para definir juntos los últimos detalles de tu diseño.</p>
      <button type="button" onClick={onClose} className="mt-2 rounded-lg border border-[var(--border-hover)] px-6 py-2.5 text-sm text-[var(--foreground)] transition hover:border-[var(--accent)]">Cerrar</button>
    </div>
  )
}