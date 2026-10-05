/**
 * 
 * Plantilla reutilizable, en este caso son CARDS para mostrar
 * los productos con cierto formato
 * 
 */

import { useState } from 'react'
import { Badge, Button, Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { formatCurrency } from '../utils/formatCurrency'
import { discountPercent, priceForDisplay } from '../utils/catalog'

function ProductCard({ product, onAddToCart }) {
    const [imagenRota, setImagenRota] = useState(false)

    const enOferta = product.precioOferta !== undefined
    const descuento = discountPercent(product)

    return (
        <Card className="h-100">
            {enOferta && (
                <Badge bg="warning" text="dark" className="position-absolute m-2">
                    -{descuento}%
                </Badge>
            )}

            {imagenRota ? (
                <div
                    className="card-img-top d-flex align-items-center justify-content-center"
                    style={{ height: '180px', backgroundColor: '#F7F7F7' }}
                >
                    <span className="text-secondary">Sin imagen</span>
                </div>
            ) : (
                <Card.Img
                    variant="top"
                    src={product.imagen}
                    alt={product.nombre}
                    style={{ height: '180px', objectFit: 'cover' }}
                    onError={() => setImagenRota(true)}
                />
            )}

            <Card.Body>
                <Card.Text className="text-secondary small mb-1">
                    {product.id} · {product.categoria}
                </Card.Text>

                <Card.Title as="h2" className="h5">
                    <Link
                        to={`/producto/${product.id}`}
                        className="text-decoration-none text-dark"
                    >
                        {product.nombre}
                    </Link>
                </Card.Title>

                <Card.Text className="small">{product.descripcion}</Card.Text>

                <Card.Text className="small mb-1">
                    <strong>Origen:</strong> {product.origen}
                </Card.Text>

                <Card.Text className="mb-1">
                    {enOferta ? (
                        <>
                            <strong>Precio oferta:</strong>{' '}
                            <span className="text-success fw-bold">
                                {formatCurrency(priceForDisplay(product))}
                            </span>{' '}
                            <span className="text-decoration-line-through text-secondary small">
                                {formatCurrency(product.precio)}
                            </span>
                        </>
                    ) : (
                        <>
                            <strong>Precio:</strong>{' '}
                            <span className="fw-bold">
                                {formatCurrency(priceForDisplay(product))}
                            </span>
                        </>
                    )}{' '}
                    <span className="small">por {product.unidad}</span>
                </Card.Text>

                <Card.Text className="mb-3">
                    <strong>Stock:</strong> {product.stock}
                </Card.Text>

                <Button
                    variant="success"
                    onClick={() => onAddToCart(product)}
                    aria-label={`Agregar ${product.nombre} al carrito`}
                >
                    Agregar al carrito
                </Button>
            </Card.Body>
        </Card>
    );
}

export default ProductCard;