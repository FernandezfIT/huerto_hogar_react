import { useEffect, useState } from 'react'
import { Alert, Badge, Button, Card, Col, Row, Spinner } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../hooks/useCart'
import { getProduct } from '../services/productService'
import { discountPercent, priceForDisplay } from '../utils/catalog'
import { formatCurrency } from '../utils/formatCurrency'

function ProductDetailPage({ idDelProducto }) {
    const { addItem } = useCart()
    const navigate = useNavigate()
    const [imagenRota, setImagenRota] = useState(false)
    // estado de la carga del producto, guarda el id al que pertenece
    const [carga, setCarga] = useState({ id: null, status: 'loading', producto: null })
    const [intento, setIntento] = useState(0)

    // pide el producto por id cada vez que cambia el id o el intento
    useEffect(() => {
        const controller = new AbortController()
        const { signal } = controller

        getProduct(idDelProducto, { signal })
            .then((producto) => {
                if (!signal.aborted) {
                    setCarga({ id: idDelProducto, status: 'success', producto })
                }
            })
            .catch((error) => {
                if (!signal.aborted) {
                    // 404 es producto inexistente, cualquier otro error es de carga
                    const status = error?.status === 404 ? 'notfound' : 'error'
                    setCarga({ id: idDelProducto, status, producto: null })
                }
            })

        return () => controller.abort()
    }, [idDelProducto, intento])

    // vuelve a pedir el producto
    function reintentar() {
        setCarga({ id: null, status: 'loading', producto: null })
        setIntento((actual) => actual + 1)
    }

    // si el estado guardado es de otro id se considera cargando
    const status = carga.id === idDelProducto ? carga.status : 'loading'
    const producto = status === 'success' ? carga.producto : null

    // pantalla de carga
    if (status === 'loading') {
        return (
            <section className="py-4">
                <div role="status" className="d-flex align-items-center gap-2">
                    <Spinner animation="border" size="sm" />
                    <span>Cargando producto...</span>
                </div>
            </section>
        )
    }

    // pantalla de error con reintento
    if (status === 'error') {
        return (
            <section className="py-4 text-center">
                <Alert variant="danger" role="alert">
                    <Alert.Heading as="h1">No pudimos cargar el producto</Alert.Heading>
                    <p className="mb-0">Revisa tu conexión e inténtalo de nuevo.</p>
                </Alert>

                <Button variant="primary" className="me-2" onClick={reintentar}>
                    Reintentar
                </Button>
                <Button variant="outline-secondary" onClick={() => navigate('/catalogo')}>
                    Ver catálogo
                </Button>
            </section>
        )
    }

    // pantalla de producto no encontrado
    if (producto === null) {
        return (
            <section className="py-4 text-center">
                <Alert variant="warning">
                    <Alert.Heading as="h1">No encontramos ese producto</Alert.Heading>
                    <p className="mb-0">
                        Lo sentimos, este producto ya no está disponible en el catálogo.
                    </p>
                </Alert>

                <Button variant="primary" onClick={() => navigate('/catalogo')}>
                    Ver catálogo
                </Button>
            </section>
        )
    }

    const enOferta = producto.precioOferta !== undefined
    const descuento = discountPercent(producto)
    const agotado = producto.stock === 0

    return (
        <section className="py-4">
            <p className="mb-3">
                <Button
                    variant="link"
                    className="p-0 text-decoration-none"
                    onClick={() => navigate('/catalogo')}
                >
                    ← Volver al catálogo
                </Button>
            </p>

            <Row className="g-4">
                <Col xs={12} md={5}>
                    {imagenRota ? (
                        <div
                            className="d-flex align-items-center justify-content-center border rounded"
                            style={{ height: '320px', backgroundColor: '#F7F7F7' }}
                        >
                            <span className="text-secondary">Sin imagen</span>
                        </div>
                    ) : (
                        <Card.Img
                            src={producto.imagen}
                            alt={producto.nombre}
                            className="border rounded"
                            style={{ height: '320px', objectFit: 'cover' }}
                            onError={() => setImagenRota(true)}
                        />
                    )}
                </Col>

                <Col xs={12} md={7}>
                    <Card.Text className="text-secondary small mb-1">
                        {producto.categoria}
                    </Card.Text>

                    <h1 className="h3 mb-3">{producto.nombre}</h1>

                    <div className="mb-3">
                        {enOferta && (
                            <Badge bg="warning" text="dark" className="me-2">
                                -{descuento}%
                            </Badge>
                        )}

                        <span className="fs-4">
                            {enOferta ? (
                                <>
                                    <span className="text-success fw-bold">
                                        {formatCurrency(priceForDisplay(producto))}
                                    </span>{' '}
                                    <span className="text-decoration-line-through text-secondary">
                                        {formatCurrency(producto.precio)}
                                    </span>
                                </>
                            ) : (
                                <span className="fw-bold">
                                    {formatCurrency(priceForDisplay(producto))}
                                </span>
                            )}
                        </span>
                        <span className="text-muted"> por {producto.unidad}</span>
                    </div>

                    <p className="mb-4">{producto.descripcion}</p>

                    <Card className="mb-4">
                        <Card.Body>
                            <dl className="row mb-0">
                                <dt className="col-sm-4">Origen</dt>
                                <dd className="col-sm-8">{producto.origen}</dd>

                                <dt className="col-sm-4">Categoría</dt>
                                <dd className="col-sm-8">{producto.categoria}</dd>

                                <dt className="col-sm-4">Unidad</dt>
                                <dd className="col-sm-8">{producto.unidad}</dd>

                                <dt className="col-sm-4">Stock</dt>
                                <dd className="col-sm-8">{producto.stock}</dd>
                            </dl>
                        </Card.Body>
                    </Card>

                    {agotado ? (
                        <Alert variant="secondary" className="mb-0">
                            No quedan unidades de este producto por ahora.
                        </Alert>
                    ) : (
                        <Button
                            variant="success"
                            size="lg"
                            onClick={() => addItem(producto)}
                            aria-label={`Agregar ${producto.nombre} al carrito`}
                        >
                            Agregar al carrito
                        </Button>
                    )}

                    <p className="mt-3 mb-0">
                        <Button
                            variant="outline-secondary"
                            onClick={() => navigate('/carrito')}
                        >
                            Ver carrito
                        </Button>
                    </p>
                </Col>
            </Row>
        </section>
    )
}

export default ProductDetailPage
