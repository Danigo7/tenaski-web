// app/admin/messages/page.tsx
// Página completa de mensajes: lista a la izquierda, detalle a la derecha.
// El mensaje activo se controla por el query param ?id=xxx (Server Component puro).

import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { markMessageRead, deleteMessage } from './actions'
import DeleteMessageButton from './DeleteMessageButton'


// ── Tipos ────────────────────────────────────────────────────────────────────

interface Message {
  id:         string
  nombre:     string
  email:      string
  telefono:   string | null
  asunto:     string | null
  mensaje:    string
  estado:     'nuevo' | 'leido' | 'archivado'
  created_at: string
}

// ── Página ───────────────────────────────────────────────────────────────────

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>
}) {
  const { id } = await searchParams
  const supabase = await createClient()

  // Todos los mensajes ordenados por fecha desc
  const { data: messages } = await supabase
    .from('message')
    .select('id, nombre, email, telefono, asunto, mensaje, estado, created_at')
    .order('created_at', { ascending: false })

  const all = (messages ?? []) as Message[]

  // Mensaje seleccionado según ?id= en la URL
  const activeId = id ?? null
  const active   = all.find((m) => m.id === activeId) ?? null

  // Si el mensaje activo es "nuevo", marcarlo como leído
  if (active && active.estado === 'nuevo') {
    await markMessageRead(active.id)
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-4xl font-semibold">Mensajes</h1>
        <p className="mt-2 text-zinc-400">
          {all.length} mensaje{all.length !== 1 ? 's' : ''} recibido{all.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* LAYOUT: lista + detalle */}
      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">

        {/* ── LISTA ──────────────────────────────────────────────────────── */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">

          {all.length === 0 ? (
            <p className="p-6 text-sm text-zinc-500">No hay mensajes todavía.</p>
          ) : (
            <ul className="divide-y divide-zinc-800">
              {all.map((msg) => {
                const isActive = msg.id === activeId
                return (
                  <li key={msg.id}>
                    <Link
                      href={`/admin/messages?id=${msg.id}`}
                      className={`flex flex-col gap-1 px-4 py-3 transition hover:bg-zinc-800 ${
                        isActive ? 'bg-zinc-800 border-l-2 border-[#C4A882]' : ''
                      }`}
                    >
                      {/* Nombre + badge */}
                      <div className="flex items-center gap-2">
                        <span
                          className={`truncate text-sm font-medium ${
                            isActive ? 'text-[#C4A882]' : 'text-[#E8E4DC]'
                          }`}
                        >
                          {msg.nombre}
                        </span>
                        {msg.estado === 'nuevo' && (
                          <span className="shrink-0 rounded-full bg-[#C4A882] px-1.5 py-0.5 text-[10px] font-bold text-[#0F0F0F]">
                            NEW
                          </span>
                        )}
                      </div>

                      {/* Asunto */}
                      <span className="truncate text-xs text-zinc-400">
                        {msg.asunto ?? '(sin asunto)'}
                      </span>

                      {/* Fecha */}
                      <span className="text-[11px] text-zinc-600">
                        {formatDate(msg.created_at)}
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {/* ── DETALLE ────────────────────────────────────────────────────── */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">

          {active ? (
            <article className="space-y-6">

              {/* Cabecera del mensaje */}
              <div className="space-y-1 border-b border-zinc-800 pb-6">
                <h2 className="font-['Cormorant_Garamond'] text-2xl font-semibold text-[#E8E4DC]">
                  {active.asunto ?? '(sin asunto)'}
                </h2>

                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-zinc-400 pt-1">
                  <span>
                    <span className="text-zinc-500">De: </span>
                    <span className="text-[#E8E4DC]">{active.nombre}</span>
                  </span>
                  <span>
                    <a
                      href={`mailto:${active.email}`}
                      className="text-[#C4A882] hover:underline"
                    >
                      {active.email}
                    </a>
                  </span>
                  {active.telefono && (
                    <span>
                      <a
                        href={`tel:${active.telefono}`}
                        className="text-[#C4A882] hover:underline"
                      >
                        {active.telefono}
                      </a>
                    </span>
                  )}
                  <span className="text-zinc-500">{formatDateFull(active.created_at)}</span>
                </div>
              </div>

              {/* Cuerpo del mensaje */}
              <div className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-300">
                {active.mensaje}
              </div>

              {/* Acciones */}
              <div className="border-t border-zinc-800 pt-4">
                <DeleteMessageButton messageId={active.id} deleteAction={deleteMessage} />
              </div>

            </article>
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-zinc-500">
                Selecciona un mensaje para verlo.
              </p>
            </div>
          )}

        </div>

      </div>

    </div>
  )
}

// ── Helpers de fecha ─────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-ES', {
    day:   '2-digit',
    month: 'short',
    year:  'numeric',
  })
}

function formatDateFull(iso: string) {
  return new Date(iso).toLocaleString('es-ES', {
    day:    '2-digit',
    month:  'long',
    year:   'numeric',
    hour:   '2-digit',
    minute: '2-digit',
  })
}