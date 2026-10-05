# TODO del equipo — EV2 Huerto Hogar React

## Rama 1: `feature/catalog-products-data`

Objetivo: construir la base de catálogo y productos.

Tareas:

- [ ] Ampliar `src/data/products.js` con más productos reales del ecommerce EV1.
- [ ] Agregar campo `categoria` consistente.
- [ ] Agregar campo `oferta` o similar para productos en oferta.
- [ ] Crear componente `ProductList`.
- [ ] Crear filtro por categoría.
- [ ] Crear búsqueda por nombre.
- [ ] Crear vista de categorías.
- [ ] Crear vista de ofertas.
- [ ] Crear vista detalle de producto.
- [ ] Implementar funciones CRUD simuladas sobre productos.
- [ ] Agregar tests de render, filtro, búsqueda y CRUD.

Archivos probables:

```txt
src/data/products.js
src/components/ProductCard.jsx
src/components/ProductList.jsx
src/components/CategoryFilter.jsx
src/pages/CategoriesPage.jsx
src/pages/OffersPage.jsx
src/pages/ProductDetailPage.jsx
```

## Rama 2: `feature/cart-checkout-flow`

Objetivo: completar carrito y flujo de compra.

Tareas:

- [x] Revisar y mejorar `CartSummary`.
- [x] Crear vista completa de carrito.
- [x] Persistir carrito con `localStorage`.
- [x] Crear formulario de checkout.
- [x] Validar datos del cliente.
- [x] Crear resumen de compra.
- [x] Crear vista compra exitosa.
- [x] Crear vista compra fallida.
- [x] Agregar tests de carrito, checkout y validaciones.

Archivos creados:

```txt
src/utils/formatCurrency.js
src/utils/cartCalculations.js
src/utils/cartStorage.js
src/utils/validators.js
src/utils/checkoutService.js
src/hooks/useCart.js
src/context/cartContext.js
src/context/CartProvider.jsx
src/pages/CartPage.jsx
src/pages/CheckoutPage.jsx
src/pages/OrderSuccessPage.jsx
src/pages/OrderFailurePage.jsx
src/test/cartFixtures.js
```

Archivos modificados:

```txt
src/components/CartSummary.jsx
src/App.jsx
```

### Decisiones que el equipo debe conocer

- **El estado del carrito ya no está en `App.jsx`.** Vive en el reducer de
  `src/context/CartProvider.jsx` y se consume con `useCart()`. Si otra rama
  necesita tocar el carrito, debe usar ese hook y no crear estado propio.
- **`App.jsx` navega con un estado `vista`, no con React Router.** Es
  transitorio hasta que la Rama 3 integre el router. Las páginas ya solo
  reciben `onNavigate`, así que la migración a `<Routes>` queda acotada a
  `App.jsx`. Ver la nota en la cabecera de ese archivo.
- **El total ya soporta ofertas:** los cálculos usan
  `getUnitPrice(item)`, que toma `precioOferta` si existe y `precio` si no.
  Cuando la Rama 1 agregue el campo `oferta`, el carrito no necesita cambios.
- **React-Bootstrap ya se usa** en carrito, checkout y páginas. No se cargó el
  JS de Bootstrap: React-Bootstrap resuelve el comportamiento en React.
- **Accesibilidad verificada:** los botones del carrito tienen
  `aria-label` con el nombre del producto, y el formulario declara
  `aria-invalid` y `aria-describedby` (react-bootstrap solo agrega la clase
  `is-invalid`, no el atributo).

### Pendientes que quedan para otras ramas

- **Rama 3:** navbar real, rutas con React Router y badge del carrito. Ya está
  expuesta la cantidad total en `useCart().count`.
- **Rama 4:** `README.md` está desactualizado. La sección "Estructura actual"
  necesita agregar `pages/`, `utils/`, `hooks/` y `context/`, y la descripción
  de `App.jsx` ya no dice "estado global inicial". También falta el documento
  de cobertura con los tests de esta rama.
- **Rama 1:** el bug de imágenes (`/images/*.jpg` en `products.js` contra
  archivos `.jpeg` reales) sigue sin corregir, por ser de esa rama.

## Rama 3: `feature/navigation-layout-public-pages`

Objetivo: crear navegación, layout y vistas públicas.

Tareas:

- [ ] Crear `AppNavbar` con React-Bootstrap.
- [ ] Crear `Footer`.
- [ ] Crear `MainLayout`.
- [ ] Integrar React Router si el equipo decide usar rutas.
- [ ] Crear Home.
- [ ] Crear páginas públicas necesarias.
- [ ] Revisar responsividad general.
- [ ] Adaptar diseño del template HTML entregado por el curso.
- [ ] Agregar tests básicos de navegación/render.

Archivos probables:

```txt
src/components/AppNavbar.jsx
src/components/Footer.jsx
src/layouts/MainLayout.jsx
src/pages/HomePage.jsx
src/pages/LoginPage.jsx
src/pages/RegisterPage.jsx
src/pages/ProfilePage.jsx
```

## Rama 4: `feature/testing-docs-coverage`

Objetivo: asegurar calidad, documentación y entrega.

Tareas:

- [ ] Mantener configuración de Vitest.
- [ ] Revisar que todos los tests pasen.
- [ ] Aumentar pruebas hasta llegar al menos a 10 tests relevantes.
- [ ] Crear documento de cobertura de testing.
- [ ] Actualizar README.
- [ ] Crear o actualizar ERS V2.
- [ ] Preparar checklist de presentación.
- [ ] Documentar decisión Vitest vs Jasmine/Karma.
- [ ] Revisar que `npm run build` pase antes de entrega.

Archivos probables:

```txt
README.md
docs/TESTING.md
docs/COVERAGE.md
docs/ERS_V2.md
docs/PRESENTATION_CHECKLIST.md
```

## Reglas generales para todos

- [ ] No trabajar directo en `main`.
- [ ] Crear rama desde `develop`.
- [ ] Escribir nombres claros.
- [ ] Comentar la lógica que no sea obvia.
- [ ] No duplicar lógica.
- [ ] No mutar estado directamente.
- [ ] Antes de mergear, correr:

```bash
npm run test -- --run
npm run build
```

## Preguntas que cada integrante debe poder responder

- ¿Qué componente hiciste?
- ¿Qué props recibe?
- ¿Dónde vive el estado?
- ¿Qué evento dispara?
- ¿Cómo se prueba?
- ¿Qué parte de la rúbrica cubre?
