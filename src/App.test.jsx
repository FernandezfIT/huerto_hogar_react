/*
   Pruebas de integraci��n de App.

   Verifican el cableado completo con React Router: home, cat��logo, carrito,
   checkout y confirmaci��n de compra.

   El primer test recorre toda la aplicaci��n y renderiza las siete tarjetas
   del cat��logo, as�� que se le da un timeout m��s alto que el de Vitest (5 s).
*/

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, expect, test } from 'vitest'
import App from './App'

beforeEach(() => {
  localStorage.clear()
  window.history.pushState({}, '', '/')
})

test('flujo completo: home → catálogo → carrito → checkout → éxito', async () => {
  const user = userEvent.setup()
  render(<App />)

  // 1. Home: navegar al catálogo
  await user.click(screen.getByRole('link', { name: /catálogo/i }))

  // 2. Catálogo: se agrega el primer producto
  await user.click(screen.getAllByRole('button', { name: /agregar.*al carrito/i })[0])

  expect(screen.getByRole('link', { name: /carrito\s*1/i })).toBeInTheDocument()
  expect(localStorage.getItem('huerto-hogar-cart')).toContain('FR001')

  // 3. Navegar al carrito
  await user.click(screen.getByRole('link', { name: /carrito\s*1/i }))

  expect(screen.getByRole('heading', { name: /carrito de compras/i })).toBeInTheDocument()
  expect(screen.getByText('Manzanas Fuji')).toBeInTheDocument()
  // El carrito cobra precioOferta cuando existe, asi que Manzanas Fuji
  // (precio 1200, precioOferta 990) suma $990 y no $1.200.
  expect(screen.getByText(/total a pagar/i)).toHaveTextContent('$990')

  // 4. Ir al checkout
  await user.click(screen.getByRole('button', { name: /ir al checkout/i }))

  expect(screen.getByRole('heading', { name: /finalizar compra/i })).toBeInTheDocument()

  // 5. Completar y confirmar
  await user.type(screen.getByLabelText(/nombre completo/i), 'Ana Lopez')
  await user.type(screen.getByLabelText(/correo electrónico/i), 'ana.lopez@duoc.cl')
  await user.type(screen.getByLabelText(/teléfono/i), '+56912345678')
  await user.type(screen.getByLabelText(/dirección/i), 'Av. Siempre Viva 742')
  await user.click(screen.getByRole('button', { name: /confirmar compra/i }))

  expect(
    screen.getByRole('heading', { name: /compra realizada con éxito/i }),
  ).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /carrito\s*0/i })).toBeInTheDocument()
  expect(localStorage.getItem('huerto-hogar-cart')).toBe('[]')
}, 20000)

test('el carrito recuperado de localStorage aparece al cargar', async () => {
  const user = userEvent.setup()

  // Primera visita: se navega al catálogo y se agrega un producto.
  const { unmount } = render(<App />)
  await user.click(screen.getByRole('link', { name: /catálogo/i }))
  await user.click(screen.getAllByRole('button', { name: /agregar.*al carrito/i })[0])
  unmount()

  // Segunda visita: el carrito sigue ahí.
  window.history.pushState({}, '', '/')
  render(<App />)
  expect(screen.getByRole('link', { name: /carrito\s*1/i })).toBeInTheDocument()
})