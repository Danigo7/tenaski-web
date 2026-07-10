'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type GallerySize = 'lg' | 'md' | 'sm'

// ─────────────────────────────────────────────
// Añadir / editar en galería (mismo action sirve para ambos casos:
// si ya estaba en galería, simplemente actualiza tamaño/alt)
// ─────────────────────────────────────────────
export async function addToGallery(
  imageId: string,
  size: GallerySize,
  alt: string,
  orden: number
) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('image')
    .update({
      en_galeria: true,
      galeria_size: size,
      galeria_orden: orden,
      texto_alt: alt,
    })
    .eq('id', imageId)

  if (error) throw error

  revalidatePath('/admin/images')
  revalidatePath('/galeria')
}

// ─────────────────────────────────────────────
// Quitar de galería (no borra la imagen, solo el flag)
// ─────────────────────────────────────────────
export async function removeFromGallery(imageId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('image')
    .update({ en_galeria: false })
    .eq('id', imageId)

  if (error) throw error

  revalidatePath('/admin/images')
  revalidatePath('/galeria')
}

// ─────────────────────────────────────────────
// Comprobar si una imagen está referenciada en otra parte
// (producto, página o bloque de contenido)
// ─────────────────────────────────────────────
export async function getImageUsage(imageId: string) {
  const supabase = await createClient()

  const [{ count: productCount }, { count: pageCount }, { count: contentCount }] =
    await Promise.all([
      supabase
        .from('product_image')
        .select('*', { count: 'exact', head: true })
        .eq('imagen_id', imageId),
      supabase
        .from('page_image')
        .select('*', { count: 'exact', head: true })
        .eq('imagen_id', imageId),
      supabase
        .from('content_block')
        .select('*', { count: 'exact', head: true })
        .eq('imagen_id', imageId),
    ])

  return {
    productos: productCount ?? 0,
    paginas: pageCount ?? 0,
    contenido: contentCount ?? 0,
    inUse: (productCount ?? 0) + (pageCount ?? 0) + (contentCount ?? 0) > 0,
  }
}

// ─────────────────────────────────────────────
// Eliminar permanentemente (bloquea si hay FK en uso)
// ─────────────────────────────────────────────
export async function deleteImagePermanently(imageId: string, rutaStorage: string) {
  const supabase = await createClient()

  const usage = await getImageUsage(imageId)
  if (usage.inUse) {
    throw new Error(
      'No se puede eliminar: la imagen está en uso en producto, página o contenido.'
    )
  }

  // Intentamos borrar también el archivo del Storage (best-effort)
  try {
    const fileName = rutaStorage.split('/product-images/')[1]
    if (fileName) {
      await supabase.storage.from('product-images').remove([fileName])
    }
  } catch (err) {
    console.error('No se pudo borrar el archivo del storage:', err)
  }

  const { error } = await supabase.from('image').delete().eq('id', imageId)
  if (error) throw error

  revalidatePath('/admin/images')
  revalidatePath('/galeria')
}