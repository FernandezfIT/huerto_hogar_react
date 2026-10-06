import { useLocation } from 'react-router-dom'

const RUTAS_SIN_BANNER = ['/login', '/registro']

function Banner() {
    const { pathname } = useLocation()

    if (RUTAS_SIN_BANNER.includes(pathname)) {
        return null
    }

    const esInicio = pathname === '/'
    const src = esInicio
        ? '/images/banner-huertohogar.jpg'
        : '/images/banner-huertohogar2.jpg'

    return (
        <section id="banner">
            <img src={src} alt="Banner HuertoHogar" />
        </section>
    )
}

export default Banner