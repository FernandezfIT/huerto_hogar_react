import { Badge, Container, Nav, Navbar } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'
import { useCart } from '../hooks/useCart'

function AppNavbar() {
    const { count } = useCart()

    return (
        <Navbar bg="light" expand="lg" className="border-bottom mb-4">
            <Container>
                <Navbar.Brand as={NavLink} to='/'>
                    Huerto Hogar
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="main-navbar" />

                <Navbar.Collapse id="main-navbar">
                    <Nav className="ms-auto">
                        <Nav.Link as={NavLink} to="/">
                            Inicio
                        </Nav.Link>
                        <Nav.Link as={NavLink} to="/catalogo">
                            Catálogo
                        </Nav.Link>
                        <Nav.Link as={NavLink} to="/carrito">
                            Carrito <Badge bg="success">{count}</Badge>
                        </Nav.Link>

                        <Nav.Link as={NavLink} to="/login">
                            Login
                        </Nav.Link>

                        <Nav.Link as={NavLink} to="/registro">
                            Registro
                        </Nav.Link>


                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default AppNavbar
