import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = await createClient()

  const [
    products,
    messages,
    images
  ] = await Promise.all([
    supabase.from('product').select('*', { count: 'exact', head: true }),
    supabase.from('message').select('*', { count: 'exact', head: true }),
    supabase.from('image').select('*', { count: 'exact', head: true }),
  ])

  const productCount = products.count ?? 0
  const messageCount = messages.count ?? 0
  const imageCount = images.count ?? 0

  const { data: latestMessages } = await supabase
    .from('message')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div className="space-y-10">

      {/* HEADER */}

      <div>
        <h1 className="text-4xl font-semibold">
          Dashboard
        </h1>

        <p className="mt-2 text-zinc-400">
          Resumen general del sistema Tenaski CMS
        </p>
      </div>

      {/* KPIs */}

      <div className="grid gap-6 md:grid-cols-3">

        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <p className="text-sm text-zinc-400">Productos</p>
          <p className="mt-2 text-3xl font-semibold">
            {productCount}
          </p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <p className="text-sm text-zinc-400">Mensajes</p>
          <p className="mt-2 text-3xl font-semibold">
            {messageCount}
          </p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <p className="text-sm text-zinc-400">Imágenes</p>
          <p className="mt-2 text-3xl font-semibold">
            {imageCount}
          </p>
        </div>

      </div>

      {/* ÚLTIMOS MENSAJES */}

      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">

        <h2 className="text-xl font-semibold">
          Últimos mensajes
        </h2>

        <div className="mt-6 space-y-4">

          {latestMessages?.map((msg) => (
            <div
              key={msg.id}
              className="border-b border-zinc-800 pb-4"
            >
              <p className="font-medium">
                {msg.nombre}
              </p>

              <p className="text-sm text-zinc-400">
                {msg.email}
              </p>

              <p className="mt-1 text-sm text-zinc-300">
                {msg.asunto}
              </p>
            </div>
          ))}

        </div>

      </div>

    </div>
  )
}