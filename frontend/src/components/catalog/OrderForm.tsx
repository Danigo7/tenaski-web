'use client'

type OrderFormData = {
  nombre: string
  email: string
  telefono: string
  mensaje: string
}

type Props = {
  form: OrderFormData
  onFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  honeypot: string
  onHoneypotChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit: (e: React.FormEvent) => void
  sending: boolean
  sendError: boolean
  totalPrice: number
  priceBreakdown?: string
  onBack: () => void
  backLabel?: string
  submitDisabled?: boolean
  children?: React.ReactNode
}

export default function OrderForm({
  form,
  onFormChange,
  honeypot,
  onHoneypotChange,
  onSubmit,
  sending,
  sendError,
  totalPrice,
  priceBreakdown,
  onBack,
  backLabel = 'Volver',
  submitDisabled,
  children,
}: Props) {
  return (
    <form
      onSubmit={onSubmit}
      className="flex max-h-[90vh] w-full max-w-md flex-col overflow-y-auto rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-5 sm:p-6"
    >
      <h3 className="text-lg font-light text-[var(--foreground)]" style={{ fontFamily: 'var(--font-display)' }}>
        Completa tus datos
      </h3>
      <p className="mb-5 mt-1 text-xs text-[var(--text-muted)]">
        Enviaremos tu diseño junto a tus datos. Nos pondremos en contacto para definir los detalles finales.
      </p>

      <div className="space-y-5">
        <div>
          <label className="mb-1.5 block text-sm text-[var(--accent)]">Nombre *</label>
          <input name="nombre" type="text" required value={form.nombre} onChange={onFormChange} className="w-full rounded-lg border border-[var(--border-hover)] bg-transparent px-4 py-2.5 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)]" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm text-[var(--accent)]">Email *</label>
          <input name="email" type="email" required value={form.email} onChange={onFormChange} className="w-full rounded-lg border border-[var(--border-hover)] bg-transparent px-4 py-2.5 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)]" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm text-[var(--accent)]">Teléfono*</label>
          <input name="telefono" type="tel" required value={form.telefono} onChange={onFormChange} placeholder="+34 600 000 000" className="w-full rounded-lg border border-[var(--border-hover)] bg-transparent px-4 py-2.5 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)]" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm text-[var(--accent)]">Notas (opcional)</label>
          <textarea name="mensaje" value={form.mensaje} onChange={onFormChange} rows={3} placeholder="Cuéntanos algo más..." className="w-full resize-none rounded-lg border border-[var(--border-hover)] bg-transparent px-4 py-2.5 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)]" />
        </div>

        {children}

        <input type="text" name="website" value={honeypot} onChange={onHoneypotChange} tabIndex={-1} autoComplete="off" style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', opacity: 0 }} aria-hidden="true" />
        {sendError && <p className="text-sm text-red-400">Ha ocurrido un error enviando tu pedido. Inténtalo de nuevo.</p>}
      </div>

      <div className="mt-6 border-t border-[var(--border)] pt-5">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm text-[var(--text-muted)]">Precio total</span>
          <span className="text-lg font-medium text-[var(--foreground)]">{totalPrice.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</span>
        </div>
        {priceBreakdown && <p className="mb-4 text-xs text-[var(--text-soft)]">{priceBreakdown}</p>}
        <p className="mb-4 text-xs text-[var(--text-soft)]">No se paga en este momento. Revisaremos tu pedido y nos pondremos en contacto contigo para definir los últimos detalles y comenzar la elaboración; el pago se realiza en ese momento.</p>
        <div className="flex gap-3">
          <button type="button" onClick={onBack} className="flex-1 rounded-lg border border-[var(--border-hover)] px-4 py-3 text-sm text-[var(--text-muted)] transition hover:text-[var(--foreground)]">{backLabel}</button>
          <button type="submit" disabled={sending || !!submitDisabled} className="flex-1 rounded-lg bg-[var(--accent)] px-4 py-3 text-sm font-medium text-[var(--surface)] transition hover:bg-[var(--accent-hover)] disabled:opacity-50">{sending ? 'Enviando...' : 'Enviar pedido'}</button>
        </div>
      </div>
    </form>
  )
}