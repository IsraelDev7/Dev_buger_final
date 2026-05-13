import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle2, ArrowRight } from 'lucide-react'
import { useCart } from '../../hooks/CartContext.jsx'

export default function CheckoutSuccess() {
  const { clearCart } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    // Garantir que o carrinho seja limpo se não tiver sido
    clearCart()
    
    // Rola a tela para o topo
    window.scrollTo(0, 0)
  }, [clearCart])

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center py-20 px-4 relative"
      style={{ 
        backgroundImage: `url('/assets/login/Padrão 2.png')`,
        backgroundSize: '300px',
        backgroundRepeat: 'repeat',
        backgroundBlendMode: 'color-burn',
        backgroundColor: '#efefef'
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, type: 'spring', bounce: 0.4 }}
        className="bg-white p-10 md:p-16 rounded-[30px] shadow-2xl border border-gray-100 max-w-[600px] w-full text-center relative overflow-hidden"
      >
        {/* Confete / Brilho Decorativo Superior */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#9758a6] to-[#82c91e]" />

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
          className="mx-auto w-24 h-24 bg-[#82c91e]/10 rounded-full flex items-center justify-center mb-8"
        >
          <CheckCircle2 size={56} className="text-[#82c91e]" />
        </motion.div>

        <h1 className="text-4xl md:text-5xl font-['Road_Rage'] text-[#9758a6] mb-4">
          MUITO OBRIGADO!
        </h1>
        
        <p className="text-gray-600 font-['Poppins'] text-lg md:text-xl mb-10 leading-relaxed">
          Seu pedido já está em produção e logo sairá para entrega. Agradecemos a preferência!
        </p>

        <button
          onClick={() => navigate('/home')}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-4 rounded-[12px] font-black text-white text-[16px] transition-all hover:scale-105 shadow-[0_8px_20px_rgba(151,88,166,0.3)] bg-[#9758a6]"
        >
          Voltar para o Início <ArrowRight size={20} />
        </button>
        
        <div className="mt-8 flex items-center justify-center">
           <img src="/assets/login/logo2.svg" alt="DevBurger" className="h-10 opacity-50 grayscale" />
        </div>
      </motion.div>
    </div>
  )
}
