'use client'

import Link from 'next/link'

type CTAProps = {
  eyebrow: string

  title: string

  description: string

  buttonText?: string

  buttonHref?: string
}

export default function CTA({
  eyebrow,

  title,

  description,

  buttonText = 'Explorar catálogo',

  buttonHref = '/catalogo',
}: CTAProps) {
  return (
    <section className="home-section py-10">

      <div className="mx-auto max-w-4xl px-6 text-center">

        {/* Etiqueta */}

        <p className="home-section__eyebrow">
          {eyebrow}
        </p>

        {/* Título */}

        <h2 className="mx-auto max-w-3xl home-section__title">
          {title}
        </h2>

        {/* Descripción */}

        <p className="mx-auto mt-8 max-w-2xl home-section__text">
          {description}
        </p>

        {/* Botón */}

        <Link href={buttonHref} className="mt-12 home-section__button-primary">
          {buttonText}
        </Link>

      </div>

    </section>
  )
}