/*
  Pruebas de OffersPage.

  La página lee el catálogo de useCatalog; estos tests usan un fake del
  servicio con los tres productos en oferta de la semilla.
*/

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, expect, test, vi } from 'vitest'
import { CartProvider } from '../context/CartProvider'
import { CatalogProvider } from '../context/CatalogProvider'
import { getProducts } from '../services/productService'
import OffersPage from './OffersPage'

const CARTAZO = 'huerto-hogar-cart'

function renderOfertas() {
    return render(
        <MemoryRouter initialEntries={['/ofertas']}>
            <CatalogProvider>
                <CartProvider>
                    <OffersPage />
                </CartProvider>
            </CatalogProvider>
        </MemoryRouter>
    )
}

// reemplaza el servicio real por el falso
vi.mock('../services/productService', () => import('../test/fakeProductService'))

// muestra la pagina y espera a que termine la carga
async function cargarOfertas() {
    renderOfertas()
    await waitFor(() => expect(screen.queryByText(/cargando cat/i)).not.toBeInTheDocument())
}

beforeEach(() => {
    localStorage.clear()
})

test('muestra el encabezado de la vista de ofertas', async () => {
    await cargarOfertas()

    expect(screen.getByRole('heading', { name: /ofertas de la semana/i })).toBeInTheDocument()
})

test('muestra solo los productos que tienen precio de oferta', async () => {
    await cargarOfertas()

    expect(screen.getAllByRole('button', { name: /agregar.*al carrito/i })).toHaveLength(3)
    expect(screen.getByRole('heading', { name: /manzanas fuji/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /zanahorias orgánicas/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /pimientos tricolores/i })).toBeInTheDocument()
})

test('no incluye productos sin oferta', async () => {
    await cargarOfertas()

    expect(screen.queryByRole('heading', { name: /miel orgánica/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: /naranjas valencia/i })).not.toBeInTheDocument()
})

test('anuncia el mejor descuento de la selección', async () => {
    await cargarOfertas()

    /* Las manzanas son las de mayor descuento: de $1.200 a $990 es un 18%. */
    expect(screen.getByText(/mejor descuento es de 18%/i)).toBeInTheDocument()
    expect(screen.getByText(/mejor descuento es de 18% en/i)).toHaveTextContent(
        /manzanas fuji a \$990/i
    )
})

test('avisa que los precios de oferta pueden cambiar', async () => {
    await cargarOfertas()

    expect(screen.getByText(/precios de oferta están sujetos a disponibilidad/i)).toBeInTheDocument()
})

test('agregar una oferta la guarda en el carrito', async () => {
    const user = userEvent.setup()

    await cargarOfertas()

    await user.click(screen.getByRole('button', { name: /agregar pimientos tricolores al carrito/i }))

    const guardado = JSON.parse(localStorage.getItem(CARTAZO))

    expect(guardado).toHaveLength(1)
    expect(guardado[0].id).toBe('VR003')
})

test('el precio cobrado es el de oferta, no el precio normal', async () => {
    const user = userEvent.setup()

    await cargarOfertas()

    await user.click(screen.getByRole('button', { name: /agregar manzanas fuji al carrito/i }))

    const guardado = JSON.parse(localStorage.getItem(CARTAZO))

    expect(guardado[0].precio).toBe(1200)
    expect(guardado[0].precioOferta).toBe(990)
})

// si la api falla no se muestra el aviso de sin ofertas
test('si la API falla muestra error y no el aviso de que no hay ofertas', async () => {
    getProducts.mockRejectedValueOnce(new Error('API caída'))

    renderOfertas()

    expect(await screen.findByRole('alert')).toHaveTextContent(/no pudimos cargar el catálogo/i)
    expect(screen.queryByText(/hoy no tenemos ofertas/i)).not.toBeInTheDocument()
})
