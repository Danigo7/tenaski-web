'use client'

type GalleryItemProps = {
  src: string
  alt: string
  size?: 'sm' | 'md' | 'lg'
}

export default function GalleryItem({
  src,
  alt,
  size = 'md',
}: GalleryItemProps) {
  return (
    <div
      className={`
        relative overflow-hidden group
        ${size === 'lg' ? 'row-span-2' : ''}
        ${size === 'sm' ? 'opacity-80' : ''}
      `}
    >

      {/* Imagen */}
      <div
        className="
          h-full w-full bg-cover bg-center
          transition-all duration-700
          group-hover:scale-105
          group-hover:brightness-110
        "
        style={{ backgroundImage: `url(${src})` }}
      />

      {/* Overlay premium */}
      <div className="absolute inset-0 bg-black/20 transition-opacity duration-500 group-hover:opacity-0" />

      {/* Alt sutil (opcional futuro hover UX) */}
      <div className="absolute bottom-3 left-3 text-xs uppercase tracking-[0.2em] text-white/40 opacity-0 group-hover:opacity-100 transition-opacity">
        {alt}
      </div>

    </div>
  )
}