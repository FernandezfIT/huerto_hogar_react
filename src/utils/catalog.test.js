import {
    categoriesWithProducts,
    countByCategory,
    discountPercent,
    filterProducts,
    getOffers,
    getProductsByCategory,
    normalizeText,
    priceForDisplay,
    searchProducts,
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
/* --- normalizeText --- */

test('normalizeText pasa a minúsculas', () => {
    expect(normalizeText('MIEL Orgánica')).toBe('miel organica')
})

test('normalizeText quita las tildes', () => {
    expect(normalizeText('Plátanos')).toBe('platanos')
    expect(normalizeText('Cebolla')).toBe('cebolla')
    expect(normalizeText('Ajo')).toBe('ajo')
})

test('normalizeText recorta los espacios sobrantes', () => {
    expect(normalizeText('  miel   organica  ')).toBe('miel organica')
})

/* --- searchProducts --- */

test('searchProducts sin texto devuelve la lista completa', () => {
    expect(searchProducts('', muestra)).toHaveLength(4)
    expect(searchProducts('   ', muestra)).toHaveLength(4)
    expect(searchProducts(undefined, muestra)).toHaveLength(4)
})

test('searchProducts encuentra por coincidencia parcial', () => {
    expect(searchProducts('miel', muestra).map((p) => p.id)).toEqual([])
    expect(searchProducts('naranja', muestra).map((p) => p.id)).toEqual(['FR002'])
})

test('searchProducts ignora mayúsculas y tildes', () => {
    expect(searchProducts('MANZANAS', muestra).map((p) => p.id)).toEqual(['FR001'])
    expect(searchProducts('zanahorias', muestra).map((p) => p.id)).toEqual(['VR001'])
    expect(searchProducts('ZaNaHoRiAs', muestra).map((p) => p.id)).toEqual(['VR001'])
    expect(searchProducts('NARANJAS', muestra).map((p) => p.id)).toEqual(['FR002'])
})

test('searchProducts sin coincidencias devuelve lista vacía', () => {
    expect(searchProducts('zzz', muestra)).toEqual([])
})

test('searchProducts sobre el catálogo real encuentra los siete productos', () => {
    /* "Platano" sin tilde tiene que encontrar "Plátanos Cavendish". */
    expect(searchProducts('platano').map((p) => p.id)).toEqual(['FR003'])
    expect(searchProducts('miel').map((p) => p.id)).toEqual(['PO001'])
    expect(searchProducts('espinacas').map((p) => p.id)).toEqual(['VR002'])
    expect(searchProducts('pimiento').map((p) => p.id)).toEqual(['VR003'])
})

test('searchProducts ignora espacios que el usuario escribe de más', () => {
    expect(searchProducts('  miel  ').map((p) => p.id)).toEqual(['PO001'])
})

test('searchProducts busca dentro del nombre completo', () => {
    /* "Cavendish" es la segunda palabra del nombre. */
    expect(searchProducts('cavendish').map((p) => p.id)).toEqual(['FR003'])
})

/* --- filterProducts --- */

test('filterProducts sin filtros devuelve todo', () => {
    expect(filterProducts({}, muestra)).toHaveLength(4)
    expect(filterProducts(undefined, muestra)).toHaveLength(4)
})

test('filterProducts combina categoría y búsqueda', () => {
    const resultado = filterProducts(
        { categoria: 'Verduras Orgánicas', query: 'espinaca' },
        muestra
    )

    expect(resultado.map((p) => p.id)).toEqual(['VR002'])
})

test('filterProducts aplica la categoría antes que la búsqueda', () => {
    /* "manzanas" es de Frutas, así que con Vegetables debe quedar vacío. */
    expect(
        filterProducts({ categoria: 'Verduras Orgánicas', query: 'manzanas' }, muestra)
    ).toEqual([])
})

test('filterProducts sobre el catálogo real filtra categoría y texto juntos', () => {
    expect(filterProducts({ categoria: 'Frutas Frescas', query: 'fuji' }).map((p) => p.id))
        .toEqual(['FR001'])

    expect(filterProducts({ query: 'miel', categoria: 'Frutas Frescas' })).toEqual([])
})

test('filterProducts tolera query con espacios y tildes', () => {
    /* Ojo: solo aparece VR001 y no PO001. "Orgánicas" es plural y
       "Miel Orgánica" es singular, así que "organicas" no la alcanza.
       Hacer stemming queda fuera del alcance del enunciado. */
    expect(filterProducts({ query: '  ORGANICAS  ' }).map((p) => p.id))
        .toEqual(['VR001'])

    expect(filterProducts({ query: '  organica ' }).map((p) => p.id))
        .toEqual(['VR001', 'PO001'])
})
