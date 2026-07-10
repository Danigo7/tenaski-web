import { createClient } from '@/lib/supabase/server'
import HeroContentForm from './HeroContentForm'
import ManifestoContentForm from './ManifestoContentForm'
import ProcessContentForm from './ProcessContentForm'
import StoryContentForm from './StoryContentForm'
import ValuesContentForm from './ValuesContentForm'
import WorkshopContentForm from './WorkshopContentForm'
import SectionGroup from './Sectiongroup'

export default async function ContentPage() {
  const supabase = await createClient()

  // ─────────────────────────────────────────────
  // HEROES
  // ─────────────────────────────────────────────
  const { data: heroBlocks } = await supabase
    .from('content_block')
    .select(`
      id,
      seccion,
      data,
      imagen_id,
      image:imagen_id (
        id,
        ruta_storage
      )
    `)
    .in('seccion', [
      'hero_home',
      'hero_historia',
      'hero_catalogo',
      'hero_galeria',
      'hero_contacto',
    ])

  // ─────────────────────────────────────────────
  // LIBRERÍA DE IMÁGENES
  // ─────────────────────────────────────────────
  const { data: imageLibrary } = await supabase
    .from('image')
    .select('id, ruta_storage, nombre_archivo')
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  // ─────────────────────────────────────────────
  // MANIFESTO (HOME)
  // ─────────────────────────────────────────────
  const { data: manifesto } = await supabase
    .from('content_block')
    .select(`
      id,
      seccion,
      data,
      imagen_id,
      image:imagen_id (
        id,
        ruta_storage
      )
    `)
    .eq('seccion', 'home_manifesto')
    .single()

  // ─────────────────────────────────────────────
  // PROCESS (HOME)
  // ─────────────────────────────────────────────
  const { data: processBlocks } = await supabase
    .from('content_block')
    .select('*, image:imagen_id (id, ruta_storage)')
    .in('seccion', [
      'home_process',
      'home_process_step_1',
      'home_process_step_2',
      'home_process_step_3',
      'home_process_step_4',
    ])

  const process =
    processBlocks?.find((p) => p.seccion === 'home_process') ?? null

  const steps = Object.fromEntries(
    processBlocks
      ?.filter((p) => p.seccion.includes('step'))
      .map((p) => [
        p.seccion,
        {
          titulo: p.data?.titulo,
          descripcion: p.data?.descripcion,
          imagen_id: p.imagen_id ?? null,
          image: p.image ?? null,
        },
      ]) ?? []
  )

  // ─────────────────────────────────────────────
  // HISTORIA
  // ─────────────────────────────────────────────
  const { data: historiaBlocks } = await supabase
    .from('content_block')
    .select(`
      id,
      seccion,
      data,
      imagen_id,
      image:imagen_id (
        id,
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

  const getBlock = (seccion: string) =>
    heroBlocks?.find((block) => block.seccion === seccion) ?? null

  return (
    <div className="space-y-16">

      {/* HEADER */}
      <div>
        <h1 className="text-4xl font-semibold">Contenido</h1>
        <p className="mt-2 text-zinc-400">
          Edita los textos e imágenes de la web pública.
        </p>
      </div>

      {/* ───────────────────────────── */}
      {/* HOME */}
      {/* ───────────────────────────── */}
      <SectionGroup
        title="Home"
        description="Cabecera, manifiesto y proceso de la página principal."
        count={3}
      >
        <HeroContentForm
          titulo="Cabecera · Home"
          seccion="hero_home"
          block={getBlock('hero_home')}
          imageLibrary={imageLibrary ?? []}
        />

        <ManifestoContentForm
          block={manifesto ?? null}
          imageLibrary={imageLibrary ?? []}
        />

        <ProcessContentForm
          block={process}
          steps={steps}
          imageLibrary={imageLibrary ?? []}
        />
      </SectionGroup>

      {/* ───────────────────────────── */}
      {/* HISTORIA */}
      {/* ───────────────────────────── */}
      <SectionGroup
        title="Historia"
        description="Cabecera, relato, valores y taller."
        count={4}
      >
        <HeroContentForm
          titulo="Cabecera · Historia"
          seccion="hero_historia"
          block={getBlock('hero_historia')}
          imageLibrary={imageLibrary ?? []}
        />

        <StoryContentForm
          block={storyBlock}
          imageLibrary={imageLibrary ?? []}
        />

        <ValuesContentForm block={valuesBlock} />

        <WorkshopContentForm
          block={workshopBlock}
          imageLibrary={imageLibrary ?? []}
        />
      </SectionGroup>

      {/* ───────────────────────────── */}
      {/* CATÁLOGO */}
      {/* ───────────────────────────── */}
      <SectionGroup
        title="Catálogo"
        description="Cabecera de la página de catálogo."
        count={1}
      >
        <HeroContentForm
          titulo="Cabecera · Catálogo"
          seccion="hero_catalogo"
          block={getBlock('hero_catalogo')}
          imageLibrary={imageLibrary ?? []}
        />
      </SectionGroup>

      {/* ───────────────────────────── */}
      {/* GALERÍA */}
      {/* ───────────────────────────── */}
      <SectionGroup
        title="Galería"
        description="Cabecera de la página de galería."
        count={1}
      >
        <HeroContentForm
          titulo="Cabecera · Galería"
          seccion="hero_galeria"
          block={getBlock('hero_galeria')}
          imageLibrary={imageLibrary ?? []}
        />
      </SectionGroup>

      {/* ───────────────────────────── */}
      {/* CONTACTO */}
      {/* ───────────────────────────── */}
      <SectionGroup
        title="Contacto"
        description="Cabecera de la página de contacto."
        count={1}
      >
        <HeroContentForm
          titulo="Cabecera · Contacto"
          seccion="hero_contacto"
          block={getBlock('hero_contacto')}
          imageLibrary={imageLibrary ?? []}
        />
      </SectionGroup>

    </div>
  )
}