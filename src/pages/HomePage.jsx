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

                        <Button as={Link} to="/carrito" variant='outline-success' size='lg'>
                            Ver carrito
                        </Button>
                    </div>
                </Col>

                <Col xs={12} lg={6}>
                    <Card className='shadow-sm'>
                        <Card.Body>
                            <h2 className='h4'>¿Que encontrarás?</h2>

                            <ul className='ub-0'>
                                <li>Catálogo de productos frescos.</li>
                                <li>Carrito con cantidades, totales y persistencia.</li>
                                <li>Checkout con validaciones de datos del cliente.</li>
                                <li>Diseño responsivo con React-Bootstrap.</li>

                            </ul>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </section>
    )
}


export default HomePage



