import { useContext } from 'react'
import { CatalogContext } from '../context/catalogContext'

// devuelve products, categories, status, error y reload
export function useCatalog() {
    const context = useContext(CatalogContext)

    // avisa si se usa fuera del provider
    if (!context) {
        throw new Error('useCatalog debe usarse dentro de un <CatalogProvider>.')
    }

    return context
}
