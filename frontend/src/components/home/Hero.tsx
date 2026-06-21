'use client'

import Link from 'next/link'
import SectionText from '../ui/SectionTest'

type HeroProps = {
  eyebrow: string    // Etiqueta pequeña superior (ej: "Hecho a mano")
  title: string      // Título principal grande
  description: string
  imageUrl?: string  // Imagen de fondo opcional
}

export default function Hero({ eyebrow, title, description, imageUrl }: HeroProps) {
  return (
    // Sección a pantalla completa con overflow oculto para que nada se salga
    <section className="relative min-h-screen overflow-hidden">

      {/* ── FONDO ─────────────────────────────────────────── */}
      <div className="absolute inset-0">

        {/* Imagen de fondo o color sólido si no hay imagen */}
        {imageUrl ? (
          <div
            className="h-full w-full bg-cover bg-center"
            style={{ backgroundImage: `url(${imageUrl})` }}
          />
        ) : (
          <div className="h-full w-full bg-[#1a1714]" />
        )}

        {/* Overlay diagonal oscuro para dar profundidad */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#2a2420]/80 via-[#1a1714]/70 to-[#0F0F0F]" />

        {/* Overlay inferior para que el texto destaque sobre el fondo */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-[#0F0F0F]/20 to-transparent" />

      </div>

      {/* ── CONTENIDO ─────────────────────────────────────── */}
      {/* z-10 para que quede por encima del fondo, texto pegado abajo con justify-end */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col justify-end px-6 pb-24">

        {/* Eyebrow: etiqueta pequeña en dorado con mucho tracking */}
        <p className="mb-6 text-xs uppercase tracking-[0.3em] text-[#C4A882]">
          {eyebrow}
        </p>

        {/* Título hero: más grande que SectionTitle, escala con breakpoints */}
        <h1 className="max-w-3xl font-['Cormorant_Garamond'] text-5xl font-light leading-none tracking-tight text-[#E8E4DC] sm:text-6xl md:text-7xl lg:text-8xl">
          {title}
        </h1>

        {/* Descripción usando el componente compartido */}
        <div className="mt-6">
          <SectionText>{description}</SectionText>
        </div>

        {/* ── BOTONES ───────────────────────────────────────── */}
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">

          {/* Botón primario: fondo dorado, texto oscuro */}
          <Link
            href="/catalogo"
            className="px-8 py-3 text-center text-sm uppercase tracking-[0.15em] bg-[#C4A882] text-[#0F0F0F] transition-colors duration-300 hover:bg-[#E8E4DC]"
          >
            Ver catálogo
          </Link>

          {/* Botón secundario: borde sutil, texto apagado */}
          <Link
            href="/historia"
            className="px-8 py-3 text-center text-sm uppercase tracking-[0.15em] border border-[#E8E4DC]/20 text-[#E8E4DC]/60 transition-all duration-300 hover:border-[#E8E4DC]/50 hover:text-[#E8E4DC]"
          >
            Nuestra historia
          </Link>

        </div>

      </div>
    </section>
  )
}