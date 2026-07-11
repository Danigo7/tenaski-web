import Image from 'next/image'

type Acabado = {
  id: string
  nombre: string
  descripcion: string | null
  imageUrl: string | null
}

type Props = {
  eyebrow: string
  description: string
  acabados: Acabado[]
}

export default function Acabados({ eyebrow, description, acabados }: Props) {
  return (
    <section className="home-section py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="home-section__eyebrow">{eyebrow}</p>
          <p className="home-section__text mx-auto">{description}</p>
        </div>

        {acabados.length > 0 && (
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {acabados.map((acabado) => (
              <div
                key={acabado.id}
                className="group relative aspect-square overflow-hidden rounded-lg border-2 border-white/90"
              >
                {acabado.imageUrl ? (
                  <Image
                    src={acabado.imageUrl}
                    alt={acabado.nombre}
                    fill
                    className="img-premium object-cover"
                  />
                ) : (
                  <div className="home-section__image-placeholder flex h-full w-full items-center justify-center text-xs">
                    Sin imagen
                  </div>
                )}

                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[var(--overlay-heavy)] to-transparent px-3 pb-3 pt-8">
                  <p className="text-sm font-medium text-[var(--foreground)]">
                    {acabado.nombre}
                  </p>
                  {acabado.descripcion && (
                    <p className="mt-0.5 line-clamp-2 text-xs text-[var(--text-muted)]">
                      {acabado.descripcion}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}