'use client'

import SectionTitle from '@/components/ui/SectionTitle'
import SectionText from '../ui/SectionTest'

type StoryProps = {
  eyebrow: string
  title: string
  description: string
  imageUrl?: string
}

export default function Story({
  eyebrow,
  title,
  description,
  imageUrl,
}: StoryProps) {
  return (
    <section className="bg-[#0F0F0F] py-20">

      <div className="mx-auto grid max-w-6xl items-center gap-20 px-6 lg:grid-cols-2">

        {/* TEXTO */}
        <div>

          <p className="mb-6 text-xs uppercase tracking-[0.35em] text-[#C4A882]">
            {eyebrow}
          </p>

          <SectionTitle>{title}</SectionTitle>

          <div className="mt-10">
            <SectionText>{description}</SectionText>
          </div>

        </div>

        {/* IMAGEN */}
        <div className="relative h-[520px] overflow-hidden group">

          {imageUrl ? (
            <div
              className="img-premium h-full w-full bg-cover bg-center"
              style={{ backgroundImage: `url(${imageUrl})` }}
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-[#1a1714]">
              <p className="text-xs uppercase tracking-[0.3em] text-[#E8E4DC]/20">
                Imagen historia
              </p>
            </div>
          )}

          <div className="absolute inset-0 bg-black/25 transition-opacity duration-700 group-hover:opacity-0" />

        </div>

      </div>

    </section>
  )
}