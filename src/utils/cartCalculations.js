/*
  cartCalculations concentra los cálculos del carrito.

  Son funciones puras: reciben datos y devuelven resultados, sin estado.
  Así el reducer y los componentes pueden compartir la misma regla de
  cálculo sin duplicarla, y cada cálculo se testea por separado.
*/

/*
  Los productos en oferta traen precioOferta. Se usa con ?? para aceptar el
  campo si existe (Rama 1) y caer a precio si todavía no está, de modo que
  el carrito no se rompe mientras esa rama avanza.
*/
export function getUnitPrice(item) {
  return item.precioOferta ?? item.precio
}

export function isOnOffer(item) {
  return item.precioOferta !== undefined && item.precioOferta !== null
}

export function getLineTotal(item) {
  return getUnitPrice(item) * item.cantidad
}

export function getCartTotal(cart) {
  return cart.reduce((total, item) => total + getLineTotal(item), 0)
}

// Cantidad total de unidades, usada para el badge del carrito en el navbar.
export function getCartCount(cart) {
  return cart.reduce((count, item) => count + item.cantidad, 0)
}

/*
  Si el producto no define stock se asume infinito, para que un producto
  sin ese dato siga funcionando. Con stock 0 el producto queda bloqueado.
*/
export function getMaxQuantity(item) {
  return item.stock ?? Number.POSITIVE_INFINITY
}

// El carrito nunca puede superar el stock disponible.
export function canIncrease(item) {
  return item.cantidad < getMaxQuantity(item)
}