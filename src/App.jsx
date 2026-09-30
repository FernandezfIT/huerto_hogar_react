/*

App.jsx Define la estructura principal de la app
Muestra componentes, etc

*/


import { useState } from 'react';
import ProductCard from './components/ProductCard';
import { products } from './data/products';


function App() {
  const [cart, setCart] = useState([]);

  function addToCart(productToAdd) {
    const existingProduct = cart.find(
      (item) => item.id === productToAdd.id
    );

    if (existingProduct) {
      const updatedCart = cart.map((item) =>
        item.id === productToAdd.id
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      );

      setCart(updatedCart);
      return;

    }

    const newCartItem = {
      ...productToAdd,
      cantidad: 1,
    };

    setCart([...cart, newCartItem]);

  }

  const cartTotal = cart.reduce(
    (total, item) => total + item.precio * item.cantidad,
    0
  );

  return (
    <main className="container py-4">
      <header className="mb-4">
        <h1>Huerto Hogar</h1>
        <p className="lead">
          E-commerce de productos frescos y naturales.
        </p>
      </header>

      <section>
        <h2 className='mb-3'>
          Catálogo de productos
        </h2>

        <div className="row g-4">
          {products.map((product) => (
            <div className="col-12 col-md-6 col-lg-4" key={product.id}>
              <ProductCard
                product={product}
                onAddToCart={addToCart}
              />
            </div>
          ))}
        </div>
      </section>

      <section className='mt-5'>
        <h2>Carrito</h2>

        {cart.length === 0 ? (
          <p>El carrito está vacío</p>
        ) : (
          <>
            <ul>

              {cart.map((item) =>

                <li key={item.id}>
                  {item.nombre} x {item.cantidad} = ${item.precio * item.cantidad} CLP
                </li>
              )}
            </ul>
            <p className='fw-bold mt-3'>
              Total: ${cartTotal} CLP
            </p>
          </>
        )}
      </section>
    </main>
  );
}



export default App;  