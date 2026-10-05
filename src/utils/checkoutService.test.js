import { describe, expect, test } from 'vitest'
import { createOrder } from './checkoutService'

const cliente = { nombre: 'Ana Lopez', email: 'ana.lopez@duoc.cl' }

const items = [
  { id: 'FR001', nombre: 'Manzanas Fuji', precio: 1200, cantidad: 2, stock: 10 },
  { id: 'FR002', nombre: 'Naranjas Valencia', precio: 500, precioOferta: 400, cantidad: 1, stock: 5 },
]

describe('createOrder', () => {
  test('genera un identificador de orden con el formato del ticket', () => {
    const orden = createOrder({ cliente, items })
    expect(orden.id).toMatch(/^HH-\d{4}$/)
  })

  test('cada orden recibe un número distinto', () => {
    const primera = createOrder({ cliente, items })
    const segunda = createOrder({ cliente, items })
    expect(primera.id).not.toBe(segunda.id)
  })

  test('el total aplica el precio de oferta cuando existe', () => {
    // 2 x 1200 sin oferta + 1 x 400 en oferta = 2800
    expect(createOrder({ cliente, items }).total).toBe(2800)
  })

  test('guarda el subtotal de cada línea', () => {
    const orden = createOrder({ cliente, items })

    expect(orden.items[0].subtotal).toBe(2400)
    expect(orden.items[0].precioUnitario).toBe(1200)
    expect(orden.items[1].subtotal).toBe(400)
  })

  test('copia los datos del cliente sin mantener la referencia original', () => {
    const orden = createOrder({ cliente, items })
    orden.cliente.nombre = 'Otro nombre'

    expect(cliente.nombre).toBe('Ana Lopez')
  })

  test('falla si el carrito está vacío', () => {
    expect(() => createOrder({ cliente, items: [] })).toThrow(/vacío/)
  })

  test('falla si no hay items', () => {
    expect(() => createOrder({ cliente })).toThrow()
  })

  test('falla cuando la cantidad supera el stock disponible', () => {
    const sinStock = [{ id: 'FR001', nombre: 'Manzanas Fuji', precio: 1200, cantidad: 99, stock: 3 }]

    expect(() => createOrder({ cliente, items: sinStock })).toThrow(/stock/)
  })

  test('permite comprar exactamente todo el stock disponible', () => {
    const exacto = [{ id: 'FR001', nombre: 'Manzanas Fuji', precio: 1200, cantidad: 3, stock: 3 }]

    expect(() => createOrder({ cliente, items: exacto })).not.toThrow()
  })
})