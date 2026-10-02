/**
 * CartSummary muestra el contenido del carrito.
 * No es dueño del estado: recibe cart y funciones desde App.jsx.
 */


function CartSummary({ cart, onRemoveFromCart, onDecreaseQuantity }) {
    // Total derivado: se calcula desde cart para evitar duplicar estado.
    const cartTotal = cart.reduce(
        (total, item) => total + item.precio * item.cantidad,
        0
    );

    return (
        <section className="mt-5">
            <h2>Carrito</h2>

            {cart.length === 0 ? (
                <p>El carrito está vacío</p>
            ) : (
                <>
                    <ul>
                        {cart.map((item) => (
                            <li key={item.id}>
                                {item.nombre} x {item.cantidad} = ${item.precio * item.cantidad} CLP

                                <button
                                    className="btn btn-sm btn-outline-secondary ms-2"
                                    onClick={() => onDecreaseQuantity(item.id)}
                                >
                                    -
                                </button>

                                <button
                                    className="btn btn-sm btn-outline-danger ms-2"
                                    onClick={() => onRemoveFromCart(item.id) }
                                >
                                    Eliminar

                                </button>
                            </li>
                        ))}
                    </ul>

                    <p className="fw-bold mt-3">
                        Total: ${cartTotal} CLP
                    </p>
                </>
            )}
        </section>
    );
}

export default CartSummary;