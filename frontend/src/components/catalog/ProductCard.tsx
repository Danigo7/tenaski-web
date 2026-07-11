'use client'

import Link from 'next/link'
import SectionText from '../ui/SectionTest'

type ProductCardProps = {
  name: string
  description: string
  slug: string
  imageUrl?: string
}

export default function ProductCard({
  name,
  description,
  slug,
  imageUrl,
}: ProductCardProps) {
  return (
    <article className="group">

      {/* ── IMAGEN ───────────────────────────── */}

      <div className="relative h-[500px] overflow-hidden">

        {imageUrl ? (
          <div
            className="img-premium h-full w-full bg-cover bg-center transition-all duration-700 group-hover:scale-105"
            style={{ backgroundImage: `url(${imageUrl})` }}
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-[var(--surface-soft)]">

            <p className="text-xs uppercase tracking-[0.3em] text-[var(--text-disabled)]">
              Imagen producto
            </p>

          </div>
        )}

        {/* Overlay oscuro */}

        <div className="absolute inset-0 bg-[var(--overlay-light)] transition-opacity duration-700 group-hover:opacity-0" />

        {/* Gradiente inferior */}

        <div className="absolute inset-0 bg-[image:var(--gradient-dark)]" />

      </div>

      {/* ── CONTENIDO ───────────────────────── */}

      <div className="mt-8">

        <h3 className="font-['Cormorant_Garamond'] text-4xl font-light text-[var(--foreground)]">
          {name}
        </h3>

        <div className="mt-6">
          <SectionText>{description}</SectionText>
        </div>

        <Link
          href={`/catalogo/${slug}`}
          className="
            mt-8 inline-flex items-center gap-2 text-sm uppercase tracking-[0.15em]
            text-[var(--accent)] transition-all duration-300 hover:translate-x-2
          "
        >
          Descubrir →
        </Link>

      </div>

    </article>
  )
}