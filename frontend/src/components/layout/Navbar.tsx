'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const links = [
  { href: '/historia', label: 'Historia' },
  { href: '/catalogo', label: 'Catálogo' },
  { href: '/galeria', label: 'Galería' },
  { href: '/contacto', label: 'Contacto' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header
        className={`
          fixed top-0 left-0 right-0 z-50
          transition-all duration-500 ease-in-out
          ${scrolled
            ? 'bg-[#0F0F0F]/95 backdrop-blur-sm py-4 border-b border-white/5'
            : 'bg-transparent py-7'
          }
        `}
      >
        <nav className="max-w-6xl mx-auto px-6 flex items-center justify-between">

                  {/* Logo */}
                  <Link href="/" className="flex items-center gap-3">
                      <Image
                          src="/img/logoo.png"
                          alt="Tena Skis"
                          width={32}
                          height={32}
                          className="object-contain"
                      />
                      <span className="font-['Cormorant_Garamond'] text-xl font-semibold tracking-widest text-[#E8E4DC] uppercase">
                          Tena Skis
                      </span>
                  </Link>

          {/* Links desktop */}
          <ul className="hidden md:flex items-center gap-10">
            {links.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="
                    relative text-[#E8E4DC]/80 hover:text-[#E8E4DC]
                    text-sm tracking-[0.15em] uppercase
                    transition-colors duration-300
                    after:absolute after:bottom-[-3px] after:left-1/2 after:right-1/2
                    after:h-px after:bg-[#C4A882]
                    after:transition-all after:duration-500 after:ease-in-out
                    hover:after:left-0 hover:after:right-0
                  "
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Botón hamburguesa mobile */}
          <button
            className="md:hidden flex flex-col gap-[5px] p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Abrir menú"
          >
            <span className={`block h-px w-6 bg-[#E8E4DC] transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[6px]' : ''}`} />
            <span className={`block h-px w-6 bg-[#E8E4DC] transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-px w-6 bg-[#E8E4DC] transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[6px]' : ''}`} />
          </button>

        </nav>
      </header>

      {/* Menú mobile */}
      <div
        className={`
          fixed inset-0 z-40 bg-[#0F0F0F]/98 backdrop-blur-md
          flex flex-col items-center justify-center gap-10
          transition-all duration-500 ease-in-out
          ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
      >
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setMenuOpen(false)}
            className="
              font-['Cormorant_Garamond'] text-4xl font-light tracking-widest
              text-[#E8E4DC]/70 hover:text-[#E8E4DC]
              transition-colors duration-300 uppercase
            "
          >
            {label}
          </Link>
        ))}
      </div>
    </>
  )
}