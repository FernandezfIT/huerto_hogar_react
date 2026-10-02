/*

App.jsx Define la estructura principal de la app
Muestra componentes, etc

*/


import { useState } from 'react';
import ProductCard from './components/ProductCard';
import { products } from './data/products';
import CartSummary from './components/CartSummary'


function App() {
  // Estado principal del carrito. Los componentes hijos lo reciben por props,
  // pero las modificaciones reales se hacen aquí mediante setCart.
  const [cart, setCart] = useState([]);

  // Agrega un producto al carrito. Si ya existe, aumenta su cantidad
  // creando un nuevo array para no mutar el estado anterior.
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

  // Elimina completamente un producto del carrito usando filter,
  // que devuelve un nuevo array sin modificar el original.
  function removeFromCart(productId){
    const updatedCart = cart.filter((item) => item.id !== productId);
    setCart(updatedCart)
  }

  // Disminuye la cantidad de un producto. Si solo queda una unidad,
  // reutiliza removeFromCart para eliminarlo del carrito.
  function decreaseQuantity(productId) {
    const productInCart = cart.find((item) => item.id === productId)

    if (productInCart.cantidad === 1) {
      removeFromCart(productId)
      return
    }

    const updatedCart = cart.map((item) => 
      item.id === productId
        ? { ...item, cantidad: item.cantidad -1 }
        : item
    )

    setCart(updatedCart)

  }


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

      <CartSummary 
        cart = {cart} 
        onRemoveFromCart = {removeFromCart}
        onDecreaseQuantity = {decreaseQuantity}
      />
    </main>
  );
}



export default App;  