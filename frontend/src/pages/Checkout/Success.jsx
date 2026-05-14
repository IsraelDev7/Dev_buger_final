import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { CheckCircle2, ArrowRight } from 'lucide-react'

export default function CheckoutSuccess() {
  return (
    <div className="main-wrapper">
      {/* ── Hero Banner ── */}
      <div className="hero-banner" style={{ height: '220px' }}>
        <img 
          src="/assets/login/bg1.png" 
          alt="Success Banner" 
          className="hero-img" 
        />
        <div className="hero-overlay" style={{ justifyContent: 'center' }}>
          <img src="/assets/login/logo2.svg" alt="DevBurguer" className="h-40 drop-shadow-2xl" />
        </div>
      </div>

      <main className="main-content">
        <div className="section-container" style={{ paddingBottom: '100px' }}>
          {/* Title */}
          <div className="text-center mb-16" style={{ marginTop: '40px' }}>
            <h1 className="section-title offers-title" style={{ fontSize: '28px' }}>
              CHECKOUT - PEDIDO CONCLUÍDO
            </h1>
          </div>

          <div className="flex flex-col items-center justify-center">
            {/* Animated Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-[30px] p-12 shadow-[0_10px_40px_rgba(0,0,0,0.06)] border border-gray-100 flex flex-col items-center text-center max-w-[600px] w-full"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.3 }}
                className="w-24 h-24 rounded-full flex items-center justify-center mb-8 shadow-lg shadow-green-100"
                style={{ backgroundColor: '#82c91e' }}
              >
                <CheckCircle2 size={48} className="text-white" />
              </motion.div>

              <h2 className="text-4xl font-black font-['Poppins'] text-gray-800 mb-4">
                Pedido Realizado!
              </h2>
              <p className="font-['Poppins'] text-gray-500 text-lg leading-relaxed mb-10 max-w-[400px]">
                Seu pedido foi recebido com sucesso e já está sendo preparado com muito carinho.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                <Link 
                  to="/home" 
                  className="w-full py-4 rounded-[12px] font-['Poppins'] font-bold text-gray-700 bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
                >
                  Ir para Home
                </Link>
                <Link 
                  to="/menu" 
                  className="w-full py-4 rounded-[12px] font-['Poppins'] font-bold text-white shadow-lg hover:brightness-110 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                  style={{ backgroundColor: '#9758a6' }}
                >
                  Fazer novo pedido <ArrowRight size={20} />
                </Link>
              </div>
            </motion.div>

            {/* Delivery Illustration */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="mt-16 opacity-40 grayscale"
            >
              <p className="text-6xl animate-pulse">🛵</p>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  )
}
