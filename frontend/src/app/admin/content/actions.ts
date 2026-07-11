'use server'

// app/admin/content/actions.ts
//
// Estas funciones son el "puente" entre el formulario del admin y la base de datos.
// Se ejecutan SIEMPRE en el servidor (por eso 'use server' arriba del todo),
// nunca en el navegador del usuario, así que pueden hablar con Supabase de forma segura.

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

/**
 * Actualiza un bloque de contenido (texto + imagen).
 *
 * @param seccion   La clave del bloque a editar, ej: 'hero_global'
 * @param data      Objeto con los campos de texto, ej: { eyebrow, titulo, descripcion }
 * @param imagenId  El id de la imagen seleccionada de la librería (puede ser null si no cambia)
 */
export async function updateContentBlock(
  seccion: string,
  data: Record<string, any>,
  imagenId?: string | null
) {
  const supabase = await createClient()

  const updatePayload: Record<string, any> = {
    data,
    updated_at: new Date().toISOString(),
  }

  if (imagenId) {
    updatePayload.imagen_id = imagenId
  }

  const { data: updatedRows, error } = await supabase
    .from('content_block')
    .update(updatePayload)
    .eq('seccion', seccion)
    .select('id')

  if (error) {
    console.error('Error actualizando content_block:', error)
    throw new Error(error.message)
  }

  const rowsCount = Array.isArray(updatedRows) ? updatedRows.length : updatedRows ? 1 : 0

  if (rowsCount === 0) {
    const { error: insertError } = await supabase
      .from('content_block')
      .insert({
        seccion,
        data,
        imagen_id: imagenId ?? null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

    if (insertError) {
      console.error('Error insertando content_block:', insertError)
      throw new Error(insertError.message)
    }
  }

  revalidatePath('/admin/content')
  revalidatePath('/')
  revalidatePath('/historia')
  revalidatePath('/catalogo')
  revalidatePath('/galeria')
  revalidatePath('/contacto')
}

/**
 * Crea un nuevo acabado (imagen + nombre + descripción breve).
 */
export async function createAcabado(
  nombre: string,
  descripcion: string,
  imagenId: string,
  orden: number
) {
  const supabase = await createClient()

  const { error } = await supabase.from('acabado').insert({
    nombre,
    descripcion,
    imagen_id: imagenId,
    orden,
  })

  if (error) {
    console.error('Error creando acabado:', error)
    throw new Error(error.message)
  }

  revalidatePath('/admin/content')
  revalidatePath('/')
}

/**
 * Actualiza el nombre y la descripción de un acabado existente.
 */
export async function updateAcabado(
  id: string,
  nombre: string,
  descripcion: string
) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('acabado')
    .update({
      nombre,
      descripcion,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) {
    console.error('Error actualizando acabado:', error)
    throw new Error(error.message)
  }

  revalidatePath('/admin/content')
  revalidatePath('/')
}

/**
 * Elimina un acabado.
 */
export async function deleteAcabado(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from('acabado').delete().eq('id', id)

  if (error) {
    console.error('Error eliminando acabado:', error)
    throw new Error(error.message)
  }

  revalidatePath('/admin/content')
  revalidatePath('/')
}