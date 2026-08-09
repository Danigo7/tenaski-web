import Link from 'next/link'
import Image from 'next/image'
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
      <div className="absolute inset-0 overflow-hidden">

        {/* 1. Imagen principal del Hero + Su propia transición inferior + Opacidad */}
        {imageUrl ? (
          <div
            className="absolute inset-0 opacity-55"
            style={{
              maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
            }}
          >
            <Image
              src={imageUrl}
              alt=""
              fill
              priority
              sizes="100vw"
              quality={75}
              className="object-cover object-center"
            />
          </div>
        ) : (
          <div className="h-full w-full bg-[var(--surface-soft)]" />
        )}

        {/* 2. Filtro oscuro sutil sobre TODO el Hero para la legibilidad del texto,
            reajustado para que acompañe bien a la opacidad de la imagen */}
        <div 
          className="absolute inset-0 pointer-events-none bg-gradient-to-t from-transparent via-[rgba(0,0,0,0.3)] to-[rgba(0,0,0,0.55)]" 
        />

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