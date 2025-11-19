# Guía de Accesibilidad (ARIA) - Tienda Sol

## Descripción General
Este documento describe las mejoras de accesibilidad implementadas en el proyecto Tienda Sol, siguiendo las recomendaciones WCAG 2.1 y WAI-ARIA.

## Etiquetas ARIA Implementadas

### 1. Atributos de Roles (ARIA Roles)

#### Roles Semánticos
- `role="banner"` - Para el header/navbar principal
- `role="contentinfo"` - Para el footer
- `role="main"` - Para el contenido principal (Layout)
- `role="search"` - Para barras de búsqueda
- `role="form"` - Para formularios
- `role="dialog"` - Para diálogos y modales
- `role="presentation"` - Para elementos de presentación sin semántica
- `role="article"` - Para tarjetas de productos
- `role="status"` - Para mensajes de estado
- `role="alert"` - Para mensajes de alerta
- `role="region"` - Para regiones de contenido importante

#### Roles de Menú y Navegación
- `role="menu"` - Para menús desplegables
- `role="menuitem"` - Para items dentro de menús
- `role="menubar"` - Para barras de menú
- `role="list"` - Para listas (ej: carrusel)
- `role="listitem"` - Para items en listas

### 2. Propiedades ARIA

#### Etiquetado (aria-label, aria-labelledby)
```jsx
// Botones
aria-label="Ir al carrito"
aria-label="Eliminar producto"
aria-label="Cerrar formulario"

// Botones con iconos
aria-label="Ejecutar búsqueda"
aria-label="Página siguiente"
aria-label="Menú de utilidades"
```

#### Estados (aria-expanded, aria-selected, aria-checked)
```jsx
// Menús desplegables
aria-expanded={open}
aria-haspopup="menu"
aria-controls="menu-id"

// Paginación
aria-current="page"  // Para página actual
```

#### Validación (aria-invalid, aria-required, aria-describedby)
```jsx
// Inputs
aria-required="true"
aria-invalid={!isEmailValid}
aria-describedby="email-error"  // Conecta con mensaje de error

// Select/Dropdown
aria-required="true"
```

#### Estados de Carga (aria-busy)
```jsx
// Botones durante carga
aria-busy={loading}
```

#### Relaciones (aria-owns, aria-controls)
```jsx
// Menú controlado por botón
aria-controls="menu-id"

// Select con label
labelId="categoria-label"
```

### 3. Atributos de Accesibilidad Viva (Live Regions)

```jsx
// Actualizaciones dinámicas
aria-live="polite"   // Para cambios que el usuario debe notar
aria-live="assertive" // Para alertas urgentes
aria-live="off"      // Por defecto

// Ejemplos de uso
<p aria-live="polite" aria-label="Total actualizado">Total: $100</p>
<div role="alert" aria-live="assertive">{error}</div>
<div role="status" aria-live="polite">{successMessage}</div>
```

### 4. Clases CSS de Accesibilidad

#### Screen Reader Only (.sr-only)
```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

Uso para etiquetas ocultas visualmente pero accesibles para lectores de pantalla:
```jsx
<label htmlFor="email" className="sr-only">Correo electrónico</label>
<input id="email" type="email" />
```

### 5. Focus y Navegación por Teclado

```css
/* Focus visible - Mejorado en index.css */
button:focus-visible,
a:focus-visible,
input:focus-visible {
  outline: 3px solid #24044e;
  outline-offset: 2px;
}
```

- Todos los elementos interactivos son navegables por TAB
- El outline de focus es claramente visible

## Componentes Mejorados

### Login / Register
- ✅ Etiquetas conectadas a inputs con htmlFor
- ✅ aria-invalid en campos con error
- ✅ aria-describedby para mensajes de validación
- ✅ aria-busy durante envío de formulario
- ✅ Estructura h2 para encabezados

### Navbar / Subbar
- ✅ role="banner" en header
- ✅ role="navigation" en nav
- ✅ aria-label en botones con iconos
- ✅ aria-expanded en menús desplegables
- ✅ aria-haspopup="menu"

### Carrito
- ✅ role="region" para lista de productos
- ✅ role="article" para cada ítem
- ✅ aria-label descriptivo en items
- ✅ aria-live="polite" en total dinámico

### Checkout / Formularios
- ✅ role="form" en formularios
- ✅ aria-required="true" en campos obligatorios
- ✅ ID únicos para inputs y labels conectadas
- ✅ aria-label en selectores
- ✅ aria-live="polite" en cambios de total

### Paginación
- ✅ aria-label="Paginación de productos"
- ✅ aria-current="page" en página activa
- ✅ aria-label en botones anterior/siguiente
- ✅ role="menubar" para estructura de botones

### Búsqueda
- ✅ role="search"
- ✅ Etiqueta sr-only para campo de búsqueda
- ✅ aria-label en botón de búsqueda

### Carrusel de Productos
- ✅ role="region" en contenedor
- ✅ role="list" en track
- ✅ role="listitem" en items
- ✅ aria-label descriptivo en controles

## Mejores Prácticas Implementadas

### 1. Estructura Semántica
- Uso correcto de H1, H2, H3 (no de H4+ ni múltiples H1)
- Uso de `<main>`, `<header>`, `<footer>`, `<nav>`
- Uso de `<form>` para formularios
- Uso correcto de `<button>` vs `<a>`

### 2. Etiquetado de Inputs
Todos los inputs deben tener etiquetas asociadas:
```jsx
// Correcta
<label htmlFor="email-input">Email</label>
<input id="email-input" type="email" />

// O con sr-only para inputs visuales sin etiqueta
<label htmlFor="search" className="sr-only">Buscar</label>
<input id="search" />
```

### 3. Mensajes de Error y Estado
```jsx
// Conectar error a input
<input aria-describedby="email-error" aria-invalid={hasError} />
<p id="email-error" role="alert">{error}</p>
```

### 4. Atributos Hidden y aria-hidden
```jsx
// Ocultar iconos decorativos
<FaSearch className="icon" aria-hidden="true" />

// Ocultar completamente
<div hidden>...</div>
```

### 5. Botones vs Enlaces
```jsx
// Botón para acciones
<button onClick={handleClick}>Acción</button>

// Enlace para navegación
<a href="/path">Navegar</a>

// Botón debe tener aria-label descriptivo
<button aria-label="Eliminar producto">✕</button>
```

## Testing de Accesibilidad

### Herramientas Recomendadas
1. **axe DevTools** - Extensión para Chrome/Firefox
2. **WAVE** - Evaluador de accesibilidad
3. **Screen Reader** - NVDA (Windows) o JAWS
4. **Color Contrast Analyzer** - Verificar contraste

### Checklist de Accesibilidad
- [ ] Todos los botones tienen aria-label
- [ ] Todos los inputs tienen labels conectadas
- [ ] Menús tienen role="menu" y aria-expanded
- [ ] Iconos decorativos tienen aria-hidden
- [ ] Mensajes de error tienen role="alert"
- [ ] El sitio es navegable solo con teclado
- [ ] Focus es visible en todos los elementos
- [ ] Contraste de color cumple WCAG AA
- [ ] Imágenes tienen alt text descriptivo
- [ ] Formularios son validados con aria-invalid

## Normas WCAG 2.1

### Nivel A (Mínimo)
- ✅ Criterio 1.1.1 Contenido no textual
- ✅ Criterio 4.1.2 Nombre, rol, valor

### Nivel AA (Recomendado)
- ✅ Criterio 1.4.3 Contraste (mínimo)
- ✅ Criterio 2.1.1 Teclado
- ✅ Criterio 2.1.2 Sin trampa de teclado
- ✅ Criterio 2.4.3 Orden del foco
- ✅ Criterio 2.4.7 Focus visible

## Recursos Adicionales

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [MDN Web Docs - ARIA](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA)
- [WebAIM](https://webaim.org/)

## Notas de Mantenimiento

1. **Nuevos componentes**: Siempre agregar ARIA labels y roles apropiados
2. **Testing**: Probar con lectores de pantalla regularmente
3. **Contraste**: Mantener ratio WCAG AA mínimo 4.5:1
4. **Navegación**: Verificar orden de TAB lógico
5. **Mensajes dinámicos**: Usar aria-live apropiadamente

---

Última actualización: Noviembre 2025
