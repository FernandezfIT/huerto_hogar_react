/*
   Pruebas de integración de App.

   Verifican el cableado completo con React Router: home, catálogo, detalle de
   producto, categorías, ofertas, carrito, checkout y confirmación de compra.

   El primer test recorre toda la aplicación y renderiza las siete tarjetas
   del catálogo, así que se le da un timeout más alto que el de Vitest (5 s).

   Los comentarios de este archivo están en UTF-8: la versión anterior traía
   mojibake en vez de los caracteres acentuados.
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

test('flujo completo: catálogo → detalle → carrito → checkout', async () => {
  /*
    Recorre el camino que se había roto: el nombre del producto enlaza a
    /producto/:id, esa ruta no existía y el catch-all mandaba a Home. Este test
    comprueba que desde la tarjeta se llegue a la ficha y que desde la ficha se
    pueda agregar al carrito antes de ir al checkout.
  */
  const user = userEvent.setup()
  render(<App />)

  // 1. Ir al catálogo y abrir la ficha de las manzanas.
  await user.click(screen.getByRole('link', { name: /catálogo/i }))
  await user.click(screen.getByRole('link', { name: /manzanas fuji/i }))

  expect(screen.getByRole('heading', { name: /^manzanas fuji$/i })).toBeInTheDocument()
  // La ficha aplica el precio de oferta igual que el carrito.
  expect(screen.getByText('$990')).toBeInTheDocument()

  // 2. Agregar desde la ficha, no desde la tarjeta.
  await user.click(
    screen.getByRole('button', { name: /agregar manzanas fuji al carrito/i }),
  )

  expect(screen.getByRole('link', { name: /carrito\s*1/i })).toBeInTheDocument()

  // 3. Ir al carrito: el producto llegó desde la ficha.
  await user.click(screen.getByRole('button', { name: /ver carrito/i }))
  expect(screen.getByText('Manzanas Fuji')).toBeInTheDocument()

  // 4. Y desde ahí seguir al checkout.
  await user.click(screen.getByRole('button', { name: /ir al checkout/i }))
  expect(screen.getByRole('heading', { name: /finalizar compra/i })).toBeInTheDocument()
}, 20000)

test('un id de producto desconocido avisa y no rompe la app', async () => {
  /*
    Entra directo por URL, como haría alguien que guardó un enlace viejo.
    Antes caía en el catch-all y aparecía Home sin explicación.
  */
  window.history.pushState({}, '', '/producto/NO001')
  render(<App />)

  expect(
    screen.getByRole('heading', { name: /no encontramos ese producto/i }),
  ).toBeInTheDocument()
})

test('la vista de categorías lleva al catálogo filtrado', async () => {
  const user = userEvent.setup()
  render(<App />)

  // 1. Entrar a categorías.
  await user.click(screen.getByRole('link', { name: /catálogo/i }))
  await user.click(screen.getByRole('button', { name: /ver categorías/i }))

  expect(screen.getByRole('heading', { name: /^categorías$/i })).toBeInTheDocument()

  // 2. Entrar por una categoría concreta.
  await user.click(screen.getByRole('link', { name: /ver productos de verduras orgánicas/i }))

  // 3. El catálogo llega con los 3 productos de esa categoría, no con los 7.
  expect(screen.getAllByRole('button', { name: /agregar.*al carrito/i })).toHaveLength(3)
  expect(screen.getByRole('heading', { name: /zanahorias orgánicas/i })).toBeInTheDocument()
  expect(screen.queryByRole('heading', { name: /manzanas fuji/i })).not.toBeInTheDocument()
}, 20000)

test('la vista de ofertas muestra solo los productos en oferta', async () => {
  const user = userEvent.setup()
  render(<App />)

  await user.click(screen.getByRole('link', { name: /catálogo/i }))
  await user.click(screen.getByRole('button', { name: /ver ofertas/i }))

  expect(screen.getByRole('heading', { name: /ofertas de la semana/i })).toBeInTheDocument()
  expect(screen.getAllByRole('button', { name: /agregar.*al carrito/i })).toHaveLength(3)
  expect(screen.queryByRole('heading', { name: /miel orgánica/i })).not.toBeInTheDocument()
})
