--En Supabase:
--La base de datos es accesible por API
--SIN RLS → cualquiera puede leer/escribir
--CON RLS → tú decides TODO el acceso
--Este archivo convierte el sistema en un “backend seguro real”.

--1. ACTIVAR RLS (PRIMERO ACTIVAMOS SEGURIDAD EN TODAS LAS TABLAS).
--Sin esto, las policies no funcionan
alter table profile enable row level security;
alter table product enable row level security;
alter table page enable row level security;
alter table image enable row level security;
alter table message enable row level security;
alter table product_image enable row level security;
alter table page_image enable row level security;

------------------------------------------------------------------

--2. HELPERS

--OBTENER ROL DE USUARIO (Esto permite: saber si es admin o editor, usarlo en todas las policies)
create or replace function get_user_role()
returns text
language sql
stable
as $$
  select rol
  from profile
  where id = auth.uid()
$$;

------------------------------------------------------------------

--3. PROFILE (USUARIOS CMS)

--Select
create policy "profile_select_own"
on profile
for select
using (
  id = auth.uid()
  or get_user_role() = 'admin'
);

--Update
create policy "profile_update_own"
on profile
for update
using (
  id = auth.uid()
  or get_user_role() = 'admin'
);

--❌ INSERT / DELETE No se permite desde cliente → se controla backend/auth.

------------------------------------------------------------------

--4. PRODUCT

--Select (Publico + CMS)
create policy "product_select_public"
on product
for select
using (
  publicado = true
  or get_user_role() in ('admin', 'editor')
);

--Insert
create policy "product_insert"
on product
for insert
with check (
  created_by = auth.uid()
  and get_user_role() in ('admin', 'editor')
);

--Update
create policy "product_update"
on product
for update
using (
  created_by = auth.uid()
  or get_user_role() = 'admin'
);

--Delete
create policy "product_delete"
on product
for delete
using (
  created_by = auth.uid()
  or get_user_role() = 'admin'
);

------------------------------------------------------------------

--5. PAGE

--Select
create policy "page_select_public"
on page
for select
using (
  publicada = true
  or get_user_role() in ('admin', 'editor')
);

--Insert
create policy "page_insert"
on page
for insert
with check (
  created_by = auth.uid()
  and get_user_role() in ('admin', 'editor')
);

--Update
create policy "page_update"
on page
for update
using (
  created_by = auth.uid()
  or get_user_role() = 'admin'
);

--Delete
create policy "page_delete"
on page
for delete
using (
  created_by = auth.uid()
  or get_user_role() = 'admin'
);

------------------------------------------------------------------

--6. IMAGE (IMPORTANTE POR SEGURIDAD)

--Select (imágenes públicas SOLO se exponen vía product/page publicados (frontend lo controla))
create policy "image_select"
on image
for select
using (
  deleted_at is null
  and (
    get_user_role() in ('admin', 'editor')
  )
);

--Insert
create policy "image_insert"
on image
for insert
with check (
  uploaded_by = auth.uid()
  and get_user_role() in ('admin', 'editor')
);

--Update
create policy "image_update"
on image
for update
using (
  uploaded_by = auth.uid()
  or get_user_role() = 'admin'
);

--Delete
create policy "image_delete"
on image
for update
using (
  get_user_role() = 'admin'
);

------------------------------------------------------------------

--6. MESSAGE (MUY IMPORTANTE POR SEGURIDAD)

--Select 
create policy "message_select"
on message
for select
using (
  get_user_role() in ('admin', 'editor')
);

--Insert (PUBLICO)
create policy "message_insert_public"
on message
for insert
with check (true);

--Update
create policy "message_update"
on message
for update
using (
  get_user_role() in ('admin', 'editor')
);

-- ❌ Delete NO HAY.

------------------------------------------------------------------

--7. RELACCIONES

--PRODUCT_IMAGE
create policy "product_image_all"
on product_image
for all
using (
  get_user_role() in ('admin', 'editor')
);

--PAGE_IMAGE
create policy "page_image_all"
on page_image
for all
using (
  get_user_role() in ('admin', 'editor')
);

------------------------------------------------------------------


--8. REGLA CRÍTICA (MUY IMPORTANTE)
--⚠️ Supabase NO restringe joins automáticamente

--Esto significa:

--aunque proteja image
--si se hace JOIN mal → se pueden filtrar datos no deseados

--👉 Esto lo controlaremos después en frontend + queries.

------------------------------------------------------------------

--9. RESULTADO FINAL

--Con este archivo tienes:

--🔐 Seguridad real del sistema
--público solo ve contenido publicado
--CMS controlado por roles
--ownership aplicado
--soft delete protegido
--mensajes seguros
--imágenes controladas