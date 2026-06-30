'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'

type Props = {
  productId: string
  onFinish: () => void
}

export default function UploadProductImages({ productId, onFinish }: Props) {
  const [loading, setLoading] = useState(false)
  const [files, setFiles] = useState<FileList | null>(null)

  const handleUpload = async () => {
    if (!files || files.length === 0) return

    setLoading(true)

    try {
      for (const file of Array.from(files)) {
        // 1. Crear nombre único
        const fileName = `${Date.now()}-${file.name}`

        // 2. Subir a Storage
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, file)

        if (uploadError) throw uploadError

        // 3. Obtener URL pública
        const { data: publicUrlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName)

        const imageUrl = publicUrlData.publicUrl

        // 4. Insert en tabla image
        const { data: image, error: imageError } = await supabase
          .from('image')
          .insert({
            nombre_archivo: file.name,
            ruta_storage: imageUrl,
          })
          .select()
          .single()

        if (imageError) throw imageError

        // 5. Relación producto-imagen
        const { error: relationError } = await supabase
          .from('product_image')
          .insert({
            producto_id: productId,
            imagen_id: image.id,
            orden: 0,
            imagen_principal: false,
          })

        if (relationError) throw relationError
      }

      onFinish()
    } catch (err) {
      console.error(err)
      alert('Error subiendo imágenes')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm mb-2">
          Selecciona imágenes del producto
        </label>

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => setFiles(e.target.files)}
          className="w-full"
        />
      </div>

      <button
        onClick={handleUpload}
        disabled={loading}
        className="w-full bg-white text-black py-3 rounded-lg font-medium"
      >
        {loading ? 'Subiendo...' : 'Subir imágenes'}
      </button>
    </div>
  )
}