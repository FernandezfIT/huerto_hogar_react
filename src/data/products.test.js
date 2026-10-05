import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { expect, test } from 'vitest'
import { categories } from './categories'
import { products } from './products'

const CAMPOS_OBLIGATORIOS = [
    'id',
    'nombre',
    'categoria',
    'precio',
    'unidad',
    'stock',
    'origen',
    'imagen',
    'descripcion',
]

const nombresCategorias = categories.map((categoria) => categoria.nombre)

test('el catálogo tiene productos y todos los del enunciado', () => {
    expect(products.length).toBeGreaterThan(0)
    expect(products.map((p) => p.id)).toEqual([
        'FR001',
        'FR002',
        'FR003',
        'VR001',
        'VR002',
        'VR003',
        'PO001',
    ])
})

test('los ids son únicos', () => {
    const ids = products.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
})

test('todos los productos tienen sus campos obligatorios', () => {
    for (const product of products) {
        for (const campo of CAMPOS_OBLIGATORIOS) {
            expect(product[campo], `${product.id} no tiene ${campo}`).toBeDefined()
        }

        expect(typeof product.id).toBe('string')
        expect(typeof product.nombre).toBe('string')
        expect(typeof product.descripcion).toBe('string')
        expect(typeof product.imagen).toBe('string')
        expect(product.descripcion.length).toBeGreaterThan(30)
    }
})

test('los precios y stocks son valores válidos', () => {
    for (const product of products) {
        expect(product.precio, `${product.id} tiene precio inválido`).toBeGreaterThan(0)
        expect(product.stock, `${product.id} tiene stock inválido`).toBeGreaterThanOrEqual(0)
        expect(Number.isInteger(product.precio)).toBe(true)
        expect(Number.isInteger(product.stock)).toBe(true)
    }
})

test('el precio de oferta es siempre menor que el precio normal', () => {
    for (const product of products) {
        if (product.precioOferta !== undefined) {
            expect(
                product.precioOferta,
                `${product.id} tiene una oferta más cara que su precio normal`,
            ).toBeLessThan(product.precio)
            expect(product.precioOferta).toBeGreaterThan(0)
        }
    }
})

test('toda categoría usada está declarada en categories.js', () => {
    for (const product of products) {
        expect(
            nombresCategorias,
            `${product.id} usa la categoría desconocida "${product.categoria}"`,
        ).toContain(product.categoria)
    }
})

test('las imágenes referenciadas existen en public/', () => {
    for (const product of products) {
        const ruta = resolve(process.cwd(), 'public', product.imagen.replace(/^\//, ''))
        expect(
            existsSync(ruta),
            `${product.id} apunta a ${product.imagen} pero ese archivo no existe`,
        ).toBe(true)
    }
})

test('FR001 va primero porque el test de integración depende de esa posición', () => {
    expect(products[0].id).toBe('FR001')
})

test('Manzanas Fuji mantiene el precio en oferta que usa el flujo de compra', () => {
    const manzanas = products.find((p) => p.id === 'FR001')

    expect(manzanas.precio).toBe(1200)
    expect(manzanas.precioOferta).toBe(990)
})

test('las categorías sin productos están marcadas como tales', () => {
    for (const categoria of categories) {
        const tieneProductos = products.some((p) => p.categoria === categoria.nombre)
        expect(
            categoria.sinProductos === true,
            `${categoria.nombre} está sin productos pero no lo declara`,
        ).toBe(!tieneProductos)
    }
})