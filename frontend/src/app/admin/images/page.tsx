import { createClient } from '@/lib/supabase/server'
import ImageGrid from './ImageGrid'

export default async function ImagesPage() {
  const supabase = await createClient()

  const { data: images } = await supabase
    .from('image')
    .select('*')
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  // Para saber qué imágenes se pueden borrar permanentemente,
  // comprobamos su uso en las 3 tablas que referencian `image`
  const [{ data: productImageRows }, { data: pageImageRows }, { data: contentBlockRows }] =
    await Promise.all([
      supabase.from('product_image').select('imagen_id'),
      supabase.from('page_image').select('imagen_id'),
      supabase.from('content_block').select('imagen_id').not('imagen_id', 'is', null),
    ])

  const usedIds = Array.from(
    new Set<string>([
      ...(productImageRows ?? []).map((r) => r.imagen_id),
      ...(pageImageRows ?? []).map((r) => r.imagen_id),
      ...(contentBlockRows ?? []).map((r) => r.imagen_id),
    ])
  )

  return <ImageGrid images={images ?? []} usedIds={usedIds} />
}