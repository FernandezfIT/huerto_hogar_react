/**
 * CategoryFilter muestra los botones de categoría del catálogo.
 *
 * No decide qué productos se muestran: solo avisa qué categoría se eligió.
 * La lista llega ya filtrada desde CatalogPage. "Todas" usa null porque null
 * significa "sin filtro", que es más explícito que la cadena "Todas".
 *
 * Se usa flex-wrap y no ButtonGroup porque los nombres de categoría son largos
 * ("Productos Orgánicos") y en móvil una fila sola se desborde.
 */

import { Badge, Button } from 'react-bootstrap'

function CategoryFilter({ categories, selected, onSelect, countByCategory }) {
    return (
        <nav className="mb-4" aria-label="Filtrar por categoría">
            <div className="d-flex flex-wrap gap-2">
                <Button
                    variant={selected === null ? 'success' : 'outline-success'}
                    onClick={() => onSelect(null)}
                    aria-pressed={selected === null}
                >
                    Todas
                </Button>

                {categories.map((categoria) => {
                    const activo = selected === categoria.nombre

                    return (
                        <Button
                            key={categoria.nombre}
                            variant={activo ? 'success' : 'outline-success'}
                            onClick={() => onSelect(categoria.nombre)}
                            aria-pressed={activo}
                        >
                            {categoria.nombre}
                            <Badge bg="secondary" className="ms-2">
                                {countByCategory[categoria.nombre] ?? 0}
                            </Badge>
                        </Button>
                    )
                })}
            </div>
        </nav>
    )
}

export default CategoryFilter