import { Alert, Button, Spinner } from 'react-bootstrap'

// muestra el mensaje de carga o de error del catalogo
function CatalogStatus({ status, onRetry, message = 'No pudimos cargar el catálogo.' }) {
    // mientras carga muestra un spinner
    if (status === 'loading') {
        return (
            <div role="status" className="d-flex align-items-center gap-2 py-3">
                <Spinner animation="border" size="sm" />
                <span>Cargando catálogo...</span>
            </div>
        )
    }

    // si fallo muestra el error con boton para reintentar
    return (
        <Alert variant="danger" role="alert">
            <p className="mb-2">{message} Revisa tu conexión e inténtalo de nuevo.</p>
            <Button variant="outline-danger" size="sm" onClick={onRetry}>
                Reintentar
            </Button>
        </Alert>
    )
}

export default CatalogStatus
