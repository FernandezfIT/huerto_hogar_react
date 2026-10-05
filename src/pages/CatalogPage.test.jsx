import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, expect, test } from 'vitest'
import { CartProvider } from '../context/CartProvider'
import { products } from '../data/products'
import CatalogPage from './CatalogPage'

function renderCatalog() {
    return render(
        <MemoryRouter initialEntries={['/catalogo']}>
            <CartProvider>
                <Routes>
                    <Route path="/catalogo" element={<CatalogPage />} />
                    {/* Marcador para comprobar que la navegación ocurrió. */}
                    <Route path="/carrito" element={<h1>Pantalla del carrito</h1>} />
                </Routes>
            </CartProvider>
        </MemoryRouter>
    )
}

beforeEach(() => {
    localStorage.clear()
})

test('muestra el catálogo con los productos del enunciado', () => {
    renderCatalog()

    expect(screen.getByRole('heading', { name: /catálogo de productos/i })).toBeInTheDocument()

    /* Las 7 tarjetas del catálogo, una por producto. */
    expect(screen.getAllByRole('button', { name: /agregar.*al carrito/i })).toHaveLength(
        products.length
    )
})

test('el primer producto es Manzanas Fuji y muestra su precio en oferta', () => {
    renderCatalog()

    expect(products[0].nombre).toBe('Manzanas Fuji')
    expect(screen.getByText('$990')).toBeInTheDocument()
    expect(screen.getByText('$1.200')).toHaveClass('text-decoration-line-through')
    expect(screen.getByText('-18%')).toBeInTheDocument()
})

test('agregar un producto desde el catálogo lo guarda en el carrito', async () => {
    const user = userEvent.setup()

    renderCatalog()

    await user.click(screen.getByRole('button', { name: /agregar Manzanas Fuji al carrito/i }))

    expect(JSON.parse(localStorage.getItem('huerto-hogar-cart'))).toHaveLength(1)
})

test('el botón Ver carrito navega al carrito', async () => {
    const user = userEvent.setup()

    renderCatalog()

    await user.click(screen.getByRole('button', { name: /ver carrito/i }))

    expect(screen.getByRole('heading', { name: /pantalla del carrito/i })).toBeInTheDocument()
})

test('el filtro muestra los 7 productos antes de elegir categoría', () => {
    renderCatalog()

    expect(screen.getAllByRole('button', { name: /agregar.*al carrito/i })).toHaveLength(7)
    /* El botón "Todas" no lleva contador: los contadores van por categoría. */
    expect(screen.getByRole('button', { name: /^todas$/i })).toBeInTheDocument()
})

test('filtrar por categoría deja solo los productos de esa categoría', async () => {
    const user = userEvent.setup()

    renderCatalog()

    await user.click(screen.getByRole('button', { name: /verduras orgánicas/i }))

    /* 3 verduras y ningún producto más. */
    expect(screen.getAllByRole('button', { name: /agregar.*al carrito/i })).toHaveLength(3)
    expect(screen.getByRole('heading', { name: /zanahorias/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /espinacas/i })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: /manzanas/i })).not.toBeInTheDocument()
})

test('volver a Todas restaura los 7 productos', async () => {
    const user = userEvent.setup()

    renderCatalog()

    await user.click(screen.getByRole('button', { name: /verduras orgánicas/i }))
    await user.click(screen.getByRole('button', { name: /todas/i }))

    expect(screen.getAllByRole('button', { name: /agregar.*al carrito/i })).toHaveLength(7)
})

test('el filtro no ofrece la categoría de lácteos porque quedó sin productos', () => {
    renderCatalog()

    expect(screen.queryByRole('button', { name: /lácteos/i })).not.toBeInTheDocument()
})