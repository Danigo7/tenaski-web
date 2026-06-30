'use server'

// app/admin/messages/actions.ts
// Server actions para la gestión de mensajes

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

/**
 * Marca un mensaje como 'leido'.
 * Se llama automáticamente al abrir un mensaje con estado 'nuevo'.
 */
export async function markMessageRead(id: string) {
  const supabase = await createClient()
  await supabase
    .from('message')
    .update({ estado: 'leido' })
    .eq('id', id)
    .eq('estado', 'nuevo') // solo actualiza si todavía era 'nuevo'
}

/**
 * Elimina un mensaje de la base de datos.
 * Se llama desde el botón de eliminar en el detalle del mensaje.
 */
export async function deleteMessage(id: string) {
  const supabase = await createClient()
  await supabase
    .from('message')
    .delete()
    .eq('id', id)

  revalidatePath('/admin/messages')
}