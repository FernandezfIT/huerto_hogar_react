import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { expect, test } from 'vitest'
import AppNavbar from './AppNavbar'
import { CartProvider } from '../context/CartProvider'

test('muestra los enlaces principales de navegación', () => {
    render(
        <MemoryRouter>
            <CartProvider>
                <AppNavbar />
            </CartProvider>
        </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: /huerto hogar/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /inicio/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /catálogo/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /carrito\s*0/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /registro/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /perfil/i })).toBeInTheDocument()
})








