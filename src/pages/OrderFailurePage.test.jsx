/*
  Pruebas de OrderFailurePage.

  La página muestra el motivo real del error, por eso las pruebas cubren tanto
  un error con mensaje como la ausencia de él.
*/

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, test, vi } from 'vitest'
import OrderFailurePage from './OrderFailurePage'

function renderPage(error = new Error('No hay stock suficiente de Manzanas Fuji.')) {
  const onNavigate = vi.fn()
  render(<OrderFailurePage error={error} onNavigate={onNavigate} />)

  return { onNavigate }
}

describe('mensaje de error', () => {
  test('explica que no se pudo completar la compra', () => {
    renderPage()

    expect(
      screen.getByRole('heading', { name: /no pudimos completar tu compra/i }),
    ).toBeInTheDocument()
  })

  test('muestra el motivo real del fallo', () => {
    renderPage()

    expect(screen.getByText(/no hay stock suficiente de manzanas fuji/i)).toBeInTheDocument()
  })

  test('usa un mensaje genérico cuando no hay error', () => {
    renderPage(null)

    expect(screen.getByText(/ocurrió un error inesperado/i)).toBeInTheDocument()
  })

  test('informa que el carrito se mantiene intacto', () => {
    renderPage()

    expect(screen.getByText(/tu carrito se mantiene intacto/i)).toBeInTheDocument()
  })
})

describe('navegación desde el error', () => {
  test('permite volver al carrito para reintentar', async () => {
    const user = userEvent.setup()
    const { onNavigate } = renderPage()

    await user.click(screen.getByRole('button', { name: /volver al carrito/i }))

    expect(onNavigate).toHaveBeenCalledWith('carrito')
  })

  test('permite ir al catálogo', async () => {
    const user = userEvent.setup()
    const { onNavigate } = renderPage()

    await user.click(screen.getByRole('button', { name: /ver catálogo/i }))

    expect(onNavigate).toHaveBeenCalledWith('catalogo')
  })
})