import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { expect, test, vi } from 'vitest'
import ProductList from './ProductList'

const manzana = {
    id: 'FR001',
    nombre: 'Manzanas Fuji',
    categoria: 'Frutas Frescas',
    precio: 1200,
    precioOferta: 990,
    unidad: 'kilo',
    stock: 150,
    origen: 'Valle del Maule',
    imagen: '/images/manzanas.jpeg',
    descripcion: 'Manzanas Fuji crujientes y dulces, cultivadas en el Valle del Maule.',
}

const naranja = {
    id: 'FR002',
    nombre: 'Naranjas Valencia',
    categoria: 'Frutas Frescas',
    precio: 1000,
    unidad: 'kilo',
    stock: 200,
    origen: 'Región de Coquimbo',
    imagen: '/images/naranjas.jpeg',
    descripcion: 'Jugosas y ricas en vitamina C.',
}

function renderList(items, onAddToCart = vi.fn(), emptyMessage) {
    return render(
        <MemoryRouter>
            <ProductList items={items} onAddToCart={onAddToCart} emptyMessage={emptyMessage} />
        </MemoryRouter>
    )
}

test('dibuja una card por cada producto recibido', () => {
    renderList([manzana, naranja])

    expect(screen.getByRole('heading', { name: /Manzanas Fuji/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Naranjas Valencia/i })).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /agregar.*al carrito/i })).toHaveLength(2)
})

test('agrega el producto que se eligió al carrito', async () => {
    const onAddToCart = vi.fn()
    const user = userEvent.setup()

    renderList([manzana, naranja], onAddToCart)

    await user.click(screen.getByRole('button', { name: /agregar Naranjas Valencia al carrito/i }))

    expect(onAddToCart).toHaveBeenCalledTimes(1)
    expect(onAddToCart).toHaveBeenCalledWith(naranja)
})

test('con lista vacía muestra el mensaje de estado vacío', () => {
    renderList([], vi.fn(), 'No hay productos para mostrar.')

    expect(screen.getByText('No hay productos para mostrar.')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /agregar.*al carrito/i })).not.toBeInTheDocument()
})

test('sin lista vacía entregada usa un mensaje por defecto', () => {
    renderList([])

    expect(screen.getByText(/No hay productos para mostrar/i)).toBeInTheDocument()
})