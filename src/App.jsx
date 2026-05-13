import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { AuthProvider } from './hooks/AuthContext.jsx'
import { CartProvider } from './hooks/CartContext.jsx'

import Layout from './components/Layout/index.jsx'
import Login from './pages/Login/index.jsx'
import Register from './pages/Register/index.jsx'
import Home from './pages/Home/index.jsx'
import Menu from './pages/Menu/index.jsx'
import Cart from './pages/Cart/index.jsx'
import Checkout from './pages/Checkout/index.jsx'
import CheckoutSuccess from './pages/Checkout/Success.jsx'
import AdminLayout from './pages/Admin/AdminLayout.jsx'
import AdminOrders from './pages/Admin/Orders/index.jsx'
import AdminProducts from './pages/Admin/Products/index.jsx'
import ProductForm from './pages/Admin/Products/ProductForm.jsx'

import { useAuth } from './hooks/AuthContext.jsx'

function PrivateRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" replace />
}

function AdminRoute({ children }) {
  const { user, isAdmin } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (!isAdmin) return <Navigate to="/home" replace />
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* Public */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Private */}
            <Route element={<Layout />}>
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
              <Route path="/menu" element={<PrivateRoute><Menu /></PrivateRoute>} />
              <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
              <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
              <Route path="/checkout/success" element={<PrivateRoute><CheckoutSuccess /></PrivateRoute>} />
            </Route>

            {/* Admin */}
            <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
              <Route index element={<Navigate to="/admin/orders" replace />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="products/new" element={<ProductForm />} />
              <Route path="products/edit/:id" element={<ProductForm />} />
            </Route>

            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>

          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            closeOnClick
            pauseOnHover
            theme="dark"
          />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
