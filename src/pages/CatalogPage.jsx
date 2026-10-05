/**
 * CatalogPage es la vista de /catalogo.
 *
 * El estado del filtro y de la búsqueda vive acá, no en ProductList: la página
 * es la que sabe qué se está mostrando y ProductList solo dibuja.
 *
 * Ambos filtros se guardan en la URL y no en useState, para que el catálogo se
 * pueda compartir y sobre todo para que CategoriesPage pueda linkear a una
 * categoría ya filtrada con /catalogo?categoria=Nombre. Con estado local ese
 * enlace no podría filtrar nada.
 */

import { Button } from 'react-bootstrap'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import CategoryFilter from '../components/CategoryFilter'
import ProductList from '../components/ProductList'
import SearchBar from '../components/SearchBar'
import { products } from '../data/products'
import { useCart } from '../hooks/useCart'
import {
    categoriesWithProducts,
    countByCategory,
    filterProducts,
} from '../utils/catalog'

const PARAMETRO_CATEGORIA = 'categoria'
const PARAMETRO_BUSQUEDA = 'q'

function CatalogPage() {
    const { addItem } = useCart()
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()

    /*
       Sin categoría el parámetro se borra en vez de quedar vacío, para que la
       URL del catálogo sin filtros sea siempre /catalogo.
    */
    const categoria = searchParams.get(PARAMETRO_CATEGORIA)
    const busqueda = searchParams.get(PARAMETRO_BUSQUEDA) ?? ''

    function actualizarParametro(nombre, valor) {
        const siguiente = new URLSearchParams(searchParams)

        if (valor === null || valor === '') {
            siguiente.delete(nombre)
        } else {
            siguiente.set(nombre, valor)
        }

        setSearchParams(siguiente)
    }

    const categorias = categoriesWithProducts(products)
    const productos = filterProducts({ categoria, query: busqueda }, products)

    return (
        <section className="py-4">
            <h1 className="h3 mb-4">Catálogo de productos</h1>

            <SearchBar
                query={busqueda}
                onChange={(texto) => actualizarParametro(PARAMETRO_BUSQUEDA, texto)}
                onClear={() => actualizarParametro(PARAMETRO_BUSQUEDA, '')}
                resultCount={productos.length}
            />

            <CategoryFilter
                categories={categorias}
                selected={categoria}
                onSelect={(elegida) => actualizarParametro(PARAMETRO_CATEGORIA, elegida)}
                countByCategory={countByCategory(products)}
            />

            <ProductList
                items={productos}
                onAddToCart={addItem}
                emptyMessage={
                    busqueda.trim() === ''
                        ? 'No hay productos en esta categoría.'
                        : `No encontramos productos para "${busqueda.trim()}".`
                }
            />

            <div className="d-flex flex-wrap gap-2 mt-4">
                <Button as={Link} to="/categorias" variant="outline-secondary">
                    Ver categorías
                </Button>

                <Button as={Link} to="/ofertas" variant="warning">
                    Ver ofertas
                </Button>

                <Button variant="outline-primary" onClick={() => navigate('/carrito')}>
                    Ver carrito
                </Button>
            </div>
        </section>
    )
}

export default CatalogPage
