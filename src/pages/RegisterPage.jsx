import { Button, Card, Form } from "react-bootstrap"
import { Link } from "react-router-dom"

function RegisterPage() {
    return (
        <section className="py-4">
            <Card className="mx-auto shadow-sm" style={{ maxWidth: '32rem' }}>
                <Card.Body>
                    <h1 className="h3 mb-3">Crear cuenta</h1>

                    <p className="text-muted">
                        Este formulario prepara la experiencia de registro. En esta versión
                        frontend no se almacenan usuarios reales.
                    </p>

                    <Form>
                        <Form.Group className="mb-3" controlId="registerName">
                            <Form.Label>Nombre completo</Form.Label>
                            <Form.Control type="text" placeholder="Ana López" />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="registerEmail">
                            <Form.Label>Correo electrónico</Form.Label>
                            <Form.Control type="email" placeholder="ana.lopez@correo.cl" />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="registerPassword">
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control type="password" placeholder="Crea una contraseña" />
                        </Form.Group>

                        <Form.Group className="mb-4" controlId="registerConfirmPassword">
                            <Form.Label>Confirmar contraseña</Form.Label>
                            <Form.Control type="password" placeholder="Repite tu contraseña" />
                        </Form.Group>

                        <Button type="button" variant="success" className="w-100">
                            Crear cuenta
                        </Button>
                    </Form>

                    <p className="mt-3 mb-0 text-center">
                        ¿Ya tienes cuenta? <Link to="/login">Iniciar sesion</Link>
                    </p>
                </Card.Body>
            </Card>
        </section>
    )
}


export default RegisterPage















