# Huerto Hogar React — EV2 FullStack II

Proyecto frontend para la Evaluación Parcial 2 de Desarrollo FullStack II.

El objetivo es migrar el ecommerce anterior de Huerto Hogar a una aplicación React con Vite, Bootstrap, componentes reutilizables, navegación, estado, datos simulados y pruebas unitarias.

## Stack

- React
- Vite
- Bootstrap / React-Bootstrap
- Vitest
- React Testing Library
- jsdom

> Nota académica: la rúbrica menciona Jasmine/Karma, pero el docente recomendó usar Vitest. El equipo trabajará con Vitest y documentará esta decisión en el informe de testing.

## Instalación

```bash
npm install
```

## Ejecutar en desarrollo

```bash
npm run dev
```

## Ejecutar pruebas

Modo interactivo/watch:

```bash
npm run test
```

Ejecución única recomendada antes de mergear:

```bash
npm run test -- --run
```

## Build de producción

```bash
npm run build
```

## Estructura actual

```txt
src/
  components/       Componentes reutilizables: tarjetas, navbar, resumen de carrito
  context/          Contexto y provider del carrito
  data/             Datos simulados de productos
  hooks/            Hooks propios, como useCart
  layouts/          Layout principal con navbar, contenido y footer
  pages/            Vistas de catálogo, carrito, checkout y páginas públicas
  test/             Configuración global de pruebas
  utils/            Funciones puras: cálculos, validaciones, storage y checkout
  App.jsx           Enrutamiento principal con React Router
  main.jsx          Punto de montaje de React

docs/
  PLAN_EV2.md              Plan general de la evaluación
  BRANCH_WORKFLOW.md       Flujo de ramas y trabajo colaborativo
  TESTING.md               Manual de pruebas con Vitest
  TEAM_TODO.md             Reparto de trabajo por ramas
  COVERAGE.md              Documento de cobertura de testing
  ERS_V2.md                Especificación de requisitos actualizada
  PRESENTATION_CHECKLIST.md Checklist para presentación y defensa
```

## Flujo de trabajo del equipo

1. No trabajar directo sobre `main`.
2. Crear una rama `develop` para integración.
3. Crear ramas `feature/...` desde `develop`.
4. Antes de pedir merge:
   - correr `npm run test -- --run`;
   - correr `npm run build`;
   - revisar que el código esté comentado de forma clara cuando sea necesario.
5. Integrar mediante Pull Request.

Ver detalles en [`docs/BRANCH_WORKFLOW.md`](docs/BRANCH_WORKFLOW.md).

## Documentos importantes

- [`docs/PLAN_EV2.md`](docs/PLAN_EV2.md)
- [`docs/TEAM_TODO.md`](docs/TEAM_TODO.md)
- [`docs/TESTING.md`](docs/TESTING.md)
- [`docs/BRANCH_WORKFLOW.md`](docs/BRANCH_WORKFLOW.md)
