# TODO del equipo — EV2 Huerto Hogar React

## Rama 1: `feature/catalog-products-data`

Objetivo: construir la base de catálogo y productos.

Tareas:

- [~] Ampliar `src/data/products.js` con más productos reales del ecommerce EV1.
      Sigue teniendo los 7 productos del enunciado. Lo que sí se agregó son los
      campos que el enunciado pedía sin completar: `precioOferta` en FR001, VR001
      y VR003, `origen` en los 7 y `descripcion` en los 7.
- [x] Agregar campo `categoria` consistente.
- [x] Agregar campo `oferta` o similar para productos en oferta.
      Se llama `precioOferta` y es numérico, no un booleano `oferta`. El estado
      "está en oferta" se deduce de `precioOferta !== undefined`.
- [x] Crear componente `ProductList`.
- [x] Crear filtro por categoría.
- [x] Crear búsqueda por nombre.
- [x] Crear vista de categorías.
- [x] Crear vista de ofertas.
- [x] Crear vista detalle de producto.
- [x] Implementar funciones CRUD simuladas sobre productos.
- [x] Agregar tests de render, filtro, búsqueda y CRUD.

Archivos creados:

```txt
src/data/categories.js
src/utils/catalog.js
src/utils/catalog.test.js
src/components/ProductList.jsx
src/components/ProductList.test.jsx
src/components/CategoryFilter.jsx
src/components/CategoryFilter.test.jsx
src/components/SearchBar.jsx
src/components/SearchBar.test.jsx
src/pages/CatalogPage.jsx
src/pages/CatalogPage.test.jsx
src/pages/CategoriesPage.jsx
src/pages/CategoriesPage.test.jsx
src/pages/OffersPage.jsx
src/pages/OffersPage.test.jsx
src/pages/ProductDetailPage.jsx
src/pages/ProductDetailPage.test.jsx
```

Archivos modificados:

```txt
src/App.jsx
src/App.test.jsx
src/components/ProductCard.test.jsx
src/pages/CatalogPage.jsx
src/pages/CatalogPage.test.jsx
src/pages/HomePage.jsx
docs/COVERAGE.md
```

### Decisiones que el equipo debe conocer de la Rama 1

- **El CRUD no tiene panel de administración.** Son funciones puras en
  `src/utils/catalog.js`: `validateProduct`, `createProduct`, `getProductById`,
  `updateProduct` y `deleteProduct`. Cubren el requisito de la rúbrica sin
  inventar una vista que los documentos no piden.
- **El CRUD trabaja sobre una copia, nunca sobre el catálogo real.** Todas las
  funciones reciben `source` y devuelven un array nuevo. Hay un test que llama las
  tres sobre `products` y verifica que el import queda intacto.
- **`updateProduct` no puede cambiar el `id`.** Aunque se le pase un `id`
  distinto en los cambios, se conserva el original: la ruta de la ficha y las
  líneas del carrito lo usan como referencia.
- **El CRUD valida contra el mismo contrato que el catálogo real.** Las reglas de
  `validateProduct` son las que verifica `src/data/products.test.js`. Así nunca
  se puede crear un producto que la suite del catálogo rechace.
- **Los filtros del catálogo viven en la URL, no en `useState`.** `CatalogPage`
  lee `?categoria=` y `?q=` con `useSearchParams`. Sin esto, el enlace de cada
  categoría en `CategoriesPage` llegaría al catálogo sin filtrar.
- **`CatalogPage` tolera una URL manipulada.** Si `?categoria=` trae una categoría
  que no existe, muestra el estado vacío en vez de romper.
- **La ficha de producto recibe el `id` por props.** El `useParams` vive en un
  adaptador chico en `App.jsx`, para que la página se pueda montar en un test sin
  router.

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
- ~~**`App.jsx` navega con un estado `vista`, no con React Router.**~~
  **Desactualizado:** la Rama 3 ya integró React Router y `App.jsx` usa
  `<Routes>` con `<MainLayout />` como ruta de layout. La nota de la cabecera de
  ese archivo quedó vieja y hay que corregirla.
- **El total ya soporta ofertas:** los cálculos usan
  `getUnitPrice(item)`, que toma `precioOferta` si existe y `precio` si no.
  La Rama 1 confirmó que el carrito no necesitó cambios al agregar `precioOferta`.
- **React-Bootstrap ya se usa** en carrito, checkout y páginas. No se cargó el
  JS de Bootstrap: React-Bootstrap resuelve el comportamiento en React.
- **Accesibilidad verificada:** los botones del carrito tienen
  `aria-label` con el nombre del producto, y el formulario declara
  `aria-invalid` y `aria-describedby` (react-bootstrap solo agrega la clase
  `is-invalid`, no el atributo).

### Estado de las otras ramas

Las ramas están apiladas: cada una nace del *tip* de la anterior, así que esta
rama ya contiene todo el trabajo de la Rama 2 y de la Rama 3.

- **Rama 3 — completada.** `AppNavbar`, `MainLayout`, Home, Login, Registro,
  Perfil y React Router ya están integrados en `AppRoutes`. El badge del
  carrito usa `useCart().count`.
- **Rama 4 — completada.** Se integró `origin/develop` en esta rama, con lo
  cual llegaron `COVERAGE.md`, `ERS_V2.md`, `PRESENTATION_CHECKLIST.md` y el
  `README.md` corregido.
- **Rama 1 — completada.** Catálogo con filtros y búsqueda, vista de categorías,
  vista de ofertas, ficha de producto, CRUD simulado y filtros en la URL.
- **Rama 1 — el bug de imágenes ya está corregido** en el commit `09ed172`:
  las rutas pasaron de `.jpg` a `.jpeg`, que es la extensión real de los
  archivos en `public/images`. Además ese commit agregó `precioOferta` a
  Manzanas Fuji, por lo que el carrito ya cobra $990 y no $1.200.
- **Rama 1 — el enlace a la ficha estaba roto y ya no.** `ProductCard` enlazaba
  a `/producto/:id` sin que esa ruta existiera, así que el catch-all mandaba a
  Home en silencio. La ruta se agregó y el test de `ProductCard` ahora navega de
  verdad en vez de solo revisar el `href`.

### Pendientes de coordinación entre ramas

- **`COVERAGE.md` ya se actualizó con la Rama 1.** La tabla enumera los 22
  archivos de test reales (275 tests), no los 13 que decía antes. Cerrado en esta
  rama.
- **`main` y `develop` no divergieron: `main` está 22 commits atrás.**
  `git rev-list --left-right --count main...develop` devuelve `0 22`, o sea que
  `main` es ancestro directo de `develop`. El PR #1 se fusionó en `main` y después
  el trabajo siguió en `develop`, que es la rama de integración según
  `BRANCH_WORKFLOW.md`. No hace falta decidir nada: cuando la entrega esté lista
  se integra `develop` en `main`.

## Rama 3: `feature/navigation-layout-public-pages`

Objetivo: crear navegación, layout y vistas públicas.

Tareas:

- [x] Crear `AppNavbar` con React-Bootstrap.
- [~] Crear `Footer`. El footer existe y se ve en pantalla, pero va **inline**
      dentro de `src/layouts/MainLayout.jsx`. No hay `src/components/Footer.jsx`.
      Si se quiere como componente reutilizable, hay que extraerlo.
- [x] Crear `MainLayout`.
- [x] Integrar React Router si el equipo decide usar rutas.
- [x] Crear Home.
- [x] Crear páginas públicas necesarias.
- [~] Revisar responsividad general. `AppNavbar`, `CatalogPage`, `HomePage` y las
      páginas nuevas usan `xs`/`sm`/`md`/`lg`, pero no hay una revisión
      registrada de la app completa ni prueba de viewport.
- [ ] Adaptar diseño del template HTML entregado por el curso. No hay evidencia
      de que se haya trabajado sobre ese template.
- [x] Agregar tests básicos de navegación/render.
      Cubierto por `src/components/AppNavbar.test.jsx` y `src/App.test.jsx`.

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

- [x] Mantener configuración de Vitest. `vite.config.js` con `environment: 'jsdom'`
      y `setupFiles`; `src/test/setup.js` importa jest-dom y hace `cleanup`.
- [x] Revisar que todos los tests pasen. Verificado: 22 archivos, 275 tests.
- [x] Aumentar pruebas hasta llegar al menos a 10 tests relevantes. La meta de la
      rúbrica era 10; hay 275.
- [x] Crear documento de cobertura de testing.
- [~] Actualizar README. Tiene stack, comandos, árbol de carpetas y flujo de
      trabajo, pero le faltan los enlaces a `COVERAGE.md`, `ERS_V2.md` y
      `PRESENTATION_CHECKLIST.md`, una tabla de rutas y una sección de
      limitaciones que los criterios de aceptación del ERS sí exigen.
- [~] Crear o actualizar ERS V2. El documento existe y quedó sin el bloque de
      código que lo dejaba ilegible, pero **no menciona** el catálogo filtrable,
      la búsqueda, las vistas de categorías y ofertas, la ficha de producto ni el
      CRUD, que ya están implementados.
- [x] Preparar checklist de presentación. También se le quitó el bloque de
      código que lo dejaba renderizado como texto plano.
- [x] Documentar decisión Vitest vs Jasmine/Karma.
- [x] Revisar que `npm run build` pase antes de entrega. Verificado.

Archivos probables:

```txt
README.md
docs/TESTING.md
docs/COVERAGE.md
docs/ERS_V2.md
docs/PRESENTATION_CHECKLIST.md
```

## Reglas generales para todos

- [x] No trabajar directo en `main`.
- [x] Crear rama desde `develop`.
- [x] Escribir nombres claros.
- [x] Comentar la lógica que no sea obvia.
- [x] No duplicar lógica.
- [x] No mutar estado directamente. El CRUD del catálogo copia la fuente y
      devuelve un array nuevo; hay un test que lo verifica.
- [x] Antes de mergear, correr:

```bash
npm run test -- --run
npm run build
npm run lint
```

`npm run lint` se agregó porque ningún checklist lo tenía y detecta problemas que
el build no ve.

## Preguntas que cada integrante debe poder responder

- ¿Qué componente hiciste?
- ¿Qué props recibe?
- ¿Dónde vive el estado?
- ¿Qué evento dispara?
- ¿Cómo se prueba?
- ¿Qué parte de la rúbrica cubre?
