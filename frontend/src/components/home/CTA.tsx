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
    <section className="bg-[#0F0F0F] py-10">

      <div className="mx-auto max-w-4xl px-6 text-center">

        {/* Etiqueta */}

        <p className="mb-6 text-xs uppercase tracking-[0.35em] text-[#C4A882]">
          {eyebrow}
        </p>

        {/* Título */}

        <h2
          className="
            mx-auto

            max-w-3xl

            font-['Cormorant_Garamond']

            text-5xl

            font-light

            leading-[1]

            tracking-[-0.03em]

            text-[#E8E4DC]

            md:text-6xl
          "
        >
          {title}
        </h2>

        {/* Descripción */}

        <p
          className="
            mx-auto

            mt-8

            max-w-2xl

            text-base

            leading-relaxed

            text-[#E8E4DC]/60

            sm:text-lg
          "
        >
          {description}
        </p>

        {/* Botón */}

        <Link
          href={buttonHref}

          className="
            mt-12

            inline-block

            bg-[#C4A882]

            px-10 py-4

            text-sm

            uppercase

            tracking-[0.15em]

            text-[#0F0F0F]

            transition-colors duration-300

            hover:bg-[#E8E4DC]
          "
        >
          {buttonText}
        </Link>

      </div>

    </section>
  )
}