import Hero from '@/components/home/Hero'
import Story from '@/components/history/Story'
import Values from '@/components/history/Values'
import Workshop from '@/components/history/Workshop'
import CTA from '@/components/home/CTA'
import ScrollToTop from '@/components/ui/ScrollToTop'

export default function Historia() {
  return (
    <>
      <Hero
        imageUrl="/img/heroimg.png"
        eyebrow="Pirineos · Desde 2026"
        title="Una historia nacida en la montaña."
        description="Construimos esquís pensando en el tiempo, el terreno y las personas que los utilizarán."
      />

      <Story
        eyebrow="El origen"
        title="Todo empezó en un pequeño taller."
        description="Tena Skis nace del deseo de recuperar una forma más humana de fabricar esquís, donde cada pieza tenga personalidad propia y una conexión directa con la montaña."
        imageUrl="/img/storyimg.jpeg"
      />

       <Values
        values={[
          {
            number: '01',

            title: 'Artesanía',

            description:
              'Cada esquí se construye de forma individual, cuidando cada detalle.',
          },

          {
            number: '02',

            title: 'Durabilidad',

            description:
              'Diseñados para acompañarte durante muchos inviernos.',
          },

          {
            number: '03',

            title: 'Montaña',

            description:
              'Todo nace pensando en el terreno y en la experiencia real.',
          },
        ]}
      />

      <Workshop
        eyebrow="El taller"

        title="Donde la madera se convierte en montaña."

        description="No trabajamos en una fábrica. Trabajamos en un espacio donde cada herramienta, cada material y cada decisión forman parte del resultado final."

        imageUrl="/img/workshoppimg.png"

        details={[
          'Maderas seleccionadas',

          'Herramientas tradicionales',

          'Acabados manuales',
        ]}
      />

      <CTA
        eyebrow="Continúa el viaje"
        title="Cada esquí empieza como una idea."
        description="Descubre una colección creada para durar muchos inviernos."
        buttonText="Explorar catálogo"
        buttonHref="/catalogo"
      />

      <ScrollToTop />

    </>
  )
}