/*
  Pruebas de integración de App.

  Verifican el cableado completo: agregar desde el catálogo, navegar al
  carrito, pasar por el checkout y confirmar la compra. Son las únicas
  pruebas que comprueban que las páginas están conectadas entre sí.
*/

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, expect, test } from 'vitest'
import App from './App'

beforeEach(() => {
  localStorage.clear()
})

test('flujo completo: catálogo → carrito → checkout → éxito', async () => {
  const user = userEvent.setup()
  render(<App />)

  // 1. Catálogo: se agrega el primer producto
  await user.click(screen.getAllByRole('button', { name: /agregar al carrito/i })[0])

  expect(screen.getByRole('button', { name: /carrito \(1\)/i })).toBeInTheDocument()
  expect(localStorage.getItem('huerto-hogar-cart')).toContain('FR001')

  // 2. Navegar al carrito
  await user.click(screen.getByRole('button', { name: /carrito \(1\)/i }))

  expect(screen.getByRole('heading', { name: /carrito de compras/i })).toBeInTheDocument()
  expect(screen.getByText('Manzanas Fuji')).toBeInTheDocument()
  expect(screen.getByText(/total a pagar/i)).toHaveTextContent('$1.200')

  // 3. Ir al checkout
  await user.click(screen.getByRole('button', { name: /ir al checkout/i }))

  expect(screen.getByRole('heading', { name: /finalizar compra/i })).toBeInTheDocument()

  // 4. Completar y confirmar
  await user.type(screen.getByLabelText(/nombre completo/i), 'Ana Lopez')
  await user.type(screen.getByLabelText(/correo electrónico/i), 'ana.lopez@duoc.cl')
  await user.type(screen.getByLabelText(/teléfono/i), '+56912345678')
  await user.type(screen.getByLabelText(/dirección/i), 'Av. Siempre Viva 742')
  await user.click(screen.getByRole('button', { name: /confirmar compra/i }))

  expect(
    screen.getByRole('heading', { name: /compra realizada con éxito/i }),
  ).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /carrito \(0\)/i })).toBeInTheDocument()
  expect(localStorage.getItem('huerto-hogar-cart')).toBe('[]')
})

test('el carrito recuperado de localStorage aparece al cargar', async () => {
  const user = userEvent.setup()

  // Primera visita: se agrega un producto.
  const { unmount } = render(<App />)
  await user.click(screen.getAllByRole('button', { name: /agregar al carrito/i })[0])
  unmount()

  // Segunda visita: el carrito sigue ahí.
  render(<App />)
  expect(screen.getByRole('button', { name: /carrito \(1\)/i })).toBeInTheDocument()
})