import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ProductGallery from '@/components/catalog/ProductGallery'

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ slug: string }>
}

type ImageRow = {
  imagen_principal: boolean
  orden: number
  image: {
    ruta_storage: string
    texto_alt: string | null
  }
}

// ─── SEO ──────────────────────────────────────────────────
export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data } = await supabase
    .from('product')
    .select('nombre, descripcion_corta')
    .eq('slug', slug)
    .eq('publicado', true)
    .single()

  if (!data) return {}

  return {
    title: `${data.nombre} — Tena Skis`,
    description: data.descripcion_corta ?? undefined,
  }
}

// ─── Page ─────────────────────────────────────────────────
export default async function ProductoPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('product')
    .select(`
      id,
      nombre,
      slug,
      descripcion_corta,
      descripcion_larga,
      precio,
      product_image (
        imagen_principal,
        orden,
        image:imagen_id (
          ruta_storage,
          texto_alt
        )
      )
    `)
    .eq('slug', slug)
    .eq('publicado', true)
    .single()

  if (error || !data) notFound()

  // Ordenar: imagen principal primero, luego por orden
  const images = (data.product_image as unknown as ImageRow[])
    .sort((a, b) => {
      if (a.imagen_principal && !b.imagen_principal) return -1
      if (!a.imagen_principal && b.imagen_principal) return 1
      return a.orden - b.orden
    })
    .map((pi) => ({
      url: pi.image.ruta_storage,
      alt: pi.image.texto_alt ?? data.nombre,
      principal: pi.imagen_principal,
    }))

  return (
    // pt-[80px] para compensar el Navbar global fijo que ya existe
    <main className="min-h-screen text-[var(--foreground)] pt-[80px] lg:pt-0">

      <div className="lg:min-h-screen lg:grid lg:grid-cols-2">

        {/* COLUMNA IZQUIERDA — Galería sticky en desktop */}
        <div className="h-[60vw] lg:h-auto lg:sticky lg:top-0 lg:h-screen bg-[var(--surface)] overflow-hidden">
          <ProductGallery images={images} nombre={data.nombre} />
        </div>

        {/* COLUMNA DERECHA — Información */}
        <div className="flex flex-col justify-center px-8 py-16 lg:px-16 lg:py-24">
          <div className="max-w-md">

            {/* Eyebrow */}
            <p className="text-xs tracking-[0.25em] uppercase text-[var(--accent)] mb-6">
              Tena Skis · Artesanal
            </p>

            {/* Nombre */}
            <h1 className="... text-[var(--foreground)]" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              {data.nombre}
            </h1>

            {/* Precio */}
            <p className="text-2xl font-light text-[var(--foreground)]/50 mb-8">
              {data.precio.toLocaleString('es-ES', {
                style: 'currency',
                currency: 'EUR',
              })}
            </p>

            {/* Separador */}
            <div className="w-12 h-px bg-[var(--accent)] mb-8" />

            {/* Descripción corta */}
            {data.descripcion_corta && (
              <p className="text-base text-[var(--foreground)]/70 leading-relaxed mb-8 font-light">
                {data.descripcion_corta}
              </p>
            )}

            {/* Descripción larga */}
            {data.descripcion_larga && (
              <p className="text-sm text-[var(--text-soft)] whitespace-pre-line leading-loose mb-12">
                {data.descripcion_larga}
              </p>
            )}

            {/* CTA */}
            <Link
              href="/contacto"
              className="
                inline-flex items-center justify-center gap-3
                bg-[var(--accent)] text-[var(--background)]
                px-8 py-4 text-sm font-medium tracking-[0.15em] uppercase
                hover:bg-[var(--accent-hover)] transition-colors
                w-full lg:w-auto
              "
            >
              Solicitar información
              <span>→</span>
            </Link>

            {/* Footer de columna */}
            <div className="mt-16 pt-8 border-t border-[var(--border)] flex items-center justify-between text-xs text-[var(--text-disabled)]">
              <span className="tracking-widest uppercase">Hecho en el Pirineo</span>
              <Link href="/catalogo" className="hover:text-[var(--foreground)]/40 transition-colors">
                  ← Volver al catálogo
              </Link>
            </div>

          </div>
        </div>

      </div>

    </main>
  )
}