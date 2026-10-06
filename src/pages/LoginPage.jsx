
import { Button, Card, Form } from "react-bootstrap"
import { Link } from "react-router-dom"

function LoginPage(){
    return(
        <section className="py-4">
            <Card className="mx-auto shadow-sm" style={{maxWidth: '28rem'}}>
                <Card.Body>
                    <h1 className="h3 mb-3">Iniciar sesión</h1>

                    <p className="text-muted">
                        Accede a tu cuenta para revisar tus datos y futuras compras
                    </p>

                    <Form>
                        <Form.Group className="mb-3" controlId="loginEmail">
                            <Form.Label>Correo electrónico</Form.Label>
                            <Form.Control type="email" placeholder="cliente@correo.cl"></Form.Control>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control type="password" placeholder="Ingresa tu contraseña"></Form.Control>                            
                        </Form.Group>

                        <Button type="button" variant="success" className="w-100">
                            Entrar
                        </Button>
                    </Form>

                    <p className="mt-3 mb-0 text-center">
                        ¿No tienes cuenta? <Link to = "/registro">Crear cuenta</Link>
                    </p>
                </Card.Body>
            </Card>
        </section>
    )
}

export default LoginPage




















