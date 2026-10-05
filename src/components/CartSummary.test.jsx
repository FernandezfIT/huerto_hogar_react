/*
  Pruebas de CartSummary.

  Todas las consultas se hacen por rol y por nombre accesible, nunca por
  clases CSS: así el test sigue funcionando si el marcado cambia.
*/

import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, test, vi } from 'vitest'
import CartSummary from './CartSummary'

const sinonStock = {
  id: 'FR001',
  nombre: 'Manzanas Fuji',
  precio: 1200,
  cantidad: 2,
  stock: 10,
  unidad: 'kilo',
}

const enOferta = {
  id: 'FR002',
  nombre: 'Naranjas Valencia',
  precio: 1000,
  precioOferta: 800,
  cantidad: 1,
  stock: 10,
  unidad: 'kilo',
}

const alLimite = {
  id: 'VR001',
  nombre: 'Zanahorias Orgánicas',
  precio: 900,
  cantidad: 5,
  stock: 5,
  unidad: 'kilo',
}

function renderSummary(overrides = {}) {
  const props = {
    cart: [sinonStock, enOferta],
    onIncreaseQuantity: vi.fn(),
    onDecreaseQuantity: vi.fn(),
    onRemoveFromCart: vi.fn(),
    onClear: vi.fn(),
    ...overrides,
  }

  return { ...render(<CartSummary {...props} />), props }
}

describe('estado vacío', () => {
  test('muestra mensaje cuando el carrito está vacío', () => {
    renderSummary({ cart: [] })

    expect(screen.getByText(/el carrito está vacío/i)).toBeInTheDocument()
  })

  test('no muestra el botón de vaciar cuando no hay productos', () => {
    renderSummary({ cart: [] })

    expect(screen.queryByRole('button', { name: /vaciar carrito/i })).not.toBeInTheDocument()
  })
})

describe('listado de productos', () => {
  test('muestra el nombre y la cantidad de cada producto', () => {
    renderSummary()

    expect(screen.getByText('Manzanas Fuji')).toBeInTheDocument()
    expect(screen.getByText('Naranjas Valencia')).toBeInTheDocument()
    expect(screen.getAllByText('2')).toHaveLength(1)
  })

  test('muestra el subtotal de cada línea', () => {
    renderSummary()

    // 2 x 1200
    expect(screen.getByText('$2.400')).toBeInTheDocument()
    // 1 x 800, usando el precio de oferta
    expect(screen.getByText('$800')).toBeInTheDocument()
  })

  test('tacha el precio original cuando el producto está en oferta', () => {
    renderSummary()

    const precioOriginal = screen.getByText('$1.000')

    expect(precioOriginal.tagName).toBe('DEL')
    expect(screen.getByText('$1.000')).toBeInTheDocument()
  })

  test('no muestra precio tachado en productos sin oferta', () => {
    renderSummary({ cart: [sinonStock] })

    expect(screen.queryByText('$1.200')).not.toBeInTheDocument()
    expect(screen.getByText('$2.400')).toBeInTheDocument()
  })

  test('suma el total de todas las líneas', () => {
    renderSummary()

    // 2 x 1200 + 1 x 800 = 3200
    expect(screen.getByText(/Total:/)).toHaveTextContent('$3.200')
  })

  test('usa el precio unitario cuando el producto no define unidad', () => {
    renderSummary({ cart: [{ id: 'X1', nombre: 'Producto', precio: 500, cantidad: 1 }] })

    expect(screen.getByText(/por unidad/i)).toBeInTheDocument()
  })
})

describe('acciones sobre el carrito', () => {
  test('permite aumentar la cantidad de un producto', async () => {
    const user = userEvent.setup()
    const { props } = renderSummary()

    await user.click(screen.getByRole('button', { name: /aumentar cantidad de manzanas fuji/i }))

    expect(props.onIncreaseQuantity).toHaveBeenCalledTimes(1)
    expect(props.onIncreaseQuantity).toHaveBeenCalledWith('FR001')
  })

  test('permite disminuir la cantidad de un producto', async () => {
    const user = userEvent.setup()
    const { props } = renderSummary()

    await user.click(screen.getByRole('button', { name: /disminuir cantidad de manzanas fuji/i }))

    expect(props.onDecreaseQuantity).toHaveBeenCalledTimes(1)
    expect(props.onDecreaseQuantity).toHaveBeenCalledWith('FR001')
  })

  test('permite eliminar un producto del carrito', async () => {
    const user = userEvent.setup()
    const { props } = renderSummary()

    await user.click(screen.getByRole('button', { name: /eliminar manzanas fuji del carrito/i }))

    expect(props.onRemoveFromCart).toHaveBeenCalledTimes(1)
    expect(props.onRemoveFromCart).toHaveBeenCalledWith('FR001')
  })

  test('permite vaciar todo el carrito', async () => {
    const user = userEvent.setup()
    const { props } = renderSummary()

    await user.click(screen.getByRole('button', { name: /vaciar carrito/i }))

    expect(props.onClear).toHaveBeenCalledTimes(1)
  })

  test('cada producto tiene sus propios botones', async () => {
    const user = userEvent.setup()
    const { props } = renderSummary()

    await user.click(screen.getByRole('button', { name: /eliminar naranjas valencia del carrito/i }))

    expect(props.onRemoveFromCart).toHaveBeenCalledWith('FR002')
  })
})

describe('límite de stock', () => {
  test('deshabilita el botón de aumentar cuando se alcanza el stock', () => {
    renderSummary({ cart: [alLimite] })

    expect(
      screen.getByRole('button', { name: /aumentar cantidad de zanahorias orgánicas/i }),
    ).toBeDisabled()
  })

  test('avisa cuál es el máximo disponible', () => {
    renderSummary({ cart: [alLimite] })

    expect(screen.getByText(/Máx: 5/)).toBeInTheDocument()
  })

  test('no deshabilita el botón cuando queda stock disponible', () => {
    renderSummary({ cart: [sinonStock] })

    expect(
      screen.getByRole('button', { name: /aumentar cantidad de manzanas fuji/i }),
    ).toBeEnabled()
  })

  test('el botón deshabilitado no dispara la acción', async () => {
    const user = userEvent.setup()
    const { props } = renderSummary({ cart: [alLimite] })

    await user.click(screen.getByRole('button', { name: /aumentar cantidad de zanahorias orgánicas/i }))

    expect(props.onIncreaseQuantity).not.toHaveBeenCalled()
  })
})

describe('accesibilidad', () => {
  test('el carrito se expone como una lista', () => {
    renderSummary()

    const lista = screen.getByRole('list')
    expect(within(lista).getAllByRole('listitem')).toHaveLength(2)
  })
})