# Guion de presentación EV2 — Huerto Hogar React

**Proyecto:** Huerto Hogar ecommerce  
**Asignatura:** FullStack 2 — Sección 015V  
**Objetivo:** apoyar la exposición oral, anticipar preguntas y reforzar conceptos técnicos clave.

---

## 1. Guion por pantalla de la presentación

### Página 1 — Home Page / Inicio

**Objetivo de la pantalla:** abrir la presentación, presentar el proyecto, el foco de la EV2 y el equipo.

**Guion sugerido:**

> Buenos días/tardes. Somos el equipo de Huerto Hogar ecommerce. En esta EV2 trabajamos sobre la migración del proyecto que venía desde la EV1, donde estaba construido con HTML, CSS y JavaScript nativo. Ahora lo llevamos a una base en React con Vite, incorporando navegación con React Router, componentes reutilizables, carrito con estado global, pruebas automatizadas con Vitest y una estructura de repositorio más ordenada.
>
> La idea de esta presentación no es solo mostrar el resultado visual, sino explicar cómo fue el proceso de migración: qué teníamos antes, qué problema presentaba ese enfoque y cómo lo resolvimos ahora en React.

**Puntos que deben quedar claros:**

- Proyecto: Huerto Hogar ecommerce.
- Migración: HTML/CSS/JavaScript -> React + Vite + Vitest.
- Equipo: Felipe Fernández, Claudio Novoa, Steven Dorta y Álvaro Moran.
- Álvaro aparece en gris porque no tuvo el mismo nivel de participación o se quiere distinguir visualmente su estado dentro del equipo.

**Transición:**

> Primero vamos a contextualizar brevemente en qué consiste el proyecto y cuál fue el cambio principal de esta etapa.

---

### Página 2 — Contexto

**Objetivo de la pantalla:** explicar muy brevemente el propósito del proyecto y la migración.

**Guion sugerido:**

> Huerto Hogar es un ecommerce orientado a productos frescos y naturales. En la versión anterior, la aplicación estaba separada en páginas HTML, estilos CSS y scripts JavaScript. Esa estructura funcionaba para una primera versión, pero a medida que el proyecto crece se vuelve más difícil mantener la lógica, reutilizar partes de la interfaz y probar el comportamiento.
>
> Por eso en esta etapa migramos a React. El cambio principal es que dejamos de pensar en páginas sueltas y empezamos a pensar en componentes, estado, rutas y funciones reutilizables. Además, incorporamos Vitest para validar automáticamente los flujos principales.

**Cómo explicar la ilustración:**

- Lado izquierdo: EV1 con HTML, CSS y JavaScript.
- Centro: proceso de migración.
- Lado derecho: EV2 con React, Vite y Vitest.

**Frase clave:**

> No fue solo cambiar sintaxis; fue reorganizar responsabilidades.

**Transición:**

> Para entender mejor esa reorganización, ahora veremos cómo cambió la estructura del proyecto.

---

### Página 3 — Estructura de proyecto

**Objetivo de la pantalla:** comparar estructura anterior y actual, destacando orden y legibilidad.

**Guion sugerido:**

> En la EV1 la organización estaba más centrada en el tipo de archivo: una carpeta para HTML, otra para CSS, otra para JavaScript y otra para imágenes. Eso es común en proyectos iniciales, pero provoca que la lógica de una misma funcionalidad quede repartida entre una página HTML, un archivo CSS y un script.
>
> En la versión React reorganizamos el proyecto por responsabilidades. Por ejemplo, los componentes reutilizables están en `components`, las vistas completas en `pages`, el estado compartido del carrito en `context`, los hooks en `hooks`, las funciones puras en `utils` y los datos simulados en `data`.
>
> Esto también ayudó a trabajar con ramas y commits más claros. En lugar de mezclar catálogo, carrito, navegación y testing en un solo bloque, cada rama resolvió una parte concreta y eso hizo más fácil revisar, probar e integrar.

**Puntos que deben quedar claros:**

- Antes: organización por tipo de archivo.
- Ahora: organización por responsabilidad.
- Mejoras: legibilidad, mantenibilidad, commits más claros, integración por ramas.

**Transición:**

> Esa división se reflejó directamente en las cuatro ramas de trabajo que usamos para construir la EV2.

---

### Página 4 — Dashboard de ramas

**Objetivo de la pantalla:** presentar las cuatro ramas como división del trabajo.

**Guion sugerido:**

> La migración se organizó en cuatro ramas principales. Cada una tomó una responsabilidad distinta del proyecto.
>
> La primera rama se enfocó en catálogo, productos, categorías, ofertas, búsqueda y CRUD simulado. La segunda en carrito y checkout. La tercera en navegación, layout y páginas públicas. La cuarta en testing, documentación y cobertura.
>
> Ahora revisaremos cada rama con la misma lógica: cómo funcionaba antes, cómo funciona ahora y cuál fue el código clave que permitió ese cambio.

**Orden recomendado de exposición:**

1. Catálogo.
2. Carrito y checkout.
3. Navegación y layout.
4. Testing y documentación.

---

## 2. Guion por modal de rama

### Modal 1 — `feature/catalog-products-data`

**Título:** Catálogo, productos, categorías y ofertas.

#### Vista “Antes”

**Guion sugerido:**

> Antes, el catálogo dependía de elementos HTML ya dibujados en la página. Para buscar o filtrar, JavaScript recorría el DOM, leía el texto de cada producto y mostraba u ocultaba elementos. Eso funciona, pero mezcla mucho la lógica con la estructura visual.

**Explicación del diagrama antes:**

```txt
HTML con productos
-> JavaScript selecciona elementos del DOM
-> compara textos
-> muestra u oculta productos
```

#### Vista “Ahora”

**Guion sugerido:**

> Ahora el catálogo nace desde datos estructurados en `products.js`. Después, las funciones de `utils/catalog.js` filtran, buscan, detectan ofertas y permiten CRUD simulado. Finalmente, React renderiza la lista resultante mediante `CatalogPage`, `ProductList` y `ProductCard`.
>
> La diferencia es que ya no manipulamos el DOM directamente. Primero calculamos qué productos corresponden y luego React se encarga de renderizarlos.

**Explicación del diagrama ahora:**

```txt
products.js
-> utils/catalog.js
-> CatalogPage
-> ProductList + ProductCard
-> Detalle, categorías y ofertas
```

#### Código clave

**Código recomendado para mostrar:**

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

**Cómo explicarlo:**

> Este código es clave porque resume el nuevo funcionamiento del catálogo. La página lee los filtros desde la URL, calcula los productos con `filterProducts` y luego renderiza la lista. Esto mejora la mantenibilidad porque búsqueda, categoría y renderizado no están mezclados en un mismo bloque de DOM manual.

**Cierre de rama:**

> Esta rama dejó el catálogo preparado para trabajar con productos, categorías, ofertas, detalle de producto y CRUD simulado, todo con funciones testeables.

---

### Modal 2 — `feature/cart-checkout-flow`

**Título:** Carrito y checkout.

#### Vista “Antes”

**Guion sugerido:**

> En la versión anterior, el carrito dependía de funciones JavaScript más acopladas a la página y a `localStorage`. La lógica de agregar productos, leer el carrito, calcular totales y mostrar datos estaba más cerca de la manipulación directa del HTML.

**Explicación del diagrama antes:**

```txt
Funciones JS sueltas
-> localStorage
-> manipulación directa del HTML
-> total y productos dibujados manualmente
```

#### Vista “Ahora”

**Guion sugerido:**

> En React movimos el estado del carrito a `CartProvider`. Esto significa que el carrito vive en un contexto global y puede ser usado por el catálogo, el navbar, la página del carrito y el checkout sin duplicar estado.
>
> Además, la lógica se separó en utilidades: cálculos del carrito, persistencia en localStorage, validadores y servicio de checkout.

**Explicación del diagrama ahora:**

```txt
CartProvider
-> useCart
-> CartPage / CartSummary / CheckoutPage
-> cartStorage / cartCalculations / validators
-> éxito o fallo de compra
```

#### Código clave

**Código recomendado para mostrar:**

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

**Cómo explicarlo:**

> Este bloque muestra la base de la nueva mecánica del carrito. `CartProvider` envuelve la aplicación y `useCart()` permite que cualquier componente autorizado consuma el estado y las acciones del carrito. Así evitamos pasar datos manualmente por muchas props y evitamos tener carritos duplicados.

**Cierre de rama:**

> Esta rama hizo que el flujo de compra quedara más ordenado: agregar productos, modificar cantidades, persistir en localStorage, validar el checkout y mostrar éxito o fallo de compra.

---

### Modal 3 — `feature/navigation-layout-public-pages`

**Título:** Navegación, layout y páginas públicas.

#### Vista “Antes”

**Guion sugerido:**

> Antes la navegación funcionaba como enlaces entre archivos HTML separados: `index.html`, `tienda.html`, `carrito.html`, `login.html`, `perfil.html`. Cada vista era una página distinta.

**Explicación del diagrama antes:**

```txt
index.html
-> tienda.html
-> carrito.html
-> login.html
-> perfil.html
```

#### Vista “Ahora”

**Guion sugerido:**

> Ahora usamos React Router. La aplicación funciona como una SPA, es decir, una aplicación de una sola página donde React cambia la vista según la ruta. Además, `MainLayout` concentra navbar, banner y footer para no repetir esa estructura en cada página.

**Explicación del diagrama ahora:**

```txt
BrowserRouter
-> AppRoutes
-> MainLayout
-> Home / Catálogo / Carrito / Checkout / Login / Registro / Perfil
```

#### Código clave

**Código recomendado para mostrar:**

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

**Cómo explicarlo:**

> Este código reemplaza la navegación entre archivos HTML. Cada ruta renderiza una página distinta dentro del mismo layout. Esto nos permite mantener una navegación más ordenada y una experiencia más fluida.

**Cierre de rama:**

> Esta rama dejó lista la estructura visual principal: navbar, banner, footer, home, páginas públicas y rutas internas.

---

### Modal 4 — `feature/testing-docs-coverage`

**Título:** Testing, documentación y cobertura.

#### Explicación inicial

**Guion sugerido:**

> En la versión anterior, la validación era principalmente manual: abrir la página, probar botones, revisar si el carrito funcionaba y detectar errores visualmente. En esta EV2 agregamos pruebas automatizadas con Vitest y React Testing Library.
>
> Elegimos Vitest porque se integra naturalmente con Vite y React, permite pruebas rápidas, usa `jsdom` para simular el navegador y funciona muy bien con Testing Library. Karma y Jasmine pertenecen a un flujo más antiguo y menos directo para un proyecto moderno con Vite.

**Frase clave:**

> Los tests nos permiten comprobar flujos importantes sin depender solo de revisión manual.

#### Código clave

**Código recomendado para mostrar:**

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

**Cómo explicarlo:**

> Este test es importante porque reproduce el flujo principal como lo haría un usuario: entra al catálogo, agrega un producto, pasa al carrito, completa el checkout y confirma la compra. Si una parte de ese flujo se rompe, el test falla.

**Cierre de rama:**

> Finalmente validamos el proyecto con test, build y lint. La validación final en `main` pasó con 23 archivos de test y 278 pruebas.

---

### Página 5 — Conclusión

**Objetivo de la pantalla:** cerrar con reflexión breve sobre ventajas de la nueva mecánica.

**Guion sugerido:**

> Como conclusión, la migración nos permitió pasar de una aplicación basada en páginas HTML y manipulación directa del DOM a una arquitectura React más modular, clara y testeable.
>
> La principal ventaja es la separación de responsabilidades. Los datos están en `data`, los componentes reutilizables en `components`, las páginas en `pages`, el carrito en `context`, las reglas en `utils` y las pruebas en archivos especializados.
>
> Esto hace que el proyecto sea más fácil de mantener, más fácil de explicar y más seguro para seguir creciendo. Si mañana queremos mejorar el catálogo, el carrito o las pruebas, sabemos dónde tocar sin desordenar toda la aplicación.

**Cierre final:**

> En resumen, no solo migramos la interfaz a React; reorganizamos el funcionamiento del proyecto para que sea más claro, mantenible y verificable.

---

# 2. Glosario técnico imprescindible

## React
Librería de JavaScript para construir interfaces mediante componentes reutilizables. En el proyecto reemplaza la lógica basada en páginas HTML separadas.

## Vite
Herramienta de desarrollo y construcción. Permite levantar el proyecto rápido con `npm run dev` y generar versión productiva con `npm run build`.

## Vitest
Framework de pruebas integrado con Vite. Se usa para ejecutar pruebas unitarias e integración.

## React Testing Library
Librería para probar componentes React desde la perspectiva del usuario: buscar textos, botones, links, escribir en formularios y hacer clicks.

## jsdom
Entorno que simula el DOM del navegador dentro de Node.js. Permite probar componentes sin abrir un navegador real.

## DOM
Representación en memoria de la estructura HTML de una página. En JavaScript nativo se manipulaba directamente; en React se evita tocarlo manualmente.

## Componente
Pieza reutilizable de interfaz. Ejemplos: `ProductCard`, `ProductList`, `AppNavbar`, `CartSummary`.

## Props
Datos o funciones que un componente recibe desde su padre. Ejemplo: `ProductCard` recibe `product` y `onAddToCart`.

## State / Estado
Datos que pueden cambiar durante la ejecución y provocar que React vuelva a renderizar la interfaz.

## Hook
Función especial de React o personalizada. Ejemplos: `useState`, `useContext`, `useCart`, `useSearchParams`.

## Context
Mecanismo de React para compartir datos globales sin pasar props manualmente por muchos niveles. Se usa para el carrito.

## Provider
Componente que entrega un contexto a sus hijos. `CartProvider` entrega el estado y acciones del carrito.

## Reducer
Función que recibe un estado actual y una acción, y devuelve un nuevo estado. Se usa en el carrito para centralizar acciones.

## SPA
Single Page Application. Aplicación que no cambia entre archivos HTML separados, sino que React cambia las vistas internamente.

## React Router
Librería para manejar rutas en React. Permite rutas como `/catalogo`, `/carrito`, `/checkout` y `/producto/:id`.

## Route
Declaración de una ruta y la pantalla que debe renderizar.

## Layout
Estructura común de varias páginas. En el proyecto, `MainLayout` contiene navbar, banner, contenido y footer.

## localStorage
Almacenamiento local del navegador. En el proyecto se usa para persistir el carrito.

## CRUD
Create, Read, Update, Delete. Operaciones básicas para crear, leer, actualizar y eliminar datos. En el catálogo se implementó como CRUD simulado con funciones puras.

## Función pura
Función que no modifica datos externos y devuelve un resultado a partir de sus entradas. Ejemplo: filtros del catálogo y cálculos del carrito.

## Mock
Simulación usada en pruebas para reemplazar una función real o validar que fue llamada.

## Fixture
Datos de prueba reutilizables. Sirven para no repetir objetos grandes en varios tests.

## Build
Proceso que genera la versión optimizada para producción.

## Lint
Revisión automática de problemas de estilo, errores o malas prácticas en el código.

## Branch / Rama
Línea de trabajo separada en Git. Se usaron ramas para catálogo, carrito, navegación y testing.

## Merge
Integración de cambios de una rama en otra.

## Pull Request
Solicitud para revisar e integrar cambios desde una rama hacia otra, normalmente hacia `develop` o `main`.

## Responsividad
Capacidad de la interfaz para adaptarse a distintos tamaños de pantalla.

## Bootstrap / React-Bootstrap
Bootstrap es un framework CSS. React-Bootstrap ofrece componentes Bootstrap adaptados a React.

## Accesibilidad
Buenas prácticas para que la interfaz sea usable por más personas y herramientas, incluyendo lectores de pantalla. Ejemplos: `aria-label`, `aria-invalid`, textos alternativos.

## aria-label
Atributo que entrega un nombre accesible a un botón o elemento interactivo.

## useSearchParams
Hook de React Router para leer y escribir parámetros en la URL, como `?categoria=Frutas` o `?q=miel`.

---

# 3. Posibles preguntas y respuestas

## ¿Por qué migraron a React?
Porque React permite organizar la interfaz en componentes reutilizables, manejar estado de forma más clara y separar responsabilidades. En la versión anterior, la lógica estaba más acoplada a páginas HTML y manipulación directa del DOM.

## ¿Qué ventaja concreta tiene React frente al JavaScript nativo usado antes?
No es que JavaScript nativo no sirva, sino que React facilita mantener una app que crece. En vez de buscar elementos en el DOM y modificarlos manualmente, calculamos estado y React renderiza la interfaz correspondiente.

## ¿Por qué usaron Vite?
Porque es rápido, moderno y se integra muy bien con React y Vitest. Facilita desarrollo local, build y testing.

## ¿Por qué Vitest y no Karma/Jasmine?
Vitest se integra directamente con Vite, permite pruebas rápidas y trabaja muy bien con React Testing Library. Karma/Jasmine pertenece a un flujo más antiguo y menos natural para proyectos modernos con Vite.

## ¿El proyecto tiene backend?
No. Esta versión es frontend local. El carrito se persiste en `localStorage`, pero no hay backend, base de datos, autenticación real ni pagos reales.

## ¿Entonces login y registro funcionan realmente?
No como autenticación real. Son vistas frontend simuladas. Se dejaron para representar el flujo visual, pero sin backend no se deben presentar como login real.

## ¿Dónde se guarda el carrito?
En `localStorage`, a través de utilidades de persistencia y el estado centralizado en `CartProvider`.

## ¿Por qué el carrito está en Context y no en App.jsx?
Porque lo necesitan varias partes: catálogo, navbar, carrito y checkout. Si viviera solo en `App.jsx`, habría que pasar props manualmente y se podría duplicar lógica. Con Context, todos consumen el mismo estado mediante `useCart()`.

## ¿Por qué no usaron Redux?
Porque para el alcance del proyecto Context + reducer es suficiente. Redux sería más pesado para una app académica de este tamaño.

## ¿Qué significa que el CRUD sea simulado?
Significa que existen funciones para crear, leer, actualizar y eliminar productos sobre una copia de los datos, pero no se guardan en una base de datos ni hay panel de administración visual.

## ¿Por qué los filtros están en la URL?
Porque permite compartir estados del catálogo, por ejemplo `/catalogo?categoria=Frutas%20Frescas`. También permite que la vista de categorías lleve directamente a un catálogo filtrado.

## ¿Qué prueban los tests?
Prueban catálogo, búsqueda, filtros, detalle de producto, carrito, checkout, navegación, validaciones, persistencia, ofertas, CRUD simulado y flujo completo de compra.

## ¿Los tests reemplazan la revisión manual?
No completamente. Los tests automatizados detectan errores funcionales, pero igual conviene revisar visualmente la interfaz, responsividad y experiencia de usuario.

## ¿Tienen pruebas end-to-end reales?
No. Las pruebas actuales corren con Vitest, Testing Library y jsdom. Simulan interacción de usuario, pero no abren un navegador real como Cypress o Playwright.

## ¿Qué pasa si se recarga la página?
El carrito se mantiene porque se guarda en `localStorage`. La navegación también funciona con React Router mientras el servidor de desarrollo esté configurado para servir la app.

## ¿Qué pasa con un producto que no existe?
La ficha de producto muestra un mensaje controlado de “No encontramos ese producto”, en vez de romper la aplicación.

## ¿Qué validaciones tiene el checkout?
Valida campos como nombre, correo, teléfono y dirección antes de crear la orden. Si hay errores, no se crea la orden ni se vacía el carrito.

## ¿Qué significa que el proyecto tenga build y lint OK?
Que el proyecto compila correctamente para producción y que la revisión automática de código no detectó problemas críticos.

---

# 4. Debilidades que el docente podría atacar y cómo responder

## Debilidad 1 — No hay backend real

**Posible ataque:**
> ¿Cómo puede ser ecommerce si no tiene backend?

**Respuesta recomendada:**
> Esta EV2 se centró en la migración frontend a React. Por eso implementamos catálogo, carrito, checkout simulado, rutas y tests. No presentamos backend ni pagos reales como parte completada; lo dejamos explícito como limitación.

## Debilidad 2 — Login y registro son simulados

**Posible ataque:**
> ¿Dónde se guardan los usuarios registrados?

**Respuesta recomendada:**
> No se guardan usuarios reales. Las vistas de login y registro son maquetas frontend. Preferimos declararlo así antes que simular una autenticación insegura en localStorage.

## Debilidad 3 — localStorage no es seguro

**Posible ataque:**
> ¿Por qué usan localStorage si no es seguro?

**Respuesta recomendada:**
> Lo usamos solo para persistir el carrito localmente, no para datos sensibles. Para usuarios, contraseñas o pagos se requeriría backend y almacenamiento seguro.

## Debilidad 4 — CRUD simulado sin interfaz administrativa

**Posible ataque:**
> ¿Dónde está la pantalla para crear productos?

**Respuesta recomendada:**
> El CRUD está implementado como funciones puras testeadas sobre datos simulados. No se creó panel administrativo porque el alcance de esta etapa se centró en el frontend del cliente y la migración. Aun así, la lógica base queda preparada para conectarse a una vista o API futura.

## Debilidad 5 — No hay pruebas E2E reales

**Posible ataque:**
> ¿Sus pruebas abren un navegador real?

**Respuesta recomendada:**
> No. Usamos Vitest con jsdom y React Testing Library. Eso permite validar flujos funcionales de la interfaz de forma rápida. Para una etapa posterior se podrían agregar pruebas E2E con Playwright o Cypress.

## Debilidad 6 — Dependencia de datos simulados

**Posible ataque:**
> ¿Qué pasa si los productos vienen desde una API?

**Respuesta recomendada:**
> La estructura actual ayuda a esa transición. Hoy `products.js` actúa como fuente local, pero las páginas consumen datos estructurados. En una versión futura se podría reemplazar esa fuente por una llamada a API manteniendo gran parte de los componentes.

## Debilidad 7 — ¿Por qué no todo está en un solo componente?

**Posible ataque:**
> ¿No era más simple dejar todo en App.jsx?

**Respuesta recomendada:**
> Podría ser más rápido al inicio, pero menos mantenible. Separar en componentes, páginas, contexto y utilidades permite probar, reutilizar y explicar mejor cada parte.

## Debilidad 8 — ¿Por qué no usar Redux?

**Posible ataque:**
> ¿Por qué usaron Context en vez de Redux?

**Respuesta recomendada:**
> Redux es útil en apps más grandes, pero para este alcance Context + reducer cubre bien el carrito. Evitamos agregar complejidad innecesaria.

## Debilidad 9 — Rutas y recarga

**Posible ataque:**
> ¿Qué pasa si entro directo a `/producto/FR001`?

**Respuesta recomendada:**
> En desarrollo con Vite funciona porque la app se sirve como SPA. En producción habría que configurar el servidor para redirigir rutas internas al `index.html`.

## Debilidad 10 — Cobertura no significa ausencia de errores

**Posible ataque:**
> Tienen muchos tests, ¿eso garantiza que no hay errores?

**Respuesta recomendada:**
> No lo garantiza al 100%. Los tests reducen riesgo y validan flujos críticos, pero no reemplazan revisión visual, pruebas en navegador real ni QA completo.

## Debilidad 11 — Estética y responsividad

**Posible ataque:**
> ¿Cómo aseguran que se ve bien en todos los dispositivos?

**Respuesta recomendada:**
> Usamos React-Bootstrap con grillas responsivas (`xs`, `md`, `lg`) y una paleta centralizada en CSS. Aun así, una revisión exhaustiva de todos los viewports sería parte de una etapa posterior de QA visual.

## Debilidad 12 — Accesibilidad parcial

**Posible ataque:**
> ¿La aplicación es completamente accesible?

**Respuesta recomendada:**
> Tiene mejoras básicas como labels, `aria-label`, `aria-invalid`, textos alternativos y consultas accesibles en tests. Pero no afirmamos accesibilidad completa; faltaría una auditoría específica con herramientas como Lighthouse o axe.

---

# 5. Recomendaciones finales para defender

- No decir “tenemos backend” ni “login real”.
- Repetir la idea central: migración frontend a React, no sistema productivo completo.
- Si preguntan por seguridad, responder que no se guardan datos sensibles.
- Si preguntan por tests, mencionar: Vitest, Testing Library, jsdom, 23 archivos y 278 pruebas.
- Si preguntan por arquitectura, mencionar: `components`, `pages`, `context`, `hooks`, `utils`, `data`, `layouts`.
- Si preguntan por carrito, responder: `CartProvider` + `useCart()` + `localStorage`.
- Si preguntan por catálogo, responder: `products.js` + `utils/catalog.js` + `CatalogPage` + filtros en URL.
- Si preguntan por navegación, responder: React Router + `MainLayout`.
- Si preguntan por limitaciones, reconocerlas con claridad y explicar que están documentadas.
