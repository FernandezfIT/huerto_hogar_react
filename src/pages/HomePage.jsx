import { Button, Card, Col, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'

function HomePage() {
    return (
        <section className='py-4'>
            <Row className='align-items-center g-4'>
                <Col xs={12} lg={6}>
                    <p className='text-success fw-semibold mb-2'> Fresco, local y natural</p>

                    <h1 className='display-5 fw-bold mb-3'> Huerto Hogar</h1>

                    <p className='lead'>
                        Compra frutas, verduras y productos naturales desde una experiencia simple,
                        responsiva y pensada para el día a día.
                    </p>

                    <div className='d-flex flex-wrap gap-2 mt-4'>
                        <Button as={Link} to="/catalogo" variant='success' size='lg'>
                            Ver Catálogo
                        </Button>

                        <Button as={Link} to="/ofertas" variant='warning' size='lg'>
                            Ver ofertas
                        </Button>

                        <Button as={Link} to="/carrito" variant='outline-success' size='lg'>
                            Ver carrito
                        </Button>
                    </div>
                </Col>

                <Col xs={12} lg={6}>
                    <Card className='shadow-sm'>
                        <Card.Body>
                            <h2 className='h4'>¿Qué encontrarás?</h2>

                            <ul className='ub-0'>
                                <li>Productos frescos y de temporada, cosechados en el campo y llevados directo a tu mesa.</li>
                                <li>Carrito práctico: eliges cantidades, revisas tu detalle y ves el total antes de pagar.</li>
                                <li>Compra rápida y segura: solo necesitas tu contacto y tu dirección de despacho.</li>
                                <li>Búsqueda y filtros por categoría y ofertas para encontrar tus favoritos al instante.</li>

                            </ul>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </section>
    )
}


export default HomePage



