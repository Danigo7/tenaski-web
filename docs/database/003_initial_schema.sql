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

-- =========================================================
-- 6. GRANTS
-- =========================================================

-- Anon: solo puede insertar mensajes (formulario de contacto público)
grant insert on table public.message to anon;

-- Authenticated: acceso completo a su propio perfil y contenido publicado
grant select on table public.product to authenticated;
grant select on table public.page to authenticated;
grant select on table public.profile to authenticated;
grant select on product to authenticated;
grant insert on product to authenticated;

grant select on table public.image to authenticated;
grant insert on table public.image to authenticated;
grant update on table public.image to authenticated;
grant delete on table public.image to authenticated;

grant select on table public.product_image to authenticated;
grant insert on table public.product_image to authenticated;
grant update on table public.product_image to authenticated;
grant delete on table public.product_image to authenticated;

grant insert on table public.product to authenticated;
grant update on table public.product to authenticated;
grant delete on table public.product to authenticated;

grant select on product to anon;
grant select on product to authenticated;

grant select on product_image to anon;
grant select on product_image to authenticated;

grant select on image to anon;
grant select on image to authenticated;

GRANT DELETE ON public.message TO authenticated;

CREATE POLICY "message_delete"
ON public.message
FOR DELETE
TO authenticated
USING (
  get_user_role() = ANY (ARRAY['admin'::text, 'editor'::text])
);

-- =========================================================
-- 004_content_block.sql
-- Contenido editable: Hero global, Manifesto, Process, Historia
-- =========================================================

-- -------------------------
-- TABLA
-- -------------------------
-- Una fila por "bloque" de contenido. `seccion` es la clave única
-- que identifica cada bloque (ej: 'hero_global', 'home_manifesto').
-- `data` guarda los campos de texto en JSON, flexible por bloque.
-- `imagen_id` apunta a la tabla image ya existente (reutilizamos la librería).
create table public.content_block (
  id          uuid primary key default gen_random_uuid(),
  seccion     text unique not null,
  data        jsonb not null default '{}'::jsonb,
  imagen_id   uuid references public.image(id) on delete set null,
  updated_by  uuid references public.profile(id) on delete set null,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- -------------------------
-- SEED: filas iniciales para cada sección editable
-- -------------------------
insert into public.content_block (seccion, data) values
  ('hero_global', jsonb_build_object(
    'eyebrow', 'Pirineos · Hecho a mano',
    'titulo', 'Esquís que cuentan algo.',
    'descripcion', 'Cada par sale del taller con un nombre, una historia y la forma exacta del terreno para el que fue hecho.'
  )),
  ('home_manifesto', jsonb_build_object(
    'eyebrow', 'Nuestra filosofía',
    'titulo', 'No fabricamos esquís. Construimos compañeros de montaña.',
    'descripcion', 'Cada pieza nace en el taller, donde la madera, la experiencia y el terreno se encuentran para crear algo que durará muchos inviernos.'
  )),
  ('home_process', jsonb_build_object(
    'eyebrow', 'El taller',
    'titulo', 'Cada esquí pasa por cuatro etapas.',
    'descripcion', 'El proceso combina experiencia, materiales seleccionados y una construcción artesanal pensada para durar muchos inviernos.'
  )),
  ('home_process_step_1', jsonb_build_object('titulo', 'Diseño', 'descripcion', 'Cada modelo nace pensando en un terreno y una forma de esquiar.')),
  ('home_process_step_2', jsonb_build_object('titulo', 'Madera', 'descripcion', 'Seleccionamos materiales resistentes y ligeros para cada construcción.')),
  ('home_process_step_3', jsonb_build_object('titulo', 'Construcción', 'descripcion', 'Cada pieza se trabaja a mano dentro del taller.')),
  ('home_process_step_4', jsonb_build_object('titulo', 'Acabado', 'descripcion', 'Los detalles finales convierten cada esquí en una pieza única.')),
  ('historia_story', jsonb_build_object(
    'eyebrow', 'El origen',
    'titulo', 'Todo empezó en un pequeño taller.',
    'descripcion', 'Tena Skis nace del deseo de recuperar una forma más humana de fabricar esquís, donde cada pieza tenga personalidad propia y una conexión directa con la montaña.'
  )),
  ('historia_workshop', jsonb_build_object(
    'eyebrow', 'El taller',
    'titulo', 'Donde la madera se convierte en montaña.',
    'descripcion', 'No trabajamos en una fábrica. Trabajamos en un espacio donde cada herramienta, cada material y cada decisión forman parte del resultado final.',
    'detalles', jsonb_build_array('Maderas seleccionadas', 'Herramientas tradicionales', 'Acabados manuales')
  ));

-- -------------------------
-- RLS
-- -------------------------
alter table public.content_block enable row level security;

-- Lectura pública: cualquiera (anon o authenticated) puede leer,
-- porque estos bloques alimentan páginas públicas.
create policy "content_block_select"
on public.content_block for select
using (true);

-- Solo admin/editor pueden modificar contenido.
create policy "content_block_update"
on public.content_block for update
using (get_user_role() in ('admin', 'editor'))
with check (get_user_role() in ('admin', 'editor'));

-- -------------------------
-- GRANTS
-- -------------------------
grant select on table public.content_block to anon, authenticated;
grant update on table public.content_block to authenticated;

-- Borra la fila global que insertamos antes
DELETE FROM public.content_block WHERE seccion = 'hero_global';

-- Inserta un hero por página
INSERT INTO public.content_block (seccion, data) VALUES
  ('hero_home', jsonb_build_object(
    'eyebrow', 'Pirineos · Hecho a mano',
    'titulo', 'Esquís que cuentan algo.',
    'descripcion', 'Cada par sale del taller con un nombre, una historia y la forma exacta del terreno para el que fue hecho.'
  )),
  ('hero_historia', jsonb_build_object(
    'eyebrow', 'Pirineos · Desde 2026',
    'titulo', 'Una historia nacida en la montaña.',
    'descripcion', 'Construimos esquís pensando en el tiempo, el terreno y las personas que los utilizarán.'
  )),
  ('hero_catalogo', jsonb_build_object(
    'eyebrow', 'Colección',
    'titulo', 'Nuestros esquís.',
    'descripcion', 'Cada modelo nace para un terreno, una forma de esquiar y una manera distinta de entender la montaña.'
  )),
  ('hero_galeria', jsonb_build_object(
    'eyebrow', 'Galería',
    'titulo', 'La montaña, tal y como la vivimos.',
    'descripcion', 'Una selección de momentos, texturas y paisajes.'
  )),
  ('hero_contacto', jsonb_build_object(
    'eyebrow', 'Contacto',
    'titulo', 'Hablemos de tu próximo esquí',
    'descripcion', 'Cuéntanos qué buscas y te responderemos personalmente.'
  ));

  -- =========================================================
-- 005_content_block_values.sql
-- Fix: permitir INSERT en content_block + seed de historia_values
-- =========================================================

-- -------------------------
-- GRANT que faltaba
-- -------------------------
grant insert on table public.content_block to authenticated;

-- -------------------------
-- Policy de RLS que faltaba
-- -------------------------
create policy "content_block_insert"
on public.content_block for insert
to authenticated
with check (get_user_role() in ('admin', 'editor'));

-- -------------------------
-- SEED: historia_values (nunca se insertó en el schema original)
-- -------------------------
insert into public.content_block (seccion, data) values
  ('historia_values', jsonb_build_object(
    'values', jsonb_build_array(
      jsonb_build_object('number', '01', 'titulo', 'Artesanía', 'descripcion', 'Cada esquí se construye de forma individual, cuidando cada detalle.'),
      jsonb_build_object('number', '02', 'titulo', 'Durabilidad', 'descripcion', 'Diseñados para acompañarte durante muchos inviernos.'),
      jsonb_build_object('number', '03', 'titulo', 'Montaña', 'descripcion', 'Todo nace pensando en el terreno y en la experiencia real.')
    )
  ))
on conflict (seccion) do nothing;