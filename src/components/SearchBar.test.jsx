import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { expect, test, vi } from 'vitest'
import SearchBar from './SearchBar'

function renderSearchBar(props = {}) {
    const defaults = {
        query: '',
        onChange: vi.fn(),
        onClear: vi.fn(),
        resultCount: 0,
    }

    render(<SearchBar {...defaults} {...props} />)

    return { ...defaults, ...props }
}

test('el campo de búsqueda tiene etiqueta asociada', () => {
    renderSearchBar()

    const campo = screen.getByLabelText(/buscar productos/i)

    expect(campo).toBeInTheDocument()
    expect(campo).toHaveAttribute('type', 'search')
})

test('el formulario usa role search para que sea localizable', () => {
    renderSearchBar()

    expect(screen.getByRole('search')).toBeInTheDocument()
})

test('escribe en el campo y avisa el texto cada tecla', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()

    /*
       SearchBar es controlado, así que el test tiene que reflejar el estado:
       si se pasa query="" fijo, React vacía el campo tras cada tecla y solo se
       ve un carácter por llamada.
    */
    function Wrapper() {
        const [query, setQuery] = useState('')

        return (
            <SearchBar
                query={query}
                onChange={(valor) => {
                    onChange(valor)
                    setQuery(valor)
                }}
                onClear={() => setQuery('')}
                resultCount={1}
            />
        )
    }

    render(<Wrapper />)

    const campo = screen.getByLabelText(/buscar productos/i)
    await user.type(campo, 'miel')

    expect(campo).toHaveValue('miel')
    expect(onChange.mock.calls.map(([valor]) => valor)).toEqual(['m', 'mi', 'mie', 'miel'])
})

test('muestra el texto que le pasan como valor', () => {
    renderSearchBar({ query: 'espinacas' })

    expect(screen.getByLabelText(/buscar productos/i)).toHaveValue('espinacas')
})

test('el botón Limpiar aparece solo cuando hay texto', () => {
    const { rerender } = render(<SearchBar query="" onChange={vi.fn()} onClear={vi.fn()} resultCount={7} />)

    expect(screen.queryByRole('button', { name: /limpiar/i })).not.toBeInTheDocument()

    rerender(<SearchBar query="miel" onChange={vi.fn()} onClear={vi.fn()} resultCount={1} />)

    expect(screen.getByRole('button', { name: /limpiar/i })).toBeInTheDocument()
})

test(' Limpiar no aparece con espacios en blanco', () => {
    renderSearchBar({ query: '   ' })

    expect(screen.queryByRole('button', { name: /limpiar/i })).not.toBeInTheDocument()
})

test('el botón Limpiar avisa que se quiere borrar', async () => {
    const onClear = vi.fn()
    const user = userEvent.setup()

    renderSearchBar({ query: 'miel', onClear })

    await user.click(screen.getByRole('button', { name: /limpiar/i }))

    expect(onClear).toHaveBeenCalledTimes(1)
})

test('el contador usa singular cuando hay un resultado', () => {
    renderSearchBar({ query: 'miel', resultCount: 1 })

    expect(screen.getByRole('status')).toHaveTextContent('1 producto encontrado.')
})

test('el contador usa plural con varios resultados', () => {
    renderSearchBar({ query: 'miel', resultCount: 4 })

    expect(screen.getByRole('status')).toHaveTextContent('4 productos encontrados.')
})

test('sin texto no hay contador', () => {
    renderSearchBar({ query: '', resultCount: 7 })

    expect(screen.queryByRole('status')).not.toBeInTheDocument()
})

test('el texto de ayuda queda asociado al campo', () => {
    renderSearchBar()

    expect(screen.getByText(/ignora mayúsculas y tildes/i)).toHaveAttribute(
        'id',
        'buscar-producto-ayuda'
    )
    expect(screen.getByLabelText(/buscar productos/i)).toHaveAttribute(
        'aria-describedby',
        'buscar-producto-ayuda'
    )
})

test('Enter no borra la búsqueda ni recarga la página', async () => {
    const user = userEvent.setup()

    /* Wrapper controlado: si el submit reseteara el estado, "miel" desaparecería. */
    function Wrapper() {
        const [query, setQuery] = useState('')

        return <SearchBar query={query} onChange={setQuery} onClear={() => setQuery('')} resultCount={1} />
    }

    render(<Wrapper />)

    const campo = screen.getByLabelText(/buscar productos/i)
    await user.type(campo, 'miel{Enter}')

    expect(campo).toHaveValue('miel')
})
