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
          <div className="flex h-full items-center justify-center bg-[#1a1714]">

            <p className="text-xs uppercase tracking-[0.3em] text-[#E8E4DC]/20">
              Imagen producto
            </p>

          </div>
        )}

        {/* Overlay oscuro */}

        <div className="absolute inset-0 bg-black/20 transition-opacity duration-700 group-hover:opacity-0" />

        {/* Gradiente inferior */}

        <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F]/40 to-transparent" />

      </div>

      {/* ── CONTENIDO ───────────────────────── */}

      <div className="mt-8">

        <h3 className="font-['Cormorant_Garamond'] text-4xl font-light text-[#E8E4DC]">
          {name}
        </h3>

        <div className="mt-6">
          <SectionText>{description}</SectionText>
        </div>

        <Link
          href={`/catalogo/${slug}`}
          className="
            mt-8
            inline-flex
            items-center
            gap-2
            text-sm
            uppercase
            tracking-[0.15em]
            text-[#C4A882]
            transition-all
            duration-300
            hover:translate-x-2
          "
        >
          Descubrir →
        </Link>

      </div>

    </article>
  )
}