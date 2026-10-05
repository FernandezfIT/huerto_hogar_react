import { Alert, Card, Col, Row } from "react-bootstrap";

function ProfilePage() {
    return (
        <section className="py-4">
            <h1 className="h3 mb-4">Mi Perfil</h1>

            <Alert variant="info">
                Esta vista es una maqueta frontend. En esta versión no existe autenticación
                real ni almacenamiento de usuarios registrados.
            </Alert>

            <Row className="g-4">
                <Col xs={12} lg={6}>
                    <Card className="h-100 shadow-sm" >
                        <Card.Body>
                            <h2 className="h5">Datos del cliente</h2>
                            <p className="mb-1">
                                <strong>Nombre:</strong> Cliente Demo
                            </p>
                            <p className="mb-1">
                                <strong>Correo:</strong>cloiente@correo.cl
                            </p>
                            <p className="mb-0">
                                <strong>Teléfono</strong>+56 9 1234 5678
                            </p>
                        </Card.Body>
                    </Card>
                </Col>

                <Col xs={12} lg={6}>
                    <Card className="h-100 shadow-sm">
                        <Card.Body>
                            <h2 className="h5">Preferencias</h2>
                            <ul className="mb-0">
                                <li>Productos frescos de temporada.</li>
                                <li>Entrega local simulada.</li>
                                <li>Compras rápidas desde catálogo.</li>
                            </ul>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </section>
    )
}

export default ProfilePage