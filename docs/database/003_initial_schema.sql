-- =========================================================
-- 003_initial_schema.sql
-- Web corporativa esquís artesanales
-- Supabase Backend Core
-- =========================================================

-- =========================================================
-- 1. EXTENSIONS
-- =========================================================

create extension if not exists "pgcrypto";

-- =========================================================
-- 2. HELPER FUNCTIONS
-- =========================================================

create or replace function get_user_role()
returns text
language sql
stable
as $$
  select coalesce(
    (select rol from profile where id = auth.uid()),
    'anonymous'
  );
$$;

-- =========================================================
-- 3. TABLES
-- =========================================================

-- -------------------------
-- PROFILE
-- -------------------------
create table profile (
  id uuid primary key references auth.users(id) on delete cascade,
  nombre text not null,
  rol text not null check (rol in ('admin', 'editor')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- -------------------------
-- PRODUCT
-- -------------------------
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

-- -------------------------
-- PAGE
-- -------------------------
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

-- -------------------------
-- IMAGE
-- -------------------------
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

-- -------------------------
-- MESSAGE
-- -------------------------
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

-- -------------------------
-- PRODUCT_IMAGE
-- -------------------------
create table product_image (
  producto_id uuid references product(id) on delete cascade,
  imagen_id uuid references image(id) on delete restrict,
  orden int default 0,
  imagen_principal boolean default false,
  created_at timestamptz default now(),
  primary key (producto_id, imagen_id)
);

-- unique: solo una imagen principal por producto
create unique index product_image_main_unique
on product_image (producto_id)
where imagen_principal = true;

-- -------------------------
-- PAGE_IMAGE
-- -------------------------
create table page_image (
  pagina_id uuid references page(id) on delete cascade,
  imagen_id uuid references image(id) on delete restrict,
  orden int default 0,
  created_at timestamptz default now(),
  primary key (pagina_id, imagen_id)
);

-- =========================================================
-- 4. ROW LEVEL SECURITY ENABLE
-- =========================================================

alter table profile enable row level security;
alter table product enable row level security;
alter table page enable row level security;
alter table image enable row level security;
alter table message enable row level security;
alter table product_image enable row level security;
alter table page_image enable row level security;

-- =========================================================
-- 5. RLS POLICIES
-- =========================================================

-- -------------------------
-- PROFILE
-- -------------------------
create policy "profile_select"
on profile for select
using (
  id = auth.uid()
  or get_user_role() = 'admin'
);

create policy "profile_update"
on profile for update
using (
  id = auth.uid()
  or get_user_role() = 'admin'
);

-- -------------------------
-- PRODUCT
-- -------------------------
create policy "product_select"
on product for select
using (
  publicado = true
  or get_user_role() in ('admin', 'editor')
);

create policy "product_insert"
on product for insert
with check (
  created_by = auth.uid()
  and get_user_role() in ('admin', 'editor')
);

create policy "product_update"
on product for update
using (
  created_by = auth.uid()
  or get_user_role() = 'admin'
)
with check (
  created_by = auth.uid()
  or get_user_role() = 'admin'
);

create policy "product_delete"
on product for delete
using (
  created_by = auth.uid()
  or get_user_role() = 'admin'
);

-- -------------------------
-- PAGE
-- -------------------------
create policy "page_select"
on page for select
using (
  publicada = true
  or get_user_role() in ('admin', 'editor')
);

create policy "page_insert"
on page for insert
with check (
  created_by = auth.uid()
  and get_user_role() in ('admin', 'editor')
);

create policy "page_update"
on page for update
using (
  created_by = auth.uid()
  or get_user_role() = 'admin'
)
with check (
  created_by = auth.uid()
  or get_user_role() = 'admin'
);

create policy "page_delete"
on page for delete
using (
  created_by = auth.uid()
  or get_user_role() = 'admin'
);

-- -------------------------
-- IMAGE (CMS ONLY)
-- -------------------------
create policy "image_select"
on image for select
using (
  deleted_at is null
  and get_user_role() in ('admin', 'editor')
);

create policy "image_insert"
on image for insert
with check (
  uploaded_by = auth.uid()
  and get_user_role() in ('admin', 'editor')
);

create policy "image_update"
on image for update
using (
  uploaded_by = auth.uid()
  or get_user_role() = 'admin'
);

create policy "image_delete"
on image for delete
using (
  get_user_role() = 'admin'
);

-- -------------------------
-- MESSAGE
-- -------------------------
create policy "message_insert"
on message for insert
with check (true);

create policy "message_select"
on message for select
using (
  get_user_role() in ('admin', 'editor')
);

create policy "message_update"
on message for update
using (
  get_user_role() in ('admin', 'editor')
);

-- -------------------------
-- PRODUCT_IMAGE
-- -------------------------
create policy "product_image_policy"
on product_image for all
using (
  get_user_role() = 'admin'
  or (
    get_user_role() = 'editor'
    and exists (
      select 1 from product p
      where p.id = product_image.producto_id
      and p.created_by = auth.uid()
    )
  )
)
with check (
  get_user_role() = 'admin'
  or (
    get_user_role() = 'editor'
    and exists (
      select 1 from product p
      where p.id = product_image.producto_id
      and p.created_by = auth.uid()
    )
  )
);

-- -------------------------
-- PAGE_IMAGE
-- -------------------------
create policy "page_image_policy"
on page_image for all
using (
  get_user_role() = 'admin'
  or (
    get_user_role() = 'editor'
    and exists (
      select 1 from page p
      where p.id = page_image.pagina_id
      and p.created_by = auth.uid()
    )
  )
)
with check (
  get_user_role() = 'admin'
  or (
    get_user_role() = 'editor'
    and exists (
      select 1 from page p
      where p.id = page_image.pagina_id
      and p.created_by = auth.uid()
    )
  )
);