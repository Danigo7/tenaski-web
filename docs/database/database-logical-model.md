# Modelo Lógico de Base de Datos
Web corporativa marca artesanal de esquís

---

# 1. Introducción

Este documento define el modelo lógico de la base de datos en PostgreSQL (Supabase).

Incluye:

- Tablas
- Tipos de datos
- Claves primarias
- Claves foráneas
- Relaciones
- Reglas de integridad

---

# 2. AUTENTICACIÓN (Supabase Auth)

La autenticación se gestiona con:

- auth.users (Supabase)

No se modifica ni se amplía directamente.

---

# 3. TABLAS

---

## 3.1 profile (usuarios del CMS)

```sql
create table profile (
  id uuid primary key references auth.users(id) on delete cascade,
  nombre text not null,
  rol text not null check (rol in ('admin', 'editor')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

---

## 3.2 product (Productos)

```sql
create table product (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  slug text unique not null check (length(slug) > 2),
  descripcion_corta text,
  descripcion_larga text,
  precio numeric(10,2) default 0 not null,
  destacado boolean default false not null,
  publicado boolean default false not null,

  created_by uuid references profile(id) on delete set null,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
); 
```

## 3.3 image (Imagenes)

```sql
create table image (
  id uuid primary key default gen_random_uuid(),
  nombre_archivo text not null,
  ruta_storage text not null,
  texto_alt text,

  uploaded_by uuid references profile(id) on delete set null,

  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  deleted_at timestamptz default null
);
```

---

## 3.4 page (Paginas)

```sql
create table page (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  slug text unique not null check (length(slug) > 2),
  contenido text,
  publicada boolean default false,

  created_by uuid references profile(id) on delete set null,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
); 
```

## 3.2 message (Mensaje)

```sql
create table message (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  email text not null,
  telefono text,
  asunto text,
  mensaje text not null,
  estado text not null default 'nuevo' check (estado in ('nuevo', 'leido', 'archivado')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

---

# 4. TABLAS DE RELACIÓN

---

## 4.1 product_image (Producto imagenes)

```sql
create table product_image (
  producto_id uuid references product(id) on delete cascade,
  imagen_id uuid references image(id) on delete restrict,
  created_at timestamptz default now(),

  orden int default 0,
  imagen_principal boolean default false,

  primary key (producto_id, imagen_id)
);

-- Garantiza que solo haya una imagen principal por producto
create unique index on product_image (producto_id)
where imagen_principal = true;
```

---

## 4.2 page_image (Pagina Imagenes)

```sql
create table page_image (
  pagina_id uuid references page(id) on delete cascade,
  imagen_id uuid references image(id) on delete restrict,
  created_at timestamptz default now(),

  orden int default 0,

  primary key (pagina_id, imagen_id)
);
```

---

# 5. RELACIONES GLOBALES

---

## profiles
1 ─── N product
1 ─── N page

## products
1 ─── N product_image ─── N image

## pages
1 ─── N page_image ─── N image

---

# 6. REGLAS DE INTEGRIDAD

---

## Eliminación
product → elimina relaciones (CASCADE)
page → elimina relaciones (CASCADE)
image → NO se pueden borrar si están en uso (RESTRICT)

## Creación
todo product debe tener created_by
todo page debe tener created_by

## Reutilización de imágenes
imágenes pueden existir sin uso
pueden ser reutilizadas en múltiples entidades

## Nomenclatura de fechas
Todas las tablas usan created_at y updated_at (estándar Supabase / ORMs).
Las tablas de relación (product_image, page_image) solo tienen created_at (no se actualizan).
La tabla image añade deleted_at para soft delete.

## Storage
Las imágenes usan soft delete: al "borrar" se rellena deleted_at, no se elimina el registro.
El archivo físico en Supabase Storage se borra desde el backend cuando deleted_at está presente.
Las queries deben filtrar siempre por deleted_at is null para excluir imágenes borradas.
Las imágenes con deleted_at NOT NULL no pueden usarse en nuevas relaciones.

---

# 7. ESTRATEGIA DE STORAGE

---

Supabase Storage — bucket único `images`:

images/products/
images/pages/
images/gallery/
images/blog/

La base de datos solo guarda:

ruta_storage
metadata

---

# 8. SEGURIDAD (PREVIEW RLS)

---

Este modelo está preparado para:

- lectura pública de productos publicados
- lectura pública de páginas publicadas
- escritura solo para admin/editor
- protección de imágenes y relaciones

---

# 9. ESTADO DEL MODELO

---

Este es el modelo lógico base del sistema.

A partir de aquí se construye:

RLS policies
Backend Supabase
Frontend Next.js
CMS admin panel