import { request } from './httpClient'

// quita precioOferta cuando viene null para que los helpers no vean una oferta falsa
function normalizarProducto(producto) {
    if (producto === null || typeof producto !== 'object') {
        throw new Error('La API devolvió un producto con formato inválido.')
    }

    const { precioOferta, ...resto } = producto

    if (precioOferta === null || precioOferta === undefined) {
        return resto
    }

    return { ...resto, precioOferta }
}

// pide la lista de productos a la api
export async function getProducts({ signal } = {}) {
    const datos = await request('/productos', { signal })

    if (!Array.isArray(datos)) {
        throw new Error('La API devolvió una lista de productos inválida.')
    }

    return datos.map(normalizarProducto)
}

// pide un producto por id
export async function getProduct(id, { signal } = {}) {
    const dato = await request(`/productos/${encodeURIComponent(id)}`, { signal })

    return normalizarProducto(dato)
}

// pide la lista de categorias a la api
export async function getCategories({ signal } = {}) {
    const datos = await request('/categorias', { signal })

    if (!Array.isArray(datos)) {
        throw new Error('La API devolvió una lista de categorías inválida.')
    }

    return datos
}
