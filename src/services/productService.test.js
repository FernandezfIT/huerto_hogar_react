import { beforeEach, expect, test, vi } from 'vitest'
import { getCategories, getProduct, getProducts } from './productService'
import { request } from './httpClient'

// reemplaza el cliente http por uno falso
vi.mock('./httpClient', () => ({ request: vi.fn() }))

// datos de ejemplo
const manzana = { id: 'FR001', nombre: 'Manzanas Fuji', precio: 1200, precioOferta: 990 }
const naranja = { id: 'FR002', nombre: 'Naranjas Valencia', precio: 1000, precioOferta: null }

// limpia el mock antes de cada test
beforeEach(() => {
    request.mockReset()
})

// revisa la ruta y la senal de cancelacion
test('getProducts pide /productos con la señal de cancelación', async () => {
    request.mockResolvedValue([manzana])
    const { signal } = new AbortController()

    await getProducts({ signal })

    expect(request).toHaveBeenCalledWith('/productos', { signal })
})

// revisa que el null de oferta se quite
test('getProducts quita precioOferta null y conserva la oferta real', async () => {
    request.mockResolvedValue([manzana, naranja])

    const [conOferta, sinOferta] = await getProducts()

    expect(conOferta.precioOferta).toBe(990)
    expect('precioOferta' in sinOferta).toBe(false)
})

// revisa que rechace respuestas que no son lista
test('getProducts rechaza una respuesta que no es una lista', async () => {
    request.mockResolvedValue({ id: 'FR001' })

    await expect(getProducts()).rejects.toThrow(/inválida/i)
})

// revisa el id codificado y la oferta normalizada
test('getProduct codifica el id y normaliza la oferta', async () => {
    request.mockResolvedValue(naranja)

    const producto = await getProduct('FR 002')

    expect(request).toHaveBeenCalledWith('/productos/FR%20002', { signal: undefined })
    expect('precioOferta' in producto).toBe(false)
})

// revisa que el error de la api se propague
test('getProduct propaga el error de la API', async () => {
    const error = Object.assign(new Error('no existe'), { status: 404 })
    request.mockRejectedValue(error)

    await expect(getProduct('NO001')).rejects.toBe(error)
})

// revisa la lista de categorias
test('getCategories devuelve la lista de la API', async () => {
    request.mockResolvedValue([{ id: 'frescas', nombre: 'Frutas Frescas', descripcion: 'x' }])

    expect(await getCategories()).toHaveLength(1)
    expect(request).toHaveBeenCalledWith('/categorias', { signal: undefined })
})
