import { createClient } from '@/lib/supabase/server'
import Hero from '@/components/home/Hero'
import GalleryGrid, { ImageItem } from '@/components/galery/GalleryGrid'
import CTA from '@/components/home/CTA'
import ScrollToTop from '@/components/ui/ScrollToTop'

function getImage(block: any): string | null {
  const img = block?.image
  if (!img) return null
  if (Array.isArray(img)) return img[0]?.ruta_storage ?? null
  return img.ruta_storage ?? null
}

export default async function GaleriaPage() {
  const supabase = await createClient()
  const { data: heroBlock } = await supabase
    .from('content_block')
    .select(`
      data,
      image:imagen_id (
        ruta_storage
      )
    `)
    .eq('seccion', 'hero_galeria')
    .single()

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
        imageUrl={getImage(heroBlock) ?? '/img/heroimg.png'}
        eyebrow={
          heroBlock?.data?.eyebrow ??
          'Galería'
        }
        title={
          heroBlock?.data?.titulo ??
          'La montaña, tal y como la vivimos.'
        }
        description={
          heroBlock?.data?.descripcion ??
          'Una selección de momentos, texturas y paisajes.'
        }
        buttons={[
          {
            text: 'Ver catálogo',
            href: '/catalogo',
            variant: 'primary',
          },
          {
            text: 'Volver al inicio',
            href: '/',
            variant: 'secondary',
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

      <ScrollToTop />

    </main>
  )
}