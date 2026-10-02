# Plan EV2 — Huerto Hogar React

## Objetivo

Migrar el ecommerce anterior de Huerto Hogar a una aplicación React moderna, manteniendo la lógica principal de tienda online y agregando componentes reutilizables, navegación, formularios, carrito, datos simulados, responsividad y pruebas unitarias.

## Entregables EV2

Según la rúbrica e instrucciones:

- Enlace GitHub público del proyecto frontend actualizado.
- Proyecto frontend comprimido.
- Documento ERS actualizado V2.
- Documento de cobertura de testing.
- Presentación del caso.
- Defensa individual mediante preguntas del docente.

## Requisitos principales

- Framework moderno JavaScript: React.
- Componentes con props y state.
- Diseño responsivo con Bootstrap.
- Migración desde HTML/CSS/JS anterior hacia componentes React.
- Archivo JavaScript como fuente de datos simulada.
- Funciones CRUD sobre datos simulados.
- Navegación y vistas adicionales.
- Formularios y validaciones.
- Pruebas unitarias para componentes frontend.
- Uso de mocks y análisis de resultados.

## Decisión de testing

La rúbrica menciona Jasmine/Karma, pero el docente recomendó Vitest. El equipo usará:

- Vitest como test runner.
- React Testing Library para renderizar e interactuar con componentes.
- jsdom como DOM simulado.
- `vi.fn()` para mocks.

Esta decisión debe explicarse en el documento de testing.

## Ramas principales de trabajo

### 1. `feature/catalog-products-data`

Responsable de catálogo, categorías, ofertas y datos simulados.

Incluye:

- estructura de productos;
- categorías;
- ofertas;
- filtros/búsqueda;
- detalle de producto;
- funciones CRUD de productos en JS;
- tests asociados.

### 2. `feature/cart-checkout-flow`

Responsable de carrito y flujo de compra.

Incluye:

- carrito;
- aumentar/disminuir/eliminar productos;
- persistencia con `localStorage`;
- vista de carrito;
- checkout;
- compra exitosa/fallida;
- resumen de compra;
- tests asociados.

### 3. `feature/navigation-layout-public-pages`

Responsable de navegación, layout y vistas públicas.

Incluye:

- Navbar;
- Footer;
- layout general;
- rutas;
- home;
- páginas públicas;
- responsividad visual;
- integración con Bootstrap/React-Bootstrap;
- tests asociados cuando corresponda.

### 4. `feature/testing-docs-coverage`

Responsable de testing, documentación y soporte de entrega.

Incluye:

- configuración de Vitest;
- pruebas transversales;
- documento de cobertura;
- README;
- ERS actualizado;
- checklist de presentación;
- revisión de calidad antes de merge.

## Criterios de calidad comunes

Cada rama debe procurar:

- componentes con responsabilidad clara;
- nombres descriptivos;
- props explícitas;
- estado solo donde sea necesario;
- comentarios breves en lógica no obvia;
- pruebas para comportamientos críticos;
- ejecución correcta de `npm run test -- --run`;
- ejecución correcta de `npm run build`.

## Riesgos a controlar

- Conflictos por editar los mismos archivos centrales.
- Mezclar muchas responsabilidades en un componente.
- No documentar decisiones de testing.
- No llegar a 10 pruebas efectivas para la rúbrica.
- Que cada integrante no pueda explicar su parte en la presentación.

## Próximo paso recomendado

1. Crear `develop` desde `main`.
2. Mergear esta base de documentación a `develop`.
3. Crear las 4 ramas desde `develop`.
4. Asignar una rama a cada integrante.
