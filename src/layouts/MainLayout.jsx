import { Container } from "react-bootstrap"
import { Outlet } from "react-router-dom"
import AppNavbar from "../components/AppNavbar"
import Banner from "../components/Banner"

function MainLayout(){
    return(
        <>
            <AppNavbar/>

            <Banner/>

            <Container as = "main" className="pb-5">
                <Outlet/>
            </Container>

            <footer className="pie-huerto py-4 text-center">
                <Container>
                    <small>Huerto Hogar - Productos frescos y naturales</small>
                </Container>
            </footer>
        </>
    )
}

export default MainLayout