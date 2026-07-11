'use client'

import { useState } from 'react'

export default function SectionGroup({
  title,
  description,
  count,
  defaultOpen = false,
  children,
}: {
  title: string
  description?: string
  count?: number
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <section className="rounded-2xl border border-zinc-800">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-6 py-5 text-left"
      >
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-semibold tracking-wide text-[#C4A882]">
              {title}
            </h2>
            {typeof count === 'number' && (
              <span className="rounded-full border border-[#C4A882]/40 bg-[#C4A882]/10 px-2.5 py-0.5 text-xs font-medium text-[#C4A882]">
                {count} {count === 1 ? 'bloque' : 'bloques'}
              </span>
            )}
          </div>
          {description && (
            <p className="mt-1.5 text-sm text-zinc-500">{description}</p>
          )}
        </div>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`h-5 w-5 shrink-0 text-zinc-500 transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="space-y-8 border-t border-zinc-800 px-6 py-8">
          {children}
        </div>
      )}
    </section>
  )
}