import { createClient } from '@/lib/supabase/server'
import Hero from '@/components/home/Hero'
import Intro from '@/components/catalog/Intro'
import ProductGrid from '@/components/catalog/ProductGrid'
import CTA from '@/components/home/CTA'
import ScrollToTop from '@/components/ui/ScrollToTop'

// ─── Tipos ────────────────────────────────────────────────
type ProductRow = {
  id: string
  nombre: string
  slug: string
  descripcion_corta: string | null
  product_image: {
    imagen_principal: boolean
    image: {
      ruta_storage: string
    }
  }[]
}

// ─────────────────────────────────────────────────────────
// Server Component: sin 'use client', fetch directo
// ─────────────────────────────────────────────────────────
export default async function Catalogo() {
  const supabase = await createClient()

  const { data: heroBlock } = await supabase
    .from('content_block')
    .select(`
      data,
      image:imagen_id (
        ruta_storage
      )
    `)
    .eq('seccion', 'hero_catalogo')
    .single()

  // Traer productos publicados con su imagen principal
  const { data, error } = await supabase
    .from('product')
    .select(`
      id,
      nombre,
      slug,
      descripcion_corta,
      product_image (
        imagen_principal,
        orden,
        image:imagen_id (
          ruta_storage
        )
      )
    `)
    .eq('publicado', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error cargando catálogo:', error.message)
  }

  const products = (data ?? []) as unknown as ProductRow[]

  // Mapear al formato que espera ProductGrid
  const gridProducts = products.map((p) => {
    // Buscar imagen principal; si no hay, coger la primera
    const principalEntry =
      p.product_image.find((pi) => pi.imagen_principal) ??
      p.product_image[0]

    return {
      name: p.nombre,
      description: p.descripcion_corta ?? '',
      slug: p.slug,
      imageUrl: principalEntry?.image?.ruta_storage ?? '/img/manifestoimg.png',
    }
  })

  return (
    <main className="bg-[#0F0F0F]">

      <Hero
        imageUrl={
          heroBlock?.image?.[0]?.ruta_storage ??
          '/img/heroimg.png'
        }
        eyebrow={
          heroBlock?.data?.eyebrow ??
          'Colección'
        }
        title={
          heroBlock?.data?.titulo ??
          'Nuestros esquís.'
        }
        description={
          heroBlock?.data?.descripcion ??
          'Cada modelo nace para un terreno, una forma de esquiar y una manera distinta de entender la montaña.'
        }
        buttons={[
          { text: 'Nuestra historia', href: '/historia', variant: 'secondary' },
          { text: 'Contactar', href: '/contacto', variant: 'primary' },
        ]}
      />

      <Intro
        eyebrow="La colección"
        title="Cada modelo tiene una personalidad propia."
        description="No fabricamos productos en serie. Cada esquí se diseña pensando en la experiencia que ofrecerá en la montaña."
      />

      <ProductGrid products={gridProducts} />

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