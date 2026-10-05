/*
  Pruebas de CheckoutPage.

  createOrder se envuelve con vi.mock para poder forzar el fallo de la compra
  sin tocar el resto del módulo, y así probar la ruta de error de forma
  determinista.
*/

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import { CartProvider } from '../context/CartProvider'
import { conCarrito, manzana, naranja, seedCart } from '../test/cartFixtures'
import CheckoutPage from './CheckoutPage'

const control = vi.hoisted(() => ({ fallo: null }))

vi.mock('../utils/checkoutService', async (importOriginal) => {
  const actual = await importOriginal()

  return {
    ...actual,
    createOrder: (argumentos) => {
      if (control.fallo) {
        throw new Error(control.fallo)
      }

      return actual.createOrder(argumentos)
    },
  }
})

const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>

const DATOS_VALIDOS = {
  nombre: 'Ana Lopez',
  email: 'ana.lopez@duoc.cl',
  telefono: '+56912345678',
  direccion: 'Av. Siempre Viva 742',
}

function renderPage() {
  const onNavigate = vi.fn()
  const onOrderCreated = vi.fn()
  const onOrderFailed = vi.fn()

  render(
    <CheckoutPage
      onNavigate={onNavigate}
      onOrderCreated={onOrderCreated}
      onOrderFailed={onOrderFailed}
    />,
    { wrapper },
  )

  return { onNavigate, onOrderCreated, onOrderFailed }
}

async function completarFormulario(user, datos = DATOS_VALIDOS) {
  await user.type(screen.getByLabelText(/nombre completo/i), datos.nombre)
  await user.type(screen.getByLabelText(/correo electrónico/i), datos.email)
  await user.type(screen.getByLabelText(/teléfono/i), datos.telefono)
  await user.type(screen.getByLabelText(/dirección/i), datos.direccion)
}

beforeEach(() => {
  control.fallo = null
  localStorage.clear()
  seedCart(conCarrito(manzana, naranja))
})

describe('formulario', () => {
  test('renderiza los cuatro campos de datos del cliente', () => {
    renderPage()

    expect(screen.getByLabelText(/nombre completo/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/teléfono/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/dirección/i)).toBeInTheDocument()
  })

  test('enviar el formulario vacío reporta los cuatro errores', async () => {
    const user = userEvent.setup()
    renderPage()

    await user.click(screen.getByRole('button', { name: /confirmar compra/i }))

    expect(screen.getByText(/ingresa tu nombre completo/i)).toBeInTheDocument()
    expect(screen.getByText(/ingresa tu correo electrónico/i)).toBeInTheDocument()
    expect(screen.getByText(/ingresa tu teléfono/i)).toBeInTheDocument()
    expect(screen.getByText(/ingresa tu dirección/i)).toBeInTheDocument()
  })

  test('un email inválido se reporta solo en ese campo', async () => {
    const user = userEvent.setup()
    renderPage()

    await completarFormulario(user, { ...DATOS_VALIDOS, email: 'correo-malo' })
    await user.click(screen.getByRole('button', { name: /confirmar compra/i }))

    expect(screen.getByText(/correo electrónico no es válido/i)).toBeInTheDocument()
    expect(screen.queryByText(/ingresa tu nombre completo/i)).not.toBeInTheDocument()
  })

  test('un teléfono demasiado corto se rechaza', async () => {
    const user = userEvent.setup()
    renderPage()

    await completarFormulario(user, { ...DATOS_VALIDOS, telefono: '123' })
    await user.click(screen.getByRole('button', { name: /confirmar compra/i }))

    expect(screen.getByText(/al menos 8 dígitos/i)).toBeInTheDocument()
  })

  test('el campo con error queda marcado como inválido', async () => {
    const user = userEvent.setup()
    renderPage()

    await user.click(screen.getByRole('button', { name: /confirmar compra/i }))

    expect(screen.getByLabelText(/nombre completo/i)).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByLabelText(/dirección/i)).toHaveAttribute('aria-invalid', 'true')
  })

  test('el mensaje de error se asocia al campo', async () => {
    const user = userEvent.setup()
    renderPage()

    await user.click(screen.getByRole('button', { name: /confirmar compra/i }))

    const campo = screen.getByLabelText(/nombre completo/i)
    const mensaje = screen.getByText(/ingresa tu nombre completo/i)

    expect(campo).toHaveAttribute('aria-describedby', mensaje.id)
  })

  test('con datos inválidos no se crea la orden ni se navega', async () => {
    const user = userEvent.setup()
    const { onNavigate, onOrderCreated } = renderPage()

    await user.click(screen.getByRole('button', { name: /confirmar compra/i }))

    expect(onOrderCreated).not.toHaveBeenCalled()
    expect(onNavigate).not.toHaveBeenCalled()
  })

  test('un error de validación no vacía el carrito', async () => {
    const user = userEvent.setup()
    renderPage()

    await user.click(screen.getByRole('button', { name: /confirmar compra/i }))

    expect(screen.getByText('Manzanas Fuji')).toBeInTheDocument()
    expect(screen.getByText('Naranjas Valencia')).toBeInTheDocument()
  })
})

describe('compra exitosa', () => {
  test('crea la orden, vacía el carrito y navega al éxito', async () => {
    const user = userEvent.setup()
    const { onNavigate, onOrderCreated } = renderPage()

    await completarFormulario(user)
    await user.click(screen.getByRole('button', { name: /confirmar compra/i }))

    expect(onOrderCreated).toHaveBeenCalledTimes(1)
    expect(onNavigate).toHaveBeenCalledWith('exito')
    expect(screen.getByText(/el carrito está vacío/i)).toBeInTheDocument()
  })

  test('la orden guarda el total con el precio de oferta aplicado', async () => {
    const user = userEvent.setup()
    const { onOrderCreated } = renderPage()

    await completarFormulario(user)
    await user.click(screen.getByRole('button', { name: /confirmar compra/i }))

    const orden = onOrderCreated.mock.calls[0][0]

    expect(orden.total).toBe(2000)
    expect(orden.cliente.email).toBe('ana.lopez@duoc.cl')
    expect(orden.id).toMatch(/^HH-\d{4}$/)
  })

  test('el botón de volver lleva al carrito', async () => {
    const user = userEvent.setup()
    const { onNavigate } = renderPage()

    await user.click(screen.getByRole('button', { name: /volver al carrito/i }))

    expect(onNavigate).toHaveBeenCalledWith('carrito')
  })
})

describe('carrito vacío', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  test('advierte que no se puede confirmar la compra', () => {
    renderPage()

    expect(screen.getByText(/carrito vacío/i)).toBeInTheDocument()
  })
})

describe('compra fallida', () => {
  test('informa el error y navega a la vista de fallo', async () => {
    control.fallo = 'No hay stock suficiente de Manzanas Fuji.'
    const user = userEvent.setup()
    const { onNavigate, onOrderCreated, onOrderFailed } = renderPage()

    await completarFormulario(user)
    await user.click(screen.getByRole('button', { name: /confirmar compra/i }))

    expect(onOrderFailed).toHaveBeenCalledTimes(1)
    expect(onOrderFailed.mock.calls[0][0].message).toMatch(/stock suficiente/i)
    expect(onOrderCreated).not.toHaveBeenCalled()
    expect(onNavigate).toHaveBeenCalledWith('falla')
  })

  test('un fallo no vacía el carrito', async () => {
    control.fallo = 'No hay stock suficiente de Manzanas Fuji.'
    const user = userEvent.setup()
    renderPage()

    await completarFormulario(user)
    await user.click(screen.getByRole('button', { name: /confirmar compra/i }))

    expect(screen.getByText('Manzanas Fuji')).toBeInTheDocument()
  })
})