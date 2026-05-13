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
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-[220px] flex-shrink-0 flex flex-col" style={{ backgroundColor: '#2a2a2a' }}>
        {/* Logo */}
        <div className="px-6 py-6 flex justify-center border-b border-white/10">
          <img src="/assets/login/logo2.svg" alt="DevBurguer" className="h-16 w-auto" />
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-6 flex flex-col gap-1">
          {/* Pedidos */}
          <NavLink
            to="/admin/orders"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-[10px] font-['Poppins'] font-semibold text-[14px] transition-all ${isActive ? 'text-white' : 'text-white/60 hover:text-white/80'}`
            }
            style={({ isActive }) => ({
              backgroundColor: isActive ? '#9758a6' : 'transparent',
            })}
          >
            <ClipboardList size={18} />
            Pedidos
          </NavLink>

          {/* Produtos (com submenu) */}
          <div>
            <button
              onClick={() => setProductsOpen((v) => !v)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-[10px] font-['Poppins'] font-semibold text-[14px] text-white/60 hover:text-white/80 transition-all"
            >
              <Package size={18} />
              <span className="flex-1 text-left">Produtos</span>
              <ChevronRight size={16} className={`transition-transform ${productsOpen ? 'rotate-90' : ''}`} />
            </button>
            {productsOpen && (
              <div className="ml-10 mt-1">
                <NavLink
                  to="/admin/products"
                  className={({ isActive }) =>
                    `block px-4 py-2 rounded-[8px] font-['Poppins'] text-[13px] transition-all ${isActive ? 'text-white font-bold' : 'text-white/50 hover:text-white/80'}`
                  }
                >
                  Listar produtos
                </NavLink>
              </div>
            )}
          </div>

          {/* Adicionar produto */}
          <NavLink
            to="/admin/products/new"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-[10px] font-['Poppins'] font-semibold text-[14px] transition-all ${isActive ? 'text-white' : 'text-white/60 hover:text-white/80'}`
            }
            style={({ isActive }) => ({
              backgroundColor: isActive ? '#9758a6' : 'transparent',
            })}
          >
            <ShoppingCart size={18} />
            Adicionar produto
          </NavLink>
        </nav>

        {/* Sair */}
        <div className="px-4 pb-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-[10px] font-['Poppins'] font-semibold text-[14px] text-white/60 hover:text-white/80 transition-all"
          >
            <LogOut size={18} />
            Sair
          </button>
        </div>

        {/* Purple footer bar */}
        <div className="h-2 w-full" style={{ backgroundColor: '#9758a6' }} />
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto bg-[#f5f5f5]">
        <Outlet />
      </main>
    </div>
  )
}
