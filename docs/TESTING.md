# Testing con Vitest

## Decisión del proyecto

Aunque la rúbrica menciona Jasmine/Karma, el docente recomendó Vitest. Por eso este proyecto usa Vitest para pruebas unitarias de componentes React.

## Herramientas

- **Vitest**: ejecuta las pruebas.
- **React Testing Library**: renderiza componentes y permite consultar/interactuar con el DOM.
- **jsdom**: simula un navegador dentro de Node.
- **jest-dom**: agrega matchers como `toBeInTheDocument()`.
- **vi.fn()**: crea funciones falsas o mocks.

## Comandos

Modo watch/interactivo:

```bash
npm run test
```

Ejecución única:

```bash
npm run test -- --run
```

## Configuración actual

`vite.config.js`:

```js
test: {
  environment: 'jsdom',
  setupFiles: './src/test/setup.js',
}
```

`src/test/setup.js`:

```js
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

afterEach(() => {
  cleanup()
})
```

`cleanup()` desmonta los componentes después de cada test para que un render anterior no contamine al siguiente.

## Convención de nombres

Los tests deben ir cerca del componente probado:

```txt
src/components/ProductCard.jsx
src/components/ProductCard.test.jsx
```

Vitest detecta archivos con:

- `.test.jsx`
- `.spec.jsx`

## Qué probar

Priorizar comportamientos visibles y relevantes:

- render de datos;
- props recibidas;
- eventos de usuario;
- cambios de estado;
- formularios;
- validaciones;
- mensajes de error;
- carrito;
- checkout;
- CRUD de datos simulados.

## Ejemplo de mock

```js
const onAddToCart = vi.fn()
```

Sirve para verificar:

```js
expect(onAddToCart).toHaveBeenCalledTimes(1)
expect(onAddToCart).toHaveBeenCalledWith(product)
```

## Consultas recomendadas

Preferir consultas parecidas a cómo un usuario entiende la pantalla:

```js
screen.getByRole('button', { name: /agregar al carrito/i })
screen.getByRole('heading', { name: /manzanas fuji/i })
```

Evitar consultas demasiado frágiles cuando hay alternativas más semánticas.

## Meta de la rúbrica

La rúbrica exige hasta 10 pruebas para el máximo nivel. Meta del equipo:

- mínimo 10 pruebas relevantes;
- cubrir catálogo, carrito, checkout, formularios y navegación crítica;
- documentar qué cubre cada prueba;
- incluir resultados en el documento de cobertura.

## Documento de cobertura

El documento de cobertura debe explicar:

- qué componentes fueron probados;
- qué comportamiento valida cada test;
- qué mocks se usaron;
- resultados de ejecución;
- limitaciones;
- justificación de Vitest frente a Jasmine/Karma por recomendación docente.
