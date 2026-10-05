import { categories } from '../data/categories'
import { products } from '../data/products'

/**
 * Devuelve el precio que realmente se cobra por el producto.
 * Reutiliza la misma regla del carrito (getUnitPrice en cartCalculations):
 * si hay precioOferta se cobra ese, si no el precio normal.
 */
export function priceForDisplay(product) {
    return product.precioOferta ?? product.precio
}

export function discountPercent(product) {
    if (product.precioOferta === undefined || product.precio === 0) {
        return 0
    }

    return Math.round((1 - product.precioOferta / product.precio) * 100)
}

/**
 * Categorías que tienen al menos un producto en el catálogo.
 * "Productos Lácteos" viene del enunciado pero quedó sin productos, así que no
 * aparece en la interfaz. Si se agrega un lácteo, aparece sin tocar nada.
 */
export function categoriesWithProducts(source = products) {
    const enUso = new Set(source.map((product) => product.categoria))

    return categories.filter((categoria) => enUso.has(categoria.nombre))
}

export function getProductsByCategory(categoryName, source = products) {
    if (!categoryName) {
        return source
    }

    return source.filter((product) => product.categoria === categoryName)
}

/**
 * Cuenta cuántos productos hay por categoría. Se usa para mostrar el número en
 * los botones del filtro, así el usuario sabe qué va a ver antes de clickear.
 */
export function countByCategory(source = products) {
    return source.reduce((counts, product) => {
        counts[product.categoria] = (counts[product.categoria] ?? 0) + 1
        return counts
    }, {})
}

export function getOffers(source = products) {
    return source.filter((product) => product.precioOferta !== undefined)
}