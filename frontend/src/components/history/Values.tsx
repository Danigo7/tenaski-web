'use client'

import SectionTitle from '@/components/ui/SectionTitle'
import SectionText from '../ui/SectionTest'
type Value = {
  number: string
  title: string
  description: string
}

type ValuesProps = {
  values: Value[]
}

export default function Values({ values }: ValuesProps) {
  return (
    <section className="bg-[#0F0F0F] py-20">

      <div className="mx-auto max-w-6xl px-6">

        {/* HEADER */}

        <div className="max-w-3xl">

          <p className="mb-6 text-xs uppercase tracking-[0.35em] text-[#C4A882]">
            Nuestros valores
          </p>

          <SectionTitle>
            La montaña marca nuestras decisiones.
          </SectionTitle>

        </div>

        {/* TARJETAS */}

        <div className="mt-20 grid gap-10 md:grid-cols-3">

          {values.map((value) => (

            <div
              key={value.number}
              className="
                border border-white/5
                p-10
                transition-all duration-500
                hover:border-[#C4A882]/30
                hover:-translate-y-1
              "
            >

              <p className="text-5xl font-light text-[#C4A882]/50">
                {value.number}
              </p>

              <h3 className="mt-8 font-['Cormorant_Garamond'] text-3xl font-light text-[#E8E4DC]">
                {value.title}
              </h3>

              <div className="mt-6">
                <SectionText>
                  {value.description}
                </SectionText>
              </div>

            </div>

          ))}

        </div>

      </div>

    </section>
  )
}