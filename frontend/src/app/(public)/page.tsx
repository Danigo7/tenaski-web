import { createClient } from '@/lib/supabase/server'
import Hero from '@/components/home/Hero'
import Manifesto from '@/components/home/Manifesto'
import Process from '@/components/home/Process'
import FeaturedProduct from '@/components/home/FeaturedProduct'
import CTA from '@/components/home/CTA'
import ScrollToTop from '@/components/ui/ScrollToTop'

// ─────────────────────────────────────────────────────────
// Server Component
// ─────────────────────────────────────────────────────────
export default async function Home() {
  const supabase = await createClient()

  // Producto destacado: publicado + destacado = true
  const { data: featured } = await supabase
    .from('product')
    .select(`
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
    .eq('destacado', true)
    .order('updated_at', { ascending: false })
    .limit(1)
    .single()

  // Imagen principal del producto destacado
  const featuredImage = featured
    ? (() => {
        const imgs = featured.product_image as any[]
        const main = imgs.find((pi) => pi.imagen_principal) ?? imgs[0]
        return main?.image?.ruta_storage ?? '/img/manifestoimg.png'
      })()
    : '/img/manifestoimg.png'

  return (
    <main>

      <Hero
        imageUrl="/img/heroimg.png"
        eyebrow="Pirineos · Hecho a mano"
        title="Esquís que cuentan algo."
        description="Cada par sale del taller con un nombre, una historia y la forma exacta del terreno para el que fue hecho."
        buttons={[
          { text: 'Ver catálogo', href: '/catalogo', variant: 'primary' },
          { text: 'Nuestra historia', href: '/historia', variant: 'secondary' },
        ]}
      />

      <Manifesto
        imageUrl="/img/manifestoimg.png"
        eyebrow="Nuestra filosofía"
        title="No fabricamos esquís. Construimos compañeros de montaña."
        description="Cada pieza nace en el taller, donde la madera, la experiencia y el terreno se encuentran para crear algo que durará muchos inviernos."
      />

      <Process
        eyebrow="El taller"
        title="Cada esquí pasa por cuatro etapas."
        description="El proceso combina experiencia, materiales seleccionados y una construcción artesanal pensada para durar muchos inviernos."
        steps={[
          {
            title: 'Diseño',
            description: 'Cada modelo nace pensando en un terreno y una forma de esquiar.',
            imageUrl: '/img/designimg.png',
            imageAlt: 'Diseño artesanal de esquís',
          },
          {
            title: 'Madera',
            description: 'Seleccionamos materiales resistentes y ligeros para cada construcción.',
            imageUrl: '/img/woodimg.jpeg',
            imageAlt: 'Selección de madera',
          },
          {
            title: 'Construcción',
            description: 'Cada pieza se trabaja a mano dentro del taller.',
            imageUrl: '/img/buildimg.jpeg',
            imageAlt: 'Construcción de esquís',
          },
          {
            title: 'Acabado',
            description: 'Los detalles finales convierten cada esquí en una pieza única.',
            imageUrl: '/img/finishimg.png',
            imageAlt: 'Acabado artesanal',
          },
        ]}
      />

      {/* Solo renderizar FeaturedProduct si hay un producto destacado */}
      {featured ? (
        <FeaturedProduct
          eyebrow="Producto destacado"
          name={featured.nombre}
          description={featured.descripcion_corta ?? ''}
          imageUrl={featuredImage}
          buttonText="Descubrir modelo"
          buttonHref={`/catalogo/${featured.slug}`}
        />
      ) : (
        // Fallback vacío si no hay ningún producto destacado configurado
        null
      )}

      <CTA
        eyebrow="Empieza el viaje"
        title="Cada esquí empieza como un trozo de madera."
        description="Descubre una colección creada para durar, evolucionar y acompañarte durante muchos inviernos."
        buttonText="Explorar catálogo"
        buttonHref="/catalogo"
      />

      <ScrollToTop />

    </main>
  )
}