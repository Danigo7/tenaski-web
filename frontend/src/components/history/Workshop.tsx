'use client'

import SectionTitle from '@/components/ui/SectionTitle'
import SectionText from '../ui/SectionTest'

type WorkshopProps = {
  eyebrow: string

  title: string

  description: string

  imageUrl?: string

  details: string[]
}

export default function Workshop({
  eyebrow,
  title,
  description,
  imageUrl,
  details,
}: WorkshopProps) {
  return (
    <section className="bg-[#0F0F0F] py-20">

      <div className="mx-auto grid max-w-6xl items-center gap-20 px-6 lg:grid-cols-2">

        {/* CONTENIDO */}

        <div>

          <p className="mb-6 text-xs uppercase tracking-[0.35em] text-[#C4A882]">
            {eyebrow}
          </p>

          <SectionTitle>
            {title}
          </SectionTitle>

          <div className="mt-10">
            <SectionText>
              {description}
            </SectionText>
          </div>

          {/* DETALLES */}

          <div className="mt-14 space-y-6">

            {details.map((detail) => (

              <div
                key={detail}
                className="flex items-center gap-4"
              >

                <div className="h-[1px] w-8 bg-[#C4A882]/60" />

                <p className="text-[#E8E4DC]/70">
                  {detail}
                </p>

              </div>

            ))}

          </div>

        </div>

        {/* IMAGEN */}

        <div className="relative h-[600px] overflow-hidden group">

          {imageUrl ? (

            <div
              className="
                img-premium
                h-full
                w-full
                bg-cover
                bg-center
                transition-all
                duration-700
                group-hover:scale-105
              "
              style={{
                backgroundImage: `url(${imageUrl})`,
              }}
            />

          ) : (

            <div className="flex h-full items-center justify-center bg-[#1a1714]">

              <p className="text-xs uppercase tracking-[0.3em] text-[#E8E4DC]/20">
                Imagen taller
              </p>

            </div>

          )}

          <div className="absolute inset-0 bg-black/25 transition-opacity duration-700 group-hover:opacity-0" />

          <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F]/40 to-transparent" />

        </div>

      </div>

    </section>
  )
}