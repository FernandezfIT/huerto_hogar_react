/*
  El contexto se declara en su propio archivo, separado del provider.

  Motivo: oxlint activa react/only-export-components, que marca como warning
  mezclar en un mismo archivo un contexto y componentes de React.
*/

import { createContext } from 'react'

export const CartContext = createContext(null)