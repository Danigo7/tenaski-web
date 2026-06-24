import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import LogoutButton from './LogoutButton'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen flex bg-zinc-950 text-zinc-100">

      {/* SIDEBAR */}
      <aside className="w-72 border-r border-zinc-800 bg-zinc-950 flex flex-col justify-between">

        {/* TOP */}
        <div>

          {/* BRAND */}
          <div className="p-8 border-b border-zinc-800">

            <div className="flex items-center gap-3">
              <img
                src="/img/logoo.png"
                alt="Tenaski"
                className="w-10 h-10 object-contain"
              />

              <div>
                <h1 className="text-lg font-semibold tracking-wide">
                  TENASKI
                </h1>

                <p className="text-xs text-zinc-500 tracking-[0.2em]">
                  PANEL ADMIN
                </p>
              </div>
            </div>

          </div>

          {/* NAV */}
          <nav className="p-6 space-y-2">

            <Link href="/admin/dashboard" className="block px-3 py-2 rounded hover:bg-zinc-900 text-sm">
              Dashboard
            </Link>

            <Link href="/admin/products" className="block px-3 py-2 rounded hover:bg-zinc-900 text-sm">
              Productos
            </Link>

            <Link href="/admin/content" className="block px-3 py-2 rounded hover:bg-zinc-900 text-sm">
              Contenido
            </Link>

            <Link href="/admin/images" className="block px-3 py-2 rounded hover:bg-zinc-900 text-sm">
              Imágenes
            </Link>

            <Link href="/admin/messages" className="block px-3 py-2 rounded hover:bg-zinc-900 text-sm">
              Mensajes
            </Link>

          </nav>

        </div>

        {/* BOTTOM */}
        <div className="p-6 border-t border-zinc-800">
          <LogoutButton />
        </div>

      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-10 bg-zinc-950">
        {children}
      </main>

    </div>
  )
}