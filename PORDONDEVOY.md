# 🏔️ Proyecto Web Marca Artesanal de Esquís

## 📌 Resumen General

Este proyecto consiste en el desarrollo de una web profesional para una marca artesanal de esquís hechos a mano.

El objetivo es crear una plataforma:

- Visualmente premium
- Rápida y optimizada
- Fácil de administrar
- Segura a nivel de base de datos
- Escalable para futuro (blog, ecommerce, etc.)

Además, el proyecto está siendo desarrollado como parte de un portfolio profesional Full Stack.

---------------------------------------------------------------------------------------------

## 🧠 Estado actual del proyecto

# 🧱 FASE 0 — Backend Supabase (Fase 0 completada) ✅

## 1. Objetivo de esta fase

Se construyó toda la base del backend del sistema.

El objetivo era definir:

- Modelo de datos
- Relaciones entre entidades
- Sistema de seguridad (RLS)
- Roles de acceso
- Reglas de negocio base

---

## 2. Base de datos (completada)

Se han creado las siguientes tablas:

### Usuarios CMS
- profile (usuarios internos del sistema)

### Contenido principal
- product (esquís)
- page (páginas informativas)
- message (mensajes de contacto)

### Media
- image (imágenes en Supabase Storage)

### Relaciones
- product_image
- page_image

---

## 3. Seguridad (RLS implementado)

Se ha implementado Row Level Security en todas las tablas.

### Roles definidos
- anon → usuario no autenticado
- authenticated → usuario logueado
- admin → control total CMS
- editor → gestión limitada de contenido

---

## 4. Reglas principales

### Visibilidad pública
- Solo contenido con `publicado = true` es visible

### Ownership
- `editor` solo puede modificar su propio contenido
- `admin` tiene control total

### Mensajes
- Público puede enviar mensajes
- Solo CMS puede leerlos

### Imágenes
- Solo accesibles vía CMS o relaciones con contenido publicado

---

## 5. Función auxiliar

Se ha creado:

- get_user_role()

Permite determinar el rol del usuario para aplicar reglas de acceso.

---

## 6. Estado final FASE 0

✔ Base de datos creada  
✔ Relaciones definidas  
✔ RLS activo  
✔ Roles implementados  
✔ Reglas de seguridad aplicadas  
✔ Primeros tests realizados  

---

## 7. Problemas detectados durante pruebas

- Errores de permisos en tabla `profile`
- Dependencia de la función `get_user_role()` con RLS
- Problemas de test en entorno SQL (no refleja producción real)

---

## 8. Decisión tomada

Se detienen las pruebas de backend en SQL Editor.

Motivo:
- El entorno no representa el comportamiento real de producción
- Los tests deben hacerse desde frontend (Next.js + Supabase client)

---

⚠️ Nota importante

Los tests de RLS en SQL Editor no son fiables, se validarán desde Next.js.

---------------------------------------------------------------------------------------------

# 🟢 FASE 1 — Setup del proyecto (EN CURSO)
## 🎯 Objetivo

Tener Next.js + Supabase funcionando con base técnica lista para desarrollo real.

## COMPLETADO
Core setup
✔ Next.js + TypeScript creado
✔ Tailwind CSS configurado
✔ Estructura base (components, lib, hooks, types)
✔ Layout base (layout.tsx)
✔ Home inicial funcional
UI base
✔ Button component
✔ Header básico
✔ Estilo inicial con Tailwind
Supabase
✔ Conexión cliente + servidor
✔ Variables .env.local configuradas
✔ Validación inicial de conexión
DevOps básico
✔ Git inicializado
✔ GitHub conectado
✔ Primer push limpio
✔ Netlify configurado (deploy inicial)

##  PENDIENTE CRÍTICO
🔲 Validación real de Supabase en runtime (queries reales)
🔲 Preparar estructura de auth (base)
🔲 Testing básico de RLS desde frontend

## 🧠 Estado real

👉 Frontend + backend conectados, pero aún sin validación funcional completa de datos reales.

# 🎨 FASE 2 — UI / Diseño visual (INICIADA)

## HECHO
✔ Layout base
✔ Home inicial
✔ Botones base
✔ Tailwind system base

## PENDIENTE
🔲 Navbar final (premium)
🔲 Footer
🔲 Sistema visual completo (tipografía, espaciado, grid)
🔲 Componentes reutilizables avanzados
🔲 Responsive completo
🔲 Dirección estética final (outdoor premium)

---------------------------------------------------------------------------------------------

## 🔐 Estado actual del trabajo

# 🎯 Objetivo

Tener el proyecto Next.js funcionando, conectado a Supabase y listo para desarrollo real.

Actualmente el proyecto está en:

# 🟢 FASE ACTUAL: FASE 1 — Validación real de Supabase en runtime (queries reales)

🔲 Validación real de Supabase en runtime (queries reales)
🔲 Preparar estructura de auth (base)
🔲 Testing básico de RLS desde frontend

# 🧠 Nota de estado

👉 Ya hay fronted funcionando conectado a supabase y netlify

---------------------------------------------------------------------------------------------

## ⚠️ Decisión importante tomada

Tests de RLS en SQL editor no son fiables. Se valida todo desde Next.js con el cliente real de Supabase.

⚠️ Tests de RLS pendientes — no realizados aún. Validar antes de pasar a Fase 2.

---------------------------------------------------------------------------------------------

## 🧭 Siguiente paso previsto CLAVE (OBLIGATORIO)

Realizar los test basicos de RLS antes de pasar a la fase 2, desde fronted. 

---------------------------------------------------------------------------------------------

## 🎯 Objetivo final de esta fase

Proyecto Next.js corriendo en local, conectado a Supabase, estructura de carpetas definida, variables de entorno configuradas, subido a GitHub con deploy en Netlify. Sin UI — solo la base técnica lista para construir encima.

---------------------------------------------------------------------------------------------

## 🧠 Nota importante del proceso

El proyecto se está construyendo de forma profesional:

1. Primero arquitectura
2. Luego base de datos (diseño)
3. Luego seguridad (RLS conceptual + real)
3.5. Tests reales desde frontend, no desde SQL editor
4. Luego desarrollo frontend
5. Luego UI/UX final
6. Luego deploy

Evitando errores comunes de desarrollo sin planificación. 

---------------------------------------------------------------------------------------------

## 📍 Estado general

FASE 0 — Arquitectura y diseño técnico

✔ Definición de objetivos
✔ Definición de funcionalidades
✔ Roles de usuario
✔ Arquitectura general del sistema
✔ Modelo de base de datos
✔ Supabase configurado (Auth, DB, Storage base)
⏸️ Tests de seguridad (pendientes, los haremos cuando exista Next.js + Supabase client real)


FASE 1 — Setup del proyecto (Next.js) ⏳

✔ Crear proyecto Next.js + TypeScript
✔ Configurar Tailwind CSS
✔ Estructura base de carpetas (components, lib, hooks, types)
✔ Primer layout básico funcionando (layout.tsx)
✔ Navegación básica funcionando (Header + Link)
✔ Home inicial funcional
✔ Conectar Supabase (cliente + servidor) 
✔ Configurar variables de entorno (.env.local)
✔ Setup Git 
✔ Conectar GitHub
✔ Primer push limpio
✔ Setup Netlify (deploy)

FASE 2 — Base UI / Diseño visual

✔ Layout principal básico (Header existe)
✔ Primer sistema de botones (Button component)
✔ Home con diseño inicial
✔ Estilo base con Tailwind
✔ Layout principal (Navbar, Footer)
✔ Sistema visual premium (tipografía, colores, espaciado)
✔ Componentes base reutilizables
✔ Diseño responsive inicial

FASE 3 — Web pública (frontend)

✔ Home
✔ Historia de la marca
✔ Catálogo de productos
✔ Página de producto
✔ Galería
✔ Contacto + formulario (Supabase messages)

FASE 4 — Autenticación

🔲 Login con Supabase Auth
🔲 Middleware de protección
🔲 Sesión de usuario
🔲 Roles (admin)

FASE 5 — CMS (panel admin)

🔲 Dashboard
🔲 CRUD productos
🔲 Gestión de imágenes (Supabase Storage)
🔲 Gestión de contenido (pages table)
🔲 Gestión de mensajes

FASE 6 — Seguridad y hardening

🔲 Revisión RLS completa
🔲 Validación de inputs
🔲 Protección de endpoints
🔲 Reglas de acceso por rol
🔲 Revisión OWASP básica

FASE 7 — SEO + rendimiento

🔲 Metadata global
🔲 Open Graph
🔲 Sitemap + robots
🔲 Optimización imágenes
🔲 Core Web Vitals

FASE 8 — Deploy

🔲 Deploy Netlify
🔲 Configuración producción Supabase
🔲 Variables de entorno
🔲 Dominio (opcional)

---------------------------------------------------------------------------------------------

# 🧭 Mapa de chats por fase

---

## 🟢 FASE 1 — Setup (Next.js)
👉 💻 DESARROLLO FRONTEND  
↳ 🧭 ROADMAP (orden y dudas)

---

## 🎨 FASE 2 — UI / Diseño
👉 🎨 DISEÑO UX  
↳ 💻 FRONTEND (si se implementa)

---

## 🌐 FASE 3 — Web pública
👉 💻 DESARROLLO FRONTEND  
↳ 🎨 UX (diseño)  
↳ 🧭 ROADMAP (estructura)

---

## 🔐 FASE 4 — Autenticación
👉 💻 FRONTEND  
↳ 🔐 DESPLIEGUE Y SEGURIDAD

---

## 🛠 FASE 5 — CMS
👉 💻 FRONTEND  
↳ 🧱 SUPABASE (datos)  
↳ 🔐 SEGURIDAD (roles / RLS)

---

## 🔐 FASE 6 — Seguridad
👉 🔐 DESPLIEGUE Y SEGURIDAD  
↳ 🧱 SUPABASE  
↳ 💻 FRONTEND

---

## 🚀 FASE 7 — SEO
👉 💻 FRONTEND  
↳ 🔐 SEGURIDAD (performance)

---

## 🌍 FASE 8 — Deploy
👉 🔐 DESPLIEGUE Y SEGURIDAD  
↳ GitHub / Netlify / Supabase