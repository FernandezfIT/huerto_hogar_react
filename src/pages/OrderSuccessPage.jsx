/*
  OrderSuccessPage confirma la compra y muestra el resumen final.

  Recibe la orden creada por createOrder, así el resumen refleja los precios
  congelados al momento de la compra y no los del catálogo actual.
*/

import { Alert, Badge, Button, Card } from 'react-bootstrap'
import { formatCurrency } from '../utils/formatCurrency'

function OrderSuccessPage({ order, onNavigate }) {
  if (!order) {
    return (
      <section className="py-4 text-center">
        <Alert variant="warning">
          <Alert.Heading as="h2">No hay ninguna compra para mostrar</Alert.Heading>
          <p>Vuelve al catálogo para continuar comprando.</p>
        </Alert>

        <Button variant="primary" onClick={() => onNavigate('catalogo')}>
          Ir al catálogo
        </Button>
      </section>
    )
  }

  return (
    <section className="py-4 text-center">
      <Alert variant="success">
        <Alert.Heading as="h2">¡Compra realizada con éxito!</Alert.Heading>
        <p className="mb-0">
          Gracias {order.cliente.nombre}. Te enviamos el detalle a {order.cliente.email}.
        </p>
      </Alert>

      <Card className="mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="h5 mb-0">Resumen de la orden</h2>
            <Badge bg="success">{order.id}</Badge>
          </div>

          <ul className="list-unstyled mb-3">
            {order.items.map((item) => (
              <li
                key={item.id}
                className="d-flex justify-content-between border-bottom py-2"
              >
                <span>
                  {item.nombre} x {item.cantidad}
                </span>
                <span>{formatCurrency(item.subtotal)}</span>
              </li>
            ))}
          </ul>

          <div className="d-flex justify-content-between fs-5 fw-bold">
            <span>Total pagado</span>
            <span>{formatCurrency(order.total)}</span>
          </div>
        </Card.Body>
      </Card>

      <Button variant="primary" onClick={() => onNavigate('catalogo')}>
        Volver al catálogo
      </Button>
    </section>
  )
}

export default OrderSuccessPage