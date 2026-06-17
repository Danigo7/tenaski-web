import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        
        {/* Logo */}
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Tena Skis
        </Link>

        {/* Navegación */}
        <nav className="flex gap-6 text-sm text-zinc-600">
          
          <Link href="/catalogo" className="hover:text-black">
            Catálogo
          </Link>

          <Link href="/historia" className="hover:text-black">
            Historia
          </Link>

          <Link href="/contacto" className="hover:text-black">
            Contacto
          </Link>

        </nav>

      </div>
    </header>
  );
}