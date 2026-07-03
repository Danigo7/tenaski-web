import { createClient } from '@/lib/supabase/server'
import Hero from '@/components/home/Hero'
import Story from '@/components/history/Story'
import Values from '@/components/history/Values'
import Workshop from '@/components/history/Workshop'
import CTA from '@/components/home/CTA'
import ScrollToTop from '@/components/ui/ScrollToTop'

export default async function Historia() {
  const supabase = await createClient()
  const { data: heroBlock } = await supabase
    .from('content_block')
    .select(`
      data,
      image:imagen_id (
        ruta_storage
      )
    `)
    .eq('seccion', 'hero_historia')
    .single()

  const { data: historiaBlocks } = await supabase
    .from('content_block')
    .select(`
      seccion,
      data,
      image:imagen_id (
        ruta_storage
      )
    `)
    .in('seccion', [
      'historia_story',
      'historia_values',
      'historia_workshop',
    ])

  const storyBlock =
    historiaBlocks?.find((block) => block.seccion === 'historia_story') ?? null
  const valuesBlock =
    historiaBlocks?.find((block) => block.seccion === 'historia_values') ?? null
  const workshopBlock =
    historiaBlocks?.find((block) => block.seccion === 'historia_workshop') ?? null

  type HistoryValue = {
    number?: string
    titulo?: string
    descripcion?: string
    title?: string
    description?: string
  }

  const defaultValues = [
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
  ]

  const historyValues = Array.isArray(valuesBlock?.data?.values)
    ? valuesBlock.data.values.map((item: HistoryValue) => ({
        number: item.number ?? '01',
        title: item.titulo ?? item.title ?? '',
        description: item.descripcion ?? item.description ?? '',
      }))
    : defaultValues

  return (
    <>
      <Hero
        imageUrl={
          heroBlock?.image?.[0]?.ruta_storage ??
          '/img/heroimg.png'
        }
        eyebrow={
          heroBlock?.data?.eyebrow ??
          'Pirineos · Desde 2026'
        }
        title={
          heroBlock?.data?.titulo ??
          'Una historia nacida en la montaña.'
        }
        description={
          heroBlock?.data?.descripcion ??
          'Construimos esquís pensando en el tiempo, el terreno y las personas que los utilizarán.'
        }
        buttons={[
          { text: 'Ver catálogo', href: '/catalogo', variant: 'primary' },
          { text: 'Volver al inicio', href: '/', variant: 'secondary' },
        ]}
      />

      <Story
        eyebrow={storyBlock?.data?.eyebrow ?? 'El origen'}
        title={
          storyBlock?.data?.titulo ??
          'Todo empezó en un pequeño taller.'
        }
        description={
          storyBlock?.data?.descripcion ??
          'Tena Skis nace del deseo de recuperar una forma más humana de fabricar esquís, donde cada pieza tenga personalidad propia y una conexión directa con la montaña.'
        }
        imageUrl={storyBlock?.image?.[0]?.ruta_storage ?? '/img/storyimg.jpeg'}
      />

      <Values
        values={historyValues}
      />

      <Workshop
        eyebrow={workshopBlock?.data?.eyebrow ?? 'El taller'}
        title={
          workshopBlock?.data?.titulo ??
          'Donde la madera se convierte en montaña.'
        }
        description={
          workshopBlock?.data?.descripcion ??
          'No trabajamos en una fábrica. Trabajamos en un espacio donde cada herramienta, cada material y cada decisión forman parte del resultado final.'
        }
        imageUrl={workshopBlock?.image?.[0]?.ruta_storage ?? '/img/workshoppimg.png'}
        details={
          workshopBlock?.data?.detalles ?? [
            'Maderas seleccionadas',
            'Herramientas tradicionales',
            'Acabados manuales',
          ]
        }
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