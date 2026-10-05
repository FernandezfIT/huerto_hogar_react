/*
  Pruebas de CategoriesPage.

  La página deriva las categorías de los productos que existen, así que con el
  catálogo actual muestra 3: Frutas Frescas, Verduras Orgánicas y Productos
  Orgánicos. "Productos Lácteos" viene del enunciado pero no tiene productos, y
  por eso no aparece.
*/

import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { expect, test } from 'vitest'
import CategoriesPage from './CategoriesPage'

function renderCategorias() {
    return render(
        <MemoryRouter initialEntries={['/categorias']}>
            <CategoriesPage />
        </MemoryRouter>
    )
}

test('muestra el encabezado de la vista de categorías', () => {
    renderCategorias()

    expect(screen.getByRole('heading', { name: /^categorías$/i })).toBeInTheDocument()
})

test('muestra una tarjeta por cada categoría con productos', () => {
    renderCategorias()

    expect(screen.getByRole('heading', { name: /frutas frescas/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /verduras orgánicas/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /productos orgánicos/i })).toBeInTheDocument()
})

test('no muestra la categoría que quedó sin productos', () => {
    renderCategorias()

    expect(screen.queryByRole('heading', { name: /lácteos/i })).not.toBeInTheDocument()
})

test('muestra la descripción que estaba escrita en categories.js', () => {
    renderCategorias()

    /* Estas descripciones antes nunca se renderizaban en ninguna vista. */
    expect(screen.getByText(/cultivadas sin el uso de pesticidas/i)).toBeInTheDocument()
    expect(screen.getByText(/experiencia directa del campo a tu hogar/i)).toBeInTheDocument()
})

test('cada categoría muestra cuántos productos tiene', () => {
    renderCategorias()

    const manchas = screen.getByRole('heading', { name: /frutas frescas/i }).closest('.card')

    expect(manchas).toHaveTextContent('3')
})

test('cada categoría enlaza al catálogo ya filtrado', () => {
    renderCategorias()

    expect(
        screen.getByRole('link', { name: /ver productos de verduras orgánicas/i })
    ).toHaveAttribute('href', '/catalogo?categoria=Verduras%20Org%C3%A1nicas')
})

test('el enlace codifica los acentos de la categoría', () => {
    renderCategorias()

    /* Sin encodeURIComponent la URL quedaría con acentos sueltos y el catálogo
       no la interpretaría igual. */
    const enlace = screen.getByRole('link', { name: /ver productos de frutas frescas/i })

    expect(enlace.getAttribute('href')).toBe(
        '/catalogo?categoria=Frutas%20Frescas'
    )
    expect(enlace.getAttribute('href')).not.toContain('ó')
})

test('el enlace de productos orgánicos conserva los espacios', () => {
    renderCategorias()

    expect(
        screen.getByRole('link', { name: /ver productos de productos orgánicos/i })
    ).toHaveAttribute('href', '/catalogo?categoria=Productos%20Org%C3%A1nicos')
})
