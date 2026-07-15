'use server'

import { createClient } from '@/lib/supabase/server'

// ─────────────────────────────────────────────────────────────
// createProductWithImages
// ─────────────────────────────────────────────────────────────
export async function createProductWithImages(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No autorizado')

  const nombre = formData.get('nombre') as string
  const precio = Number(formData.get('precio'))
  const descripcion_corta = formData.get('descripcion_corta') as string
  const descripcion_larga = formData.get('descripcion_larga') as string
  const publicado = formData.get('publicado') === 'on'
  const destacado = formData.get('destacado') === 'on'

  const rawIds = formData.get('image_ids') as string
  const imageIds: string[] = rawIds ? JSON.parse(rawIds) : []

  const rawMedidas = formData.get('medidas') as string | null
  const medidas: string[] = rawMedidas ? JSON.parse(rawMedidas) : []
  const precio_extra_espatula = Number(formData.get('precio_extra_espatula') || 0)
  const precio_extra_cola = Number(formData.get('precio_extra_cola') || 0)

  const baseSlug = nombre.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
  const slug = `${baseSlug}-${Date.now()}`

  const { data: product, error: productError } = await supabase
    .from('product')
    .insert({
      nombre,
      precio,
      descripcion_corta,
      descripcion_larga,
      publicado,
      destacado,
      created_by: user.id,
      slug,
      medidas,
      precio_extra_espatula,
      precio_extra_cola,
    })
    .select()
    .single()

  if (productError) throw new Error(productError.message)

  if (imageIds.length > 0) {
    const relations = imageIds.map((imageId, index) => ({
      producto_id: product.id,
      imagen_id: imageId,
      orden: index,
      imagen_principal: index === 0,
    }))

    const { error: relError } = await supabase.from('product_image').insert(relations)
    if (relError) throw new Error(relError.message)
  }

  return product
}

// ─────────────────────────────────────────────────────────────
// deleteProduct
// ─────────────────────────────────────────────────────────────
export async function deleteProduct(productId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No autorizado')

  const { error } = await supabase.from('product').delete().eq('id', productId)
  if (error) throw new Error(error.message)
}

// ─────────────────────────────────────────────────────────────
// updateProduct
// ─────────────────────────────────────────────────────────────
export async function updateProduct(productId: string, formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No autorizado')

  const nombre = formData.get('nombre') as string
  const precio = Number(formData.get('precio'))
  const descripcion_corta = formData.get('descripcion_corta') as string
  const descripcion_larga = formData.get('descripcion_larga') as string
  const publicado = formData.get('publicado') === 'on'
  const destacado = formData.get('destacado') === 'on'

  const rawMedidas = formData.get('medidas') as string | null
  const medidas: string[] = rawMedidas ? JSON.parse(rawMedidas) : []
  const precio_extra_espatula = Number(formData.get('precio_extra_espatula') || 0)
  const precio_extra_cola = Number(formData.get('precio_extra_cola') || 0)

  const { data, error } = await supabase
    .from('product')
    .update({
      nombre,
      precio,
      descripcion_corta,
      descripcion_larga,
      publicado,
      destacado,
      medidas,
      precio_extra_espatula,
      precio_extra_cola,
      updated_at: new Date().toISOString(),
    })
    .eq('id', productId)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data
}

// ─────────────────────────────────────────────────────────────
// updateProductImages
// ─────────────────────────────────────────────────────────────
export async function updateProductImages(
  productId: string,
  imageIdsToRemove: string[],
  imageIdsToAdd: string[],
  principalImageId: string | null = null,
) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No autorizado')

  if (imageIdsToRemove.length > 0) {
    const { error } = await supabase
      .from('product_image')
      .delete()
      .eq('producto_id', productId)
      .in('imagen_id', imageIdsToRemove)
    if (error) throw new Error(error.message)
  }

  if (imageIdsToAdd.length > 0) {
    const { data: existing } = await supabase
      .from('product_image')
      .select('orden')
      .eq('producto_id', productId)
      .order('orden', { ascending: false })
      .limit(1)

    const nextOrden = existing && existing.length > 0 ? existing[0].orden + 1 : 0

    const relations = imageIdsToAdd.map((imageId, i) => ({
      producto_id: productId,
      imagen_id: imageId,
      orden: nextOrden + i,
      imagen_principal: false,
    }))

    const { error } = await supabase.from('product_image').insert(relations)
    if (error) throw new Error(error.message)
  }

  await supabase
    .from('product_image')
    .update({ imagen_principal: false })
    .eq('producto_id', productId)

  let targetId = principalImageId

  if (!targetId) {
    const { data: first } = await supabase
      .from('product_image')
      .select('imagen_id')
      .eq('producto_id', productId)
      .order('orden', { ascending: true })
      .limit(1)
    targetId = first?.[0]?.imagen_id ?? null
  }

  if (targetId) {
    await supabase
      .from('product_image')
      .update({ imagen_principal: true })
      .eq('producto_id', productId)
      .eq('imagen_id', targetId)
  }
}

// ─────────────────────────────────────────────────────────────
// setFeaturedProduct
// ─────────────────────────────────────────────────────────────
export async function setFeaturedProduct(productId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No autorizado')

  const { error: clearError } = await supabase
    .from('product')
    .update({ destacado: false })
    .gte('created_at', '1970-01-01')
  if (clearError) throw new Error(clearError.message)

  const { error: setError } = await supabase
    .from('product')
    .update({ destacado: true })
    .eq('id', productId)
  if (setError) throw new Error(setError.message)
}