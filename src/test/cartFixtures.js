/*
  Datos de prueba compartidos por las pruebas de las páginas del carrito.

  Los productos son fixtures sin cantidad: conCarrito se encarga de agregarla.
  Se siembran en localStorage porque CartProvider lee el carrito al montar, así
  las páginas hay que probarlas con un carrito realista.
*/

export const manzana = {
  id: 'FR001',
  nombre: 'Manzanas Fuji',
  precio: 1200,
  stock: 5,
  unidad: 'kilo',
}

export const naranja = {
  id: 'FR002',
  nombre: 'Naranjas Valencia',
  precio: 1000,
  precioOferta: 800,
  stock: 5,
  unidad: 'kilo',
}

export const zanahoria = {
  id: 'VR001',
  nombre: 'Zanahorias Orgánicas',
  precio: 900,
  stock: 2,
  unidad: 'kilo',
}

// Arma el carrito que se guarda en localStorage, con una unidad por producto.
export function conCarrito(...productos) {
  return productos.map((producto) => ({ ...producto, cantidad: 1 }))
}

export function seedCart(items) {
  localStorage.setItem('huerto-hogar-cart', JSON.stringify(items))
}