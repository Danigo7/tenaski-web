'use client'

import { useEffect, useState } from 'react'

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollUp = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <button
      onClick={scrollUp}
      aria-label="Volver arriba"
      className={`
        fixed bottom-8 right-8 z-50
        group
        flex items-center justify-center
        w-11 h-11
        border border-[var(--border-hover)]
        bg-[var(--background)]/80 backdrop-blur-sm
        text-[var(--text-muted)]
        transition-all duration-500 ease-in-out
        hover:border-[var(--accent)]/50
        hover:text-[var(--accent)]
        hover:bg-[var(--background)]/95
        ${visible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-4 pointer-events-none'
        }
      `}
    >
      {/* Flecha minimalista */}
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform duration-300 group-hover:-translate-y-0.5"
      >
        <path
          d="M7 12V2M7 2L2.5 6.5M7 2L11.5 6.5"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}