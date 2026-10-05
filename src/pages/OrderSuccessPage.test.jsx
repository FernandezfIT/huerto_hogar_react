/*
  Pruebas de OrderSuccessPage.

  La orden es un dato fijo: la página solo la presenta, sin pedir al carrito.
*/

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, test, vi } from 'vitest'
import OrderSuccessPage from './OrderSuccessPage'

const orden = {
  id: 'HH-0007',
  cliente: { nombre: 'Ana Lopez', email: 'ana.lopez@duoc.cl' },
  items: [
    { id: 'FR001', nombre: 'Manzanas Fuji', cantidad: 2, precioUnitario: 1200, subtotal: 2400 },
    { id: 'FR002', nombre: 'Naranjas Valencia', cantidad: 1, precioUnitario: 800, subtotal: 800 },
  ],
  total: 3200,
}

function renderPage(order = orden) {
  const onNavigate = vi.fn()
  render(<OrderSuccessPage order={order} onNavigate={onNavigate} />)

  return { onNavigate }
}

describe('confirmación de la compra', () => {
  test('anuncia que la compra fue exitosa', () => {
    renderPage()

    expect(
      screen.getByRole('heading', { name: /compra realizada con éxito/i }),
    ).toBeInTheDocument()
  })

  test('agradece al cliente usando los datos de la orden', () => {
    renderPage()

    expect(screen.getByText(/gracias ana lopez/i)).toBeInTheDocument()
    expect(screen.getByText(/ana\.lopez@duoc\.cl/)).toBeInTheDocument()
  })

  test('muestra el número de orden', () => {
    renderPage()

    expect(screen.getByText('HH-0007')).toBeInTheDocument()
  })

  test('detalla cada línea con su cantidad', () => {
    renderPage()

    expect(screen.getByText('Manzanas Fuji x 2')).toBeInTheDocument()
    expect(screen.getByText('Naranjas Valencia x 1')).toBeInTheDocument()
  })

  test('muestra los subtotales y el total general', () => {
    renderPage()

    expect(screen.getByText('$2.400')).toBeInTheDocument()
    expect(screen.getByText('$800')).toBeInTheDocument()
    expect(screen.getByText('$3.200')).toBeInTheDocument()
  })

  test('permite volver al catálogo', async () => {
    const user = userEvent.setup()
    const { onNavigate } = renderPage()

    await user.click(screen.getByRole('button', { name: /volver al catálogo/i }))

    expect(onNavigate).toHaveBeenCalledWith('catalogo')
  })
})

describe('sin orden disponible', () => {
  test('avisa que no hay ninguna compra que mostrar', () => {
    renderPage(null)

    expect(
      screen.getByRole('heading', { name: /no hay ninguna compra/i }),
    ).toBeInTheDocument()
  })

  test('una orden sin líneas muestra el total en cero', () => {
    renderPage({ ...orden, items: [], total: 0 })

    expect(screen.getByText('$0')).toBeInTheDocument()
    expect(screen.getByText('HH-0007')).toBeInTheDocument()
  })
})