import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../../hooks/CartContext.jsx'

function PageBanner() {
  return (
    <div
      className="w-full relative flex items-center justify-center"
      style={{
        height: '190px',
        backgroundImage: `url('/assets/login/bg1.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black/25" />
      <img src="/assets/login/logo2.svg" alt="DevBurguer" className="relative z-10 h-36 drop-shadow-xl" />
    </div>
  )
}

export default function CheckoutSuccess() {
  const { clearCart } = useCart()

  useEffect(() => {
    clearCart()
    window.scrollTo(0, 0)
  }, [clearCart])

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: '#efefef', backgroundImage: `url('/assets/login/Padrão 2.png')`, backgroundSize: '280px', backgroundRepeat: 'repeat', backgroundBlendMode: 'color-burn' }}
    >
      <PageBanner />

      <div className="flex-1 max-w-[1100px] mx-auto w-full px-4 py-10">
        {/* Title */}
        <div className="text-center mb-10">
          <h1 className="font-['Poppins'] font-black text-[26px] uppercase inline-block relative" style={{ color: '#82c91e' }}>
            Checkout - Pedido concluído
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-[3px] w-12" style={{ backgroundColor: '#9758a6' }} />
          </h1>
        </div>

        {/* Card */}
        <div className="bg-white rounded-[20px] shadow-sm max-w-[600px] mx-auto px-8 py-12 flex flex-col items-center text-center gap-6">
          {/* Check icon */}
          <img
            src="/assets/checkout/mdi_message-check.png"
            alt="Pedido confirmado"
            className="w-24 h-24 object-contain"
          />

          <h2 className="font-['Poppins'] font-black text-[28px]" style={{ color: '#9758a6' }}>
            Obrigado!
          </h2>

          <p className="font-['Poppins'] text-[14px] text-gray-500 leading-relaxed max-w-[380px]">
            Seu pedido já está em produção e logo sairá para entrega. Agradecemos a preferência!
          </p>

          <Link
            to="/home"
            className="font-['Poppins'] font-semibold text-[14px] underline mt-2"
            style={{ color: '#9758a6' }}
          >
            &lt; Voltar para o início
          </Link>
        </div>
      </div>
    </div>
  )
}
