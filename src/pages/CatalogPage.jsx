/**
 * CatalogPage es la vista de /catalogo.
 *
 * El estado del filtro y de la búsqueda vive acá, no en ProductList: la página
 * es la que sabe qué se está mostrando y ProductList solo dibuja.
 */

import { useState } from 'react'
import { Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import CategoryFilter from '../components/CategoryFilter'
import ProductList from '../components/ProductList'
import { products } from '../data/products'
import { useCart } from '../hooks/useCart'
import {
    categoriesWithProducts,
    countByCategory,
    getProductsByCategory,
} from '../utils/catalog'

function CatalogPage() {
    const { addItem } = useCart()
    const navigate = useNavigate()

    /* null significa "sin filtro": se muestran todas las categorías. */
    const [categoria, setCategoria] = useState(null)

    const categorias = categoriesWithProducts(products)
    const productos = getProductsByCategory(categoria, products)

    return (
        <section className="py-4">
            <h1 className="h3 mb-4">Catálogo de productos</h1>

            <CategoryFilter
                categories={categorias}
                selected={categoria}
                onSelect={setCategoria}
                countByCategory={countByCategory(products)}
            />

            <ProductList
                items={productos}
                onAddToCart={addItem}
                emptyMessage="No hay productos en esta categoría."
            />

            <div className="mt-4">
                <Button variant="outline-primary" onClick={() => navigate('/carrito')}>
                    Ver carrito
                </Button>
            </div>
        </section>
    )
}

export default CatalogPage