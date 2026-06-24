import Hero from '@/components/home/Hero'

import Intro from '@/components/catalog/Intro'

import ProductGrid from '@/components/catalog/ProductGrid'

import CTA from '@/components/home/CTA'

import ScrollToTop from '@/components/ui/ScrollToTop'

export default function Catalogo() {
  return (
    <main className="bg-[#0F0F0F]">

      <Hero
        imageUrl="/img/heroimg.png"

        eyebrow="Colección"

        title="Nuestros esquís."

        description="Cada modelo nace para un terreno, una forma de esquiar y una manera distinta de entender la montaña."

        buttons={[
          {
            text: 'Nuestra historia',
            href: '/historia',
            variant: 'secondary',
          },
          {
            text: 'Contactar',
            href: '/contacto',
            variant: 'primary',
          },

        ]}
      />

      <Intro
        eyebrow="La colección"

        title="Cada modelo tiene una personalidad propia."

        description="No fabricamos productos en serie. Cada esquí se diseña pensando en la experiencia que ofrecerá en la montaña."
      />

      <ProductGrid
        products={[
          {
            name: 'O Sallenuto',

            description:
              'Diseñado para quienes buscan estabilidad y precisión en cualquier condición.',

            slug: 'o-sallenuto',

            imageUrl: '/img/manifestoimg.png',
          },

          {
            name: 'Anayet',

            description:
              'Ligero, ágil y pensado para largas jornadas en montaña.',

            slug: 'anayet',

            imageUrl: '/img/manifestoimg.png',
          },

          {
            name: 'Midi d’Ossau',

            description:
              'Una construcción sólida para quienes buscan carácter y potencia.',

            slug: 'midi-dossau',

            imageUrl: '/img/manifestoimg.png',
          },

          {
            name: 'Tendeñera',

            description:
              'Equilibrio perfecto entre estabilidad, precisión y versatilidad.',

            slug: 'tendeñera',

            imageUrl: '/img/manifestoimg.png',
          },
        ]}
      />

      <CTA
        eyebrow="Encuentra tu modelo"

        title="Cada montaña merece un esquí diferente."

        description="Descubre una colección artesanal creada para acompañarte durante muchos inviernos."

        buttonText="Contactar"

        buttonHref="/contacto"
      />

      <ScrollToTop />

    </main>
  )
}