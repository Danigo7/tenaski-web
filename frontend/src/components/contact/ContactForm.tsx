'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'

export default function ContactForm() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    setLoading(true)
    setError('')
    setSuccess(false)

    const form = new FormData(e.currentTarget)

    const nombre = form.get('nombre') as string
    const email = form.get('email') as string
    const mensaje = form.get('mensaje') as string

    const { error } = await supabase.from('message').insert(
      {
        nombre,
        email,
        mensaje,
      },
    )

    setLoading(false)

    if (error) {
      setError('No se pudo enviar el mensaje')
      return
    }

    setSuccess(true)
    e.currentTarget.reset()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">

      <input
        name="nombre"
        placeholder="Nombre"
        required
        className="w-full bg-[#1a1714] px-4 py-3 text-[#E8E4DC]"
      />

      <input
        name="email"
        type="email"
        placeholder="Email"
        required
        className="w-full bg-[#1a1714] px-4 py-3 text-[#E8E4DC]"
      />

      <textarea
        name="mensaje"
        placeholder="Mensaje"
        rows={6}
        required
        className="w-full bg-[#1a1714] px-4 py-3 text-[#E8E4DC]"
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-[#C4A882] px-8 py-3 text-sm uppercase text-[#0F0F0F]"
      >
        {loading ? 'Enviando...' : 'Enviar mensaje'}
      </button>

      {success && (
        <p className="text-green-400 text-sm">
          Mensaje enviado correctamente
        </p>
      )}

      {error && (
        <p className="text-red-400 text-sm">
          {error}
        </p>
      )}

    </form>
  )
}