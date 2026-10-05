/*
  CartPage es la vista completa del carrito.

  Reutiliza CartSummary, así la lógica de líneas y totales no se duplica.
  onNavigate es temporal: mientras la Rama 3 no integre React Router, el
  App cambia de vista con estado.
*/

import { Alert, Button } from 'react-bootstrap'
import CartSummary from '../components/CartSummary'
import { useCart } from '../hooks/useCart'
import { formatCurrency } from '../utils/formatCurrency'

function CartPage({ onNavigate }) {
  const { items, total, increaseQuantity, decreaseQuantity, removeItem, clearCart } = useCart()

  const hayProductos = items.length > 0

  return (
    <section className="py-4">
      <h1 className="mb-4">Carrito de compras</h1>

      <CartSummary
        cart={items}
        onIncreaseQuantity={increaseQuantity}
        onDecreaseQuantity={decreaseQuantity}
        onRemoveFromCart={removeItem}
        onClear={clearCart}
      />

      {!hayProductos ? (
        <Alert variant="info" className="mt-4">
          Aún no has agregado productos.{' '}
          <Button variant="link" onClick={() => onNavigate('catalogo')}>
            Ver productos
          </Button>
        </Alert>
      ) : (
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mt-4">
          <p className="mb-0 fs-5">
            Total a pagar: <strong>{formatCurrency(total)}</strong>
          </p>

          <div className="d-flex gap-2">
            <Button variant="outline-secondary" onClick={() => onNavigate('catalogo')}>
              Seguir comprando
            </Button>

            <Button variant="success" size="lg" onClick={() => onNavigate('checkout')}>
              Ir al checkout
            </Button>
          </div>
        </div>
      )}
    </section>
  )
}

export default CartPage