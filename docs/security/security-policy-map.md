# Security Policy Map

Web corporativa marca artesanal de esquís

---

# 1. Objetivo

Este documento traduce el modelo de seguridad conceptual a políticas concretas que deberán implementarse mediante Row Level Security (RLS) en Supabase.

No contiene SQL.

Su objetivo es definir:

- Qué operaciones necesita cada tabla
- Qué rol puede ejecutarlas
- Qué condiciones deben cumplirse
- Qué políticas RLS habrá que crear

---

# 2. Convenciones

Operaciones:

- SELECT → lectura
- INSERT → creación
- UPDATE → modificación
- DELETE → eliminación

Roles:

- Público → usuario no autenticado
- Editor → usuario autenticado con rol editor
- Admin → usuario autenticado con rol admin

---

# 3. Tabla profile

## SELECT

### Editor

Puede leer únicamente su propio perfil.

Condición:

- profile.id = auth.uid()

### Admin

Puede leer todos los perfiles.

---

## INSERT

No permitido desde frontend.

La creación del perfil se realiza mediante proceso controlado.

---

## UPDATE

### Editor

Puede actualizar únicamente su propio perfil.

### Admin

Puede actualizar cualquier perfil.

---

## DELETE

No permitido.

Los perfiles no se eliminan desde la aplicación.

---

# 4. Tabla product

## SELECT

### Público

Puede leer únicamente productos publicados.

Condición:

- publicado = true

### Editor

Puede leer todos los productos.

### Admin

Puede leer todos los productos.

---

## INSERT

### Editor

Puede crear productos.

Condición:

- created_by = auth.uid()

### Admin

Puede crear productos.

---

## UPDATE

### Editor

Puede modificar únicamente productos propios.

Condición:

- created_by = auth.uid()

### Admin

Puede modificar cualquier producto.

---

## DELETE

### Editor

Puede eliminar únicamente productos propios.

Condición:

- created_by = auth.uid()

### Admin

Puede eliminar cualquier producto.

---

# 5. Tabla page

## SELECT

### Público

Puede leer únicamente páginas publicadas.

Condición:

- publicada = true

### Editor

Puede leer todas las páginas.

### Admin

Puede leer todas las páginas.

---

## INSERT

### Editor

Puede crear páginas.

Condición:

- created_by = auth.uid()

### Admin

Puede crear páginas.

---

## UPDATE

### Editor

Puede modificar únicamente páginas propias.

Condición:

- created_by = auth.uid()

### Admin

Puede modificar cualquier página.

---

## DELETE

### Editor

Puede eliminar únicamente páginas propias.

Condición:

- created_by = auth.uid()

### Admin

Puede eliminar cualquier página.

---

# 6. Tabla image

## SELECT

### Editor

Puede leer todas las imágenes.

### Admin

Puede leer todas las imágenes.

---

## INSERT

### Editor

Puede subir imágenes.

Condición:

- uploaded_by = auth.uid()

### Admin

Puede subir imágenes.

---

## UPDATE

### Editor

Puede modificar imágenes subidas por él.

Condición:

- uploaded_by = auth.uid()

### Admin

Puede modificar cualquier imagen.

---

## DELETE

No existe borrado físico mediante RLS.

Las imágenes utilizan soft delete.

---

# 7. Tabla message

## SELECT

### Editor

Puede leer todos los mensajes.

### Admin

Puede leer todos los mensajes.

---

## INSERT

### Público

Puede crear mensajes.

### Editor

Puede crear mensajes.

### Admin

Puede crear mensajes.

---

## UPDATE

### Editor

Puede cambiar el estado.

### Admin

Puede modificar cualquier mensaje.

---

## DELETE

No permitido.

Los mensajes se conservan como histórico.

---

# 8. Tabla product_image

## SELECT

### Editor

Puede leer relaciones.

### Admin

Puede leer relaciones.

---

## INSERT

### Editor

Solo sobre productos que puede editar.

### Admin

Sin restricciones.

---

## UPDATE

### Editor

Solo sobre productos que puede editar.

### Admin

Sin restricciones.

---

## DELETE

### Editor

Solo sobre productos que puede editar.

### Admin

Sin restricciones.

---

# 9. Tabla page_image

## SELECT

### Editor

Puede leer relaciones.

### Admin

Puede leer relaciones.

---

## INSERT

### Editor

Solo sobre páginas que puede editar.

### Admin

Sin restricciones.

---

## UPDATE

### Editor

Solo sobre páginas que puede editar.

### Admin

Sin restricciones.

---

## DELETE

### Editor

Solo sobre páginas que puede editar.

### Admin

Sin restricciones.

---

# 10. Resultado esperado

Al finalizar la implementación existirán políticas RLS para:

- profile
- product
- page
- image
- message
- product_image
- page_image

Cada política implementará exactamente las reglas definidas en este documento.

Este documento actúa como especificación previa al SQL.