/**
 * 
 * Plantilla reutilizable, en este caso son CARDS para mostrar
 * los productos con cierto formato
 * 
 */

function ProductCard({ product, onAddToCart }) {
    return (
        <article className="card h-100">
            <img
                src={product.imagen}
                className="card-img-top"
                alt={product.nombre}
            />

            <div className="card-body">
                <h2 className="h5 card-title">
                    {product.id} - {product.nombre}
                </h2>

                <p className="card-text">{product.descripcion}</p>

                <p className="mb-1">
                    <strong>Precio:</strong> ${product.precio} CLP por {product.unidad}
                </p>

                <p className="mb-3">
                    <strong>Stock:</strong> {product.stock}
                </p>

                <button 
                    className="btn btn-success"
                    onClick={() => onAddToCart(product)}
                >
                    Agregar al carrito
                </button>
            </div>
        </article>
    );
}

export default ProductCard;  