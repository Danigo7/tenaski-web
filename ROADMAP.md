# 🏔️ Roadmap de Desarrollo

## Fase 0 — Planificación

Antes de escribir código se definió la arquitectura completa del proyecto.

### Objetivos

- Definir el stack tecnológico.
- Diseñar la arquitectura.
- Planificar la escalabilidad.
- Diseñar el modelo de datos.

Resultado:

✔ Proyecto planificado antes de comenzar el desarrollo.

---

# Fase 1 — Backend

Se construyó la base técnica utilizando Supabase.

### Base de datos

- PostgreSQL
- Relaciones
- Storage
- Auth
- RLS

Se diseñaron las tablas principales:

- profile
- product
- image
- page
- message
- content_block
- acabado

Resultado:

✔ Backend preparado para soportar tanto la web pública como el CMS.

---

# Fase 2 — Inicialización del Frontend

Se creó el proyecto utilizando:

- Next.js
- React
- TypeScript
- Tailwind CSS

También se configuró:

- Git
- GitHub
- Netlify
- Variables de entorno
- Cliente y servidor de Supabase

Resultado:

✔ Base técnica preparada.

---

# Fase 3 — Arquitectura del Frontend

Se organizó el proyecto por responsabilidad.


app/
components/
lib/
hooks/
types/


Separando claramente:

- Web pública
- Administración
- Componentes
- Acceso a datos

Resultado:

✔ Arquitectura modular y escalable.

---

# Fase 4 — Diseño Base

Se creó el sistema visual inicial.

Incluye:

- Layout
- Navbar
- Footer
- Botones
- Tipografía
- Sistema de secciones

Resultado:

✔ Identidad visual unificada.

---

# Fase 5 — Desarrollo de la Web Pública

Se desarrollaron las páginas principales.

- Home
- Historia
- Catálogo
- Producto
- Galería
- Contacto

El contenido comenzó a obtenerse desde Supabase.

Resultado:

✔ Primera versión funcional de la web.

---

# Fase 6 — Sistema CMS

Se creó un panel privado para administrar la web.

Incluye:

- Dashboard
- Productos
- Imágenes
- Mensajes
- Contenido dinámico

Resultado:

✔ La web dejó de depender del código para actualizar contenido.

---

# Fase 7 — Componentes Reutilizables

El contenido pasó a gestionarse mediante componentes reutilizables.

Ejemplos:

- HeroContentForm
- CTAContentForm
- IntroContentForm
- ManifestoContentForm
- ValuesContentForm
- WorkshopContentForm
- ProcessContentForm
- AcabadosContentForm

También se añadieron:

- Switch reutilizable
- UploadContentImage
- SectionGroup

Resultado:

✔ CMS mantenible y fácilmente ampliable.

---

# Fase 8 — Contenido Dinámico

Las secciones públicas comenzaron a depender completamente de la base de datos.

Ejemplos:

- Hero
- CTAs
- Historia
- Valores
- Taller
- Proceso
- Acabados

Cada sección puede:

- editarse
- ocultarse
- actualizar imágenes
- modificar textos

sin cambiar el código.

Resultado:

✔ Separación completa entre contenido y presentación.

---

# Fase 9 — Autenticación

Se integró Supabase Auth para proteger el panel.

Incluye:

- Login
- Logout
- Protección de rutas
- Roles
- Middleware

Resultado:

✔ Acceso restringido al CMS.

---

# Fase 10 — Estado Actual

Actualmente el proyecto dispone de:

✔ Arquitectura modular

✔ Base de datos normalizada

✔ Seguridad mediante RLS

✔ Supabase Auth

✔ Panel CMS

✔ Gestión de productos

✔ Gestión de imágenes

✔ Gestión de mensajes

✔ Gestión de contenido

✔ Componentes reutilizables

✔ Deploy en Netlify

✔ Web pública funcional

---

# Próximas mejoras

- Optimización SEO
- Mejoras de rendimiento
- Hardening de seguridad
- Accesibilidad
- Optimización de Core Web Vitals
- Posible integración futura de ecommerce