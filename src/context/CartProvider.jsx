/*
  CartProvider es el dueño del estado del carrito.

  Toda la lógica de agregar, aumentar, disminuir, eliminar y vaciar vive en
  el reducer de este archivo. Los componentes solo reciben funciones, nunca
  modifican el estado directamente, y el carrito queda persistido en
  localStorage para sobrevivir a un refresh.
*/

import { useEffect, useMemo, useReducer } from 'react'
import { CartContext } from './cartContext'
import { getCartCount, getCartTotal, getMaxQuantity } from '../utils/cartCalculations'
import { loadCart, saveCart } from '../utils/cartStorage'

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const product = action.product
      const max = getMaxQuantity(product)
      const existing = state.items.find((item) => item.id === product.id)

      // Un producto con stock 0 no entra al carrito.
      if (!existing) {
        if (max <= 0) {
          return state
        }

        // Se guarda una copia del producto para que el carrito conserve el
        // precio del momento de agregarlo, como en un resumen de compra real.
        return { items: [...state.items, { ...product, cantidad: 1 }] }
      }

      // Ya estaba en el carrito: se incrementa sin pasar del stock disponible.
      return {
        items: state.items.map((item) =>
          item.id === product.id
            ? { ...item, cantidad: Math.min(item.cantidad + 1, max) }
            : item,
        ),
      }
    }

    case 'INCREASE_QUANTITY': {
      return {
        items: state.items.map((item) =>
          item.id === action.id
            ? { ...item, cantidad: Math.min(item.cantidad + 1, getMaxQuantity(item)) }
            : item,
        ),
      }
    }

    case 'DECREASE_QUANTITY': {
      const item = state.items.find((row) => row.id === action.id)

      // Guarda por id inexistente: si el producto ya no está, el estado no cambia.
      if (!item) {
        return state
      }

      // Si queda una sola unidad, la línea se elimina del carrito.
      if (item.cantidad <= 1) {
        return { items: state.items.filter((row) => row.id !== action.id) }
      }

      return {
        items: state.items.map((row) =>
          row.id === action.id ? { ...row, cantidad: row.cantidad - 1 } : row,
        ),
      }
    }

    case 'REMOVE_ITEM': {
      return { items: state.items.filter((item) => item.id !== action.id) }
    }

    case 'CLEAR_CART': {
      return { items: [] }
    }

    default:
      return state
  }
}

export function CartProvider({ children }) {
  /*
    El estado inicial se lee de localStorage al montar el provider, y no al
    importar el módulo: así cada montaje recupera el carrito que había
    guardado y un segundo provider no arranca con datos de otro momento.
  */
  const [state, dispatch] = useReducer(cartReducer, null, () => ({
    items: loadCart(),
  }))

  /*
    Guardar un carrito vacío equivale a limpiar el almacenamiento, así que
    un solo efecto basta para persistir y para vaciar.
  */
  useEffect(() => {
    saveCart(state.items)
  }, [state.items])

  // El total y la cantidad son derivados: no se guardan como estado propio.
  const value = useMemo(
    () => ({
      items: state.items,
      total: getCartTotal(state.items),
      count: getCartCount(state.items),
      addItem: (product) => dispatch({ type: 'ADD_ITEM', product }),
      increaseQuantity: (id) => dispatch({ type: 'INCREASE_QUANTITY', id }),
      decreaseQuantity: (id) => dispatch({ type: 'DECREASE_QUANTITY', id }),
      removeItem: (id) => dispatch({ type: 'REMOVE_ITEM', id }),
      clearCart: () => dispatch({ type: 'CLEAR_CART' }),
    }),
    [state.items],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}