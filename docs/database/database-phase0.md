# Fase 0 — Diseño de Base de Datos
Web corporativa marca artesanal de esquís

---

# 1. Objetivo

Definir el modelo de datos completo antes de implementar Supabase.

Este documento incluye:

- Entidades
- Atributos
- Relaciones
- Reglas de negocio
- Decisiones de arquitectura

---

# 2. Entidades del sistema

## Profile (Usuario)
Representa un usuario con acceso al CMS.

- id
- nombre
- rol (admin | editor)
- created_at
- updated_at

Notas:
- La autenticación (email/password) se gestiona con Supabase Auth.
- No almacenamos contraseñas aquí.

---

## Producto
Representa un esquí dentro del catálogo.

- id
- nombre
- slug
- descripcion_corta
- descripcion_larga
- precio
- destacado
- publicado
- created_at
- updated_at

Notas:
- Puede existir sin imágenes.
- Toda la información técnica vive en descripcion_larga (V1).

---

## Imagen
Entidad reutilizable en todo el sistema.

- id
- nombre_archivo
- ruta_storage
- texto_alt
- created_at
- updated_at
- deleted_at

Notas:
- No pertenece directamente a un solo contenido.
- Se relaciona mediante tablas intermedias.
- Puede existir sin estar asociada a nada.
- Usa soft delete: deleted_at marca el borrado lógico.
- El archivo físico en storage se elimina desde el backend cuando deleted_at está presente.
- Imagen es una entidad independiente del sistema

---

## Página
Contenido editable del sitio web.

- id
- titulo
- slug
- contenido
- publicada
- created_at
- updated_at

Notas:
- SEO gestionado directamente en código (Next.js metadata).
- Siempre tiene creador lógico.

---

## Mensaje
Mensajes enviados desde el formulario de contacto.

- id
- nombre
- email
- telefono
- asunto
- mensaje
- estado (nuevo | leido | archivado)
- created_at
- updated_at

Notas:
- Se conservan permanentemente (sin borrado físico).
- El campo estado es exclusivo: un mensaje solo puede estar en un estado a la vez.
- Estado inicial: nuevo.

---

# 3. Tablas de relación

## ProductoImagen
Relación entre productos e imágenes.

- producto_id
- imagen_id
- orden
- imagen_principal

Reglas:
- Un producto puede tener muchas imágenes.
- Una imagen puede pertenecer a varios productos.
- Solo una imagen principal por producto (garantizado mediante índice único parcial en BD).

---

## PaginaImagen
Relación entre páginas e imágenes.

- pagina_id
- imagen_id
- orden

Reglas:
- Una página puede tener muchas imágenes.
- Una imagen puede reutilizarse en varias páginas.

---

# 4. Relaciones del sistema

Usuario (profile) 1 ─── N Producto  
Usuario (profile) 1 ─── N Página  

Producto 1 ─── N ProductoImagen ─── N Imagen  
Página 1 ─── N PaginaImagen ─── N Imagen  

---

# 5. Reglas de negocio

## Usuarios
- Todo contenido debe tener un creador lógico.
- No se eliminan usuarios con contenido asociado.

---

## Productos
- Puede existir sin imágenes.
- Puede eliminarse sin borrar imágenes (solo relaciones).

---

## Imágenes
- No se eliminan físicamente si están en uso (RESTRICT en BD).
- Pueden existir sin estar asociadas.
- Soft delete: se marca deleted_at, no se borra el registro.
- Las imágenes con deleted_at NOT NULL no pueden usarse en nuevas relaciones.
- El archivo en storage se elimina desde el backend de forma controlada.

---

## Páginas
- Siempre tienen creador.
- Pueden existir sin imágenes.

---

## Mensajes
- No se eliminan nunca (solo cambian de estado).
- Estado exclusivo: nuevo / leido / archivado.
- Archivado sustituye al borrado.
- Los mensajes archivados son visibles en el CMS pero filtrables por estado.
- No dependen de otras entidades.

---

# 6. Estrategia de imágenes

- Se almacenan en Supabase Storage.
- La base de datos solo guarda metadata.
- Un único bucket `images` con carpetas internas (simplifica RLS).

Estructura:

images/products/
images/pages/
images/gallery/
images/blog/

---

# 7. Roles de usuario

## Admin
- Acceso total al CMS
- Gestión de usuarios
- Gestión de contenido

## Editor
- Gestión de productos
- Gestión de páginas
- Gestión de imágenes
- Sin acceso a usuarios

---

# 8. Decisiones arquitectónicas importantes

- SEO gestionado en código (Next.js)
- Imagen como entidad reutilizable única con soft delete
- Uso de tablas intermedias para relaciones N:N
- Mensajes con estado exclusivo (nuevo / leido / archivado) en lugar de booleanos
- No borrado físico sin control (evitar pérdida de datos)
- Supabase Auth gestiona autenticación (no almacenar passwords)
- Nomenclatura unificada: created_at / updated_at en todo el SQL (estándar Supabase / ORMs)
- Un único bucket `images` en Storage con carpetas internas
- Diseño preparado para futura expansión (blog y ecommerce)

---

# 9. Futuro del sistema (no implementado aún)

## Blog
- Categorías
- Posts
- Imágenes asociadas

## Ecommerce
- Clientes
- Pedidos
- Líneas de pedido

---

# 10. Estado del modelo

Este documento representa el modelo conceptual completo de la Fase 0.