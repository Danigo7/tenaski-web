'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'

// Campos del formulario de contacto
interface FormState {
  nombre: string
  email: string
  telefono: string
  asunto: string
  mensaje: string
}

const EMPTY: FormState = {
  nombre: '',
  email: '',
  telefono: '',
  asunto: '',
  mensaje: '',
}

export default function ContactForm() {
  const [form, setForm] = useState<FormState>(EMPTY)
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle')

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')

    const { error } = await supabase.from('message').insert({
      nombre:   form.nombre,
      email:    form.email,
      telefono: form.telefono || null,
      asunto:   form.asunto,
      mensaje:  form.mensaje,
      estado:   'nuevo',
    })

    if (error) {
      console.error(error)
      setStatus('error')
    } else {
      setStatus('ok')
      setForm(EMPTY)
    }
  }

  return (
    <div className="mx-auto max-w-2xl">

      {/* Título de sección */}
      <h2 className="home-section__title mb-8 text-3xl sm:text-4xl">
        Escríbenos
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Nombre + Email */}
        <div className="grid gap-6 sm:grid-cols-2">
          <Field
            label="Nombre *"
            name="nombre"
            type="text"
            value={form.nombre}
            onChange={handleChange}
            required
          />
          <Field
            label="Email *"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Teléfono + Asunto */}
        <div className="grid gap-6 sm:grid-cols-2">
          <Field
            label="Teléfono"
            name="telefono"
            type="tel"
            value={form.telefono}
            onChange={handleChange}
            placeholder="+34 600 000 000"
          />
          <Field
            label="Asunto *"
            name="asunto"
            type="text"
            value={form.asunto}
            onChange={handleChange}
            placeholder="¿En qué podemos ayudarte?"
            required
          />
        </div>

        {/* Mensaje */}
        <div className="space-y-2">
          <label className="block text-sm text-[#C4A882]">
            Mensaje *
          </label>
          <textarea
            name="mensaje"
            value={form.mensaje}
            onChange={handleChange}
            required
            rows={6}
            placeholder="Cuéntanos qué buscas..."
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-[#E8E4DC] placeholder-zinc-500 outline-none transition focus:border-[#C4A882] resize-none"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={status === 'sending'}
          className="w-full rounded-lg bg-[#C4A882] px-6 py-3 font-medium text-[#0F0F0F] transition hover:bg-[#b3976f] disabled:opacity-50"
        >
          {status === 'sending' ? 'Enviando…' : 'Enviar mensaje'}
        </button>

        {/* Feedback */}
        {status === 'ok' && (
          <p className="text-center text-sm text-emerald-400">
            Mensaje enviado. Te responderemos en breve.
          </p>
        )}
        {status === 'error' && (
          <p className="text-center text-sm text-red-400">
            Ha ocurrido un error. Inténtalo de nuevo.
          </p>
        )}

      </form>
    </div>
  )
}

// ── Campo reutilizable ───────────────────────────────────────────────────────

interface FieldProps {
  label: string
  name: string
  type: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  required?: boolean
  placeholder?: string
}

function Field({ label, name, type, value, onChange, required, placeholder }: FieldProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm text-[#C4A882]">
        {label}
      </label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-[#E8E4DC] placeholder-zinc-500 outline-none transition focus:border-[#C4A882]"
      />
    </div>
  )
}