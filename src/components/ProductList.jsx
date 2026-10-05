/**
 * ProductList arma la grilla responsiva del catálogo.
 *
 * No sabe nada de filtros ni búsqueda: solo recibe la lista ya filtrada y la
 * dibuja. Si recibe una lista vacía muestra un aviso, para que el estado vacío
 * quede en un solo lugar.
 */

import { Alert, Col, Row } from 'react-bootstrap'
import ProductCard from './ProductCard'

function ProductList({ items, onAddToCart, emptyMessage = 'No hay productos para mostrar.' }) {
    if (items.length === 0) {
        return (
            <Alert variant="warning" role="status">
                {emptyMessage}
            </Alert>
        )
    }

    return (
        <Row className="g-4">
            {items.map((product) => (
                <Col xs={12} md={6} lg={4} key={product.id}>
                    <ProductCard product={product} onAddToCart={onAddToCart} />
                </Col>
            ))}
        </Row>
    )
}

export default ProductList