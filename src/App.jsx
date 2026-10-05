/*
  App.jsx define la estructura principal de la app.

  El estado del carrito ya no vive acá: lo administra CartProvider a través
  de useCart. App solo compone el encabezado, la navegación y la vista activa.

  IMPORTANTE PARA EL EQUIPO:
  La navegación usa un estado `vista` porque la Rama 3 todavía no integró
  React Router. Cuando eso ocurra, se eliminan el estado `vista`, la constante
  VISTAS y los botones del <nav>, y se reemplaza cada bloque condicional por
  su <Route>. El resto de la app ya está preparada: las páginas solo reciben
  onNavigate, así que el cambio queda acotado a este archivo.
*/

import { useState } from 'react'
import { Button } from 'react-bootstrap'
import { CartProvider } from './context/CartProvider'
import { useCart } from './hooks/useCart'
import ProductCard from './components/ProductCard'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import OrderSuccessPage from './pages/OrderSuccessPage'
import OrderFailurePage from './pages/OrderFailurePage'
import { products } from './data/products'

const VISTA_CATALOGO = 'catalogo'

// Catálogo: la lista de productos y el alta desde cada tarjeta.
function Catalogo({ onNavigate }) {
  const { addItem } = useCart()

  return (
    <section>
      <h2 className="h4 mb-3">Catálogo de productos</h2>

      <div className="row g-4">
        {products.map((product) => (
          <div className="col-12 col-md-6 col-lg-4" key={product.id}>
            <ProductCard product={product} onAddToCart={addItem} />
          </div>
        ))}
      </div>

      <div className="mt-4">
        <Button variant="outline-primary" onClick={() => onNavigate('carrito')}>
          Ver carrito
        </Button>
      </div>
    </section>
  )
}

// Tienda envuelve todo lo que necesita el carrito, por eso va dentro del provider.
function Tienda() {
  const { count } = useCart()
  const [vista, setVista] = useState(VISTA_CATALOGO)
  const [orden, setOrden] = useState(null)
  const [errorOrden, setErrorOrden] = useState(null)

  function handleOrderCreated(nuevaOrden) {
    setOrden(nuevaOrden)
    setErrorOrden(null)
  }

  function handleOrderFailed(error) {
    setErrorOrden(error)
    setOrden(null)
  }

  return (
    <main className="container py-4">
      <header className="mb-4">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
          <div>
            <h1 className="mb-1">Huerto Hogar</h1>
            <p className="lead mb-0">E-commerce de productos frescos y naturales.</p>
          </div>

          <nav className="d-flex gap-2" aria-label="Navegación principal">
            <Button variant="link" onClick={() => setVista(VISTA_CATALOGO)}>
              Catálogo
            </Button>

            <Button variant="outline-primary" onClick={() => setVista('carrito')}>
              Carrito ({count})
            </Button>
          </nav>
        </div>
      </header>

      {vista === VISTA_CATALOGO && <Catalogo onNavigate={setVista} />}

      {vista === 'carrito' && <CartPage onNavigate={setVista} />}

      {vista === 'checkout' && (
        <CheckoutPage
          onNavigate={setVista}
          onOrderCreated={handleOrderCreated}
          onOrderFailed={handleOrderFailed}
        />
      )}

      {vista === 'exito' && <OrderSuccessPage order={orden} onNavigate={setVista} />}

      {vista === 'falla' && <OrderFailurePage error={errorOrden} onNavigate={setVista} />}
    </main>
  )
}

function App() {
  return (
    <CartProvider>
      <Tienda />
    </CartProvider>
  )
}

export default App