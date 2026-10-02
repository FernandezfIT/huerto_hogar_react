
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import ProductCard from './ProductCard'


const product = {
    id: "FR001",
    nombre: "Manzanas Fuji",
    categoria: "Frutas Frescas",
    precio: 1200,
    unidad: "kilo",
    stock: 150,
    imagen: "/images/manzanas.jpg",
    descripcion:
        "Manzanas Fuji crujientes y dulces, cultivadas en el Valle del Maule.",
}

test('muestra el producto y permite agregarlo al carrito', async () => {
    /* Crea una función falsa (mock) para verificar si el click la ejecuta. */
    const onAddToCart = vi.fn()
    const user = userEvent.setup()

    /* Monta el componente en el DOM simulado de jsdom. */
    render(
        <ProductCard
            product={product}
            onAddToCart={onAddToCart}

        />
    )

    /*  
        expect indica qué debe cumplirse.
        getByRole busca un elemento semántico; aquí validamos que exista
        un heading con el nombre del producto.
    */
    expect(screen.getByRole(
        'heading',
        {name: /Manzanas Fuji/i}
    )).toBeInTheDocument()
    expect(screen.getByText(/1200/i)).toBeInTheDocument()

    /* Busca un botón accesible que tenga el texto "Agregar al Carrito" */
    /* La i significa que no importa si está en mayúscula o minúscula. */
    const button = screen.getByRole('button', {
        name: /agregar al carrito/i,
    })

    /* Simula el click del usuario. */
    await user.click(button)

    /* Comprueba que ProductCard llamó a la función con el producto correcto. */
    expect(onAddToCart).toHaveBeenCalledTimes(1)
    expect(onAddToCart).toHaveBeenCalledWith(product)
})