import { describe, expect, test } from 'vitest'
import { hasErrors, validateCustomer } from './validators'

const clienteValido = {
  nombre: 'Ana Lopez',
  email: 'ana.lopez@duoc.cl',
  telefono: '+56912345678',
  direccion: 'Av. Siempre Viva 742',
}

describe('validateCustomer', () => {
  test('un cliente válido no genera errores', () => {
    expect(validateCustomer(clienteValido)).toEqual({})
  })

  test('sin datos se reportan los cuatro campos', () => {
    expect(Object.keys(validateCustomer({}))).toEqual(['nombre', 'email', 'telefono', 'direccion'])
  })

  test('los espacios en blanco cuentan como campo vacío', () => {
    const errores = validateCustomer({ ...clienteValido, nombre: '   ' })
    expect(errores.nombre).toBeTruthy()
  })

  test('un cliente ausente no rompe la validación', () => {
    expect(() => validateCustomer(undefined)).not.toThrow()
  })

  describe('nombre', () => {
    test('rechaza nombres demasiado cortos', () => {
      expect(validateCustomer({ ...clienteValido, nombre: 'An' }).nombre).toMatch(/3 caracteres/)
    })

    test('acepta un nombre de exactamente 3 caracteres', () => {
      expect(validateCustomer({ ...clienteValido, nombre: 'Ana' }).nombre).toBeUndefined()
    })

    test('rechaza nombres con números', () => {
      expect(validateCustomer({ ...clienteValido, nombre: 'Ana123' }).nombre).toMatch(/letras/)
    })

    test('acepta nombres con tildes', () => {
      expect(validateCustomer({ ...clienteValido, nombre: 'Martina Núñez' }).nombre).toBeUndefined()
    })
  })

  describe('email', () => {
    test('rechaza emails sin arroba', () => {
      expect(validateCustomer({ ...clienteValido, email: 'ana.cl' }).email).toBeTruthy()
    })

    test('rechaza emails sin dominio', () => {
      expect(validateCustomer({ ...clienteValido, email: 'ana@' }).email).toBeTruthy()
    })

    test('rechaza emails sin punto en el dominio', () => {
      expect(validateCustomer({ ...clienteValido, email: 'ana@duoc' }).email).toBeTruthy()
    })
  })

  describe('telefono', () => {
    test('rechaza teléfonos muy cortos', () => {
      expect(validateCustomer({ ...clienteValido, telefono: '123' }).telefono).toMatch(/8 dígitos/)
    })

    test('acepta el formato con prefijo +56', () => {
      expect(validateCustomer({ ...clienteValido, telefono: '+56 9 6123 4567' }).telefono).toBeUndefined()
    })
  })

  describe('direccion', () => {
    test('rechaza direcciones demasiado cortas', () => {
      expect(validateCustomer({ ...clienteValido, direccion: 'Av 1' }).direccion).toMatch(/5 caracteres/)
    })

    test('acepta una dirección de exactamente 5 caracteres', () => {
      expect(validateCustomer({ ...clienteValido, direccion: 'Av. 1' }).direccion).toBeUndefined()
    })
  })
})

describe('hasErrors', () => {
  test('detecta que hay al menos un error', () => {
    expect(hasErrors(validateCustomer({}))).toBe(true)
  })

  test('detecta que no hay errores', () => {
    expect(hasErrors(validateCustomer(clienteValido))).toBe(false)
  })
})