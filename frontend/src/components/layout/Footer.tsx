import Link from 'next/link'

const navLinks = [
    { href: '/historia', label: 'Historia' },
    { href: '/catalogo', label: 'Catálogo' },
    { href: '/galeria', label: 'Galería' },
    { href: '/contacto', label: 'Contacto' },
]

export default function Footer() {
    return (
        <footer className="border-t border-white/5 bg-[#0F0F0F]">

            {/* Bloque principal */}
            <div className="max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">

               {/* Bloque 1: Marca */}
                <div className="md:col-span-1">
                    <Link href="/" className="flex items-center gap-3 w-fit">
                        <img
                            src="/img/logoo.png"
                            alt="Tena Skis"
                            className="w-auto h-7 object-contain"
                        />
                        <p className="font-['Cormorant_Garamond'] text-lg font-semibold tracking-widest uppercase text-[#E8E4DC]">
                            Tena Skis
                        </p>
                    </Link>
                    <p className="mt-4 text-sm text-[#E8E4DC]/40 leading-relaxed">
                        Esquís artesanales hechos a mano<br />en los Pirineos.
                    </p>
                </div>

                {/* Bloque 2: Menú */}
                <div>
                    <p className="text-xs tracking-[0.2em] uppercase text-[#E8E4DC]/30 mb-5">
                        Menú
                    </p>
                    <ul className="flex flex-col gap-3">
                        {navLinks.map(({ href, label }) => (
                            <li key={href}>
                                <Link
                                    href={href}
                                    className="text-sm text-[#E8E4DC]/50 hover:text-[#E8E4DC] transition-colors duration-300"
                                >
                                    {label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>


                {/* Bloque 3: Redes */}
                <div>
                    <p className="text-xs tracking-[0.2em] uppercase text-[#E8E4DC]/30 mb-5">
                        Redes
                    </p>

                    <Link
                        href="#"
                        className="flex items-center gap-2 text-sm text-[#E8E4DC]/50 hover:text-[#E8E4DC] transition-colors duration-300 w-fit"
                    >
                        {/* Instagram SVG inline */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                            <circle cx="12" cy="12" r="4" />
                            <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
                        </svg>

                        Instagram
                    </Link>
                </div>

                {/* Bloque 4: Créditos */}
                <div className="flex flex-col justify-between">
                    <div />
                    <div className="text-xs text-[#E8E4DC]/20 leading-relaxed">
                        <p>© 2026 Tena Skis</p>
                        <p className="mt-1 flex items-center gap-1.5">
                            Diseñado y desarrollado por{' '}
                            <Link href="http://danigostudios.netlify.app" className="flex items-center gap-1 text-[#E8E4DC]/30 hover:text-[#E8E4DC]/50 transition-colors duration-300">
                                <img
                                    src="/img/danigostudios-logo.png"
                                    alt="Danigo Studios"
                                    className="w-auto h-3 object-contain opacity-50"
                                />
                                Danigo Studios
                            </Link>
                        </p>
                    </div>
                </div>

            </div>

        </footer>
    )
}