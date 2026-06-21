'use client'

import SectionText from "../ui/SectionTest"

// Tipo para cada paso individual del proceso
type Step = {
  title: string
  description: string
  imageUrl?: string  // Imagen del paso, opcional
  imageAlt?: string
}

type ProcessProps = {
  eyebrow: string     // Etiqueta superior (ej: "Cómo lo hacemos")
  title: string       // Título de la sección
  description: string // Descripción introductoria
  steps: Step[]       // Array de pasos del proceso
}

export default function Process({ eyebrow, title, description, steps }: ProcessProps) {
  return (
    <section className="bg-[#0F0F0F] py-20">
      <div className="mx-auto max-w-6xl px-6">

        {/* ── HEADER ────────────────────────────────────────── */}
        {/* max-w-3xl para que el header no ocupe todo el ancho */}
        <div className="max-w-3xl">

          {/* Eyebrow en dorado */}
          <p className="mb-6 text-xs uppercase tracking-[0.35em] text-[#C4A882]">
            {eyebrow}
          </p>

          {/* Título inline (sin SectionTitle) para respetar el max-w-3xl del contenedor */}
          <h2 className="font-['Cormorant_Garamond'] text-5xl font-light leading-[1] tracking-[-0.03em] text-[#E8E4DC] md:text-6xl">
            {title}
          </h2>

          {/* Descripción con el componente compartido */}
          <div className="mt-10">
            <SectionText>{description}</SectionText>
          </div>

        </div>

        {/* ── STEPS ─────────────────────────────────────────── */}
        <div className="mt-24 space-y-28">

          {steps.map((step, index) => {

            // Los pasos pares alternan el orden imagen/texto para dar ritmo visual
            const isEven = index % 2 === 1

            return (
              <div key={step.title} className="grid items-center gap-12 lg:grid-cols-2">

                {/* ── IMAGEN DEL PASO ───────────────────────── */}
                {/* lg:order-X controla si la imagen va a izquierda o derecha */}
                <div className={`relative h-[420px] overflow-hidden group ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>

                  {/* Imagen o placeholder si no hay */}
                  {step.imageUrl ? (
                    <div
                      className="img-premium h-full w-full bg-cover bg-center transition-all duration-700 group-hover:scale-110 group-hover:brightness-110 group-hover:contrast-110"
                      style={{ backgroundImage: `url(${step.imageUrl})` }}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-[#1a1714]">
                      <p className="text-xs uppercase tracking-[0.3em] text-[#E8E4DC]/20">Imagen</p>
                    </div>
                  )}

                  {/* Overlay oscuro que desaparece en hover */}
                  <div className="absolute inset-0 bg-black/20 transition-opacity duration-700 group-hover:opacity-0" />

                  {/* Gradiente inferior para fundir con el fondo */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F]/40 to-transparent" />

                </div>

                {/* ── TEXTO DEL PASO ────────────────────────── */}
                <div className={isEven ? 'lg:order-1' : 'lg:order-2'}>

                  {/* Número del paso en dorado apagado */}
                  <p className="mb-6 text-5xl font-light text-[#C4A882]/50">
                    0{index + 1}
                  </p>

                  {/* Título del paso, más pequeño que el título de sección */}
                  <h3 className="font-['Cormorant_Garamond'] text-3xl font-light text-[#E8E4DC]">
                    {step.title}
                  </h3>

                  {/* Descripción del paso, inline (no usa SectionText para no limitar el ancho) */}
                  <p className="mt-6 text-base leading-relaxed text-[#E8E4DC]/60">
                    {step.description}
                  </p>

                </div>

              </div>
            )
          })}

        </div>

      </div>
    </section>
  )
}