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

/**
 * Normaliza el texto de búsqueda: minúsculas y sin tildes.
 *
 * Sin esto "pimienta" no encontraría "Pimienta" y "verdura" no encontraría
 * "Verduras". Usa normalize('NFD') para separar la tilde de la letra y luego
 * descarta los diacríticos, en vez de tener una lista de reemplazos a mano.
 *
 * También colapsa los espacios internos: si el usuario escribe "miel  organica"
 * con dos espacios, tiene que encontrar "Miel Orgánica" igual.
 */
export function normalizeText(text) {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, ' ')
        .trim()
}

/**
 * Busca productos por nombre. Con texto vacío devuelve la lista completa,
 * para que el catálogo arranque mostrando todo.
 */
export function searchProducts(query, source = products) {
    const term = normalizeText(query ?? '')

    if (term === '') {
        return source
    }

    return source.filter((product) => normalizeText(product.nombre).includes(term))
}

/**
 * Aplica categoría y búsqueda a la vez. Es el orden correcto: primero se acota
 * por categoría y después se busca dentro de lo que quedó.
 */
export function filterProducts({ categoria = null, query = '' } = {}, source = products) {
    return searchProducts(query, getProductsByCategory(categoria, source))
}

/* --- CRUD sobre datos simulados --- */

/**
 * Busca un producto por su id. Devuelve undefined cuando no existe, que es
 * justamente lo que necesita la página de detalle para mostrar su estado de
 * "producto no encontrado" en vez de romper el render.
 */
export function getProductById(id, source = products) {
    return source.find((product) => product.id === id)
}

/**
 * Revisa un producto contra el mismo contrato que exige el catálogo real.
 *
 * Las reglas están aquí y no duplicadas en otro lado a propósito: si el CRUD
 * aceptara un producto que src/data/products.test.js rechaza, la suite fallaría
 * en el primer test del catálogo. Que ambos lean el mismo contrato evita esa
 * contradicción.
 *
 * `idAReemplazar` lo usa updateProduct: al editar, el producto sigue ocupando
 * su propio id, así que no debe contarse como duplicado de sí mismo.
 */
export function validateProduct(product, source = products, idAReemplazar = null) {
    const errores = {}

    if (typeof product.id !== 'string' || product.id.trim() === '') {
        errores.id = 'El producto necesita un id.'
    } else if (source.some((otro) => otro.id === product.id && otro.id !== idAReemplazar)) {
        errores.id = `Ya existe un producto con el id ${product.id}.`
    }

    for (const campo of ['nombre', 'unidad', 'origen', 'imagen', 'descripcion']) {
        if (typeof product[campo] !== 'string' || product[campo].trim() === '') {
            errores[campo] = `El campo ${campo} no puede quedar vacío.`
        }
    }

    if (!categories.some((categoria) => categoria.nombre === product.categoria)) {
        errores.categoria = 'La categoría debe ser una de las declaradas en categories.js.'
    }

    if (!Number.isInteger(product.precio) || product.precio <= 0) {
        errores.precio = 'El precio debe ser un número entero mayor que cero.'
    }

    if (!Number.isInteger(product.stock) || product.stock < 0) {
        errores.stock = 'El stock debe ser un número entero igual o mayor que cero.'
    }

    if (product.precioOferta !== undefined) {
        if (!Number.isInteger(product.precioOferta) || product.precioOferta <= 0) {
            errores.precioOferta = 'El precio de oferta debe ser un entero mayor que cero.'
        } else if (product.precioOferta >= product.precio) {
            errores.precioOferta = 'El precio de oferta tiene que ser menor que el precio normal.'
        }
    }

    return errores
}

/**
 * Agrega un producto al final del catálogo y devuelve un array nuevo.
 *
 * Nunca muta el array recibido: copia la fuente y agrega una copia del
 * producto, igual que hace el reducer del carrito con sus líneas. Así el
 * catálogo importado queda intacto y cada llamada es predecible.
 */
export function createProduct(product, source = products) {
    const errores = validateProduct(product, source)

    if (Object.keys(errores).length > 0) {
        throw new Error(`No se pudo crear el producto: ${Object.keys(errores).join(', ')}.`)
    }

    return [...source, { ...product }]
}

/**
 * Reemplaza un producto por su id y devuelve un array nuevo.
 *
 * El id no se puede cambiar aunque venga en `cambios`: la ruta de detalle y las
 * líneas del carrito lo usan como referencia, y cambiarlo rompería los enlaces
 * ya compartidos. Solo se mezclan los campos editables.
 */
export function updateProduct(id, cambios, source = products) {
    const original = getProductById(id, source)

    if (original === undefined) {
        throw new Error(`No existe un producto con el id ${id}.`)
    }

    const actualizado = { ...original, ...cambios, id: original.id }
    const errores = validateProduct(actualizado, source, original.id)

    if (Object.keys(errores).length > 0) {
        throw new Error(`No se pudo actualizar ${id}: ${Object.keys(errores).join(', ')}.`)
    }

    return source.map((product) => (product.id === id ? actualizado : product))
}

/**
 * Quita un producto por su id y devuelve un array nuevo.
 *
 * Falla si el id no existe, para que un typo en el id no se lea como una
 * eliminación exitosa que en realidad no borró nada.
 */
export function deleteProduct(id, source = products) {
    if (getProductById(id, source) === undefined) {
        throw new Error(`No existe un producto con el id ${id}.`)
    }

    return source.filter((product) => product.id !== id)
}
