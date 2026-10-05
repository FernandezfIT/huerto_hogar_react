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