/*
  validators centraliza las reglas de validación del checkout.

  Son funciones puras que devuelven un objeto de errores, en vez de
  escribir en el DOM. Así CheckoutPage solo muestra lo que devuelve esta
  capa y las reglas se validan sin montar ningún componente.
*/

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const NAME_PATTERN = /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]+$/
const MIN_NAME_LENGTH = 3
const MIN_ADDRESS_LENGTH = 5
const MIN_PHONE_DIGITS = 8

export function validateCustomer(customer) {
  const errors = {}
  const nombre = (customer?.nombre ?? '').trim()
  const email = (customer?.email ?? '').trim()
  const telefono = (customer?.telefono ?? '').trim()
  const direccion = (customer?.direccion ?? '').trim()

  if (!nombre) {
    errors.nombre = 'Ingresa tu nombre completo.'
  } else if (nombre.length < MIN_NAME_LENGTH) {
    errors.nombre = `El nombre debe tener al menos ${MIN_NAME_LENGTH} caracteres.`
  } else if (!NAME_PATTERN.test(nombre)) {
    errors.nombre = 'El nombre solo puede contener letras.'
  }

  if (!email) {
    errors.email = 'Ingresa tu correo electrónico.'
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = 'El correo electrónico no es válido.'
  }

  // Se cuentan solo los dígitos para aceptar formatos como +56 9 1234 5678.
  const phoneDigits = telefono.replace(/\D/g, '')

  if (!telefono) {
    errors.telefono = 'Ingresa tu teléfono.'
  } else if (phoneDigits.length < MIN_PHONE_DIGITS) {
    errors.telefono = `El teléfono debe tener al menos ${MIN_PHONE_DIGITS} dígitos.`
  }

  if (!direccion) {
    errors.direccion = 'Ingresa tu dirección.'
  } else if (direccion.length < MIN_ADDRESS_LENGTH) {
    errors.direccion = `La dirección debe tener al menos ${MIN_ADDRESS_LENGTH} caracteres.`
  }

  return errors
}

export function hasErrors(errors) {
  return Object.keys(errors).length > 0
}