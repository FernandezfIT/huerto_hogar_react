import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { expect, test } from 'vitest'
import Banner from './Banner'

function renderBanner(ruta = '/') {
    render(
        <MemoryRouter initialEntries={[ruta]}>
            <Banner />
        </MemoryRouter>
    )
}

test('en la página de inicio se muestra el banner principal', () => {
    renderBanner('/')

    const imagen = screen.getByAltText('Banner HuertoHogar')

    expect(imagen).toHaveAttribute('src', '/images/banner-huertohogar.jpg')
})

test('en el resto de las páginas se muestra el segundo banner', () => {
    renderBanner('/catalogo')

    const imagen = screen.getByAltText('Banner HuertoHogar')

    expect(imagen).toHaveAttribute('src', '/images/banner-huertohogar2.jpg')
})

test('en login y registro no se renderiza el banner', () => {
    renderBanner('/login')
    expect(screen.queryByAltText('Banner HuertoHogar')).not.toBeInTheDocument()

    renderBanner('/registro')
    expect(screen.queryByAltText('Banner HuertoHogar')).not.toBeInTheDocument()
})