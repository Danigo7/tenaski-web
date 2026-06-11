--EXTENSIONES
-- UUID generator (Supabase normalmente ya lo tiene, pero lo dejamos explícito) ESTO PERMITE USAR gen_random_uuid()
--¡NO NECESARIO EN SUPABASE!
create extension if not exists "pgcrypto";

--TABLA PROFILE
create table profile (
  id uuid primary key references auth.users(id) on delete cascade,
  nombre text not null,
  rol text not null check (rol in ('admin', 'editor')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

--TABLA PRODUCT
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

--TABLA IMAGE
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

--TABLA PAGE
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

--TABLA MESSAGE
create table message (
  id uuid primary key default gen_random_uuid(),

  nombre text not null,
  email text not null,
  telefono text,
  asunto text,
  mensaje text not null,

  estado text not null default 'nuevo'
    check (estado in ('nuevo', 'leido', 'archivado')),

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

--TABLA PRODUCT_IMAGE
create table product_image (
  producto_id uuid references product(id) on delete cascade,
  imagen_id uuid references image(id) on delete restrict,

  orden int default 0,
  imagen_principal boolean default false,

  created_at timestamptz default now(),

  primary key (producto_id, imagen_id)
);

create unique index product_image_one_main
on product_image (producto_id)
where imagen_principal = true;

--TABLA PAGE_IMAGE
create table page_image (
  pagina_id uuid references page(id) on delete cascade,
  imagen_id uuid references image(id) on delete restrict,

  orden int default 0,

  created_at timestamptz default now(),

  primary key (pagina_id, imagen_id)
);