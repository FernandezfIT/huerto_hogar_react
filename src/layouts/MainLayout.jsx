import { Container } from "react-bootstrap"
import { Outlet } from "react-router-dom"
import AppNavbar from "../components/AppNavbar"

function MainLayout(){
    return(
        <>
            <AppNavbar/>

            <Container as = "main" className="pb-5">
                <Outlet/>
            </Container>

            <footer className="border-top py-4 text-center text-muted">
                <Container>
                    <small>Huerto Hogar - Productos frescos y naturales</small>
                </Container>
            </footer>
        </>
    )
}

export default MainLayout


/**
 * 
 *  Outlet es el espacio donde React Router renderiza la página actual.
 * 
 * 
 * 
 * 
 * 
 */



