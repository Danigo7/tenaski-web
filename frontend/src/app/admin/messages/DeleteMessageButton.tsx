'use client'

// app/admin/messages/DeleteMessageButton.tsx
// Botón que abre un modal de confirmación con estilo propio antes de eliminar.

import { useState, useTransition } from 'react'

type Props = {
  messageId: string
  deleteAction: (id: string) => Promise<void>
}

export default function DeleteMessageButton({ messageId, deleteAction }: Props) {
  const [showModal, setShowModal] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleConfirm() {
    startTransition(() => {
      deleteAction(messageId)
    })
    setShowModal(false)
  }

  return (
    <>
      {/* Botón que abre el modal */}
      <button
        type="button"
        onClick={() => setShowModal(true)}
        disabled={isPending}
        className="rounded-lg border border-red-900 bg-red-950/50 px-4 py-2
                   text-sm font-medium text-red-400 transition hover:bg-red-900/50
                   disabled:opacity-50"
      >
        {isPending ? 'Eliminando...' : 'Eliminar mensaje'}
      </button>

      {/* Overlay + modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setShowModal(false)}
        >
          <div
            // Evita que el click dentro del modal lo cierre
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl"
          >
            {/* Icono de aviso */}
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-950/50 border border-red-900">
              <svg
                className="h-6 w-6 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948
                     3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949
                     3.378c-.866-1.5-3.032-1.5-3.898 0L2.748 16.126zM12
                     15.75h.007v.008H12v-.008z"
                />
              </svg>
            </div>

            {/* Texto */}
            <h3 className="mt-4 text-lg font-semibold text-[#E8E4DC]">
              Eliminar mensaje
            </h3>
            <p className="mt-2 text-sm text-zinc-400">
              ¿Seguro que quieres eliminar este mensaje? Esta acción no se puede deshacer.
            </p>

            {/* Botones */}
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2.5
                           text-sm font-medium text-zinc-300 transition hover:bg-zinc-700"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold
                           text-white transition hover:bg-red-500"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}