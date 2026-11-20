import { vi } from 'vitest'
import { categories } from '../data/categories'
import { products } from '../data/products'

// datos de prueba tomados de los archivos historicos
const idPorNombre = Object.fromEntries(categories.map((c) => [c.nombre, c.id]))

// categorias con el formato de la api
export const categoriasApi = categories.map(({ id, nombre, descripcion }) => ({
    id,
    nombre,
    descripcion,
}))

// productos con categoriaId como los entrega la api
export const productosApi = products.map((p) => ({ ...p, categoriaId: idPorNombre[p.categoria] }))

// versiones falsas de los servicios
export const getProducts = vi.fn(async () => productosApi.map((p) => ({ ...p })))

export const getCategories = vi.fn(async () => categoriasApi.map((c) => ({ ...c })))

export const getProduct = vi.fn(async (id) => {
    const producto = productosApi.find((p) => p.id === id)

    // simula el 404 de la api
    if (!producto) {
        const error = new Error('Producto no encontrado.')
        error.status = 404
        throw error
    }

    return { ...producto }
})
