import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { User, Menu, X, ClipboardList } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../../hooks/CartContext.jsx'
import { useAuth } from '../../hooks/AuthContext.jsx'

export default function Header() {
  const { cartCount } = useCart()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => setMobileOpen(false), [pathname])

  function handleLogout() {
    logout()
    navigate('/login')
  }

  const firstName = user?.name ? user.name.split(' ')[0] : 'Visitante'
  const isMenu = pathname === '/menu'

  return (
    <>
      <header className="header-container fixed top-0 left-0 w-full z-50 shadow-xl">
        <div className="max-w-[1400px] mx-auto w-full flex items-center justify-between">

          {/* Logo */}
          <Link to="/home" className="shrink-0 flex items-center">
            <img src="/assets/login/logo2.svg" alt="DevBurguer" className="h-12 w-auto" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-0 ml-10 flex-1">
            <Link
              to="/home"
              className="text-white hover:text-[#9758a6] transition-colors text-[15px] font-['Poppins'] px-4"
            >
              Home
            </Link>
            <span className="text-white/30 text-lg select-none">|</span>
            <Link
              to="/menu"
              className="text-white hover:text-[#9758a6] transition-colors text-[15px] font-['Poppins'] px-4"
            >
              Cardápio
            </Link>
            <span className="text-white/30 text-lg select-none">|</span>
            <Link
              to="#"
              className="text-white hover:text-[#9758a6] transition-colors text-[15px] font-['Poppins'] px-4"
            >
              Contatos
            </Link>
            {user?.isAdmin && (
              <>
                <span className="text-white/30 text-lg select-none">|</span>
                <Link
                  to="/admin/orders"
                  className="admin-link px-4 text-[15px] font-['Poppins']"
                >
                  Gerenciar
                </Link>
              </>
            )}
          </nav>

          {/* Right Area */}
          <div className="hidden md:flex items-center gap-5">
            {/* User Info */}
            <div className="flex items-center gap-2">
              <User size={26} className="text-white" />
              <div className="flex flex-col items-start leading-tight">
                <span className="text-white text-[13px] font-['Poppins']">
                  Olá,{' '}
                  <span className="font-bold" style={{ color: '#e89d15' }}>
                    {firstName}
                  </span>
                </span>
                <button
                  onClick={handleLogout}
                  className="text-[#e63946] text-[12px] font-['Poppins'] hover:underline"
                >
                  Sair
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="h-9 w-[1px] bg-white/15" />

            {/* Cart / Pedidos */}
            <Link to="/cart" className="flex items-center gap-2 relative group">
              <div className="relative">
                <ClipboardList size={26} className="text-white group-hover:text-[#9758a6] transition-colors" />
                {cartCount > 0 && (
                  <span
                    className="absolute -top-1.5 -right-2 text-black text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: '#e89d15' }}
                  >
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-white text-[14px] font-['Poppins'] group-hover:text-[#9758a6] transition-colors">
                Pedidos
              </span>
            </Link>
          </div>

          {/* Mobile burger button */}
          <button
            className="md:hidden flex items-center justify-center w-10 h-10 text-white"
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-[70px] left-0 w-full shadow-2xl z-40 flex flex-col p-4 md:hidden"
            style={{ backgroundColor: '#1c1c1c' }}
          >
            <div className="flex flex-col gap-4">
              <Link to="/home" className="text-white text-lg font-['Poppins']">Home</Link>
              <Link to="/menu" className="text-white text-lg font-['Poppins']">Cardápio</Link>
              <Link to="#" className="text-white text-lg font-['Poppins']">Contatos</Link>
              {user?.isAdmin && (
                <Link to="/admin/orders" className="admin-link text-lg font-['Poppins']">Gerenciar</Link>
              )}
              <div className="h-[1px] w-full bg-white/10 my-2" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User size={20} style={{ color: '#9758a6' }} />
                  <span className="text-white font-bold">{firstName}</span>
                </div>
                <button onClick={handleLogout} className="text-[#e63946] font-bold">Sair</button>
              </div>
              <Link
                to="/cart"
                className="flex items-center gap-2 mt-4 p-3 rounded-[10px] justify-center"
                style={{ backgroundColor: '#9758a6' }}
              >
                <span className="text-white font-bold">Ver Pedidos ({cartCount})</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
