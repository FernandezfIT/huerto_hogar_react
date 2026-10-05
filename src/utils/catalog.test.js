import {
    categoriesWithProducts,
    countByCategory,
    getProductsByCategory,
    getOffers,
    priceForDisplay,
    discountPercent,
} from './catalog'
import { expect, test } from 'vitest'

const muestra = [
    { id: 'FR001', nombre: 'Manzanas Fuji', categoria: 'Frutas Frescas', precio: 1200, precioOferta: 990, stock: 150 },
    { id: 'FR002', nombre: 'Naranjas Valencia', categoria: 'Frutas Frescas', precio: 1000, stock: 200 },
    { id: 'VR001', nombre: 'Zanahorias', categoria: 'Verduras Orgánicas', precio: 900, stock: 100 },
    { id: 'VR002', nombre: 'Espinacas', categoria: 'Verduras Orgánicas', precio: 700, stock: 80 },
]

test('priceForDisplay usa el precio de oferta cuando existe', () => {
    expect(priceForDisplay(muestra[0])).toBe(990)
    expect(priceForDisplay(muestra[1])).toBe(1000)
})

test('discountPercent calcula el descuento redondeado', () => {
    expect(discountPercent(muestra[0])).toBe(18)
    expect(discountPercent(muestra[1])).toBe(0)
})

test('discountPercent no divide por cero', () => {
    expect(discountPercent({ precio: 0, precioOferta: 0 })).toBe(0)
})

test('getProductsByCategory sin filtro devuelve todo', () => {
    expect(getProductsByCategory(null, muestra)).toHaveLength(4)
    expect(getProductsByCategory(undefined, muestra)).toHaveLength(4)
})

test('getProductsByCategory filtra por nombre exacto', () => {
    const verduras = getProductsByCategory('Verduras Orgánicas', muestra)

    expect(verduras).toHaveLength(2)
    expect(verduras.every((p) => p.categoria === 'Verduras Orgánicas')).toBe(true)
})

test('getProductsByCategory con una categoría desconocida devuelve vacío', () => {
    expect(getProductsByCategory('Productos Lácteos', muestra)).toEqual([])
})

test('categoriesWithProducts descarta las categorías sin productos', () => {
    const nombres = categoriesWithProducts(muestra).map((c) => c.nombre)

    expect(nombres).toEqual(['Frutas Frescas', 'Verduras Orgánicas'])
    expect(nombres).not.toContain('Productos Lácteos')
})

test('categoriesWithProducts sobre el catálogo real solo ofrece categorías con stock', () => {
    const conProductos = categoriesWithProducts()

    expect(conProductos.map((c) => c.nombre)).toEqual([
        'Frutas Frescas',
        'Verduras Orgánicas',
        'Productos Orgánicos',
    ])
})

test('countByCategory cuenta los productos de cada categoría', () => {
    expect(countByCategory(muestra)).toEqual({
        'Frutas Frescas': 2,
        'Verduras Orgánicas': 2,
    })
})

test('countByCategory sobre el catálogo real suma los 7 productos', () => {
    const counts = countByCategory()
    const total = Object.values(counts).reduce((suma, n) => suma + n, 0)

    expect(counts).toEqual({
        'Frutas Frescas': 3,
        'Verduras Orgánicas': 3,
        'Productos Orgánicos': 1,
    })
    expect(total).toBe(7)
})

test('getOffers devuelve solo los productos con precioOferta', () => {
    const ofertas = getOffers(muestra)

    expect(ofertas.map((p) => p.id)).toEqual(['FR001'])
})

test('getOffers sobre el catálogo real devuelve los tres en oferta', () => {
    expect(getOffers().map((p) => p.id)).toEqual(['FR001', 'VR001', 'VR003'])
})