import { NavLink, Outlet, Navigate } from 'react-router-dom'
import { ShoppingBag, Package, LogOut, ChefHat } from 'lucide-react'
import { useAuth } from '../../hooks/AuthContext.jsx'

export default function AdminLayout() {
  const { user, logout, isAdmin } = useAuth()

  if (!user) return <Navigate to="/login" replace />
  if (!isAdmin) return <Navigate to="/home" replace />

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--color-bg)' }}>
      {/* Sidebar */}
      <aside
        className="w-64 flex-shrink-0 flex flex-col border-r"
        style={{ background: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}
      >
        {/* Logo */}
        <div className="p-6 border-b" style={{ borderColor: 'var(--color-border)' }}>
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'var(--gradient-primary)' }}
            >
              <ChefHat size={20} className="text-white" />
            </div>
            <div>
              <p className="font-black text-base" style={{ color: 'var(--color-text)' }}>Dev<span style={{ color: 'var(--color-primary)' }}>Burguer</span></p>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Painel Admin</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          <NavLink
            to="/admin/orders"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${isActive ? 'text-white' : 'hover:opacity-80'}`
            }
            style={({ isActive }) => ({
              background: isActive ? 'var(--gradient-primary)' : 'transparent',
              color: isActive ? 'white' : 'var(--color-text-muted)',
            })}
          >
            <ShoppingBag size={18} />
            Pedidos
          </NavLink>
          <NavLink
            to="/admin/products"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${isActive ? 'text-white' : 'hover:opacity-80'}`
            }
            style={({ isActive }) => ({
              background: isActive ? 'var(--gradient-primary)' : 'transparent',
              color: isActive ? 'white' : 'var(--color-text-muted)',
            })}
          >
            <Package size={18} />
            Produtos
          </NavLink>
        </nav>

        {/* User info */}
        <div className="p-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm"
              style={{ background: 'var(--gradient-primary)' }}
            >
              {user?.name?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate" style={{ color: 'var(--color-text)' }}>{user?.name}</p>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Administrador</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
            style={{ background: 'rgba(230,57,70,0.1)', color: 'var(--color-primary)' }}
          >
            <LogOut size={15} /> Sair
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
