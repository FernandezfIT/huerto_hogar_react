/*
  Pruebas del reducer del carrito, montando el provider real.

  Se usa renderHook porque la lógica vive en el estado del provider, y act()
  porque en React los dispatch solo se aplican de forma inmediata dentro de act.
*/

import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, test } from 'vitest'
import { CartProvider } from '../context/CartProvider'
import { useCart } from './useCart'

const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>

// Atajo para no repetir el wrapper en cada prueba.
function renderCart() {
  return renderHook(() => useCart(), { wrapper })
}

const manzana = { id: 'FR001', nombre: 'Manzanas Fuji', precio: 1200, stock: 3 }
const naranja = { id: 'FR002', nombre: 'Naranjas Valencia', precio: 1000, precioOferta: 800, stock: 5 }

beforeEach(() => {
  // El provider lee localStorage al montar, así que hay que partir limpio.
  localStorage.clear()
})

describe('addItem', () => {
  test('agrega un producto nuevo con cantidad 1', () => {
    const { result } = renderCart()

    act(() => result.current.addItem(manzana))

    expect(result.current.items).toHaveLength(1)
    expect(result.current.items[0].id).toBe('FR001')
    expect(result.current.items[0].cantidad).toBe(1)
  })

  test('incrementa la cantidad si el producto ya está en el carrito', () => {
    const { result } = renderCart()

    act(() => result.current.addItem(manzana))
    act(() => result.current.addItem(manzana))

    expect(result.current.items).toHaveLength(1)
    expect(result.current.items[0].cantidad).toBe(2)
  })

  test('no supera el stock al agregar un producto repetido', () => {
    const { result } = renderCart()

    act(() => result.current.addItem(manzana))
    act(() => result.current.addItem(manzana))
    act(() => result.current.addItem(manzana))
    act(() => result.current.addItem(manzana))

    expect(result.current.items[0].cantidad).toBe(3)
  })

  test('no agrega un producto agotado', () => {
    const { result } = renderCart()

    act(() => result.current.addItem({ ...manzana, stock: 0 }))

    expect(result.current.items).toHaveLength(0)
  })

  test('guarda una copia del producto con su precio original', () => {
    const { result } = renderCart()
    // Se usa una copia local para no alterar el producto compartido.
    const producto = { ...manzana }

    act(() => result.current.addItem(producto))
    producto.precio = 9999

    expect(result.current.items[0].precio).toBe(1200)
  })
})

describe('increaseQuantity', () => {
  test('aumenta la cantidad en uno', () => {
    const { result } = renderCart()

    act(() => result.current.addItem(manzana))
    act(() => result.current.increaseQuantity('FR001'))

    expect(result.current.items[0].cantidad).toBe(2)
  })

  test('respeta el límite de stock', () => {
    const { result } = renderCart()

    act(() => result.current.addItem(manzana))
    act(() => result.current.increaseQuantity('FR001'))
    act(() => result.current.increaseQuantity('FR001'))
    act(() => result.current.increaseQuantity('FR001'))

    expect(result.current.items[0].cantidad).toBe(3)
  })

  test('deja el carrito intacto si el id no existe', () => {
    const { result } = renderCart()

    act(() => result.current.addItem(manzana))
    act(() => result.current.increaseQuantity('NO_EXISTE'))

    expect(result.current.items).toHaveLength(1)
    expect(result.current.items[0].cantidad).toBe(1)
  })
})

describe('decreaseQuantity', () => {
  test('disminuye la cantidad en uno', () => {
    const { result } = renderCart()

    act(() => result.current.addItem(manzana))
    act(() => result.current.increaseQuantity('FR001'))
    act(() => result.current.decreaseQuantity('FR001'))

    expect(result.current.items[0].cantidad).toBe(1)
  })

  test('elimina la línea cuando queda una sola unidad', () => {
    const { result } = renderCart()

    act(() => result.current.addItem(manzana))
    act(() => result.current.decreaseQuantity('FR001'))

    expect(result.current.items).toHaveLength(0)
  })

  test('no lanza si el producto no está en el carrito', () => {
    const { result } = renderCart()

    act(() => result.current.addItem(manzana))

    expect(() => act(() => result.current.decreaseQuantity('NO_EXISTE'))).not.toThrow()
    expect(result.current.items).toHaveLength(1)
  })

  test('no lanza con el carrito vacío', () => {
    const { result } = renderCart()

    expect(() => act(() => result.current.decreaseQuantity('FR001'))).not.toThrow()
  })
})

describe('removeItem', () => {
  test('elimina el producto indicado', () => {
    const { result } = renderCart()

    act(() => result.current.addItem(manzana))
    act(() => result.current.addItem(naranja))
    act(() => result.current.removeItem('FR001'))

    expect(result.current.items).toHaveLength(1)
    expect(result.current.items[0].id).toBe('FR002')
  })

  test('deja el carrito intacto si el producto no está', () => {
    const { result } = renderCart()

    act(() => result.current.addItem(manzana))
    act(() => result.current.removeItem('NO_EXISTE'))

    expect(result.current.items).toHaveLength(1)
  })
})

describe('clearCart', () => {
  test('vacía por completo el carrito', () => {
    const { result } = renderCart()

    act(() => result.current.addItem(manzana))
    act(() => result.current.addItem(naranja))
    act(() => result.current.clearCart())

    expect(result.current.items).toEqual([])
    expect(result.current.total).toBe(0)
  })
})

describe('valores derivados', () => {
  test('el total y la cantidad se calculan desde los productos', () => {
    const { result } = renderCart()

    act(() => result.current.addItem(manzana))
    act(() => result.current.addItem(naranja))

    expect(result.current.count).toBe(2)
    expect(result.current.total).toBe(1200 + 800)
  })

  test('con el carrito vacío el total es cero', () => {
    const { result } = renderCart()

    expect(result.current.total).toBe(0)
    expect(result.current.count).toBe(0)
  })
})

describe('persistencia', () => {
  test('guarda el carrito en localStorage', () => {
    const { result } = renderCart()

    act(() => result.current.addItem(manzana))

    expect(localStorage.getItem('huerto-hogar-cart')).toContain('FR001')
  })

  test('recupera el carrito guardado al montar', () => {
    act(() => localStorage.setItem('huerto-hogar-cart', JSON.stringify([{ ...manzana, cantidad: 2 }])))

    const { result } = renderCart()

    expect(result.current.items).toHaveLength(1)
    expect(result.current.items[0].cantidad).toBe(2)
  })

  test('arranca vacío si lo guardado está corrupto', () => {
    act(() => localStorage.setItem('huerto-hogar-cart', '{no es json'))

    const { result } = renderCart()

    expect(result.current.items).toEqual([])
  })

  test('vaciar el carrito limpia el almacenamiento', () => {
    const { result } = renderCart()

    act(() => result.current.addItem(manzana))
    act(() => result.current.clearCart())

    expect(localStorage.getItem('huerto-hogar-cart')).toBe('[]')
  })
})

describe('useCart fuera del provider', () => {
  test('lanza un error indicando que falta el provider', () => {
    expect(() => renderHook(() => useCart())).toThrow(/CartProvider/)
  })
})