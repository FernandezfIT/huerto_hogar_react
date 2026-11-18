# Prompt para Figma — Presentación EV2 Huerto Hogar React

Copia y pega el siguiente prompt en Figma AI / herramienta de generación de presentación.

---

## Prompt

Crea una presentación interactiva para la EV2 del proyecto **Huerto Hogar ecommerce**. La presentación debe parecer una mini landing/app navegable, no una presentación plana tradicional. Usa como referencia estética la página actual del proyecto Huerto Hogar React.

### Estética visual obligatoria

Basar el diseño en una tienda ecommerce natural/orgánica:

- Paleta principal:
  - Verde esmeralda: `#2E8B57`
  - Verde hover/oscuro: `#246B45`
  - Amarillo mostaza para ofertas/destacados: `#D4A017`
  - Marrón/tierra para títulos: `#8B4513`
  - Fondo blanco suave: `#F7F7F7`
  - Texto principal: `#333333`
  - Texto secundario: `#666666`
- Estilo general:
  - limpio, natural, responsivo, tipo ecommerce moderno;
  - tarjetas con bordes suaves y sombra sutil;
  - botones verdes con esquinas redondeadas;
  - detalles amarillos para destacar ofertas o cambios importantes;
  - íconos simples relacionados con código, carrito, rutas, testing y productos;
  - usar ilustraciones simples tipo diagramas, no imágenes recargadas;
  - usar tipografía elegante para títulos similar a Playfair Display y sans-serif legible tipo Montserrat para cuerpo.

La presentación debe tener navegación mediante botones. Cada pantalla debe tener un botón visible para avanzar. En la sección de ramas debe haber cuadros clickeables y modales/interacciones.

---

# Estructura de la presentación

## 1. Home Page / Inicio

Diseñar una pantalla de portada con fondo claro, acentos verdes y algún elemento visual agrícola/huerto/ecommerce.

Contenido obligatorio:

- Título principal: **Huerto-Hogar ecommerce**
- Subtítulo: **Migración de HTML/CSS/JAVASCRIPT a REACT con VITEST**
- Asignatura: **FullStack 2 — Sección 015V**
- Integrantes:
  - Felipe Fernández
  - Claudio Novoa
  - Steven Dorta
  - Álvaro Moran

El nombre **Álvaro Moran** debe aparecer en gris, visualmente menos destacado que los demás.

Agregar botón principal:

- Texto: **Comenzar presentación**
- Acción: avanzar a la pantalla 2, Contexto.

---

## 2. Contexto

Pantalla breve y visual.

### 2.1 Descripción breve

Agregar un texto corto:

> Huerto Hogar es un ecommerce de productos frescos y naturales. En esta etapa migramos la versión anterior creada con HTML, CSS y JavaScript nativo hacia una aplicación React + Vite, incorporando componentes, rutas, estado global, carrito persistente y pruebas automatizadas con Vitest.

### 2.2 Ilustración del proceso de migración

Crear una ilustración central tipo flujo horizontal:

```txt
EV1
HTML + CSS + JavaScript
Páginas separadas + DOM manual
        ↓
EV2
React + Vite + Vitest
Componentes + rutas + tests
```

Representar la fase anterior con tres tarjetas o bloques:

- HTML
- CSS
- JavaScript

Representar la fase actual con tres tarjetas o bloques:

- React
- Vite
- Vitest

Entre ambas fases incluir una flecha grande con texto:

> Migración y reorganización

### 2.3 Botón

Botón inferior:

- Texto: **Ver estructura del proyecto**
- Acción: avanzar a la pantalla 3.

---

## 3. Estructura de proyecto

Pantalla comparativa entre estructura antigua y estructura actual.

### 3.1 Comparación ilustrativa

Diseñar dos columnas grandes.

Columna izquierda: **Antes — EV1 HTML/CSS/JS**

Mostrar estructura tipo árbol:

```txt
HuertoHogar/
  html/
    index.html
    tienda.html
    carrito.html
    login.html
  css/
    style.css
  js/
    tienda.js
    carrito.js
    login.js
  img/
```

Debajo agregar una etiqueta breve:

> Organización por tipo de archivo.

Columna derecha: **Ahora — EV2 React**

Mostrar estructura tipo árbol:

```txt
src/
  components/
  pages/
  context/
  hooks/
  utils/
  data/
  layouts/
  App.jsx
  main.jsx

docs/
  COVERAGE.md
  ERS_V2.md
  PRESENTATION_CHECKLIST.md
```

Debajo agregar una etiqueta breve:

> Organización por responsabilidad.

### 3.2 Texto breve

Agregar texto corto al centro o al pie:

> La nueva estructura mejora la legibilidad del repositorio: cada carpeta tiene una responsabilidad clara, los commits son más pequeños y precisos, y el trabajo por ramas permitió integrar catálogo, carrito, navegación y testing sin mezclar responsabilidades.

### 3.3 Botón

Botón inferior:

- Texto: **Ver ramas de trabajo**
- Acción: avanzar a la pantalla 4.

---

## 4. Presentación de las 4 ramas de trabajo

Crear una pantalla tipo dashboard con cuatro cuadros/tarjetas grandes. Cada tarjeta debe ser clickeable y abrir una ventana modal o cuadro de diálogo con la información de esa rama.

Título de pantalla:

> Ramas de trabajo EV2

Subtítulo:

> La migración se organizó en ramas para separar responsabilidades y facilitar integración, pruebas y revisión.

Tarjetas:

1. `feature/catalog-products-data`
2. `feature/cart-checkout-flow`
3. `feature/navigation-layout-public-pages`
4. `feature/testing-docs-coverage`

Cada tarjeta debe tener un ícono:

- Catálogo: caja/productos/lista.
- Carrito: carrito de compras.
- Navegación: rutas/mapa/navbar.
- Testing: check/test/tubo de ensayo.

Agregar botón inferior:

- Texto: **Ir a conclusión**
- Acción: avanzar a pantalla 5.

---

# Interacciones/modales por rama

Cada tarjeta de rama abre un modal grande centrado, con fondo semitransparente detrás. El modal debe tener:

- título de la rama;
- contenido principal;
- botón para cambiar de “antes” a “ahora” cuando corresponda;
- botón para ver código fundamental;
- botón para volver a la selección de ramas.

---

## Modal 1 — `feature/catalog-products-data`

Título visible:

> Catálogo, productos, categorías y ofertas

### Pantalla inicial del modal: diagrama “Antes”

Mostrar diagrama:

```txt
EV1 tienda.html
      ↓
Productos escritos/renderizados en HTML
      ↓
JavaScript busca elementos del DOM
      ↓
Muestra/oculta productos según texto o categoría
```

Texto breve:

> Antes, la lógica del catálogo dependía de elementos HTML ya existentes y de manipulación directa del DOM.

Botón:

- Texto: **Ver cómo funciona ahora**
- Acción: reemplazar diagrama por el diagrama “Ahora”.

### Estado “Ahora” del mismo modal

Mostrar diagrama:

```txt
src/data/products.js
      ↓
utils/catalog.js
 búsqueda + filtros + ofertas + CRUD simulado
      ↓
CatalogPage.jsx
      ↓
ProductList.jsx + ProductCard.jsx
      ↓
Detalle / Categorías / Ofertas
```

Texto breve:

> Ahora el catálogo nace desde datos estructurados. React filtra, busca y renderiza componentes reutilizables sin manipular directamente el DOM.

### Pantalla de código fundamental

Botón:

- Texto: **Ver código clave**
- Acción: mostrar una segunda pantalla dentro del modal con este código.

Código elegido como esencial:

```jsx
export function filterProducts({ categoria = null, query = '' } = {}, source = products) {
  return searchProducts(query, getProductsByCategory(categoria, source))
}

function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const categoria = searchParams.get('categoria')
  const busqueda = searchParams.get('q') ?? ''

  const productos = filterProducts({ categoria, query: busqueda }, products)

  return (
    <>
      <SearchBar query={busqueda} />
      <CategoryFilter selected={categoria} />
      <ProductList items={productos} onAddToCart={addItem} />
    </>
  )
}
```

Debajo del código agregar explicación corta:

> Esta es la parte central de la nueva lógica: primero se calcula la lista de productos según búsqueda y categoría, y luego React renderiza solamente los productos resultantes.

Botón:

- Texto: **Volver a ramas**
- Acción: cerrar modal y volver a pantalla 4.

---

## Modal 2 — `feature/cart-checkout-flow`

Título visible:

> Carrito y checkout

### Pantalla inicial del modal: diagrama “Antes”

Mostrar diagrama:

```txt
EV1 JavaScript nativo
      ↓
Funciones sueltas de carrito
      ↓
localStorage
      ↓
Manipulación directa del HTML
      ↓
Total y productos dibujados manualmente
```

Texto breve:

> Antes, el carrito dependía de scripts y manipulación directa de la página. La persistencia existía, pero estaba más acoplada al HTML.

Botón:

- Texto: **Ver cómo funciona ahora**
- Acción: reemplazar diagrama por el diagrama “Ahora”.

### Estado “Ahora” del mismo modal

Mostrar diagrama:

```txt
CartProvider.jsx
 estado global + reducer
      ↓
useCart()
 hook de acceso al carrito
      ↓
CartPage / CartSummary / CheckoutPage
      ↓
cartStorage + cartCalculations + validators
      ↓
Éxito o fallo de compra
```

Texto breve:

> Ahora el carrito vive en un contexto global. Las páginas consumen el estado mediante `useCart()` y la lógica de cálculos, storage y validaciones quedó separada en utilidades testeables.

### Pantalla de código fundamental

Botón:

- Texto: **Ver código clave**
- Acción: mostrar una segunda pantalla dentro del modal con este código.

Código elegido como esencial:

```jsx
function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <AppRoutes />
      </CartProvider>
    </BrowserRouter>
  )
}

export function useCart() {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error('useCart debe usarse dentro de un <CartProvider>.')
  }

  return context
}
```

Debajo del código agregar explicación corta:

> Esta estructura permite que catálogo, navbar, carrito y checkout usen el mismo estado sin duplicarlo ni pasarlo manualmente por muchas props.

Botón:

- Texto: **Volver a ramas**
- Acción: cerrar modal y volver a pantalla 4.

---

## Modal 3 — `feature/navigation-layout-public-pages`

Título visible:

> Navegación, layout y páginas públicas

### Pantalla inicial del modal: diagrama “Antes”

Mostrar diagrama:

```txt
EV1
index.html
 tienda.html
 carrito.html
 login.html
 perfil.html

Navegación con enlaces entre archivos HTML
```

Texto breve:

> Antes, cada pantalla era un archivo HTML distinto y la navegación dependía de enlaces entre páginas separadas.

Botón:

- Texto: **Ver cómo funciona ahora**
- Acción: reemplazar diagrama por el diagrama “Ahora”.

### Estado “Ahora” del mismo modal

Mostrar diagrama:

```txt
BrowserRouter
      ↓
AppRoutes
      ↓
MainLayout
 Navbar + Banner + Footer
      ↓
Home / Catálogo / Carrito / Checkout / Login / Registro / Perfil
```

Texto breve:

> Ahora la aplicación funciona como SPA con React Router. Las rutas cambian la vista sin separar el proyecto en múltiples archivos HTML.

### Pantalla de código fundamental

Botón:

- Texto: **Ver código clave**
- Acción: mostrar una segunda pantalla dentro del modal con este código.

Código elegido como esencial:

```jsx
<Routes>
  <Route element={<MainLayout />}>
    <Route index element={<HomePage />} />
    <Route path="catalogo" element={<CatalogPage />} />
    <Route path="categorias" element={<CategoriesPage />} />
    <Route path="ofertas" element={<OffersPage />} />
    <Route path="producto/:id" element={<DetalleDeProducto />} />
    <Route path="carrito" element={<CartPage onNavigate={navigateTo} />} />
    <Route path="checkout" element={<CheckoutPage />} />
    <Route path="login" element={<LoginPage />} />
    <Route path="registro" element={<RegisterPage />} />
    <Route path="perfil" element={<ProfilePage />} />
  </Route>
</Routes>
```

Debajo del código agregar explicación corta:

> La ruta define qué página se renderiza. `MainLayout` evita repetir navbar, banner y footer en cada pantalla.

Botón:

- Texto: **Volver a ramas**
- Acción: cerrar modal y volver a pantalla 4.

---

## Modal 4 — `feature/testing-docs-coverage`

Título visible:

> Testing, documentación y cobertura

### Pantalla inicial del modal

No usar diagrama antes/ahora obligatorio. Crear una pantalla dividida en dos columnas.

Columna izquierda:

> Antes: validación manual

Elementos:

```txt
Abrir navegador
Probar botones
Revisar visualmente
Detectar errores tarde
```

Columna derecha:

> Ahora: validación automatizada

Elementos:

```txt
Vitest
React Testing Library
jsdom
278 tests
build + lint
```

### Texto breve sobre Vitest frente a Karma/Jasmine

Agregar este texto:

> Se eligió Vitest porque se integra directamente con Vite y React, permite ejecutar pruebas rápidas, trabajar con React Testing Library y simular interacciones de usuario de forma simple. Karma/Jasmine pertenece a un flujo más antiguo y menos natural para proyectos modernos con Vite, por lo que Vitest facilita mantener pruebas cercanas al funcionamiento real de la interfaz.

Importante: no mencionar recomendación del profesor.

### Pantalla de código fundamental

Botón:

- Texto: **Ver código clave**
- Acción: mostrar una segunda pantalla dentro del modal con este código.

Código elegido como esencial:

```jsx
test('flujo completo: home → catálogo → carrito → checkout → éxito', async () => {
  const user = userEvent.setup()
  render(<App />)

  await user.click(screen.getByRole('link', { name: /catálogo/i }))
  await user.click(screen.getAllByRole('button', { name: /agregar al carrito/i })[0])

  expect(screen.getByRole('link', { name: /carrito\s*1/i })).toBeInTheDocument()

  await user.click(screen.getByRole('link', { name: /carrito\s*1/i }))
  await user.click(screen.getByRole('button', { name: /ir al checkout/i }))

  await user.type(screen.getByLabelText(/nombre completo/i), 'Ana Lopez')
  await user.type(screen.getByLabelText(/correo electrónico/i), 'ana.lopez@duoc.cl')
  await user.type(screen.getByLabelText(/teléfono/i), '+56912345678')
  await user.type(screen.getByLabelText(/dirección/i), 'Av. Siempre Viva 742')
  await user.click(screen.getByRole('button', { name: /confirmar compra/i }))

  expect(
    screen.getByRole('heading', { name: /compra realizada con éxito/i }),
  ).toBeInTheDocument()
})
```

Debajo del código agregar explicación corta:

> Este test recorre el flujo más importante como lo haría un usuario real: entra al catálogo, agrega un producto, pasa por carrito, completa checkout y confirma la compra.

Botón:

- Texto: **Volver a ramas**
- Acción: cerrar modal y volver a pantalla 4.

---

## 5. Conclusión

Pantalla final con diseño limpio, fondo claro, acentos verdes y un ícono de check o brote/planta.

Título:

> Conclusión

Texto breve:

> La migración permitió pasar desde una aplicación basada en páginas HTML y manipulación directa del DOM hacia una arquitectura React más clara, modular y testeable. Ahora el proyecto separa datos, componentes, páginas, estado global, utilidades y pruebas, lo que facilita mantener el código, explicar el funcionamiento y continuar creciendo sin desordenar la base del ecommerce.

Agregar tres tarjetas pequeñas como resumen:

1. **Más orden**
   - componentes, páginas, hooks y utils.
2. **Más control**
   - carrito global, rutas y validaciones.
3. **Más confianza**
   - Vitest, Testing Library, build y lint.

Botón final:

- Texto: **Fin de la presentación**
- Acción: volver al Home o cerrar flujo.

---

# Requisitos de prototipo

Configurar interacciones en Figma:

- Home → Contexto.
- Contexto → Estructura.
- Estructura → Ramas.
- Ramas → Conclusión.
- Cada tarjeta de rama abre su modal.
- En cada modal, el botón “Ver cómo funciona ahora” cambia el contenido del diagrama.
- En cada modal, el botón “Ver código clave” muestra la pantalla de código dentro del mismo modal.
- En cada modal, el botón “Volver a ramas” cierra el modal.
- Conclusión puede volver al Home.

Mantener la presentación visual, breve y muy apoyada en diagramas/código. Evitar exceso de texto plano.
