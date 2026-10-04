/*
  cartStorage encapsula la persistencia del carrito en localStorage.

  Se separa del reducer para que el estado siga siendo testeable sin
  depender del navegador, y para poder simular un localStorage con error.
*/

const STORAGE_KEY = 'huerto-hogar-cart'

/*
  Un carrito guardado puede estar corrupto o haber quedado con otra forma
  de datos, así que se devuelve siempre un array usable y nunca se propaga
  el error: un refresh nunca debe romper la app.
*/
export function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)

    if (!raw) {
      return []
    }

    const parsed = JSON.parse(raw)

    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveCart(cart) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart))
    return true
  } catch {
    // localStorage puede estar bloqueado (modo privado) o sin cuota.
    return false
  }
}

export function clearCart() {
  try {
    localStorage.removeItem(STORAGE_KEY)
    return true
  } catch {
    return false
  }
}