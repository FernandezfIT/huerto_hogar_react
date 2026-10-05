/*
  CategoriesPage es la vista de /categorias.

  Muestra la descripción de cada categoría, un dato que estaba escrito en
  data/categories.js pero que ninguna vista renderizaba hasta ahora.

  Usa categoriesWithProducts de utils/catalog en vez de leer categories.js
  directo, por la misma razón que usa el filtro del catálogo: la vista se
  deriva de los productos que existen. Por eso "Productos Lácteos", que viene
  del enunciado pero quedó sin productos, no aparece acá.
*/

import { Badge, Card, Col, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { countByCategory, categoriesWithProducts } from '../utils/catalog'
import { products } from '../data/products'

function CategoriesPage() {
    const categorias = categoriesWithProducts(products)
    const conteos = countByCategory(products)

    return (
        <section className="py-4">
            <h1 className="h3 mb-2">Categorías</h1>

            <p className="text-muted">
                El catálogo está organizado en {categorias.length} categorías. Entrar a una
                muestra sus productos ya filtrados.
            </p>

            <Row className="g-4">
                {categorias.map((categoria) => (
                    <Col xs={12} md={6} lg={4} key={categoria.nombre}>
                        <Card className="h-100">
                            <Card.Body className="d-flex flex-column">
                                <Card.Title as="h2" className="h5 d-flex align-items-center gap-2">
                                    {categoria.nombre}
                                    <Badge bg="secondary">{conteos[categoria.nombre] ?? 0}</Badge>
                                </Card.Title>

                                <Card.Text className="small flex-grow-1">
                                    {categoria.descripcion}
                                </Card.Text>

                                {/*
                                  El enlace arma la URL del catálogo con el mismo
                                  parámetro que lee CatalogPage. Si algún día el
                                  filtro pasa a usar searchParams, este es el único
                                  punto que hay que cambiar.
                                */}
                                <Link
                                    to={`/catalogo?categoria=${encodeURIComponent(categoria.nombre)}`}
                                    className="text-decoration-none"
                                >
                                    Ver productos de {categoria.nombre}
                                </Link>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </section>
    )
}

export default CategoriesPage
