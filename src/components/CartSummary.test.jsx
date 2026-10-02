
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import CartSummary from './CartSummary'

const cart = [
    {
        id: 'FR001',
        nombre: 'Manzanas Fuji',
        precio: 1200,
        cantidad: 2,
    },
    {
        id: 'FR002',
        nombre: 'Naranjas Valencia',
        precio: 1000,
        cantidad: 1,
    },
]
test('muestra mensaje cuando el carrito está vacío', () => {
    render(
        <CartSummary
            cart={[]}
            onRemoveFromCart={vi.fn()}
            onDecreaseQuantity={vi.fn()}
        />
    )

    expect(screen.getByText(/el carrito está vacío/i)).toBeInTheDocument()
})

test('muestra productos, cantidades y total del carrito', () => {
    render(
        <CartSummary
            cart={cart}
            onRemoveFromCart={vi.fn()}
            onDecreaseQuantity={vi.fn()}
        />
    )

    expect(screen.getByText(/Manzanas Fuji x 2/i)).toBeInTheDocument()
    expect(screen.getByText(/Naranjas Valencia x 1/i)).toBeInTheDocument()
    expect(screen.getByText(/Total: \$3400 CLP/i)).toBeInTheDocument()
})

test('permite eliminar un producto del carrito', async () => {
    const onRemoveFromCart = vi.fn()
    const user = userEvent.setup()

    render(
        <CartSummary
            cart={cart}
            onRemoveFromCart={onRemoveFromCart}
            onDecreaseQuantity={vi.fn()}
        />
    )

    const deleteButtons = screen.getAllByRole('button', {
        name: /Eliminar/i,
    })

    await user.click(deleteButtons[0])

    expect(onRemoveFromCart).toHaveBeenCalledTimes(1)
    expect(onRemoveFromCart).toHaveBeenCalledWith('FR001')
})

test('permite disminuir la cantidad de un producto', async () => {
    const onDecreaseQuantity = vi.fn()
    const user = userEvent.setup()

    render(
        <CartSummary
            cart={cart}
            onRemoveFromCart={vi.fn()}
            onDecreaseQuantity={onDecreaseQuantity}
        />
    )

    const decreaseButtons = screen.getAllByRole('button', {
        name: '-',
    })

    await user.click(decreaseButtons[0])

    expect(onDecreaseQuantity).toHaveBeenCalledTimes(1)
    expect(onDecreaseQuantity).toHaveBeenCalledWith('FR001')
})