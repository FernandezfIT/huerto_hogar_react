/*
  Pruebas de ProductDetailPage.

  La página recibe idDelProducto por props, así que se monta sin router. Solo los
  botones que usan useNavigate necesitan MemoryRouter.
*/

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, expect, test } from 'vitest'
import { CartProvider } from '../context/CartProvider'
import ProductDetailPage from './ProductDetailPage'

const CARTAZO = 'huerto-hogar-cart'

function renderDetalle(idDelProducto) {
    return render(
        <MemoryRouter initialEntries={[`/producto/${idDelProducto}`]}>
            <CartProvider>
                <Routes>
                    <Route
                        path="/producto/:id"
                        element={<ProductDetailPage idDelProducto={idDelProducto} />}
                    />
                    {/* Marcadores para comprobar que la navegación ocurrió. */}
                    <Route path="/catalogo" element={<h1>Pantalla del catálogo</h1>} />
                    <Route path="/carrito" element={<h1>Pantalla del carrito</h1>} />
                </Routes>
            </CartProvider>
        </MemoryRouter>
    )
}

beforeEach(() => {
    localStorage.clear()
})

test('muestra el nombre y la descripción del producto', () => {
    renderDetalle('FR001')

    expect(screen.getByRole('heading', { name: 'Manzanas Fuji' })).toBeInTheDocument()
    expect(screen.getByText(/crujientes y dulces/i)).toBeInTheDocument()
})

test('muestra el precio en oferta y el precio normal tachado', () => {
    renderDetalle('FR001')

    expect(screen.getByText('$990')).toBeInTheDocument()
    expect(screen.getByText('$1.200')).toHaveClass('text-decoration-line-through')
    expect(screen.getByText('-18%')).toBeInTheDocument()
})

test('un producto sin oferta muestra solo su precio normal', () => {
    renderDetalle('FR002')

    expect(screen.getByText('$1.000')).toBeInTheDocument()
    expect(screen.queryByText(/^-\d+%$/)).not.toBeInTheDocument()
})

test('muestra el origen, la categoría, la unidad y el stock', () => {
    renderDetalle('PO001')

    expect(screen.getByText('Región de La Araucanía')).toBeInTheDocument()
    expect(screen.getByText('frasco de 500g')).toBeInTheDocument()
    expect(screen.getByText('50')).toBeInTheDocument()
})

test('usa el mismo precio que el carrito para un producto en oferta', () => {
    renderDetalle('VR001')

    /* El carrito cobra $790 por zanahorias, no $900. */
    expect(screen.getByText('$790')).toBeInTheDocument()
})

test('la imagen usa el nombre del producto como texto alternativo', () => {
    renderDetalle('VR002')

    expect(screen.getByAltText('Espinacas Frescas')).toBeInTheDocument()
})

test('agregar al carrito guarda el producto en localStorage', async () => {
    const user = userEvent.setup()

    renderDetalle('FR002')

    await user.click(screen.getByRole('button', { name: /agregar naranjas valencia al carrito/i }))

    const guardado = JSON.parse(localStorage.getItem(CARTAZO))

    expect(guardado).toHaveLength(1)
    expect(guardado[0].id).toBe('FR002')
    expect(guardado[0].cantidad).toBe(1)
})

test('volver al catálogo navega a /catalogo', async () => {
    const user = userEvent.setup()

    renderDetalle('FR001')

    await user.click(screen.getByRole('button', { name: /volver al catálogo/i }))

    expect(screen.getByRole('heading', { name: /pantalla del catálogo/i })).toBeInTheDocument()
})

test('ver carrito navega a /carrito', async () => {
    const user = userEvent.setup()

    renderDetalle('FR001')

    await user.click(screen.getByRole('button', { name: /^ver carrito$/i }))

    expect(screen.getByRole('heading', { name: /pantalla del carrito/i })).toBeInTheDocument()
})

/* --- producto inexistente --- */

test('un id desconocido avisa que no se encontró el producto', () => {
    renderDetalle('NO001')

    expect(
        screen.getByRole('heading', { name: /no encontramos ese producto/i })
    ).toBeInTheDocument()
    expect(screen.getByText(/ya no está disponible/i)).toBeInTheDocument()
})

test('un id desconocido no muestra el botón de agregar al carrito', () => {
    renderDetalle('NO001')

    expect(screen.queryByRole('button', { name: /agregar.*al carrito/i })).not.toBeInTheDocument()
})

test('desde el error se puede volver al catálogo', async () => {
    const user = userEvent.setup()

    renderDetalle('NO001')

    await user.click(screen.getByRole('button', { name: /ver catálogo/i }))

    expect(screen.getByRole('heading', { name: /pantalla del catálogo/i })).toBeInTheDocument()
})
