import { useCallback, useEffect, useMemo, useState } from 'react'
import { getCategories, getProducts } from '../services/productService'
import { CatalogContext } from './catalogContext'

export function CatalogProvider({ children }) {
    // estado del catalogo: datos, estado de carga y error
    const [datos, setDatos] = useState({
        products: [],
        categories: [],
        status: 'loading',
        error: null,
    })
    const [intento, setIntento] = useState(0)

    // carga productos y categorias cada vez que cambia el intento
    useEffect(() => {
        const controller = new AbortController()
        const { signal } = controller

        Promise.all([getProducts({ signal }), getCategories({ signal })])
            .then(([products, categories]) => {
                // ignora respuestas tardias de una carga cancelada
                if (signal.aborted) {
                    return
                }

                setDatos({ products, categories, status: 'success', error: null })
            })
            .catch((error) => {
                if (signal.aborted) {
                    return
                }

                // si falla, conserva los ultimos datos validos pero marca error
                setDatos((anterior) => ({ ...anterior, status: 'error', error }))
            })

        // cancela la peticion si el componente se desmonta
        return () => controller.abort()
    }, [intento])

    // vuelve a pedir el catalogo
    const reload = useCallback(() => {
        setDatos((anterior) => ({ ...anterior, status: 'loading', error: null }))
        setIntento((actual) => actual + 1)
    }, [])

    const value = useMemo(() => ({ ...datos, reload }), [datos, reload])

    return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
}
