import { useState } from 'react'
import { NavLink, Outlet, Navigate, useNavigate } from 'react-router-dom'
import { ClipboardList, Package, ShoppingCart, LogOut, ChevronRight } from 'lucide-react'
import { useAuth } from '../../hooks/AuthContext.jsx'

export default function AdminLayout() {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [productsOpen, setProductsOpen] = useState(false)

  if (!user) return <Navigate to="/login" replace />
  if (!isAdmin) return <Navigate to="/home" replace />

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className="admin-sidebar flex flex-col h-screen">
        {/* Logo Area */}
        <div className="flex justify-center mb-10 pt-4">
          <img src="/assets/login/logo2.svg" alt="DevBurguer" className="w-[120px]" />
        </div>

        {/* Nav Links */}
        <nav className="flex-1 flex flex-col gap-2">
          <NavLink
            to="/admin/orders"
            className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
          >
            <ClipboardList size={20} className="opacity-80" />
            Pedidos
          </NavLink>

          <NavLink
            to="/admin/products"
            className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
            end
          >
            <Package size={20} className="opacity-80" />
            <span className="flex-1">Produtos</span>
            <ChevronRight size={16} className="opacity-50" />
          </NavLink>

          <NavLink
            to="/admin/products/new"
            className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
          >
            <ShoppingCart size={20} className="opacity-80" />
            Adicionar produto
          </NavLink>
        </nav>

        {/* Sair Footer - mt-auto pushes this to the bottom */}
        <div className="mt-auto border-t border-[#4a4a4a]">
          <button
            onClick={handleLogout}
            className="sidebar-item w-full hover:bg-white/5 flex items-center gap-3 py-4"
          >
            <LogOut size={20} className="opacity-80" />
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-content">
        <Outlet />
      </main>

      {/* Admin Footer */}
      <footer className="admin-footer">
        Desenvolvido por DevClub - 2025 - Todos os direitos reservados
      </footer>
    </div>
  )
}
