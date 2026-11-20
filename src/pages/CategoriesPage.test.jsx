/*
  Pruebas de CategoriesPage.

  La página deriva las categorías (metadatos de la API) de los productos que existen, así que con el
  catálogo actual muestra 3: Frutas Frescas, Verduras Orgánicas y Productos
  Orgánicos. "Productos Lácteos" viene del enunciado pero no tiene productos, y
  por eso no aparece.
*/

import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { expect, test, vi } from 'vitest'
import { CatalogProvider } from '../context/CatalogProvider'
import { getCategories } from '../services/productService'
import CategoriesPage from './CategoriesPage'

// reemplaza el servicio real por el falso
vi.mock('../services/productService', () => import('../test/fakeProductService'))

function renderCategorias() {
    return render(
        <MemoryRouter initialEntries={['/categorias']}>
            <CatalogProvider>
                <CategoriesPage />
            </CatalogProvider>
        </MemoryRouter>
    )
}

// muestra la pagina y espera a que termine la carga
async function cargarCategorias() {
    renderCategorias()
    await waitFor(() => expect(screen.queryByText(/cargando cat/i)).not.toBeInTheDocument())
}

test('muestra el encabezado de la vista de categorías', async () => {
    await cargarCategorias()

    expect(screen.getByRole('heading', { name: /^categorías$/i })).toBeInTheDocument()
})

test('muestra una tarjeta por cada categoría con productos', async () => {
    await cargarCategorias()

    expect(screen.getByRole('heading', { name: /frutas frescas/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /verduras orgánicas/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /productos orgánicos/i })).toBeInTheDocument()
})

test('no muestra la categoría que quedó sin productos', async () => {
    await cargarCategorias()

    expect(screen.queryByRole('heading', { name: /lácteos/i })).not.toBeInTheDocument()
})

test('muestra la descripción de cada categoría', async () => {
    await cargarCategorias()

    expect(screen.getByText(/cultivadas sin el uso de pesticidas/i)).toBeInTheDocument()
    expect(screen.getByText(/experiencia directa del campo a tu hogar/i)).toBeInTheDocument()
})

test('cada categoría muestra cuántos productos tiene', async () => {
    await cargarCategorias()

    const manchas = screen.getByRole('heading', { name: /frutas frescas/i }).closest('.card')

    expect(manchas).toHaveTextContent('3')
})

test('cada categoría enlaza al catálogo ya filtrado', async () => {
    await cargarCategorias()

    expect(
        screen.getByRole('link', { name: /ver productos de verduras orgánicas/i })
    ).toHaveAttribute('href', '/catalogo?categoria=Verduras%20Org%C3%A1nicas')
})

test('el enlace codifica los acentos de la categoría', async () => {
    await cargarCategorias()

    /* Sin encodeURIComponent la URL quedaría con acentos sueltos y el catálogo
       no la interpretaría igual. */
    const enlace = screen.getByRole('link', { name: /ver productos de frutas frescas/i })

    expect(enlace.getAttribute('href')).toBe(
        '/catalogo?categoria=Frutas%20Frescas'
    )
    expect(enlace.getAttribute('href')).not.toContain('ó')
})

test('el enlace de productos orgánicos conserva los espacios', async () => {
    await cargarCategorias()

    expect(
        screen.getByRole('link', { name: /ver productos de productos orgánicos/i })
    ).toHaveAttribute('href', '/catalogo?categoria=Productos%20Org%C3%A1nicos')
})

// si la api falla no se muestran categorias
test('si la API falla muestra error y ninguna categoría', async () => {
    getCategories.mockRejectedValueOnce(new Error('API caída'))

    renderCategorias()

    expect(await screen.findByRole('alert')).toHaveTextContent(/no pudimos cargar el catálogo/i)
    expect(screen.queryByRole('heading', { name: /frutas frescas/i })).not.toBeInTheDocument()
})
