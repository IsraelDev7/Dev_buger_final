import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { User, LogOut, Menu, X, ClipboardList } from 'lucide-react'
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

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 bg-[#1c1c1c]/90 backdrop-blur-md shadow-2xl border-b border-[#2a2a2a]/50">
        <div className="max-w-[1200px] mx-auto px-6 h-[80px] flex items-center justify-between">
          
          {/* Logo - Ajuste de margens solicitado */}
          <Link to="/home" className="shrink-0 flex items-center pt-2 pl-2">
            <img src="/assets/login/logo2.svg" alt="DevBurguer" className="h-14 w-auto" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 ml-12 flex-1">
            <Link 
              to="/home" 
              className="text-white hover:text-[#9758a6] transition-colors text-[15px] font-['Poppins']"
            >
              Home
            </Link>
            <div className="h-4 w-[1px] bg-white/20"></div>
            <Link 
              to="#" 
              className="text-white hover:text-[#9758a6] transition-colors text-[15px] font-['Poppins']"
            >
              Contatos
            </Link>
            <div className="h-4 w-[1px] bg-white/20"></div>
            <Link 
              to="#" 
              className="text-white hover:text-[#9758a6] transition-colors text-[15px] font-['Poppins']"
            >
              Contatos
            </Link>
          </nav>

          {/* Right Area */}
          <div className="hidden md:flex items-center gap-6">
            
            {/* User Info */}
            <div className="flex items-center gap-3">
              <User size={28} className="text-white" />
              <div className="flex flex-col items-start leading-tight">
                <span className="text-white text-[14px] font-['Poppins']">
                  Olá, <span className="text-[#9758a6] font-bold">{firstName}</span>
                </span>
                <button 
                  onClick={handleLogout} 
                  className="text-[#e63946] text-[12px] font-['Poppins'] hover:underline"
                >
                  Sair
                </button>
              </div>
            </div>

            <div className="h-10 w-[1px] bg-white/10 mx-2"></div>

            {/* Cart / Pedidos (Prancheta) */}
            <Link to="/cart" className="flex items-center gap-2 relative group">
              <div className="relative">
                <ClipboardList size={28} className="text-white group-hover:text-[#9758a6] transition-colors" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-[#facc15] text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-white text-[15px] font-['Poppins'] group-hover:text-[#9758a6] transition-colors">
                Pedidos
              </span>
            </Link>

          </div>

          {/* Mobile burger */}
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
            className="fixed top-[80px] left-0 w-full bg-[#1c1c1c] shadow-2xl z-40 flex flex-col p-4 md:hidden"
          >
            <div className="flex flex-col gap-4">
              <Link to="/home" className="text-white text-lg font-['Poppins']">Home</Link>
              <Link to="#" className="text-white text-lg font-['Poppins']">Contatos</Link>
              <div className="h-[1px] w-full bg-white/10 my-2"></div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User size={20} className="text-[#9758a6]" />
                  <span className="text-white font-bold">{firstName}</span>
                </div>
                <button onClick={handleLogout} className="text-[#e63946] font-bold">Sair</button>
              </div>

              <Link to="/cart" className="flex items-center gap-2 mt-4 bg-[#9758a6] p-3 rounded-[10px] justify-center">
                <span className="text-white font-bold">Ver Pedidos ({cartCount})</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
