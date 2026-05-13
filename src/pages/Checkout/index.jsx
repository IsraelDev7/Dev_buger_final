import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../../hooks/CartContext.jsx'
import { useAuth } from '../../hooks/AuthContext.jsx'
import api from '../../services/api.js'
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

const PAYMENT_OPTIONS = [
  { id: 'dinheiro', label: 'Dinheiro' },
  { id: 'credito', label: 'Cartão Crédito' },
  { id: 'debito', label: 'Cartão Débito' },
  { id: 'pix', label: 'PIX' },
]

export default function Checkout() {
  const { items, total, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [payment, setPayment] = useState('dinheiro')
  const [loading, setLoading] = useState(false)

  const DELIVERY_FEE = 500
  const grandTotal = total + DELIVERY_FEE

  if (items.length === 0) {
    return (
      <div
        className="min-h-screen flex flex-col"
        style={{ backgroundColor: '#efefef', backgroundImage: `url('/assets/login/Padrão 2.png')`, backgroundSize: '280px', backgroundRepeat: 'repeat', backgroundBlendMode: 'color-burn' }}
      >
        <PageBanner />
        <div className="flex-1 flex flex-col items-center justify-center gap-6 px-4 py-20">
          <h2 className="text-2xl font-black font-['Poppins'] text-gray-800">Carrinho vazio</h2>
          <Link to="/menu" className="px-8 py-3 rounded-[8px] font-bold text-white" style={{ backgroundColor: '#9758a6' }}>
            Ver Cardápio
          </Link>
        </div>
      </div>
    )
  }

  async function handleOrder() {
    setLoading(true)
    try {
      await api.post('/orders', {
        products: items.map((i) => ({ id: i.id, quantity: i.qty })),
        paymentMethod: payment,
      })
      clearCart()
      navigate('/checkout/success')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erro ao realizar pedido. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const address = user?.address || 'Rua: Lorem Ipsum, 65\nBairro: Centro\nCep: 77777000\nCidade: São Paulo - SP'

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
            Checkout - Finalizar pedido
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-[3px] w-12" style={{ backgroundColor: '#9758a6' }} />
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Esquerda ── */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Endereço */}
            <div className="bg-white rounded-[20px] overflow-hidden shadow-sm">
              <div className="px-6 py-4" style={{ backgroundColor: '#2a2a2a' }}>
                <span className="text-white font-['Poppins'] font-semibold text-[15px]">Endereço entrega</span>
              </div>
              <div className="px-6 py-6">
                <p className="font-['Poppins'] font-bold text-[14px] text-gray-800 whitespace-pre-line leading-relaxed">
                  {address}
                </p>
                <button className="mt-4 font-['Poppins'] font-semibold text-[13px] underline" style={{ color: '#9758a6' }}>
                  Trocar endereço de entrega
                </button>
              </div>
            </div>

            {/* Pagamento */}
            <div className="bg-white rounded-[20px] overflow-hidden shadow-sm">
              <div className="px-6 py-4" style={{ backgroundColor: '#2a2a2a' }}>
                <span className="text-white font-['Poppins'] font-semibold text-[15px]">Forma de pagamento</span>
              </div>
              <div className="px-6 py-6 space-y-4">
                {PAYMENT_OPTIONS.map((opt) => (
                  <label key={opt.id} className="flex items-center gap-3 cursor-pointer">
                    <div
                      className="w-5 h-5 rounded-sm border-2 flex items-center justify-center shrink-0 transition-all"
                      style={{ borderColor: payment === opt.id ? '#9758a6' : '#ccc', backgroundColor: payment === opt.id ? '#9758a6' : 'white' }}
                      onClick={() => setPayment(opt.id)}
                    >
                      {payment === opt.id && (
                        <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
                          <path d="M1 4L4.5 7.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <span
                      className="font-['Poppins'] font-semibold text-[14px]"
                      style={{ color: payment === opt.id ? '#9758a6' : '#555' }}
                      onClick={() => setPayment(opt.id)}
                    >
                      {opt.label}
                    </span>
                  </label>
                ))}

                {payment === 'pix' && (
                  <div className="mt-4 flex justify-center">
                    <img
                      src="/assets/checkout/vaadin_qrcode.png"
                      alt="QR Code PIX"
                      className="w-40 h-40 object-contain"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Resumo (direita) ── */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-[20px] overflow-hidden shadow-sm">
              <div className="px-6 py-4" style={{ backgroundColor: '#2a2a2a' }}>
                <span className="text-white font-['Poppins'] font-semibold text-[15px]">Resumo do pedido</span>
              </div>

              <div className="px-6 py-6 space-y-4 font-['Poppins']">
                <div className="flex justify-between text-[14px] text-gray-500">
                  <span>Itens</span>
                  <span>R$ {(total / 100).toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="flex justify-between text-[14px] text-gray-500">
                  <span>Taxa de entrega</span>
                  <span>R$ {(DELIVERY_FEE / 100).toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between font-black text-[16px] text-gray-800">
                    <span>Total</span>
                    <span>R$ {(grandTotal / 100).toFixed(2).replace('.', ',')}</span>
                  </div>
                </div>
              </div>

              <div className="px-6 pb-2 text-center">
                <Link to="/cart" className="font-['Poppins'] font-semibold text-[13px] underline" style={{ color: '#9758a6' }}>
                  &lt; Rever meu pedido
                </Link>
              </div>

              <div className="px-6 pb-6 mt-4">
                <button
                  onClick={handleOrder}
                  disabled={loading}
                  className="w-full py-3.5 rounded-[8px] font-['Poppins'] font-bold text-white text-[15px] hover:brightness-110 transition-all disabled:opacity-60"
                  style={{ backgroundColor: '#9758a6' }}
                >
                  {loading ? 'Processando...' : 'Finalizar pedido'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
