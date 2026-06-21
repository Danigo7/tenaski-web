# 🏔️ Tena Skis — Design System

## Filosofía visual

Tena Skis transmite:

- Artesanía
- Exclusividad
- Naturaleza
- Montaña
- Atemporalidad
- Calidad premium

La web debe transmitir calma, espacio y autenticidad.

No buscamos una estética tecnológica, sino humana y elegante.

---

# 🎨 Paleta de colores

## Fondo principal

`#0F0F0F`

Negro carbón. Se utiliza como color principal de toda la web.

---

## Fondo secundario

`#1A1714`

Marrón oscuro. Se utiliza en overlays y profundidad visual.

---

## Color principal (acento)

`#C4A882`

Dorado cálido. Se utiliza para:

- Eyebrows
- Botones principales
- Detalles visuales
- Elementos destacados

---

## Texto principal

`#E8E4DC`

Blanco roto. Se utiliza para:

- Títulos
- Textos importantes

---

## Texto secundario

`#E8E4DC` / `60%`

Se utiliza para:

- Descripciones
- Textos auxiliares

---

## Bordes

`#E8E4DC` / `20%`

Se utiliza para:

- Botones secundarios
- Separadores
- Contenedores

---

## Opacidades del sistema

| Token | Uso |
|-------|-----|
| `/60` | Texto secundario, descripciones |
| `/50` | Números de paso, elementos apagados |
| `/25` | Overlays de imagen |
| `/20` | Bordes, separadores |

---

# 🔤 Tipografías

## Tipografía principal — Cormorant Garamond

Uso:

- H1
- H2
- H3

Sensación: Elegante, artesanal, editorial.

---

## Tipografía secundaria — DM Sans

Uso:

- Párrafos
- Botones
- Navegación
- Formularios

Sensación: Limpia, moderna, legible.

---

# 📐 Sistema de espaciado

## Contenedor principal

`max-w-6xl`

## Padding horizontal

`px-6`

## Espaciado vertical

| Contexto | Clase |
|----------|-------|
| Secciones principales | `py-20` |
| Secciones secundarias | `py-10` |
| Footer | `py-20` |

---

# 🖼️ Sistema de imágenes

## Clase `img-premium`

Todas las imágenes de sección deben usar esta clase.

Comportamiento:

| Estado | Efecto |
|--------|--------|
| Inicial | Ligera oscuridad, contraste reducido |
| Hover | Más nitidez, más brillo, ligero zoom |

Implementación CSS:

```css
.img-premium {
  filter: brightness(0.85) contrast(0.95);
  transition: transform 700ms ease, filter 700ms ease;
}

.img-premium:hover {
  transform: scale(1.08);
  filter: brightness(1.1) contrast(1.1);
}
```

Requisitos:

- Imágenes grandes
- Respiro visual
- Profundidad mediante overlays y gradientes

---

# 🧱 Componentes reutilizables

## Hero

Objetivo: Presentar la esencia de la marca.

Elementos:

- Imagen de fondo
- Eyebrow
- H1
- Descripción
- CTA principal
- CTA secundario

---

## Manifesto

Objetivo: Transmitir la filosofía de la marca.

Layout: Texto izquierda · Imagen derecha

---

## Process

Objetivo: Mostrar el proceso artesanal.

Layout: Alternancia visual — imagen izquierda / texto derecha, imagen derecha / texto izquierda.

---

## FeaturedProduct

Objetivo: Destacar un producto concreto.

Layout: Imagen izquierda · Texto derecha · Botón secundario

---

## CTA

Objetivo: Invitar a explorar el catálogo.

Layout: Centrado y minimalista.

---

# 🏷️ Sistema de títulos

## H1 — Hero

Grandes titulares emocionales.
font-['Cormorant_Garamond'] text-5xl font-light leading-none tracking-tight

sm:text-6xl md:text-7xl lg:text-8xl

Ejemplo: *"Esquís que cuentan algo."*

---

## H2 — Secciones (`SectionTitle.tsx`)
max-w-2xl font-['Cormorant_Garamond'] text-5xl font-light leading-[1] tracking-[-0.03em]

text-[#E8E4DC] md:text-6xl

---

## H3 — Subtítulos internos
font-['Cormorant_Garamond'] text-3xl font-light text-[#E8E4DC]

Uso: Títulos de pasos en Process.

---

# 📝 Sistema de texto (`SectionText.tsx`)
max-w-lg text-base leading-relaxed text-[#E8E4DC]/60 sm:text-lg

Uso:

- Descripciones de sección
- Introducciones
- Textos secundarios

---

# 🔘 Sistema de botones

## Botón primario
bg-[#C4A882] text-[#0F0F0F] px-10 py-4

text-sm uppercase tracking-[0.15em]

transition-colors duration-300 hover:bg-[#E8E4DC]

Uso: Acciones principales.

---

## Botón secundario
border border-[#E8E4DC]/20 text-[#E8E4DC]/70 px-10 py-4

text-sm uppercase tracking-[0.15em]

transition-all duration-300

hover:border-[#E8E4DC]/50 hover:text-[#E8E4DC] hover:translate-y-[-2px]

Uso: Acciones secundarias.

---

# 📱 Responsive

Mobile first. Breakpoints utilizados: `sm` · `md` · `lg`

Prioridades:

- Legibilidad
- Espacio visual
- Jerarquía clara

---

# ♿ Accesibilidad

- Contraste suficiente
- Textos legibles
- Hover consistente
- Navegación clara
- Botones grandes
- `imageAlt` obligatorio en todos los componentes con imagen

---

# 🏔️ Principios de diseño

Siempre priorizar:

✔️ Simplicidad  
✔️ Atemporalidad  
✔️ Elegancia  
✔️ Espacio visual  
✔️ Artesanía  
✔️ Rendimiento  

Evitar:

❌ Saturar la interfaz  
❌ Demasiadas animaciones  
❌ Efectos innecesarios  
❌ Exceso de colores  
❌ Elementos tecnológicos agresivos 