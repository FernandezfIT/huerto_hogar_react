import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { expect, test, vi } from 'vitest'
import ProductCard from './ProductCard'


const product = {
    id: "FR001",
    nombre: "Manzanas Fuji",
    categoria: "Frutas Frescas",
    precio: 1200,
    precioOferta: 990,
    unidad: "kilo",
    stock: 150,
    origen: "Valle del Maule",
    imagen: "/images/manzanas.jpeg",
    descripcion:
        "Manzanas Fuji crujientes y dulces, cultivadas en el Valle del Maule.",
}

const sinOferta = {
    id: "FR002",
    nombre: "Naranjas Valencia",
    categoria: "Frutas Frescas",
    precio: 1000,
    unidad: "kilo",
    stock: 200,
    origen: "Región de Coquimbo",
    imagen: "/images/naranjas.jpeg",
    descripcion: "Jugosas y ricas en vitamina C, ideales para zumos frescos.",
}

function renderCard(producto, onAddToCart) {
    return render(
        <MemoryRouter>
            <ProductCard product={producto} onAddToCart={onAddToCart} />
        </MemoryRouter>
    )
}

test('muestra el producto y permite agregarlo al carrito', async () => {
    /* Crea una función falsa (mock) para verificar si el click la ejecuta. */
    const onAddToCart = vi.fn()
    const user = userEvent.setup()

    /* Monta el componente en el DOM simulado de jsdom. */
    renderCard(product, onAddToCart)

    /* expect indica qué debe cumplirse. getByRole busca un elemento semántico. */
    expect(screen.getByRole(
        'heading',
        {name: /Manzanas Fuji/i}
    )).toBeInTheDocument()
    /* formatCurrency usa separador de miles, por eso $1.200 y no 1200. */
    expect(screen.getByText('$1.200')).toBeInTheDocument()

    /* Busca un botón accesible. El aria-label incluye el nombre del producto
       para que siete tarjetas con el mismo texto no sean ambiguas. */
    const button = screen.getByRole('button', {
        name: /agregar Manzanas Fuji al carrito/i,
    })

    /* Simula el click del usuario. */
    await user.click(button)

    /* Comprueba que ProductCard llamó a la función con el producto correcto. */
    expect(onAddToCart).toHaveBeenCalledTimes(1)
    expect(onAddToCart).toHaveBeenCalledWith(product)
})

test('un producto en oferta muestra el precio oferta tachado y el descuento', () => {
    renderCard(product, vi.fn())

    expect(screen.getByText(/precio oferta/i)).toBeInTheDocument()
    expect(screen.getByText('$990')).toBeInTheDocument()
    expect(screen.getByText('$1.200')).toHaveClass('text-decoration-line-through')
    /* 1200 -> 990 es un 18% de descuento */
    expect(screen.getByText('-18%')).toBeInTheDocument()
})

test('un producto sin oferta muestra solo el precio normal', () => {
    renderCard(sinOferta, vi.fn())

    expect(screen.queryByText(/precio oferta/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/-/)).not.toBeInTheDocument()
    expect(screen.getByText('$1.000')).toBeInTheDocument()
})

test('muestra la categoría, el origen y el stock', () => {
    renderCard(product, vi.fn())

    expect(screen.getByText(/Frutas Frescas/i)).toBeInTheDocument()
    /* "Valle del Maule" sale dos veces: en el origen y en la descripción,
       así que se comprueba que aparezca en ambos lugares. */
    expect(screen.getAllByText(/Valle del Maule/i)).toHaveLength(2)
    expect(screen.getByText(/150/i)).toBeInTheDocument()
})

test('el nombre del producto enlaza a su ficha', () => {
    renderCard(product, vi.fn())

    expect(screen.getByRole('link', { name: /Manzanas Fuji/i })).toHaveAttribute(
        'href',
        '/producto/FR001'
    )
})

test('al pulsar el nombre se llega a la ficha del producto', async () => {
    /*
      El test anterior alcanza con revisar el href, pero no detects que la ruta
      no exista: ProductCard apuntaba a /producto/:id y el catch-all de App.jsx
      mandaba a Home en silencio. Este test sí monta la ruta real y comprueba
      que se llegue a la ficha.
    */
    const user = userEvent.setup()

    render(
        <MemoryRouter initialEntries={['/catalogo']}>
            <Routes>
                <Route path="/catalogo" element={<ProductCard product={product} onAddToCart={vi.fn()} />} />
                <Route
                    path="/producto/:id"
                    element={<h1>Ficha de {product.nombre}</h1>}
                />
            </Routes>
        </MemoryRouter>
    )

    await user.click(screen.getByRole('link', { name: /Manzanas Fuji/i }))

    expect(
        screen.getByRole('heading', { name: /ficha de manzanas fuji/i })
    ).toBeInTheDocument()
})

test('la imagen usa el alt del nombre del producto', () => {
    renderCard(product, vi.fn())

    expect(screen.getByAltText(/Manzanas Fuji/i)).toHaveAttribute(
        'src',
        '/images/manzanas.jpeg'
    )
})
