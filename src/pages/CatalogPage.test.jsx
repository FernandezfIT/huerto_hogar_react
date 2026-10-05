import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, expect, test } from 'vitest'
import { CartProvider } from '../context/CartProvider'
import { products } from '../data/products'
import CatalogPage from './CatalogPage'

function renderCatalog(rutaInicial = '/catalogo') {
    return render(
        <MemoryRouter initialEntries={[rutaInicial]}>
            <CartProvider>
                <Routes>
                    <Route path="/catalogo" element={<CatalogPage />} />
                    {/* Marcador para comprobar que la navegación ocurrió. */}
                    <Route path="/carrito" element={<h1>Pantalla del carrito</h1>} />
                    <Route path="/ofertas" element={<h1>Pantalla de ofertas</h1>} />
                    <Route path="/categorias" element={<h1>Pantalla de categorías</h1>} />
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

/* --- búsqueda --- */

test('buscar por nombre deja solo el producto que coincide', async () => {
    const user = userEvent.setup()

    renderCatalog()

    await user.type(screen.getByLabelText(/buscar productos/i), 'miel')

    expect(screen.getAllByRole('button', { name: /agregar.*al carrito/i })).toHaveLength(1)
    expect(screen.getByRole('heading', { name: /miel orgánica/i })).toBeInTheDocument()
})

test('buscar ignora mayúsculas y tildes', async () => {
    const user = userEvent.setup()

    renderCatalog()

    /* "PLATANO" tiene que encontrar "Plátanos Cavendish". */
    await user.type(screen.getByLabelText(/buscar productos/i), 'PLATANO')

    expect(screen.getByRole('heading', { name: /plátanos/i })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: /miel/i })).not.toBeInTheDocument()
})

test('la búsqueda se combina con el filtro de categoría', async () => {
    const user = userEvent.setup()

    renderCatalog()

    await user.click(screen.getByRole('button', { name: /verduras orgánicas/i }))
    await user.type(screen.getByLabelText(/buscar productos/i), 'espinacas')

    expect(screen.getAllByRole('button', { name: /agregar.*al carrito/i })).toHaveLength(1)
    expect(screen.getByRole('heading', { name: /espinacas/i })).toBeInTheDocument()
})

test('sin coincidencias avisa con un mensaje y no rompe la vista', async () => {
    const user = userEvent.setup()

    renderCatalog()

    await user.type(screen.getByLabelText(/buscar productos/i), 'zzzz')

    expect(
        screen.getByText(/no encontramos productos para "zzzz"/i)
    ).toBeInTheDocument()

    /* Con cero resultados no hay ningún botón, y queryAllByRole no falla. */
    expect(screen.queryAllByRole('button', { name: /agregar.*al carrito/i })).toHaveLength(0)
})

test('el contador de resultados anuncia cuántos son', async () => {
    const user = userEvent.setup()

    renderCatalog()

    await user.type(screen.getByLabelText(/buscar productos/i), 'miel')

    expect(screen.getByRole('status')).toHaveTextContent('1 producto encontrado.')
})

test('el botón Limpiar restaura el catálogo completo', async () => {
    const user = userEvent.setup()

    renderCatalog()

    await user.type(screen.getByLabelText(/buscar productos/i), 'miel')
    await user.click(screen.getByRole('button', { name: /limpiar/i }))

    expect(screen.getByLabelText(/buscar productos/i)).toHaveValue('')
    expect(screen.getAllByRole('button', { name: /agregar.*al carrito/i })).toHaveLength(7)
})

/* --- filtros en la URL --- */

test('abre filtrado si la URL trae una categoría', () => {
    /* Es lo que hace CategoriesPage al linkear a una categoría. */
    renderCatalog('/catalogo?categoria=Verduras%20Org%C3%A1nicas')

    expect(screen.getAllByRole('button', { name: /agregar.*al carrito/i })).toHaveLength(3)
    expect(screen.queryByRole('heading', { name: /manzanas/i })).not.toBeInTheDocument()
})

test('abre con la búsqueda de la URL si viene el parámetro q', () => {
    renderCatalog('/catalogo?q=miel')

    expect(screen.getByLabelText(/buscar productos/i)).toHaveValue('miel')
    expect(screen.getAllByRole('button', { name: /agregar.*al carrito/i })).toHaveLength(1)
})

test('ignora una categoría desconocida que llegue en la URL', () => {
    /* Con state local esto no podría pasar; con URL hay que tolerar basura. */
    renderCatalog('/catalogo?categoria=Categoria%20Inventada')

    expect(screen.queryAllByRole('button', { name: /agregar.*al carrito/i })).toHaveLength(0)
    expect(screen.getByText(/no hay productos en esta categoría/i)).toBeInTheDocument()
})

test('el botón de categorías lleva a la vista de categorías', async () => {
    const user = userEvent.setup()

    renderCatalog()

    /* React-Bootstrap le pone role="button" al <a> que renderiza Button as={Link},
       así que el rol accesible es button y no link. */
    await user.click(screen.getByRole('button', { name: /ver categorías/i }))

    expect(screen.getByRole('heading', { name: /pantalla de categorías/i })).toBeInTheDocument()
})

test('el botón de ofertas lleva a la vista de ofertas', async () => {
    const user = userEvent.setup()

    renderCatalog()

    await user.click(screen.getByRole('button', { name: /ver ofertas/i }))

    expect(screen.getByRole('heading', { name: /pantalla de ofertas/i })).toBeInTheDocument()
})
