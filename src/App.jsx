/*
  App.jsx define la estructura principal de la app.

  El estado del carrito ya no vive acá: lo administra CartProvider a través
  de useCart. App solo compone el encabezado, la navegación y la vista activa.

*/

import { useState } from "react"
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from "react-router-dom"
import { CartProvider } from './context/CartProvider'
import MainLayout from './layouts/MainLayout'
import CatalogPage from './pages/CatalogPage'
import HomePage from './pages/HomePage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import OrderSuccessPage from './pages/OrderSuccessPage'
import OrderFailurePage from './pages/OrderFailurePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProfilePage from './pages/ProfilePage'

function AppRoutes() {

  const navigate = useNavigate()
  const [orden, setOrden] = useState(null)
  const [errorOrden, setErrorOrden] = useState(null)

  function navigateTo(vista) {
    const rutas = {
      catalogo: '/catalogo',
      carrito: '/carrito',
      checkout: '/checkout',
      exito: '/compra-exitosa',
      falla: '/compra-fallida',
      login: '/login',
      registro: '/registro',
      perfil: '/perfil'
    }

    navigate(rutas[vista] ?? '/')
  }

  function handleOrderCreated(nuevaOrden) {
    setOrden(nuevaOrden)
    setErrorOrden(null)
  }

  function handleOrderFailed(error) {
    setErrorOrden(error)
    setOrden(null)
  }

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="catalogo" element={<CatalogPage />} />
        <Route path="carrito" element={<CartPage onNavigate={navigateTo} />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="registro" element={<RegisterPage />} />
        <Route path="perfil" element={<ProfilePage />} />
        <Route
          path="checkout"
          element={
            <CheckoutPage
              onNavigate={navigateTo}
              onOrderCreated={handleOrderCreated}
              onOrderFailed={handleOrderFailed}
            />
          }
        />
        <Route
          path="compra-exitosa"
          element={<OrderSuccessPage order={orden} onNavigate={navigateTo} />}
        />
        <Route
          path="compra-fallida"
          element={<OrderFailurePage error={errorOrden} onNavigate={navigateTo} />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <AppRoutes />
      </CartProvider>
    </BrowserRouter>
  )
}

export default App




