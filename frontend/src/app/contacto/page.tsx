import Hero from '@/components/home/Hero'
import ContactForm from '@/components/contact/ContactForm'

export default function ContactoPage() {
  return (
    <main className="bg-[#0F0F0F]">

      <Hero
        imageUrl="/img/heroimg.png"
        eyebrow="Contacto"
        title="Hablemos de tu próximo esquí"
        description="Cuéntanos qué buscas y te responderemos personalmente."
      />

      <section className="mx-auto max-w-6xl px-6 py-20">
        <ContactForm />
      </section>

    </main>
  )
}