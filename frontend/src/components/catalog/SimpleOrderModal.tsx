'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import OrderForm from './OrderForm'
import OrderSentConfirmation from './OrderSentConfirmation'

type Product = { id: string; nombre: string; slug: string; precio: number }
type Props = { product: Product }
type FormData = { nombre: string; email: string; telefono: string; mensaje: string }

const EMPTY_FORM: FormData = { nombre: '', email: '', telefono: '', mensaje: '' }

export default function SimpleOrderModal({ product }: Props) {
  const [open, setOpen] = useState(false)
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState<FormData>(EMPTY_FORM)
  const [honeypot, setHoneypot] = useState('')
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState(false)

  function handleFormChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) { setForm((prev) => ({ ...prev, [e.target.name]: e.target.value })) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (honeypot) { setSent(true); return }
    setSending(true)
    setSendError(false)
    const mensajeFinal = `${form.mensaje || 'Sin notas adicionales.'}\n\n— Resumen del pedido —\nPrecio total: ${product.precio.toFixed(2)} €`
    const { error } = await supabase.from('message').insert({
      nombre: form.nombre,
      email: form.email,
      telefono: form.telefono || null,
      asunto: `Solicitud de información — ${product.nombre}`,
      mensaje: mensajeFinal,
      estado: 'nuevo',
      producto_id: product.id,
      tipo: 'diseno',
      precio_final: product.precio,
    })
    setSending(false)
    if (error) { console.error(error); setSendError(true); return }
    setSent(true)
  }

  function closeModal() {
    setOpen(false)
    setSent(false)
    setSendError(false)
    setHoneypot('')
    setForm(EMPTY_FORM)
  }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="mt-4 inline-flex w-full items-center justify-center gap-2 border border-[var(--border-hover)] px-8 py-4 text-sm font-medium uppercase tracking-[0.15em] text-[var(--text-muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--foreground)] lg:w-auto">Solicita información o comprar</button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--overlay-heavy)] px-3 py-6 sm:px-4 sm:py-8">
          <div className="relative w-full max-w-md">
            <button type="button" onClick={closeModal} className="absolute -top-10 right-0 text-xl leading-none text-[var(--text-muted)] transition hover:text-[var(--foreground)] sm:-top-2 sm:-right-10" aria-label="Cerrar">×</button>
            {sent ? <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-6"><OrderSentConfirmation onClose={closeModal} /></div> : <OrderForm form={form} onFormChange={handleFormChange} honeypot={honeypot} onHoneypotChange={(e) => setHoneypot(e.target.value)} onSubmit={handleSubmit} sending={sending} sendError={sendError} totalPrice={product.precio} onBack={closeModal} backLabel="Cancelar" />}
          </div>
        </div>
      )}
    </>
  )
}