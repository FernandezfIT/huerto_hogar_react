import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { clearCart, loadCart, saveCart } from './cartStorage'

const carrito = [{ id: 'FR001', nombre: 'Manzanas Fuji', precio: 1200, cantidad: 2 }]

beforeEach(() => {
  localStorage.clear()
})

afterEach(() => {
  // Deja los mocks en su estado original entre pruebas.
  vi.restoreAllMocks()
})

describe('loadCart', () => {
  test('devuelve un array vacío cuando no hay nada guardado', () => {
    expect(loadCart()).toEqual([])
  })

  test('recupera el carrito guardado anteriormente', () => {
    saveCart(carrito)
    expect(loadCart()).toEqual(carrito)
  })

  test('devuelve vacío si el contenido guardado no es JSON válido', () => {
    // Un carrito corrupto no debe romper la app al iniciar.
    localStorage.setItem('huerto-hogar-cart', '{no es json')
    expect(loadCart()).toEqual([])
  })

  test('devuelve vacío si lo guardado no es un array', () => {
    localStorage.setItem('huerto-hogar-cart', '{"productos": []}')
    expect(loadCart()).toEqual([])
  })

  test('devuelve vacío cuando localStorage está bloqueado', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('almacenamiento bloqueado')
    })

    expect(loadCart()).toEqual([])
  })
})

describe('saveCart', () => {
  test('guarda el carrito y permite recuperarlo', () => {
    expect(saveCart(carrito)).toBe(true)
    expect(loadCart()).toEqual(carrito)
  })

  test('informa cuando no se puede guardar', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('sin cuota')
    })

    expect(saveCart(carrito)).toBe(false)
  })
})

describe('clearCart', () => {
  test('elimina el carrito guardado', () => {
    saveCart(carrito)
    clearCart()
    expect(loadCart()).toEqual([])
  })

  test('no falla cuando no había nada guardado', () => {
    expect(clearCart()).toBe(true)
  })
})