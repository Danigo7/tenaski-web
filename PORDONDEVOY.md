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

----------------------------------------------------------------------------------------------------------

## 🧠 Estado actual del proyecto

Actualmente el proyecto se encuentra en:

# 🧱 FASE 0 — Diseño de Base de Datos y Arquitectura

Esta fase es completamente de planificación (NO código todavía).

----------------------------------------------------------------------------------------------------------

## 📚 Trabajo ya realizado

### 1. Arquitectura del sistema definida

Se ha definido el stack tecnológico:

- Frontend: Next.js + TypeScript + Tailwind CSS
- Backend: Supabase
- Base de datos: PostgreSQL (Supabase)
- Storage: Supabase Storage
- Hosting: Netlify

### 2. Roadmap del proyecto creado

El proyecto está dividido en fases:

- Fase 0 → Diseño (arquitectura + base de datos + seguridad)
- Fase 1 → Setup del proyecto
- Fase 2 → Diseño UI/UX
- Fase 3 → Base de datos en Supabase
- Fase 4 → Frontend público
- Fase 5 → Autenticación
- Fase 6 → Panel de administración (CMS)
- Fase 7 → Optimización (SEO + rendimiento + seguridad)
- Fase 8 → Deploy final

### 3. Modelo de base de datos diseñado

Se han definido las entidades principales:

- products
- product_images
- gallery_images
- pages
- messages
- profiles (admins)

Relaciones y estructura lógica ya diseñadas. 

Se han definido las tablas, entidades, atributos, todo ya. 

### 4. Sistema de seguridad en diseño

Se está trabajando en:

# 🔐 security_model.md

Donde se define:

- Roles del sistema
- Permisos por tabla
- Acceso público vs admin
- Estrategia de Row Level Security (RLS)


## 👥 Roles del sistema

### Público (visitante)
- Puede ver productos
- Puede ver páginas públicas
- Puede enviar mensajes

### Administrador
- Acceso al panel CMS
- Crear / editar / borrar productos
- Gestionar imágenes
- Editar contenido
- Ver mensajes

----------------------------------------------------------------------------------------------------------

## 🔐 Estado actual del trabajo

Actualmente el proyecto está en:

# 👉 Diseño del modelo de seguridad de base de datos (RLS)

Se está definiendo:

- Qué datos son públicos
- Qué datos son privados
- Qué puede hacer cada rol
- Qué tablas estarán protegidas
- Qué operaciones estarán permitidas (SELECT / INSERT / UPDATE / DELETE)

----------------------------------------------------------------------------------------------------------

## ⚠️ Decisión importante tomada

Se está usando seguridad a nivel de base de datos (RLS en Supabase), no solo seguridad en frontend.

Esto garantiza:

- Protección real de datos
- Control total del acceso
- Prevención de accesos no autorizados
- Arquitectura profesional

----------------------------------------------------------------------------------------------------------

## 🧭 Siguiente paso previsto

Una vez terminado el `security_model.md`, el siguiente paso será:

### 🔐 Implementación de RLS en Supabase

- Crear políticas reales en SQL
- Definir permisos por tabla
- Conectar con autenticación
- Validar acceso por roles

----------------------------------------------------------------------------------------------------------

## 🎯 Objetivo final de esta fase

Tener una base de datos:

- Bien estructurada
- Segura
- Escalable
- Lista para conectarse al frontend

Sin necesidad de cambios posteriores importantes.

----------------------------------------------------------------------------------------------------------

## 🧠 Nota importante del proceso

El proyecto se está construyendo de forma profesional:

1. Primero arquitectura
2. Luego base de datos
3. Luego seguridad
4. Luego desarrollo
5. Luego UI
6. Luego deploy

Evitando errores comunes de desarrollo rápido sin planificación.

----------------------------------------------------------------------------------------------------------

## 📍 Estado general

✔ Arquitectura definida  
✔ Roadmap definido  
✔ Modelo de datos definido  
🔄 Seguridad (RLS) en progreso  
⏳ README.md CREO QUE SERÍA INTERESANTE HACERLO, DE LA ARQUITECTURA DEFINIDA.

---