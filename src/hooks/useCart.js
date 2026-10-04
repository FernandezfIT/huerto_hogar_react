/*
  useCart es la única forma de leer el carrito desde un componente.

  Concentra el acceso al contexto para que ninguna vista tenga que importar
  CartContext directamente, y falla con un mensaje claro si se usa fuera
  del provider.
*/

import { useContext } from 'react'
import { CartContext } from '../context/cartContext'

export function useCart() {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error('useCart debe usarse dentro de un <CartProvider>.')
  }

  return context
}