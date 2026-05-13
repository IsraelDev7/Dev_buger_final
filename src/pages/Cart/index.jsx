import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Minus, Plus, ArrowRight } from 'lucide-react'
import { useCart } from '../../hooks/CartContext.jsx'
import { useAuth } from '../../hooks/AuthContext.jsx'
import { toast } from 'react-toastify'

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

export default function Cart() {
  const { items, removeItem, updateQty, total } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const DELIVERY_FEE = 500
  const grandTotal = total + DELIVERY_FEE

  function handleProceed() {
    if (!user) { toast.info('Faça login para continuar.'); navigate('/login'); return }
    if (items.length === 0) return
    navigate('/checkout')
  }

  if (items.length === 0) {
    return (
      <div
        className="min-h-screen flex flex-col"
        style={{ backgroundColor: '#efefef', backgroundImage: `url('/assets/login/Padrão 2.png')`, backgroundSize: '280px', backgroundRepeat: 'repeat', backgroundBlendMode: 'color-burn' }}
      >
        <PageBanner />
        <div className="flex-1 flex flex-col items-center justify-center gap-6 px-4 py-20">
          <div className="text-7xl">🛒</div>
          <h2 className="text-2xl font-black font-['Poppins'] text-gray-800">Seu carrinho está vazio</h2>
          <Link to="/menu" className="flex items-center gap-2 px-8 py-3 rounded-[8px] font-bold text-white" style={{ backgroundColor: '#9758a6' }}>
            Ver Cardápio <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: '#efefef', backgroundImage: `url('/assets/login/Padrão 2.png')`, backgroundSize: '280px', backgroundRepeat: 'repeat', backgroundBlendMode: 'color-burn' }}
    >
      <PageBanner />

      <div className="flex-1 max-w-[1100px] mx-auto w-full px-4 py-10">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="font-['Poppins'] font-black text-[26px] uppercase inline-block relative" style={{ color: '#82c91e' }}>
            Checkout - Pedido
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-[3px] w-12" style={{ backgroundColor: '#9758a6' }} />
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Tabela de Itens (esquerda) ── */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-[20px] overflow-hidden shadow-sm">
              {/* Header da tabela */}
              <div className="grid grid-cols-4 px-6 py-4 rounded-t-[20px]" style={{ backgroundColor: '#2a2a2a' }}>
                <span className="text-white font-['Poppins'] font-semibold text-[14px]">Itens</span>
                <span className="text-white font-['Poppins'] font-semibold text-[14px] text-center">Preço</span>
                <span className="text-white font-['Poppins'] font-semibold text-[14px] text-center">Quantidade</span>
                <span className="text-white font-['Poppins'] font-semibold text-[14px] text-right">Total</span>
              </div>

              {/* Linhas */}
              {items.map((item) => {
                const price = item.price / 100
                const lineTotal = (item.price * item.qty) / 100
                return (
                  <div key={item.id} className="grid grid-cols-4 items-center px-6 py-4 border-b border-gray-100 last:border-0">
                    {/* Item info */}
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 bg-gray-50 rounded-[10px] flex items-center justify-center shrink-0">
                        {item.url_image
                          ? <img src={item.url_image} alt={item.name} className="w-full h-full object-contain rounded-[10px]" />
                          : <span className="text-2xl">🍔</span>
                        }
                      </div>
                      <span className="font-['Poppins'] font-bold text-[13px] text-gray-800 leading-snug">{item.name}</span>
                    </div>

                    {/* Preço unit */}
                    <span className="font-['Poppins'] font-semibold text-[14px] text-gray-700 text-center">
                      R$ {price.toFixed(2).replace('.', ',')}
                    </span>

                    {/* Quantidade */}
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => updateQty(item.id, item.qty - 1)}
                        className="w-7 h-7 rounded-[6px] flex items-center justify-center text-white font-bold text-lg"
                        style={{ backgroundColor: '#9758a6' }}
                      >
                        <Minus size={14} />
                      </button>
                      <span className="font-['Poppins'] font-bold text-[14px] w-5 text-center">{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.id, item.qty + 1)}
                        className="w-7 h-7 rounded-[6px] flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: '#9758a6' }}
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    {/* Total da linha */}
                    <span className="font-['Poppins'] font-bold text-[14px] text-gray-800 text-right">
                      R$ {lineTotal.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                )
              })}
            </div>

            {/* Adicionar mais produtos */}
            <div className="mt-4 text-center">
              <Link to="/menu" className="font-['Poppins'] font-semibold text-[14px] underline" style={{ color: '#9758a6' }}>
                &lt; Adicionar mais produtos
              </Link>
            </div>
          </div>

          {/* ── Resumo do Pedido (direita) ── */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-[20px] overflow-hidden shadow-sm">
              {/* Header */}
              <div className="px-6 py-4 rounded-t-[20px]" style={{ backgroundColor: '#2a2a2a' }}>
                <span className="text-white font-['Poppins'] font-semibold text-[15px]">Resumo do pedido</span>
              </div>

              {/* Valores */}
              <div className="px-6 py-6 space-y-4 font-['Poppins']">
                <div className="flex justify-between text-[14px] text-gray-500">
                  <span>Itens</span>
                  <span>R$ {(total / 100).toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="flex justify-between text-[14px] text-gray-500">
                  <span>Taxa de entrega</span>
                  <span>R$ &nbsp;{(DELIVERY_FEE / 100).toFixed(2).replace('.', ',')}</span>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between font-black text-[16px] text-gray-800">
                    <span>Total</span>
                    <span>R$ {(grandTotal / 100).toFixed(2).replace('.', ',')}</span>
                  </div>
                </div>
              </div>

              {/* Botão */}
              <div className="px-6 pb-6">
                <button
                  onClick={handleProceed}
                  className="w-full py-3.5 rounded-[8px] font-['Poppins'] font-bold text-white text-[15px] hover:brightness-110 transition-all"
                  style={{ backgroundColor: '#9758a6' }}
                >
                  Continuar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
