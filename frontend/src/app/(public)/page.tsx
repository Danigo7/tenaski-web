import { createClient } from '@/lib/supabase/server'

import Hero from '@/components/home/Hero'
import Manifesto from '@/components/home/Manifesto'
import Process from '@/components/home/Process'
import FeaturedProduct from '@/components/home/FeaturedProduct'
import CTA from '@/components/home/CTA'
import ScrollToTop from '@/components/ui/ScrollToTop'

// ─────────────────────────────────────────────
// HELPER: extrae ruta_storage sea objeto o array
// (Supabase a veces tipa la relación embebida como
// array aunque en runtime devuelva un solo objeto)
// ─────────────────────────────────────────────
function getImage(block: any): string | null {
  const img = block?.image
  if (!img) return null
  if (Array.isArray(img)) return img[0]?.ruta_storage ?? null
  return img.ruta_storage ?? null
}

export default async function Home() {
  const supabase = await createClient()

  // ─────────────────────────────────────────────
  // HERO HOME
  // ─────────────────────────────────────────────
  const { data: hero } = await supabase
    .from('content_block')
    .select('data, image:imagen_id (ruta_storage)')
    .eq('seccion', 'hero_home')
    .single()

  // ─────────────────────────────────────────────
  // MANIFESTO HOME
  // ─────────────────────────────────────────────
  const { data: manifesto } = await supabase
    .from('content_block')
    .select('data, image:imagen_id (ruta_storage)')
    .eq('seccion', 'home_manifesto')
    .single()

  // ─────────────────────────────────────────────
  // PROCESS HOME + STEPS
  // ─────────────────────────────────────────────
  const { data: processBlocks } = await supabase
    .from('content_block')
    .select('seccion, data, image:imagen_id (ruta_storage)')
    .in('seccion', [
      'home_process',
      'home_process_step_1',
      'home_process_step_2',
      'home_process_step_3',
      'home_process_step_4',
    ])

  const process = processBlocks?.find((p) => p.seccion === 'home_process')

  const step = (n: number) =>
    processBlocks?.find((p) => p.seccion === `home_process_step_${n}`)

  // ─────────────────────────────────────────────
  // PRODUCTO DESTACADO (lo dejas igual)
  // ─────────────────────────────────────────────
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
    .limit(1)
    .single()

  const featuredImage = featured
    ? (() => {
        const imgs = featured.product_image as any[]
        const main = imgs.find((pi) => pi.imagen_principal) ?? imgs[0]
        return main?.image?.ruta_storage ?? '/img/manifestoimg.png'
      })()
    : '/img/manifestoimg.png'

  return (
    <>
      {/* HERO */}
      <Hero
        imageUrl={getImage(hero) ?? '/img/heroimg.png'}
        eyebrow={hero?.data?.eyebrow ?? ''}
        title={hero?.data?.titulo ?? ''}
        description={hero?.data?.descripcion ?? ''}
        buttons={[
          { text: 'Ver catálogo', href: '/catalogo', variant: 'primary' },
          { text: 'Nuestra historia', href: '/historia', variant: 'secondary' },
        ]}
      />

      {/* MANIFESTO */}
      <Manifesto
        imageUrl={getImage(manifesto) ?? '/img/manifestoimg.png'}
        eyebrow={manifesto?.data?.eyebrow ?? ''}
        title={manifesto?.data?.titulo ?? ''}
        description={manifesto?.data?.descripcion ?? ''}
      />

      {/* PROCESS */}
      <Process
        eyebrow={process?.data?.eyebrow ?? ''}
        title={process?.data?.titulo ?? ''}
        description={process?.data?.descripcion ?? ''}
        steps={[
          {
            title: step(1)?.data?.titulo ?? '',
            description: step(1)?.data?.descripcion ?? '',
            imageUrl: getImage(step(1)) ?? '/img/designimg.png',
            imageAlt: 'Step 1',
          },
          {
            title: step(2)?.data?.titulo ?? '',
            description: step(2)?.data?.descripcion ?? '',
            imageUrl: getImage(step(2)) ?? '/img/woodimg.jpeg',
            imageAlt: 'Step 2',
          },
          {
            title: step(3)?.data?.titulo ?? '',
            description: step(3)?.data?.descripcion ?? '',
            imageUrl: getImage(step(3)) ?? '/img/buildimg.jpeg',
            imageAlt: 'Step 3',
          },
          {
            title: step(4)?.data?.titulo ?? '',
            description: step(4)?.data?.descripcion ?? '',
            imageUrl: getImage(step(4)) ?? '/img/finishimg.png',
            imageAlt: 'Step 4',
          },
        ]}
      />

      {/* FEATURED PRODUCT */}
      {featured ? (
        <FeaturedProduct
          eyebrow="Producto destacado"
          name={featured.nombre}
          description={featured.descripcion_corta ?? ''}
          imageUrl={featuredImage}
          buttonText="Descubrir modelo"
          buttonHref={`/catalogo/${featured.slug}`}
        />
      ) : null}

      {/* CTA */}
      <CTA
        eyebrow="Empieza el viaje"
        title="Cada esquí empieza como un trozo de madera."
        description="Descubre una colección creada para durar, evolucionar y acompañarte durante muchos inviernos."
        buttonText="Explorar catálogo"
        buttonHref="/catalogo"
      />

      <ScrollToTop />
    </>
  )
}