import {
    categoriesWithProducts,
    countByCategory,
    createProduct,
    deleteProduct,
    discountPercent,
    filterProducts,
    getOffers,
    getProductById,
    getProductsByCategory,
    normalizeText,
    priceForDisplay,
    searchProducts,
    updateProduct,
    validateProduct,
} from './catalog'
import { expect, test } from 'vitest'
import { products } from '../data/products'

/*
   `muestra` cumple el mismo contrato que el catálogo real, con productos
   recortados. Se puede usar tanto para filtros como para el CRUD: si le
   faltara un campo obligatorio, updateProduct lo rechazaría al mezclar.
*/
const muestra = [
    { id: 'FR001', nombre: 'Manzanas Fuji', categoria: 'Frutas Frescas', precio: 1200, precioOferta: 990, unidad: 'kilo', stock: 150, origen: 'Valle del Maule', imagen: '/images/manzanas.jpeg', descripcion: 'Manzanas Fuji crujientes y dulces, del Valle del Maule.' },
    { id: 'FR002', nombre: 'Naranjas Valencia', categoria: 'Frutas Frescas', precio: 1000, unidad: 'kilo', stock: 200, origen: 'Región de Coquimbo', imagen: '/images/naranjas.jpeg', descripcion: 'Jugosas y ricas en vitamina C, ideales para zumos frescos.' },
    { id: 'VR001', nombre: 'Zanahorias', categoria: 'Verduras Orgánicas', precio: 900, unidad: 'kilo', stock: 100, origen: "Región de O'Higgins", imagen: '/images/zanahorias.jpeg', descripcion: 'Zanahorias crujientes cultivadas sin pesticidas.' },
    { id: 'VR002', nombre: 'Espinacas', categoria: 'Verduras Orgánicas', precio: 700, unidad: 'bolsa de 500g', stock: 80, origen: 'Región Metropolitana', imagen: '/images/espinacas.jpg', descripcion: 'Espinacas frescas y nutritivas para ensaladas.' },
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

/* --- CRUD sobre datos simulados --- */

/*
   A diferencia de `muestra`, que es un recorte mínimo para probar filtros, el
   CRUD exige el producto completo: los mismos campos que
   src/data/products.test.js revisa del catálogo real.
*/
const productoValido = {
    id: 'FR004',
    nombre: 'Frutillas',
    categoria: 'Frutas Frescas',
    precio: 950,
    unidad: 'kilo',
    stock: 60,
    origen: 'Región del Maule',
    imagen: '/images/frutillas.svg',
    descripcion: 'Frutillas dulces y aromáticas, cosechadas a mano en el Maule.',
}

test('getProductById encuentra un producto existente', () => {
    expect(getProductById('FR002', muestra)?.nombre).toBe('Naranjas Valencia')
})

test('getProductById devuelve undefined si el id no existe', () => {
    expect(getProductById('NO001', muestra)).toBeUndefined()
})

test('getProductById sobre el catálogo real encuentra los siete productos', () => {
    expect(getProductById('PO001')?.precio).toBe(5000)
    expect(getProductById('VR003')?.precioOferta).toBe(1290)
})

test('validateProduct acepta un producto completo y válido', () => {
    expect(validateProduct(productoValido, muestra)).toEqual({})
})

test('validateProduct acepta un precio de oferta menor que el normal', () => {
    const enOferta = { ...productoValido, precioOferta: 750 }

    expect(validateProduct(enOferta, muestra)).toEqual({})
})

test('validateProduct rechaza un id repetido', () => {
    const errores = validateProduct({ ...productoValido, id: 'FR001' }, muestra)

    expect(errores.id).toMatch(/ya existe/i)
})

test('validateProduct acepta que el producto se repita a sí mismo', () => {
    /* updateProduct revalida el producto ya existente con su mismo id. */
    expect(validateProduct(muestra[0], muestra, 'FR001').id).toBeUndefined()
})

test('validateProduct rechaza una categoría no declarada', () => {
    const errores = validateProduct({ ...productoValido, categoria: 'Lácteos Rare' }, muestra)

    expect(errores.categoria).toMatch(/categories\.js/)
})

test('validateProduct rechaza precio cero, negativo o decimal', () => {
    expect(validateProduct({ ...productoValido, precio: 0 }, muestra).precio).toBeDefined()
    expect(validateProduct({ ...productoValido, precio: -5 }, muestra).precio).toBeDefined()
    expect(validateProduct({ ...productoValido, precio: 10.5 }, muestra).precio).toBeDefined()
})

test('validateProduct acepta stock cero pero rechaza el negativo', () => {
    /* stock 0 es válido: el producto existe, solo que no se puede agregar
       al carrito. El reducer del carrito lo bloquea, no el catálogo. */
    expect(validateProduct({ ...productoValido, stock: 0 }, muestra).stock).toBeUndefined()
    expect(validateProduct({ ...productoValido, stock: -1 }, muestra).stock).toBeDefined()
})

test('validateProduct rechaza una oferta más cara que el precio normal', () => {
    const errores = validateProduct({ ...productoValido, precioOferta: 1200 }, muestra)

    expect(errores.precioOferta).toMatch(/menor que el precio normal/i)
})

test('validateProduct rechaza campos de texto vacíos', () => {
    for (const campo of ['nombre', 'unidad', 'origen', 'imagen', 'descripcion']) {
        expect(
            validateProduct({ ...productoValido, [campo]: '   ' }, muestra)[campo],
            `${campo} vacío debería ser error`,
        ).toBeDefined()
    }
})

test('validateProduct acumula todos los errores de una vez', () => {
    const errores = validateProduct({ id: '', nombre: '', precio: -1, stock: -1 }, muestra)

    expect(Object.keys(errores)).toEqual(
        expect.arrayContaining(['id', 'nombre', 'categoria', 'precio', 'stock', 'descripcion'])
    )
})

test('createProduct agrega el producto al final y devuelve un array nuevo', () => {
    const resultado = createProduct(productoValido, muestra)

    expect(resultado).toHaveLength(5)
    expect(resultado.at(-1).id).toBe('FR004')
    expect(muestra).toHaveLength(4)
})

test('createProduct guarda una copia y no una referencia al objeto original', () => {
    const resultado = createProduct(productoValido, muestra)

    resultado.at(-1).nombre = 'Nombre editado'

    expect(getProductById('FR004', muestra)).toBeUndefined()
    expect(productoValido.nombre).toBe('Frutillas')
})

test('createProduct falla si el producto no es válido', () => {
    expect(() => createProduct({ ...productoValido, precio: 0 }, muestra))
        .toThrow(/no se pudo crear/i)
})

test('createProduct falla si el id ya existe', () => {
    /* El mensaje nombra los campos con problema, no el valor concreto. */
    expect(() => createProduct({ ...productoValido, id: 'FR002' }, muestra))
        .toThrow(/no se pudo crear el producto: id\./i)
})

test('updateProduct cambia solo los campos indicados', () => {
    const resultado = updateProduct('FR002', { precio: 1100 }, muestra)
    const naranja = getProductById('FR002', resultado)

    expect(naranja.precio).toBe(1100)
    expect(naranja.nombre).toBe('Naranjas Valencia')
    expect(naranja.stock).toBe(200)
    expect(resultado).toHaveLength(4)
})

test('updateProduct no puede cambiar el id aunque se le pida', () => {
    /* Cambiarlo rompería el enlace de la ficha y las líneas del carrito. */
    const resultado = updateProduct('FR002', { id: 'OTRO99', precio: 1100 }, muestra)

    expect(getProductById('FR002', resultado).precio).toBe(1100)
    expect(getProductById('OTRO99', resultado)).toBeUndefined()
})

test('updateProduct no muta el array original', () => {
    updateProduct('FR002', { precio: 1100 }, muestra)

    expect(getProductById('FR002', muestra).precio).toBe(1000)
})

test('updateProduct valida el producto ya mezclado', () => {
    /* Cambiar solo la categoría a una inexistente debe fallar, aunque el resto
       del producto siga válido. */
    expect(() => updateProduct('FR002', { categoria: 'Lácteos Rare' }, muestra))
        .toThrow(/no se pudo actualizar/i)
})

test('updateProduct falla si el producto no existe', () => {
    expect(() => updateProduct('NO001', { precio: 1100 }, muestra)).toThrow(/no existe/i)
})

test('updateProduct puede poner y quitar el precio de oferta', () => {
    const conOferta = updateProduct('FR002', { precioOferta: 850 }, muestra)
    const sinOferta = updateProduct('FR002', { precioOferta: undefined }, muestra)

    expect(getProductById('FR002', conOferta).precioOferta).toBe(850)
    expect(getProductById('FR002', sinOferta).precioOferta).toBeUndefined()
})

test('deleteProduct quita el producto y devuelve un array nuevo', () => {
    const resultado = deleteProduct('FR001', muestra)

    expect(resultado).toHaveLength(3)
    expect(getProductById('FR001', resultado)).toBeUndefined()
    expect(muestra).toHaveLength(4)
})

test('deleteProduct falla si el id no existe', () => {
    /* Para que un id mal escrito no se lea como un borrado exitoso. */
    expect(() => deleteProduct('NO001', muestra)).toThrow(/no existe/i)
})

test('el CRUD completo sobre el catálogo real deja 7 productos', () => {
    /* create, update y delete encadenados sobre los datos reales, cada paso
       partiendo del resultado del anterior. */
    let catalogo = createProduct({
        id: 'FR004',
        nombre: 'Frutillas',
        categoria: 'Frutas Frescas',
        precio: 950,
        unidad: 'kilo',
        stock: 60,
        origen: 'Región del Maule',
        imagen: '/images/frutillas.svg',
        descripcion: 'Frutillas dulces y aromáticas, cosechadas a mano en el Maule.',
    })

    expect(catalogo).toHaveLength(8)

    catalogo = updateProduct('FR004', { precio: 890 }, catalogo)
    expect(getProductById('FR004', catalogo).precio).toBe(890)

    catalogo = deleteProduct('FR004', catalogo)
    expect(catalogo).toHaveLength(7)
    expect(getProductById('FR004', catalogo)).toBeUndefined()
})

test('updateProduct rechaza bajar el precio de un producto en oferta', () => {
    /* FR001 está en oferta a $990. Bajar su precio normal a $1 dejaría la
       oferta más cara que el precio, así que la validación lo bloquea. */
    expect(() => updateProduct('FR001', { precio: 1 }, muestra))
        .toThrow(/precioOferta/)
})

test('el CRUD nunca altera el array de productos del enunciado', () => {
    /* products es un import de solo lectura para la app: si una función del
       CRUD lo mutara, el catálogo real se rompería en caliente. */
    const antes = products.length
    const primero = products[0]

    createProduct({ ...productoValido, id: 'FR004' })
    updateProduct('FR002', { precio: 1100 })
    deleteProduct('FR002')

    expect(products).toHaveLength(antes)
    expect(products[0]).toEqual(primero)
    expect(getProductById('FR002').precio).toBe(1000)
})
