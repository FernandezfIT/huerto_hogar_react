/*
  CartSummary muestra el contenido del carrito.

  Es un componente de presentación: no tiene estado propio, recibe el carrito
  y las acciones desde quien lo usa. Así lo reutilizan sin cambios tanto la
  vista del catálogo como la página de carrito y el resumen del checkout.
*/

import { Badge, Button, ListGroup } from 'react-bootstrap'
import {
  canIncrease,
  getCartTotal,
  getLineTotal,
  getMaxQuantity,
  getUnitPrice,
  isOnOffer,
} from '../utils/cartCalculations'
import { formatCurrency } from '../utils/formatCurrency'

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
        {cart.map((item) => {
          const maxQuantity = getMaxQuantity(item)
          const puedeAumentar = canIncrease(item)

          return (
            <ListGroup.Item as="li" key={item.id} className="d-flex justify-content-between gap-3">
              <div>
                <p className="mb-1 fw-semibold">{item.nombre}</p>

                <p className="mb-1 small text-muted">
                  {formatCurrency(getUnitPrice(item))} por {item.unidad ?? 'unidad'}
                  {isOnOffer(item) && (
                    <span className="ms-1">
                      <del>{formatCurrency(item.precio)}</del>
                    </span>
                  )}
                </p>

                <p className="mb-0 small">
                  Subtotal: <strong>{formatCurrency(getLineTotal(item))}</strong>
                </p>

                {/* Al llegar al stock se avisa el tope y se bloquea el botón + */}
                {!puedeAumentar && (
                  <Badge bg="secondary" className="mt-1">
                    Máx: {maxQuantity}
                  </Badge>
                )}
              </div>

              <div className="d-flex align-items-center gap-2">
                <Button
                  variant="outline-primary"
                  size="sm"
                  disabled={!puedeAumentar}
                  onClick={() => onIncreaseQuantity(item.id)}
                  aria-label={`Aumentar cantidad de ${item.nombre}`}
                >
                  +
                </Button>

                <span className="fw-semibold">{item.cantidad}</span>

                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => onDecreaseQuantity(item.id)}
                  aria-label={`Disminuir cantidad de ${item.nombre}`}
                >
                  −
                </Button>

                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => onRemoveFromCart(item.id)}
                  aria-label={`Eliminar ${item.nombre} del carrito`}
                >
                  Eliminar
                </Button>
              </div>
            </ListGroup.Item>
          )
        })}
      </ListGroup>

      <p className="fw-bold mt-3">Total: {formatCurrency(getCartTotal(cart))}</p>
    </section>
  )
}

export default CartSummary