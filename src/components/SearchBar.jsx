/**
 * SearchBar es el campo de búsqueda del catálogo.
 *
 * Es un input controlado que solo avisa lo que se escribió: el filtrado real
 * lo hace CatalogPage con filterProducts. Se declara con <Form> de
 * react-bootstrap y un <Form.Label> real, así el campo tiene nombre accesible
 * y se puede buscar con getByLabelText.
 */

import { Form, InputGroup, Button } from 'react-bootstrap'

function SearchBar({ query, onChange, onClear, resultCount }) {
    const hayTexto = query.trim() !== ''

    return (
        <Form
            role="search"
            className="mb-4"
            onSubmit={(evento) => evento.preventDefault()}
        >
            <Form.Label htmlFor="buscar-producto" className="fw-semibold">
                Buscar productos
            </Form.Label>

            <InputGroup>
                <Form.Control
                    id="buscar-producto"
                    type="search"
                    value={query}
                    onChange={(evento) => onChange(evento.target.value)}
                    placeholder="Por ejemplo: manzana, miel, espinacas"
                    aria-describedby="buscar-producto-ayuda"
                />
                {hayTexto && (
                    <Button variant="outline-secondary" onClick={onClear}>
                        Limpiar
                    </Button>
                )}
            </InputGroup>

            <Form.Text id="buscar-producto-ayuda">
                La búsqueda ignora mayúsculas y tildes, y se combina con el filtro
                de categoría.
            </Form.Text>

            {hayTexto && (
                <p className="small text-secondary mt-2" role="status">
                    {resultCount === 1
                        ? '1 producto encontrado.'
                        : `${resultCount} productos encontrados.`}
                </p>
            )}
        </Form>
    )
}

export default SearchBar
