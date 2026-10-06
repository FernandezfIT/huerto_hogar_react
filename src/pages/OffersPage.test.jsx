/*
  Pruebas de OffersPage.

  La página usa el catálogo real, así que estos tests verifican los tres
  productos en oferta que hay en products.js. Si el catálogo cambia, el
  conteo de 3 hay que ajustarlo.
*/

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, expect, test } from 'vitest'
import { CartProvider } from '../context/CartProvider'
import OffersPage from './OffersPage'

const CARTAZO = 'huerto-hogar-cart'

function renderOfertas() {
    return render(
        <MemoryRouter initialEntries={['/ofertas']}>
            <CartProvider>
                <OffersPage />
            </CartProvider>
        </MemoryRouter>
    )
}

beforeEach(() => {
    localStorage.clear()
})

test('muestra el encabezado de la vista de ofertas', () => {
    renderOfertas()

    expect(screen.getByRole('heading', { name: /ofertas de la semana/i })).toBeInTheDocument()
})

test('muestra solo los productos que tienen precio de oferta', () => {
    renderOfertas()

    expect(screen.getAllByRole('button', { name: /agregar.*al carrito/i })).toHaveLength(3)
    expect(screen.getByRole('heading', { name: /manzanas fuji/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /zanahorias orgánicas/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /pimientos tricolores/i })).toBeInTheDocument()
})

test('no incluye productos sin oferta', () => {
    renderOfertas()

    expect(screen.queryByRole('heading', { name: /miel orgánica/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: /naranjas valencia/i })).not.toBeInTheDocument()
})

test('anuncia el mejor descuento de la selección', () => {
    renderOfertas()

    /* Las manzanas son las de mayor descuento: de $1.200 a $990 es un 18%. */
    expect(screen.getByText(/mejor descuento es de 18%/i)).toBeInTheDocument()
    expect(screen.getByText(/mejor descuento es de 18% en/i)).toHaveTextContent(
        /manzanas fuji a \$990/i
    )
})

test('avisa que los precios de oferta pueden cambiar', () => {
    renderOfertas()

    expect(screen.getByText(/precios de oferta están sujetos a disponibilidad/i)).toBeInTheDocument()
})

test('agregar una oferta la guarda en el carrito', async () => {
    const user = userEvent.setup()

    renderOfertas()

    await user.click(screen.getByRole('button', { name: /agregar pimientos tricolores al carrito/i }))

    const guardado = JSON.parse(localStorage.getItem(CARTAZO))

    expect(guardado).toHaveLength(1)
    expect(guardado[0].id).toBe('VR003')
})

test('el precio cobrado es el de oferta, no el precio normal', async () => {
    const user = userEvent.setup()

    renderOfertas()

    await user.click(screen.getByRole('button', { name: /agregar manzanas fuji al carrito/i }))

    const guardado = JSON.parse(localStorage.getItem(CARTAZO))

    expect(guardado[0].precio).toBe(1200)
    expect(guardado[0].precioOferta).toBe(990)
})
