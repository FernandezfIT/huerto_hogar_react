/*
  checkoutService simula la confirmación de una compra.

  No hay backend: la orden se valida y se construye en memoria. El fallo es
  determinista (carrito vacío o stock insuficiente) para que la vista de
  compra fallida sea testeable sin depender de aleatoriedad.
*/

import { getCartTotal, getUnitPrice } from './cartCalculations'

// Secuencia del módulo para numerar las órdenes como en un ticket real.
let orderSequence = 0

export function createOrder({ cliente, items }) {
  if (!items || items.length === 0) {
    throw new Error('No puedes confirmar una compra con el carrito vacío.')
  }

  const sinStock = items.find((item) => item.cantidad > (item.stock ?? Number.POSITIVE_INFINITY))

  if (sinStock) {
    throw new Error(`No hay stock suficiente de ${sinStock.nombre}.`)
  }

  orderSequence += 1

  return {
    id: `HH-${String(orderSequence).padStart(4, '0')}`,
    cliente: { ...cliente },
    items: items.map((item) => ({
      id: item.id,
      nombre: item.nombre,
      cantidad: item.cantidad,
      precioUnitario: getUnitPrice(item),
      subtotal: getUnitPrice(item) * item.cantidad,
    })),
    total: getCartTotal(items),
  }
}