import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, expect, test, vi } from 'vitest'
import { CartProvider } from '../context/CartProvider'
import { CatalogProvider } from '../context/CatalogProvider'
import { products } from '../data/products'
import { getProducts } from '../services/productService'
import CatalogPage from './CatalogPage'

function renderCatalog(rutaInicial = '/catalogo') {
    return render(
        <MemoryRouter initialEntries={[rutaInicial]}>
            <CatalogProvider>
            <CartProvider>
                <Routes>
                    <Route path="/catalogo" element={<CatalogPage />} />
                    {/* Marcador para comprobar que la navegación ocurrió. */}
                    <Route path="/carrito" element={<h1>Pantalla del carrito</h1>} />
                    <Route path="/ofertas" element={<h1>Pantalla de ofertas</h1>} />
                    <Route path="/categorias" element={<h1>Pantalla de categorías</h1>} />
                </Routes>
            </CartProvider>
            </CatalogProvider>
        </MemoryRouter>
    )
}

// reemplaza el servicio real por el falso
vi.mock('../services/productService', () => import('../test/fakeProductService'))

// muestra la pagina y espera a que termine la carga
async function cargarCatalogo(ruta) {
    renderCatalog(ruta)
    await waitFor(() => expect(screen.queryByText(/cargando cat/i)).not.toBeInTheDocument())
}

beforeEach(() => {
    localStorage.clear()
})

test('muestra el catálogo con los productos del enunciado', async () => {
    await cargarCatalogo()

    expect(screen.getByRole('heading', { name: /catálogo de productos/i })).toBeInTheDocument()

    /* Las 7 tarjetas del catálogo, una por producto. */
    expect(screen.getAllByRole('button', { name: /agregar.*al carrito/i })).toHaveLength(
        products.length
    )
})

test('el primer producto es Manzanas Fuji y muestra su precio en oferta', async () => {
    await cargarCatalogo()

    expect(products[0].nombre).toBe('Manzanas Fuji')
    expect(screen.getByText('$990')).toBeInTheDocument()
    expect(screen.getByText('$1.200')).toHaveClass('text-decoration-line-through')
    expect(screen.getByText('-18%')).toBeInTheDocument()
})

test('agregar un producto desde el catálogo lo guarda en el carrito', async () => {
    const user = userEvent.setup()

    await cargarCatalogo()

    await user.click(screen.getByRole('button', { name: /agregar Manzanas Fuji al carrito/i }))

    expect(JSON.parse(localStorage.getItem('huerto-hogar-cart'))).toHaveLength(1)
})

test('el botón Ver carrito navega al carrito', async () => {
    const user = userEvent.setup()

    await cargarCatalogo()

    await user.click(screen.getByRole('button', { name: /ver carrito/i }))

    expect(screen.getByRole('heading', { name: /pantalla del carrito/i })).toBeInTheDocument()
})

test('el filtro muestra los 7 productos antes de elegir categoría', async () => {
    await cargarCatalogo()

    expect(screen.getAllByRole('button', { name: /agregar.*al carrito/i })).toHaveLength(7)
    /* El botón "Todas" no lleva contador: los contadores van por categoría. */
    expect(screen.getByRole('button', { name: /^todas$/i })).toBeInTheDocument()
})

test('filtrar por categoría deja solo los productos de esa categoría', async () => {
    const user = userEvent.setup()

    await cargarCatalogo()

    await user.click(screen.getByRole('button', { name: /verduras orgánicas/i }))

    /* 3 verduras y ningún producto más. */
    expect(screen.getAllByRole('button', { name: /agregar.*al carrito/i })).toHaveLength(3)
    expect(screen.getByRole('heading', { name: /zanahorias/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /espinacas/i })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: /manzanas/i })).not.toBeInTheDocument()
})

test('volver a Todas restaura los 7 productos', async () => {
    const user = userEvent.setup()

    await cargarCatalogo()

    await user.click(screen.getByRole('button', { name: /verduras orgánicas/i }))
    await user.click(screen.getByRole('button', { name: /todas/i }))

    expect(screen.getAllByRole('button', { name: /agregar.*al carrito/i })).toHaveLength(7)
})

test('el filtro no ofrece la categoría de lácteos porque quedó sin productos', async () => {
    await cargarCatalogo()

    expect(screen.queryByRole('button', { name: /lácteos/i })).not.toBeInTheDocument()
})

/* --- búsqueda --- */

test('buscar por nombre deja solo el producto que coincide', async () => {
    const user = userEvent.setup()

    await cargarCatalogo()

    await user.type(screen.getByLabelText(/buscar productos/i), 'miel')

    expect(screen.getAllByRole('button', { name: /agregar.*al carrito/i })).toHaveLength(1)
    expect(screen.getByRole('heading', { name: /miel orgánica/i })).toBeInTheDocument()
})

test('buscar ignora mayúsculas y tildes', async () => {
    const user = userEvent.setup()

    await cargarCatalogo()

    /* "PLATANO" tiene que encontrar "Plátanos Cavendish". */
    await user.type(screen.getByLabelText(/buscar productos/i), 'PLATANO')

    expect(screen.getByRole('heading', { name: /plátanos/i })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: /miel/i })).not.toBeInTheDocument()
})

test('la búsqueda se combina con el filtro de categoría', async () => {
    const user = userEvent.setup()

    await cargarCatalogo()

    await user.click(screen.getByRole('button', { name: /verduras orgánicas/i }))
    await user.type(screen.getByLabelText(/buscar productos/i), 'espinacas')

    expect(screen.getAllByRole('button', { name: /agregar.*al carrito/i })).toHaveLength(1)
    expect(screen.getByRole('heading', { name: /espinacas/i })).toBeInTheDocument()
})

test('sin coincidencias avisa con un mensaje y no rompe la vista', async () => {
    const user = userEvent.setup()

    await cargarCatalogo()

    await user.type(screen.getByLabelText(/buscar productos/i), 'zzzz')

    expect(
        screen.getByText(/no encontramos productos para "zzzz"/i)
    ).toBeInTheDocument()

    /* Con cero resultados no hay ningún botón, y queryAllByRole no falla. */
    expect(screen.queryAllByRole('button', { name: /agregar.*al carrito/i })).toHaveLength(0)
})

test('el contador de resultados anuncia cuántos son', async () => {
    const user = userEvent.setup()

    await cargarCatalogo()

    await user.type(screen.getByLabelText(/buscar productos/i), 'miel')

    expect(screen.getByRole('status')).toHaveTextContent('1 producto encontrado.')
})

test('el botón Limpiar restaura el catálogo completo', async () => {
    const user = userEvent.setup()

    await cargarCatalogo()

    await user.type(screen.getByLabelText(/buscar productos/i), 'miel')
    await user.click(screen.getByRole('button', { name: /limpiar/i }))

    expect(screen.getByLabelText(/buscar productos/i)).toHaveValue('')
    expect(screen.getAllByRole('button', { name: /agregar.*al carrito/i })).toHaveLength(7)
})

/* --- filtros en la URL --- */

test('abre filtrado si la URL trae una categoría', async () => {
    /* Es lo que hace CategoriesPage al linkear a una categoría. */
    await cargarCatalogo('/catalogo?categoria=Verduras%20Org%C3%A1nicas')

    expect(screen.getAllByRole('button', { name: /agregar.*al carrito/i })).toHaveLength(3)
    expect(screen.queryByRole('heading', { name: /manzanas/i })).not.toBeInTheDocument()
})

test('abre con la búsqueda de la URL si viene el parámetro q', async () => {
    await cargarCatalogo('/catalogo?q=miel')

    expect(screen.getByLabelText(/buscar productos/i)).toHaveValue('miel')
    expect(screen.getAllByRole('button', { name: /agregar.*al carrito/i })).toHaveLength(1)
})

test('ignora una categoría desconocida que llegue en la URL', async () => {
    /* Con state local esto no podría pasar; con URL hay que tolerar basura. */
    await cargarCatalogo('/catalogo?categoria=Categoria%20Inventada')

    expect(screen.queryAllByRole('button', { name: /agregar.*al carrito/i })).toHaveLength(0)
    expect(screen.getByText(/no hay productos en esta categoría/i)).toBeInTheDocument()
})

test('el botón de categorías lleva a la vista de categorías', async () => {
    const user = userEvent.setup()

    await cargarCatalogo()

    /* React-Bootstrap le pone role="button" al <a> que renderiza Button as={Link},
       así que el rol accesible es button y no link. */
    await user.click(screen.getByRole('button', { name: /ver categorías/i }))

    expect(screen.getByRole('heading', { name: /pantalla de categorías/i })).toBeInTheDocument()
})

test('el botón de ofertas lleva a la vista de ofertas', async () => {
    const user = userEvent.setup()

    await cargarCatalogo()

    await user.click(screen.getByRole('button', { name: /ver ofertas/i }))

    expect(screen.getByRole('heading', { name: /pantalla de ofertas/i })).toBeInTheDocument()
})

// t02: si la api falla se ve el error y no productos falsos
test('T02: si la API falla muestra error, no productos ni catálogo vacío', async () => {
    getProducts.mockRejectedValueOnce(new Error('API caída'))

    renderCatalog()

    expect(await screen.findByRole('alert')).toHaveTextContent(/no pudimos cargar el catálogo/i)
    expect(screen.queryAllByRole('button', { name: /agregar.*al carrito/i })).toHaveLength(0)
    expect(screen.queryByText(/no hay productos/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/por ahora no hay productos/i)).not.toBeInTheDocument()
})

// el boton reintentar vuelve a pedir el catalogo
test('reintentar vuelve a pedir el catálogo', async () => {
    const user = userEvent.setup()

    getProducts.mockRejectedValueOnce(new Error('API caída'))
    renderCatalog()

    await user.click(await screen.findByRole('button', { name: /reintentar/i }))

    expect(await screen.findAllByRole('button', { name: /agregar.*al carrito/i })).toHaveLength(7)
})

// catalogo vacio real distinto de un error
test('un catálogo realmente vacío se distingue del error', async () => {
    getProducts.mockResolvedValueOnce([])

    await cargarCatalogo()

    expect(screen.getByText(/por ahora no hay productos en el catálogo/i)).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
})
