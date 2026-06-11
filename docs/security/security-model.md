# Security Model (RLS Conceptual)

Web corporativa marca artesanal de esquís

---

# 1. Objetivo

Este documento define el modelo de seguridad del sistema antes de implementar RLS en Supabase.

Aquí se describen:

- Roles del sistema
- Principios globales de acceso
- Reglas de visibilidad por entidad
- Permisos de lectura/escritura
- Restricciones críticas de seguridad

Este documento NO contiene SQL.
Su objetivo es definir comportamiento, no implementación.

---

# 2. Roles del sistema

El sistema distingue dos capas de roles:

## 2.1 Roles de Supabase

- `anon` → usuario no autenticado
- `authenticated` → usuario logueado

## 2.2 Roles de negocio (tabla profile)

- `admin` → control total del CMS
- `editor` → gestión de contenido limitada

---

# 3. Principios globales de seguridad

Estos principios aplican a todo el sistema:

## 3.1 Publicación controla visibilidad

- Solo contenido con `publicado = true` es visible públicamente
- Los borradores nunca son accesibles desde el frontend público

---

## 3.2 Imagen no es entidad pública directa

- Las imágenes nunca se exponen directamente como recurso público
- Solo son accesibles a través de relaciones con:
  - productos publicados
  - páginas publicadas

---

## 3.3 Mensajes son write-only públicos

- El público puede crear mensajes
- El público NO puede leer mensajes

---

## 3.4 Profile nunca es público

- No existe acceso público a usuarios del CMS
- Solo acceso interno controlado por roles

---

## 3.5 Base de datos no es pública

- Todo acceso pasa por Supabase RLS
- Nunca se expone acceso directo sin filtros

## 3.6 Ownership del contenido

Los usuarios con rol `editor` solo pueden modificar o eliminar contenido cuyo campo `created_by` coincida con su propio usuario.

Los usuarios con rol `admin` no tienen esta restricción.

Este principio aplica a:

- product
- page
- relaciones asociadas

La propiedad del contenido es la base del modelo de autorización del CMS.

---

# 4. Reglas de acceso por entidad

---

# 4.1 Profile (Usuarios CMS)

## anon
- ❌ sin acceso

## authenticated

- Sin permisos directos.
- Los permisos dependen del rol almacenado en `profile`.

## editor
- 👁 solo su propio perfil

## admin
- 👁 todos los perfiles
- ✏ gestión completa

---

# 4.2 Product

## anon (público web)

- 👁 solo productos con `publicado = true`

## authenticated

- Sin permisos directos.
- Los permisos dependen del rol almacenado en `profile`.

## editor

- 👁 ver todos los productos
- ✏ crear productos
- ✏ editar únicamente productos creados por él
- ✏ eliminar únicamente productos creados por él
- ❌ no puede modificar contenido de otros usuarios

## admin

- 👁✏ control total
- publicar / despublicar
- eliminar cualquier producto
---

# 4.3 Page

## anon

- 👁 solo páginas publicadas

## authenticated

- Sin permisos directos.
- Los permisos dependen del rol almacenado en `profile`.

## editor

- 👁 ver todas las páginas
- ✏ crear páginas
- ✏ editar únicamente páginas creadas por él
- ✏ eliminar únicamente páginas creadas por él
- ❌ no puede modificar contenido de otros usuarios

## admin

- 👁✏ control total

---

# 4.4 Image

## anon

- 👁 solo imágenes asociadas a contenido publicado

## authenticated

- Sin permisos directos.
- Los permisos dependen del rol almacenado en `profile`.

## editor

- 👁 ver todas las imágenes
- ✏ subir imágenes
- ✏ asociar imágenes a contenido
- ❌ eliminar imágenes utilizadas por otros contenidos

## admin

- 👁✏ control total

Las imágenes utilizan soft delete mediante el campo `deleted_at`.

Solo los administradores pueden ejecutar el borrado definitivo de imágenes.

---

# 4.5 Message

## Público

- ✏ crear mensajes

## authenticated

- Sin permisos directos.
- Los permisos dependen del rol almacenado en `profile`.

## editor

- 👁 leer mensajes
- ✏ cambiar estado (nuevo / leído / archivado)

## admin

- 👁✏ control total

Nadie puede leer mensajes excepto editor y admin.

---

# 4.6 Product_Image / Page_Image

## anon

- ❌ sin acceso

## authenticated

- Sin permisos directos.
- Los permisos dependen del rol almacenado en `profile`.

## editor

- ✏ crear relaciones
- ✏ modificar orden
- ✏ eliminar relaciones

Solo sobre contenido que puede editar.

## admin

- 👁✏ control total


---

# 5. Matriz global de permisos

| Acción                   | Público | Editor | Admin |
| ------------------------ | ------- | ------ | ----- |
| Ver productos publicados | 👁      | 👁     | 👁    |
| Ver borradores           | ❌       | 👁     | 👁    |
| Crear producto           | ❌       | ✏      | ✏     |
| Editar producto propio   | ❌       | ✏      | ✏     |
| Editar producto ajeno    | ❌       | ❌      | ✏     |
| Eliminar producto propio | ❌       | ✏      | ✏     |
| Eliminar producto ajeno  | ❌       | ❌      | ✏     |
| Crear página             | ❌       | ✏      | ✏     |
| Editar página propia     | ❌       | ✏      | ✏     |
| Editar página ajena      | ❌       | ❌      | ✏     |
| Subir imágenes           | ❌       | ✏      | ✏     |
| Leer mensajes            | ❌       | 👁     | 👁    |
| Cambiar estado mensajes  | ❌       | ✏      | ✏     |
| Ver perfil propio        | ❌       | 👁     | 👁    |
| Ver otros perfiles       | ❌       | ❌      | 👁    |
| Gestionar usuarios       | ❌       | ❌      | ✏     |


---

# 6. Reglas críticas de seguridad

---

## 6.1 Publicación es la única puerta al público

Nada es accesible públicamente si no cumple:

- `publicado = true`

---

## 6.2 Imagen siempre depende de otra entidad

Las imágenes:

- no se exponen directamente
- solo existen en contexto de producto o página

---

## 6.3 Mensajes son privados por defecto

- Solo escritura pública permitida
- Lectura restringida al CMS

---

## 6.4 Profile es completamente interno

- Nunca expuesto al frontend público

---

## 6.5 Separación estricta entre público y CMS

- Web pública → solo lectura filtrada
- CMS → control completo con autenticación

## 6.6 Storage protegido

Los archivos almacenados en Supabase Storage siguen las mismas reglas de acceso definidas por RLS.

El acceso a imágenes públicas se realiza únicamente mediante contenido publicado.

Los archivos internos del CMS no deben exponerse públicamente sin autorización.

---

# 7. Modelo mental del sistema

El sistema se divide en 3 capas:

## 7.1 Capa pública (marketing site)
- lectura de contenido publicado
- sin acceso a datos internos

## 7.2 Capa CMS
- gestión completa del contenido
- control por roles

## 7.3 Capa base de datos
- protegida por RLS
- nunca expuesta directamente

---

# 8. Consideraciones para implementación futura

Este modelo será implementado en Supabase mediante:

- RLS policies por tabla
- CHECK constraints para estados
- JOIN controlado para imágenes
- Validación de roles desde profile

---

# 9. Futuro del sistema

Este modelo se extenderá para:

## Blog
- posts
- categorías
- imágenes asociadas

## Ecommerce
- pedidos
- clientes
- pagos

---

# 10. Estado del modelo

Este documento define el modelo de seguridad conceptual del sistema.