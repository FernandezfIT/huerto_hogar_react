/*
  CheckoutPage concentra el formulario de datos del cliente.

  Las reglas de validación viven en utils/validators como funciones puras;
  esta vista solo muestra lo que esa capa devuelve. Al confirmar se llama a
  createOrder, que puede fallar y derivar en la vista de compra fallida.
*/

import { useState } from 'react'
import { Alert, Button, Form } from 'react-bootstrap'
import CartSummary from '../components/CartSummary'
import { useCart } from '../hooks/useCart'
import { hasErrors, validateCustomer } from '../utils/validators'
import { createOrder } from '../utils/checkoutService'

const CAMPOS_INICIALES = { nombre: '', email: '', telefono: '', direccion: '' }

// Un solo bloque para los cuatro campos, ya que comparten el mismo treatment.
const CAMPOS = [
  { name: 'nombre', label: 'Nombre completo', type: 'text', placeholder: 'Ana López' },
  { name: 'email', label: 'Correo electrónico', type: 'email', placeholder: 'ana.lopez@duoc.cl' },
  { name: 'telefono', label: 'Teléfono', type: 'tel', placeholder: '+56 9 6123 4567' },
  { name: 'direccion', label: 'Dirección', type: 'text', placeholder: 'Av. Siempre Viva 742' },
]

function CheckoutPage({ onNavigate, onOrderCreated, onOrderFailed }) {
  const { items, clearCart, increaseQuantity, decreaseQuantity, removeItem } = useCart()
  const [datos, setDatos] = useState(CAMPOS_INICIALES)
  const [errores, setErrores] = useState({})

  function handleChange(event) {
    const { name, value } = event.target
    setDatos((actual) => ({ ...actual, [name]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()

    const nuevosErrores = validateCustomer(datos)
    setErrores(nuevosErrores)

    // No se intenta crear la orden si los datos del cliente no son válidos.
    if (hasErrors(nuevosErrores)) {
      return
    }

    try {
      const orden = createOrder({ cliente: datos, items })
      // El carrito se vacía recién cuando la compra se confirma.
      clearCart()
      onOrderCreated(orden)
      onNavigate('exito')
    } catch (error) {
      onOrderFailed(error)
      onNavigate('falla')
    }
  }

  return (
    <section className="py-4">
      <h2 className="h3 mb-4">Finalizar compra</h2>

      <div className="row g-4">
        <div className="col-12 col-lg-7">
          <h3 className="h5 mb-3">Datos del cliente</h3>

          <Form noValidate onSubmit={handleSubmit}>
            {CAMPOS.map((campo) => (
              <Form.Group className="mb-3" controlId={campo.name} key={campo.name}>
                <Form.Label>{campo.label}</Form.Label>

                <Form.Control
                  type={campo.type}
                  name={campo.name}
                  value={datos[campo.name]}
                  onChange={handleChange}
                  placeholder={campo.placeholder}
                  isInvalid={Boolean(errores[campo.name])}
                  // react-bootstrap solo agrega la clase is-invalid, así que el
                  // atributo aria-invalid se declara para que el lector de
                  // pantalla anuncie el campo con error.
                  aria-invalid={Boolean(errores[campo.name])}
                  aria-describedby={errores[campo.name] ? `${campo.name}-error` : undefined}
                />

                <Form.Control.Feedback type="invalid" id={`${campo.name}-error`}>
                  {errores[campo.name]}
                </Form.Control.Feedback>
              </Form.Group>
            ))}

            <div className="d-flex flex-wrap gap-2 mt-4">
              <Button type="submit" variant="success">
                Confirmar compra
              </Button>

              <Button type="button" variant="outline-secondary" onClick={() => onNavigate('carrito')}>
                Volver al carrito
              </Button>
            </div>
          </Form>
        </div>

        <div className="col-12 col-lg-5">
          <h3 className="h5 mb-3">Resumen de tu compra</h3>

          <CartSummary
            cart={items}
            onIncreaseQuantity={increaseQuantity}
            onDecreaseQuantity={decreaseQuantity}
            onRemoveFromCart={removeItem}
          />

          {items.length === 0 && (
            <Alert variant="warning" className="mt-3">
              No puedes confirmar una compra con el carrito vacío.
            </Alert>
          )}
        </div>
      </div>
    </section>
  )
}

export default CheckoutPage