'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { supabase } from '@/lib/supabase/client'

export default function LoginForm() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault()

    setLoading(true)
    setError('')

    const { data, error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      })

    if (error) {
      setError('Correo o contraseña incorrectos')
      setLoading(false)
      return
    }

    if (data.session) {
      router.push('/admin/dashboard')
      router.refresh()
    }

    setLoading(false)
  }

  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-8 backdrop-blur">

        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
            Tenaski
          </p>

          <h2 className="mt-2 text-3xl font-semibold text-white">
            Iniciar sesión
          </h2>

          <p className="mt-2 text-sm text-zinc-400">
            Accede al panel de administración
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="mb-2 block text-sm text-zinc-300">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-amber-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-300">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-amber-500"
            />
          </div>

          {error && (
            <div className="rounded-lg border border-red-900 bg-red-950 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-amber-500 px-4 py-3 font-medium text-black transition hover:bg-amber-400 disabled:opacity-50"
          >
            {loading ? 'Accediendo...' : 'Iniciar sesión'}
          </button>

        </form>

      </div>
    </div>
  )
}