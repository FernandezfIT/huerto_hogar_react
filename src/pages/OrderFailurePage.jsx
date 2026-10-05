/*
  OrderFailurePage explica por qué no se pudo completar la compra.

  Recibe el error lanzado por createOrder para mostrar el motivo real, por
  ejemplo stock insuficiente, en vez de un mensaje genérico.
*/

import { Alert, Button } from 'react-bootstrap'

function OrderFailurePage({ error, onNavigate }) {
  return (
    <section className="py-4 text-center">
      <Alert variant="danger">
        <Alert.Heading as="h2">No pudimos completar tu compra</Alert.Heading>
        <p className="mb-0">{error?.message ?? 'Ocurrió un error inesperado. Intenta de nuevo.'}</p>
      </Alert>

      <p className="text-muted">
        Tu carrito se mantiene intacto para que puedas revisarlo antes de reintentar.
      </p>

      <div className="d-flex flex-wrap justify-content-center gap-2">
        <Button variant="primary" onClick={() => onNavigate('carrito')}>
          Volver al carrito
        </Button>

        <Button variant="outline-secondary" onClick={() => onNavigate('catalogo')}>
          Ver catálogo
        </Button>
      </div>
    </section>
  )
}

export default OrderFailurePage