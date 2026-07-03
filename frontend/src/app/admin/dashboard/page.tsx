import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()

  // Conteos KPI
  const [products, messages, images] = await Promise.all([
    supabase.from('product').select('*', { count: 'exact', head: true }),
    supabase.from('message').select('*', { count: 'exact', head: true }),
    supabase.from('image').select('*', { count: 'exact', head: true }),
  ])

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const productCount = products.count ?? 0
  const messageCount = messages.count ?? 0
  const imageCount   = images.count   ?? 0

  const displayName =
    user?.user_metadata?.full_name ||
    user?.email?.split('@')[0] ||
    'Administrador'

  // Últimos 5 mensajes — solo los campos necesarios
  const { data: latestMessages } = await supabase
    .from('message')
    .select('id, nombre, email, asunto, estado, created_at')
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div className="space-y-10">

      {/* HEADER */}
      <div>
        <h1 className="text-4xl font-semibold">Dashboard</h1>
        <p className="mt-3 text-lg text-zinc-200">Bienvenido, {displayName}</p>
        <p className="mt-4 text-zinc-400">Resumen general del sistema de Tenaski</p>
      </div>

      {/* KPIs */}
      <div className="grid gap-6 md:grid-cols-3">
        <KpiCard label="Productos" value={productCount} />
        <KpiCard label="Mensajes"  value={messageCount} />
        <KpiCard label="Imágenes"  value={imageCount}   />
      </div>

      {/* ÚLTIMOS MENSAJES */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">

        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Últimos mensajes</h2>

          {/* Enlace a la página completa de mensajes */}
          <Link
            href="/admin/messages"
            className="text-sm text-[#C4A882] hover:underline"
          >
            Ver todos →
          </Link>
        </div>

        <div className="mt-6 space-y-2">
          {latestMessages?.length ? (
            latestMessages.map((msg) => (

              // Cada fila es un link a /admin/mensajes?id=xxx
              // La página de mensajes abrirá ese mensaje automáticamente
              <Link
                key={msg.id}
                href={`/admin/messages?id=${msg.id}`}
                className="flex items-center justify-between rounded-lg border border-transparent px-4 py-3 transition hover:border-zinc-700 hover:bg-zinc-800"
              >
                <div className="min-w-0">
                  {/* Nombre + badge nuevo */}
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-[#E8E4DC] truncate">
                      {msg.nombre}
                    </span>
                    {msg.estado === 'nuevo' && (
                      <span className="shrink-0 rounded-full bg-[#C4A882] px-2 py-0.5 text-[10px] font-semibold text-[#0F0F0F]">
                        Nuevo
                      </span>
                    )}
                  </div>

                  {/* Asunto */}
                  <p className="mt-0.5 text-sm text-zinc-400 truncate">
                    {msg.asunto ?? '(sin asunto)'}
                  </p>
                </div>

                {/* Fecha */}
                <span className="ml-4 shrink-0 text-xs text-zinc-500">
                  {new Date(msg.created_at).toLocaleDateString('es-ES', {
                    day:   '2-digit',
                    month: 'short',
                  })}
                </span>
              </Link>

            ))
          ) : (
            <p className="text-sm text-zinc-500">No hay mensajes todavía.</p>
          )}
        </div>

      </div>

    </div>
  )
}

// ── KPI card ─────────────────────────────────────────────────────────────────

function KpiCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      <p className="text-sm text-zinc-400">{label}</p>
      <p className="mt-2 text-3xl font-semibold">{value}</p>
    </div>
  )
}