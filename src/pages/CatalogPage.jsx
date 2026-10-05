/**
 * CatalogPage es la vista de /catalogo.
 *
 * El estado del filtro y de la búsqueda vive acá, no en ProductList: la página
 * es la que sabe qué se está mostrando y ProductList solo dibuja.
 */

import { Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import ProductList from '../components/ProductList'
import { products } from '../data/products'
import { useCart } from '../hooks/useCart'

function CatalogPage() {
    const { addItem } = useCart()
    const navigate = useNavigate()

    return (
        <section className="py-4">
            <h1 className="h3 mb-4">Catálogo de productos</h1>

            <ProductList items={products} onAddToCart={addItem} />

            <div className="mt-4">
                <Button variant="outline-primary" onClick={() => navigate('/carrito')}>
                    Ver carrito
                </Button>
            </div>
        </section>
    )
}

export default CatalogPage