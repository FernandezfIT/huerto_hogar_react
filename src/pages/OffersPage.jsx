/*
  OffersPage es la vista de /ofertas: solo los productos con precioOferta.

  Usa getOffers de utils/catalog, que ya existía pero no tenía consumidor. La
  página no filtra nada por su cuenta, igual que CatalogPage con el catálogo:
  recibe la lista resuelta y la dibuja con ProductList.
*/

import { Alert } from 'react-bootstrap'
import ProductList from '../components/ProductList'
import { products } from '../data/products'
import { useCart } from '../hooks/useCart'
import { discountPercent, getOffers } from '../utils/catalog'
import { formatCurrency } from '../utils/formatCurrency'

function OffersPage() {
    const { addItem } = useCart()

    const ofertas = getOffers(products)

    /* El descuento más alto se muestra arriba para que el usuario sepa de
       entrada cuánto puede ahorrar, sin tener que revisar las tres tarjetas. */
    const mejorOferta =
        ofertas.length === 0
            ? null
            : ofertas.reduce((mejor, producto) =>
                  discountPercent(producto) > discountPercent(mejor) ? producto : mejor
              )

    return (
        <section className="py-4">
            <h1 className="h3 mb-2">Ofertas de la semana</h1>

            {ofertas.length === 0 ? (
                <Alert variant="warning" role="status">
                    Hoy no tenemos ofertas. Vuelve pronto o revisa el catálogo completo.
                </Alert>
            ) : (
                <>
                    <p className="text-muted">
                        {ofertas.length} productos con precio especial. El mejor descuento es
                        de {discountPercent(mejorOferta)}% en{' '}
                        <strong>{mejorOferta.nombre}</strong> a{' '}
                        {formatCurrency(mejorOferta.precioOferta)}.
                    </p>

                    <ProductList
                        items={ofertas}
                        onAddToCart={addItem}
                        emptyMessage="No hay ofertas por ahora."
                    />

                    <Alert variant="info" className="mt-4 mb-0">
                        Los precios de oferta están sujetos a disponibilidad y cambian cada semana.
                    </Alert>
                </>
            )}
        </section>
    )
}

export default OffersPage
