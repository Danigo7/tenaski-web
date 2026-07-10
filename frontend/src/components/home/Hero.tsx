'use client'

import Link from 'next/link'
import SectionText from '../ui/SectionTest'

type HeroButton = {
  text: string
  href: string
  variant: 'primary' | 'secondary'
}

type HeroProps = {
  eyebrow: string
  title: string
  description: string
  imageUrl?: string
  buttons?: HeroButton[]  // Botones opcionales y configurables
}

export default function Hero({ eyebrow, title, description, imageUrl, buttons }: HeroProps) {
  return (
    <section className="home-section relative min-h-screen overflow-hidden">

      {/* ── FONDO ─────────────────────────────────────────── */}
      <div className="absolute inset-0">

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
      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col justify-end px-6 pb-30 md:pb-24">

        {/* Eyebrow en dorado */}
        <p className="home-section__eyebrow">
          {eyebrow}
        </p>

        {/* Título hero: escala con breakpoints */}
        <h1 className="home-section__title max-w-3xl text-5xl sm:text-6xl md:text-7xl lg:text-8xl">
          {title}
        </h1>

        {/* Descripción con el componente compartido */}
        <div className="mt-6">
          <SectionText>{description}</SectionText>
        </div>

        {/* ── BOTONES ─────────────────────────────────────── */}
        {/* Solo se renderizan si se pasan botones */}
        {buttons && buttons.length > 0 && (
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">

            {buttons.map((button) => (
              button.variant === 'primary' ? (

                /* Botón primario: fondo dorado, texto oscuro */
                <Link
                  key={button.href}
                  href={button.href}
                  className="home-section__button-primary px-8 py-3 text-center"
                >
                  {button.text}
                </Link>

              ) : (

                /* Botón secundario: borde sutil, texto apagado */
                <Link
                  key={button.href}
                  href={button.href}
                  className="home-section__button-secondary px-8 py-3 text-center"
                >
                  {button.text}
                </Link>

              )
            ))}

          </div>
        )}

      </div>
    </section>
  )
}