# Informe de migración EV2 — Huerto Hogar React

**Proyecto:** Huerto Hogar — Desarrollo FullStack II  
**Etapa:** Migración desde EV1 HTML/CSS/JavaScript nativo hacia React + Vite + Vitest  
**Estado del informe:** Borrador funcional. La rama `feature/catalog-products-data` queda pendiente de completar cuando sea integrada.

## 1. Introducción del proyecto y etapa actual

Huerto Hogar es un ecommerce de productos frescos y naturales. En la EV1 se trabajó una primera versión frontend usando HTML, CSS y JavaScript nativo. Esa versión permitió construir las vistas principales del caso: inicio, tienda/catálogo, registro, login, carrito, perfil e historial, apoyándose en archivos separados por tipo (`html/`, `css/`, `js/`, `img/`) y usando eventos del DOM y `localStorage` para simular persistencia.

En la etapa actual de EV2 el proyecto se está porteando a React. El objetivo no fue copiar la versión anterior archivo por archivo, sino traducir sus responsabilidades a una estructura más mantenible: componentes reutilizables, páginas, contexto de carrito, hooks, funciones utilitarias, rutas con React Router y pruebas automatizadas con Vitest.

La migración se organizó en cuatro ramas de trabajo:

- `feature/catalog-products-data`: catálogo, productos, categorías, ofertas y datos simulados. **Pendiente de integración final.**
- `feature/cart-checkout-flow`: carrito, checkout, persistencia, validaciones y compra exitosa/fallida.
- `feature/navigation-layout-public-pages`: navegación, layout general y páginas públicas.
- `feature/testing-docs-coverage`: pruebas, cobertura, ERS, README y checklist de presentación.

La documentación de EA2 revisada pide trabajar con React/Bootstrap, componentes, props/state, datos simulados o JSON, pruebas, mocks e informe de cobertura. Aunque el material académico menciona Jasmine/Karma, el docente recomendó Vitest; por eso se usó Vitest junto con React Testing Library.

## 2. De la estructura anterior a la estructura actual

En la EV1 el proyecto se organizaba por tipo de archivo. La estructura compartida para esa etapa era similar a esta:

```txt
HuertoHogar/
├── html/
│   ├── index.html
│   ├── tienda.html
│   ├── registro.html
│   ├── login.html
│   ├── carrito.html
│   └── perfil.html
├── css/
│   └── style.css
├── js/
│   ├── menu.js
│   ├── registro.js
│   ├── login.js
│   ├── tienda.js
│   ├── carrito.js
│   └── perfil.js
└── img/
    └── recursos visuales
```

La lógica estaba asociada a páginas HTML y scripts específicos. Por ejemplo, el HTML podía llamar directamente a una función JavaScript desde un botón:

```html
<button onclick="agregarAlCarrito('Manzanas Fuji', 1200)">
    Agregar al carrito
</button>
```

En React, ese flujo se tradujo a componentes que reciben datos y funciones por props:

```jsx
<ProductCard product={product} onAddToCart={addItem} />
```

Y dentro del componente:

```jsx
<button
  className="btn btn-success"
  onClick={() => onAddToCart(product)}
>
  Agregar al carrito
</button>
```

La estructura actual queda separada por responsabilidades, no solo por tipo de archivo:

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
```

La diferencia principal es que antes cada página resolvía estructura, interacción y estado de forma más directa. Ahora la aplicación se divide en piezas conectadas: `App.jsx` define rutas, `CartProvider` mantiene el carrito, `useCart()` entrega el estado a las vistas, y los componentes solo renderizan o disparan acciones.

## 3. Migración por ramas de trabajo

## 3.1 Rama `feature/catalog-products-data` — Catálogo y productos

### Cómo se hacía antes

En la EV1, la tienda estaba asociada a una vista HTML (`tienda.html`) y a un archivo JavaScript de tienda (`tienda.js`). El enfoque nativo se apoyaba en recorrer elementos del DOM para buscar u ocultar productos. En el material de EV1 compartido se mostraba una lógica de búsqueda de este tipo:

```js
const productos = document.querySelectorAll(".producto");

productos.forEach(producto => {
    const contenido = producto.innerText.toLowerCase();

    if (contenido.includes(texto)) {
        producto.style.display = "block";
    } else {
        producto.style.display = "none";
    }
});
```

Ese enfoque funciona, pero mezcla la interfaz ya dibujada con la lógica de filtrado: primero existen elementos en el DOM y luego JavaScript los muestra u oculta.

### Cómo se tradujo a React

En React, la primera traducción fue mover los productos a un archivo de datos simulados. Así la interfaz no depende de buscar elementos ya existentes en pantalla, sino de recorrer un arreglo de objetos y renderizar componentes.

```js
export const products = [
  {
    id: "FR001",
    nombre: "Manzanas Fuji",
    categoria: "Frutas Frescas",
    precio: 1200,
    unidad: "kilo",
    stock: 150,
    imagen: "/images/manzanas.jpg",
    descripcion:
      "Manzanas Fuji crujientes y dulces, cultivadas en el Valle del Maule.",
  },
]
```

El catálogo actual en `App.jsx` recorre ese arreglo con `map()` y crea una tarjeta por producto:

```jsx
function Catalogo() {
  const { addItem } = useCart()
  const navigate = useNavigate()

  return (
    <section className="py-4">
      <h1 className="h3 mb-4">Catálogo de productos</h1>

      <div className="row g-4">
        {products.map((product) => (
          <div className="col-12 col-md-6 col-lg-4" key={product.id}>
            <ProductCard product={product} onAddToCart={addItem} />
          </div>
        ))}
      </div>

      <div className="mt-4">
        <Button variant="outline-primary" onClick={() => navigate('/carrito')}>
          Ver carrito
        </Button>
      </div>
    </section>
  )
}
```

La tarjeta de producto quedó como componente reutilizable:

```jsx
function ProductCard({ product, onAddToCart }) {
  return (
    <article className="card h-100">
      <img src={product.imagen} className="card-img-top" alt={product.nombre} />

      <div className="card-body">
        <h2 className="h5 card-title">
          {product.id} - {product.nombre}
        </h2>

        <p className="card-text">{product.descripcion}</p>

        <p className="mb-1">
          <strong>Precio:</strong> ${product.precio} CLP por {product.unidad}
        </p>

        <button className="btn btn-success" onClick={() => onAddToCart(product)}>
          Agregar al carrito
        </button>
      </div>
    </article>
  )
}
```

### Estado actual de esta rama

Esta rama aún queda pendiente de integración final. Cuando esté lista, debe completar catálogo, imágenes, categorías, ofertas, búsqueda, filtros, vista de detalle y CRUD simulado. También debe corregir la diferencia detectada entre rutas de imágenes (`.jpg`) y archivos existentes (`.jpeg`) si corresponde.

## 3.2 Rama `feature/cart-checkout-flow` — Carrito y checkout

### Cómo se hacía antes

En la EV1, el carrito estaba asociado a JavaScript nativo y `localStorage`. El flujo funcional esperado era: agregar producto, guardar datos localmente, recuperar el carrito y mostrar totales. El material anterior también mostraba uso directo de `localStorage` para persistir datos:

```js
localStorage.setItem(
    email,
    JSON.stringify(usuario)
);

const usuarioGuardado = localStorage.getItem(email);
const usuario = JSON.parse(usuarioGuardado);
```

En la migración, se mantuvo la idea de persistencia local, pero se separó la responsabilidad: el carrito ya no depende de una página específica ni de manipular directamente el DOM.

### Cómo se tradujo a React

El estado del carrito se movió a un contexto global: `CartProvider`. La aplicación completa queda envuelta por el provider, por lo que cualquier componente puede usar el carrito mediante `useCart()`.

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
```

La lógica principal vive en un reducer. Esto permite concentrar en un solo lugar las acciones del carrito: agregar, aumentar, disminuir, eliminar y limpiar.

```jsx
function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const product = action.product
      const max = getMaxQuantity(product)
      const existing = state.items.find((item) => item.id === product.id)

      if (!existing) {
        if (max <= 0) {
          return state
        }

        return { items: [...state.items, { ...product, cantidad: 1 }] }
      }

      return {
        items: state.items.map((item) =>
          item.id === product.id
            ? { ...item, cantidad: Math.min(item.cantidad + 1, max) }
            : item,
        ),
      }
    }

    case 'DECREASE_QUANTITY': {
      const item = state.items.find((row) => row.id === action.id)

      if (!item) {
        return state
      }

      if (item.cantidad <= 1) {
        return { items: state.items.filter((row) => row.id !== action.id) }
      }

      return {
        items: state.items.map((row) =>
          row.id === action.id ? { ...row, cantidad: row.cantidad - 1 } : row,
        ),
      }
    }

    case 'CLEAR_CART': {
      return { items: [] }
    }

    default:
      return state
  }
}
```

La persistencia se maneja desde el provider: al iniciar lee desde `localStorage`, y cada vez que cambia el carrito vuelve a guardar.

```jsx
const [state, dispatch] = useReducer(cartReducer, null, () => ({
  items: loadCart(),
}))

useEffect(() => {
  saveCart(state.items)
}, [state.items])
```

El acceso desde los componentes se simplificó con el hook `useCart()`:

```js
export function useCart() {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error('useCart debe usarse dentro de un <CartProvider>.')
  }

  return context
}
```

Así, una vista no modifica directamente el estado: consume funciones del contexto.

```jsx
const { items, total, increaseQuantity, decreaseQuantity, removeItem, clearCart } = useCart()
```

El resumen del carrito se convirtió en componente de presentación. Recibe el carrito y las acciones; no guarda estado propio.

```jsx
function CartSummary({
  cart,
  onIncreaseQuantity,
  onDecreaseQuantity,
  onRemoveFromCart,
  onClear,
}) {
  if (cart.length === 0) {
    return (
      <section className="mt-5">
        <h2>Carrito</h2>
        <p>El carrito está vacío</p>
      </section>
    )
  }

  return (
    <section className="mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Carrito</h2>
        <Button variant="outline-danger" size="sm" onClick={onClear}>
          Vaciar carrito
        </Button>
      </div>

      <ListGroup as="ul">
        {cart.map((item) => (
          <ListGroup.Item as="li" key={item.id}>
            <p className="mb-1 fw-semibold">{item.nombre}</p>
            <p className="mb-0 small">
              Subtotal: <strong>{formatCurrency(getLineTotal(item))}</strong>
            </p>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </section>
  )
}
```

El checkout tradujo el formulario nativo a un formulario controlado por React. Antes se obtenían valores con `getElementById()`; ahora cada campo actualiza el estado `datos`.

```jsx
const CAMPOS_INICIALES = { nombre: '', email: '', telefono: '', direccion: '' }
const [datos, setDatos] = useState(CAMPOS_INICIALES)
const [errores, setErrores] = useState({})

function handleChange(event) {
  const { name, value } = event.target
  setDatos((actual) => ({ ...actual, [name]: value }))
}
```

Al confirmar, primero se validan los datos y solo si no hay errores se crea la orden.

```jsx
function handleSubmit(event) {
  event.preventDefault()

  const nuevosErrores = validateCustomer(datos)
  setErrores(nuevosErrores)

  if (hasErrors(nuevosErrores)) {
    return
  }

  try {
    const orden = createOrder({ cliente: datos, items })
    clearCart()
    onOrderCreated(orden)
    onNavigate('exito')
  } catch (error) {
    onOrderFailed(error)
    onNavigate('falla')
  }
}
```

### Resultado de la rama

Con esta rama el carrito dejó de ser lógica dispersa y pasó a ser un módulo central del frontend. El flujo actual permite agregar productos, persistir el carrito, modificar cantidades, calcular totales, validar datos del cliente y mostrar compra exitosa o fallida.

## 3.3 Rama `feature/navigation-layout-public-pages` — Navegación, layout y páginas públicas

### Cómo se hacía antes

En la EV1, la navegación se resolvía con enlaces HTML entre archivos:

```html
<nav id="menu">
    <a href="index.html">Inicio</a>
    <a href="tienda.html">Tienda</a>
    <a href="nosotros.html">Nosotros</a>
    <a href="contacto.html">Contacto</a>
    <a href="carrito.html">Carrito</a>
    <a href="registro.html" id="btnRegistro">Registro</a>
    <a href="login.html" id="btnLogin">Iniciar sesión</a>
    <a href="perfil.html" id="btnPerfil">Perfil</a>
</nav>
```

Cada enlace apuntaba a otro archivo HTML. En React, el objetivo fue mantener páginas navegables, pero dentro de una sola aplicación.

### Cómo se tradujo a React

Se instaló React Router y `App.jsx` pasó a definir rutas. El navegador ya no cambia entre archivos HTML separados; cambia la ruta y React renderiza la página correspondiente.

```jsx
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <AppRoutes />
      </CartProvider>
    </BrowserRouter>
  )
}
```

Las rutas actuales concentran el flujo principal:

```jsx
<Routes>
  <Route element={<MainLayout />}>
    <Route index element={<HomePage />} />
    <Route path="catalogo" element={<Catalogo />} />
    <Route path="carrito" element={<CartPage onNavigate={navigateTo} />} />
    <Route path="login" element={<LoginPage />} />
    <Route path="registro" element={<RegisterPage />} />
    <Route path="perfil" element={<ProfilePage />} />
    <Route
      path="checkout"
      element={
        <CheckoutPage
          onNavigate={navigateTo}
          onOrderCreated={handleOrderCreated}
          onOrderFailed={handleOrderFailed}
        />
      }
    />
    <Route path="compra-exitosa" element={<OrderSuccessPage order={orden} onNavigate={navigateTo} />} />
    <Route path="compra-fallida" element={<OrderFailurePage error={errorOrden} onNavigate={navigateTo} />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Route>
</Routes>
```

Para no repetir navbar y footer en cada página, se creó `MainLayout`. La pieza clave es `Outlet`, que funciona como el espacio donde React Router coloca la página activa.

```jsx
function MainLayout() {
  return (
    <>
      <AppNavbar />

      <Container as="main" className="pb-5">
        <Outlet />
      </Container>

      <footer className="border-top py-4 text-center text-muted">
        <Container>
          <small>Huerto Hogar - Productos frescos y naturales</small>
        </Container>
      </footer>
    </>
  )
}
```

La navegación principal se convirtió en componente React-Bootstrap, conectado a React Router mediante `NavLink`.

```jsx
function AppNavbar() {
  const { count } = useCart()

  return (
    <Navbar bg="light" expand="lg" className="border-bottom mb-4">
      <Container>
        <Navbar.Brand as={NavLink} to="/">
          Huerto Hogar
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar" />

        <Navbar.Collapse id="main-navbar">
          <Nav className="ms-auto">
            <Nav.Link as={NavLink} to="/">Inicio</Nav.Link>
            <Nav.Link as={NavLink} to="/catalogo">Catálogo</Nav.Link>
            <Nav.Link as={NavLink} to="/carrito">
              Carrito <Badge bg="success">{count}</Badge>
            </Nav.Link>
            <Nav.Link as={NavLink} to="/login">Login</Nav.Link>
            <Nav.Link as={NavLink} to="/registro">Registro</Nav.Link>
            <Nav.Link as={NavLink} to="/perfil">Perfil</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
```

El contador del carrito ahora aparece en el navbar porque `AppNavbar` también consume `useCart()`. Esto muestra una ventaja de haber movido el carrito a contexto: la navegación puede mostrar el estado sin que `App.jsx` tenga que pasarlo manualmente por props.

### Páginas públicas

Se crearon páginas públicas para completar el flujo visual: inicio, login, registro y perfil. Login y registro no implementan autenticación real; son maquetas frontend porque el proyecto no tiene backend ni base de datos.

```jsx
function RegisterPage() {
  return (
    <section className="py-4">
      <Card className="mx-auto shadow-sm" style={{ maxWidth: '32rem' }}>
        <Card.Body>
          <h1 className="h3 mb-3">Crear cuenta</h1>

          <p className="text-muted">
            Este formulario prepara la experiencia de registro. En esta versión
            frontend no se almacenan usuarios reales.
          </p>

          <Form>
            <Form.Group className="mb-3" controlId="registerName">
              <Form.Label>Nombre completo</Form.Label>
              <Form.Control type="text" placeholder="Ana López" />
            </Form.Group>
          </Form>
        </Card.Body>
      </Card>
    </section>
  )
}
```

### Resultado de la rama

La navegación dejó de depender de archivos HTML separados y quedó integrada en una SPA con React Router. También se agregó layout compartido, navbar responsivo, footer, páginas públicas y contador del carrito conectado al estado real.

## 3.4 Rama `feature/testing-docs-coverage` — Testing, documentación y cobertura

### Cómo se hacía antes

En la versión anterior, la validación principal era manual: abrir la página, probar botones, revisar formularios y confirmar visualmente si el flujo funcionaba. Para EV2 se necesitaba dejar evidencia automatizada, especialmente porque la documentación de EA2 exige pruebas, mocks, resultados y cobertura.

### Cómo se tradujo a React + Vitest

Se configuró Vitest como runner de pruebas, React Testing Library para renderizar componentes e interactuar como usuario, `jsdom` para simular DOM y `jest-dom` para matchers legibles.

El setup global limpia cada render después de cada test:

```js
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

afterEach(() => {
  cleanup()
})
```

El test de integración principal valida el flujo real de usuario: home, catálogo, carrito, checkout y compra exitosa.

```jsx
test('flujo completo: home → catálogo → carrito → checkout → éxito', async () => {
  const user = userEvent.setup()
  render(<App />)

  await user.click(screen.getByRole('link', { name: /catálogo/i }))
  await user.click(screen.getAllByRole('button', { name: /agregar al carrito/i })[0])

  expect(screen.getByRole('link', { name: /carrito\s*1/i })).toBeInTheDocument()
  expect(localStorage.getItem('huerto-hogar-cart')).toContain('FR001')

  await user.click(screen.getByRole('link', { name: /carrito\s*1/i }))

  expect(screen.getByRole('heading', { name: /carrito de compras/i })).toBeInTheDocument()
  expect(screen.getByText('Manzanas Fuji')).toBeInTheDocument()

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

También se agregó un test específico para el navbar, porque la rama de navegación necesitaba demostrar que las rutas principales se renderizan.

```jsx
test('muestra los enlaces principales de navegación', () => {
  render(
    <MemoryRouter>
      <CartProvider>
        <AppNavbar />
      </CartProvider>
    </MemoryRouter>,
  )

  expect(screen.getByRole('link', { name: /huerto hogar/i })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /inicio/i })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /catálogo/i })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /carrito\s*0/i })).toBeInTheDocument()
})
```

El documento de cobertura resume el alcance de la suite actual:

```txt
Test Files: 13 passed
Tests: 131 passed
```

La cobertura se distribuye entre:

- integración general de `App`;
- navbar;
- tarjetas de producto;
- resumen del carrito;
- hook `useCart`;
- páginas de carrito, checkout, éxito y fallo;
- cálculos de carrito;
- storage;
- servicio de checkout;
- validadores.

### Decisión Vitest vs Jasmine/Karma

El material de EA2 menciona Jasmine/Karma, pero el docente recomendó Vitest. La decisión se documentó porque el proyecto usa Vite y Vitest se integra naturalmente con ese ecosistema. Además, Testing Library permite escribir pruebas centradas en lo que el usuario ve y hace, no en detalles internos de implementación.

### Resultado de la rama

Esta rama dejó lista la documentación base de entrega: README actualizado, informe de cobertura, ERS V2 y checklist de presentación. Además, la rama validó el proyecto con tests y build antes de integrarse a `develop`.

## 4. Conclusión del trabajo realizado

El trabajo realizado permitió transformar Huerto Hogar desde una aplicación frontend construida con HTML, CSS y JavaScript nativo hacia una base React más ordenada, modular y preparada para seguir creciendo. La migración no consistió solamente en cambiar la sintaxis: el proceso obligó a separar responsabilidades que antes estaban más juntas en páginas y scripts individuales.

El catálogo comenzó a trasladarse desde una lógica ligada a elementos HTML hacia una fuente de datos reutilizable y componentes como `ProductCard`. El carrito dejó de depender de funciones aisladas y pasó a organizarse mediante `CartProvider`, `useCart()` y utilidades especializadas para cálculos, persistencia y validaciones. La navegación dejó de funcionar como enlaces entre archivos HTML y se convirtió en una estructura de rutas con React Router, `MainLayout` y `AppNavbar`. Finalmente, el testeo dejó de ser solo una revisión manual en navegador y se convirtió en una suite automatizada con Vitest y React Testing Library.

El resultado principal es que ahora el proyecto tiene una arquitectura más clara: los datos viven en `data`, el estado compartido en `context`, el acceso al carrito en `hooks`, las reglas reutilizables en `utils`, las pantallas en `pages`, los elementos visuales en `components` y la navegación en `App.jsx`. Esta separación hace que sea más fácil explicar el proyecto, probarlo, mantenerlo y repartir trabajo entre integrantes del equipo.

También fue importante documentar explícitamente las decisiones tomadas. Se dejó registro de por qué se usó Vitest en lugar de Jasmine/Karma, cómo se organiza la cobertura de pruebas, qué partes son funcionales y qué partes siguen siendo simuladas. Esto evita presentar como backend real algo que todavía es frontend local, especialmente en login, registro y perfil.

En síntesis, la migración permitió convertir una primera versión funcional en una aplicación React con mejor estructura, navegación real, carrito persistente, checkout validado, pruebas automatizadas y documentación de entrega. La rama de catálogo queda como el último bloque pendiente para completar la migración visual y funcional de productos, pero la base principal del proyecto ya quedó preparada para integrarla sin desordenar el resto de la aplicación.
