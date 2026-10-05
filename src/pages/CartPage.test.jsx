/*
  Pruebas de CartPage.

  Las pruebas se montan sobre CartProvider y se siembran los productos en
  localStorage, que es de donde el provider lee el carrito al montar.
*/

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import { CartProvider } from '../context/CartProvider'
import { conCarrito, manzana, naranja, seedCart } from '../test/cartFixtures'
import CartPage from './CartPage'

const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>

function renderPage() {
  const onNavigate = vi.fn()
  render(<CartPage onNavigate={onNavigate} />, { wrapper })

  return { onNavigate }
}

beforeEach(() => {
  localStorage.clear()
})

describe('con el carrito vacío', () => {
  test('muestra el encabezado de la página', () => {
    renderPage()

    expect(screen.getByRole('heading', { name: /carrito de compras/i })).toBeInTheDocument()
  })

  test('avisa que el carrito está vacío', () => {
    renderPage()

    expect(screen.getByText(/el carrito está vacío/i)).toBeInTheDocument()
  })

  test('no ofrece ir al checkout sin productos', () => {
    renderPage()

    expect(screen.queryByRole('button', { name: /ir al checkout/i })).not.toBeInTheDocument()
  })

  test('invita a volver al catálogo', async () => {
    const user = userEvent.setup()
    const { onNavigate } = renderPage()

    await user.click(screen.getByRole('button', { name: /ver productos/i }))

    expect(onNavigate).toHaveBeenCalledWith('catalogo')
  })
})

describe('con productos en el carrito', () => {
  beforeEach(() => {
    seedCart(conCarrito(manzana, naranja))
  })

  test('muestra cada producto del carrito', () => {
    renderPage()

    expect(screen.getByText('Manzanas Fuji')).toBeInTheDocument()
    expect(screen.getByText('Naranjas Valencia')).toBeInTheDocument()
  })

  test('muestra el total a pagar ya formateado', () => {
    renderPage()

    // 1200 sin oferta + 800 en oferta
    expect(screen.getByText(/total a pagar/i)).toHaveTextContent('$2.000')
  })

  test('el botón de checkout lleva al paso siguiente', async () => {
    const user = userEvent.setup()
    const { onNavigate } = renderPage()

    await user.click(screen.getByRole('button', { name: /ir al checkout/i }))

    expect(onNavigate).toHaveBeenCalledWith('checkout')
  })

  test('el botón de seguir comprando vuelve al catálogo', async () => {
    const user = userEvent.setup()
    const { onNavigate } = renderPage()

    await user.click(screen.getByRole('button', { name: /seguir comprando/i }))

    expect(onNavigate).toHaveBeenCalledWith('catalogo')
  })

  test('permite vaciar el carrito', async () => {
    const user = userEvent.setup()
    renderPage()

    await user.click(screen.getByRole('button', { name: /vaciar carrito/i }))

    expect(screen.getByText(/el carrito está vacío/i)).toBeInTheDocument()
  })

  test('elimina un producto puntual', async () => {
    const user = userEvent.setup()
    renderPage()

    await user.click(screen.getByRole('button', { name: /eliminar manzanas fuji del carrito/i }))

    expect(screen.queryByText('Manzanas Fuji')).not.toBeInTheDocument()
    expect(screen.getByText('Naranjas Valencia')).toBeInTheDocument()
  })
})