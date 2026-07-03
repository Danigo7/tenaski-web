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

  // Construimos el objeto a actualizar.
  // Solo incluimos imagen_id si se pasó uno, para no borrar la imagen
  // existente cuando el formulario no toca ese campo.
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

  // revalidatePath le dice a Next.js: "estas páginas tienen datos viejos,
  // la próxima vez que alguien las visite, vuelve a pedirlos a Supabase".
  // Sin esto, aunque cambies el contenido en la DB, la web seguiría
  // mostrando la versión cacheada antigua.
  revalidatePath('/admin/content')
  revalidatePath('/') // Home
  revalidatePath('/historia')
  revalidatePath('/catalogo')
  revalidatePath('/galeria')
  revalidatePath('/contacto')
}