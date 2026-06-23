import Hero from '@/components/home/Hero'
import GalleryGrid, { ImageItem } from '@/components/galery/GalleryGrid'
import CTA from '@/components/home/CTA'

export default function GaleriaPage() {
  const images: ImageItem[] = [
    {
      src: '/img/gallery1.jpeg',
      alt: 'Logo',
      size: 'lg',
    },
    {
      src: '/img/gallery2.jpeg',
      alt: 'Taller artesanal',
      size: 'md',
    },
    {
      src: '/img/storyimg.jpeg',
      alt: 'David',
      size: 'lg',
    },
    {
      src: '/img/heroimg.png',
      alt: 'Esquí en acción',
      size: 'md',
    },
    {
      src: '/img/woodimg.jpeg',
      alt: 'Madera',
      size: 'sm',
    },
  ]

  return (
    <main className="bg-[#0F0F0F]">

      <Hero
        imageUrl="/img/gallery-hero.jpg"
        eyebrow="Galería"
        title="La montaña, tal y como la vivimos."
        description="Una selección de momentos, texturas y paisajes."
        buttons={[
          {
            text: 'Ver catálogo',
            href: '/catalogo',
            variant: 'secondary',
          },
          {
            text: 'Contactar',
            href: '/contacto',
            variant: 'primary',
          },
        ]}
      />

      <GalleryGrid images={images} />

      <CTA
        eyebrow="Inspiración"
        title="Cada imagen cuenta una historia."
        description="Descubre el catálogo completo o contáctanos."
        buttonText="Ver catálogo"
        buttonHref="/catalogo"
      />

    </main>
  )
}