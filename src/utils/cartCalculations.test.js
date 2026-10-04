import { describe, expect, test } from 'vitest'
import {
  canIncrease,
  getCartCount,
  getCartTotal,
  getLineTotal,
  getMaxQuantity,
  getUnitPrice,
  isOnOffer,
} from './cartCalculations'

const conOferta = { id: 'FR002', nombre: 'Naranjas', precio: 500, precioOferta: 400, cantidad: 1, stock: 1 }
const sinOferta = { id: 'FR001', nombre: 'Manzanas', precio: 1000, cantidad: 2, stock: 5 }

describe('getUnitPrice', () => {
  test('usa precioOferta cuando el producto está en oferta', () => {
    expect(getUnitPrice(conOferta)).toBe(400)
  })

  test('cae a precio cuando el producto no tiene oferta', () => {
    expect(getUnitPrice(sinOferta)).toBe(1000)
  })

  test('el resultado coincide con isOnOffer', () => {
    expect(isOnOffer(conOferta)).toBe(true)
    expect(isOnOffer(sinOferta)).toBe(false)
  })
})

describe('getLineTotal', () => {
  test('multiplica el precio unitario por la cantidad', () => {
    expect(getLineTotal(sinOferta)).toBe(2000)
  })

  test('el total de línea usa el precio de oferta cuando corresponde', () => {
    expect(getLineTotal({ ...conOferta, cantidad: 3 })).toBe(1200)
  })
})

describe('getCartTotal', () => {
  test('suma el total de todas las líneas', () => {
    expect(getCartTotal([sinOferta, conOferta])).toBe(2400)
  })

  test('devuelve 0 con el carrito vacío', () => {
    expect(getCartTotal([])).toBe(0)
  })
})

describe('getCartCount', () => {
  test('suma las unidades de todos los productos', () => {
    expect(getCartCount([sinOferta, conOferta])).toBe(3)
  })

  test('devuelve 0 con el carrito vacío', () => {
    expect(getCartCount([])).toBe(0)
  })
})

describe('getMaxQuantity y canIncrease', () => {
  test('el tope es el stock del producto', () => {
    expect(getMaxQuantity(sinOferta)).toBe(5)
  })

  test('un producto sin stock no tiene tope', () => {
    expect(getMaxQuantity({ precio: 1000 })).toBe(Number.POSITIVE_INFINITY)
  })

  test('permite aumentar mientras falte stock', () => {
    expect(canIncrease(sinOferta)).toBe(true)
  })

  test('bloquea el aumento al llegar al stock', () => {
    expect(canIncrease(conOferta)).toBe(false)
  })

  test('un producto con stock 0 queda bloqueado', () => {
    expect(canIncrease({ precio: 1000, cantidad: 0, stock: 0 })).toBe(false)
  })
})