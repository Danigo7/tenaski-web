import { createClient } from '@/lib/supabase/server'
import Hero from '@/components/home/Hero'
import ContactForm from '@/components/contact/ContactForm'


export default async function ContactoPage() {
  const supabase = await createClient()
  const { data: heroBlock } = await supabase
    .from('content_block')
    .select(`
      data,
      image:imagen_id (
        ruta_storage
      )
    `)
    .eq('seccion', 'hero_contacto')
    .single()

  return (
    <main className="bg-[#0F0F0F]">

      <Hero
        imageUrl={
          heroBlock?.image?.[0]?.ruta_storage ??
          '/img/heroimg.png'
        }
        eyebrow={
          heroBlock?.data?.eyebrow ??
          'Contacto'
        }
        title={
          heroBlock?.data?.titulo ??
          'Hablemos de tu próximo esquí'
        }
        description={
          heroBlock?.data?.descripcion ??
          'Cuéntanos qué buscas y te responderemos personalmente.'
        }

        buttons={[
          { text: 'Ver catálogo', href: '/catalogo', variant: 'primary' },
          { text: 'Volver al inicio', href: '/', variant: 'secondary' },
        ]}
      />

      <section className="mx-auto max-w-6xl px-6 py-20">
        <ContactForm />
      </section>

    </main>
  )
}