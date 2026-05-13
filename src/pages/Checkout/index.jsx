import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShoppingBag, MapPin, CreditCard, Banknote, QrCode, ChevronRight, ArrowLeft } from 'lucide-react'
import { useCart } from '../../hooks/CartContext.jsx'
import { useAuth } from '../../hooks/AuthContext.jsx'
import api from '../../services/api.js'
import { toast } from 'react-toastify'

const PAYMENT_METHODS = [
  { id: 'credit', label: 'Cartão de Crédito', icon: CreditCard },
  { id: 'debit', label: 'Cartão de Débito', icon: CreditCard },
  { id: 'pix', label: 'Pix', icon: QrCode },
  { id: 'cash', label: 'Dinheiro', icon: Banknote },
]

export default function Checkout() {
  const { items, total, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [payment, setPayment] = useState('pix')
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)

  const deliveryFee = 500 // Exemplo: R$ 5,00 fixa.

  if (items.length === 0) {
    return (
      <div 
        className="min-h-screen flex flex-col items-center pt-[150px] gap-6 px-4"
        style={{ 
          backgroundImage: `url('/assets/login/Padrão 2.png')`,
          backgroundSize: '300px',
          backgroundRepeat: 'repeat',
          backgroundColor: '#efefef'
        }}
      >
        <ShoppingBag size={80} className="text-gray-300" />
        <p className="text-2xl font-black font-['Poppins'] text-gray-800">
          Seu carrinho está vazio
        </p>
        <button
          onClick={() => navigate('/menu')}
          className="px-8 py-3 rounded-[12px] font-bold text-white transition-all shadow-md bg-[#9758a6] hover:scale-105"
        >
          Voltar ao Cardápio
        </button>
      </div>
    )
  }

  async function handleOrder() {
    if (!address.trim()) {
      toast.error('Informe o endereço de entrega!', { icon: '📍' })
      return
    }
    setLoading(true)
    try {
      await api.post('/orders', {
        products: items.map((i) => ({ id: i.id, quantity: i.qty })),
        deliveryAddress: address,
        paymentMethod: payment,
      })
      clearCart()
      toast.success('Pedido finalizado com sucesso! 🎉')
      navigate('/checkout/success')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erro ao realizar pedido. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div 
      className="min-h-screen pt-[100px] pb-24"
      style={{ 
        backgroundImage: `url('/assets/login/Padrão 2.png')`,
        backgroundSize: '300px',
        backgroundRepeat: 'repeat',
        backgroundBlendMode: 'color-burn',
        backgroundColor: '#efefef'
      }}
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
            <button
              onClick={() => navigate('/cart')}
              className="flex items-center gap-2 font-['Poppins'] font-bold text-[#9758a6] hover:underline"
            >
              <ArrowLeft size={18} /> Voltar para o Carrinho
            </button>
            <h1 className="text-3xl font-black font-['Poppins'] text-gray-800 hidden sm:block mx-auto pr-24">
              Finalizar Pedido
            </h1>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* ── Formulários e Opções (Esquerda) ── */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Endereço */}
              <div className="p-8 rounded-[20px] bg-white shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-[#9758a6]/10 p-2 rounded-full">
                      <MapPin size={24} className="text-[#9758a6]" />
                    </div>
                    <h2 className="text-xl font-bold font-['Poppins'] text-gray-800">Endereço de Entrega</h2>
                  </div>
                  <button className="text-sm font-bold text-[#9758a6] hover:underline">
                    Trocar
                  </button>
                </div>
                
                <textarea
                  rows={2}
                  placeholder="Rua Lorem Ipsum, 65, Bairro Centro, São Paulo - SP"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-5 py-4 rounded-[12px] bg-[#efefef] border-transparent focus:border-[#9758a6] focus:bg-white text-gray-800 outline-none transition-all resize-none font-['Poppins']"
                />
              </div>

              {/* Pagamento */}
              <div className="p-8 rounded-[20px] bg-white shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-[#82c91e]/10 p-2 rounded-full">
                    <CreditCard size={24} className="text-[#82c91e]" />
                  </div>
                  <h2 className="text-xl font-bold font-['Poppins'] text-gray-800">Forma de Pagamento</h2>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {PAYMENT_METHODS.map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => setPayment(id)}
                      className={`flex flex-col items-center justify-center gap-3 py-6 px-2 rounded-[16px] border-2 transition-all font-['Poppins'] font-bold text-[14px]
                        ${payment === id 
                          ? 'border-[#9758a6] bg-[#9758a6]/5 text-[#9758a6] shadow-sm' 
                          : 'border-gray-100 bg-white text-gray-500 hover:border-gray-300 hover:bg-gray-50'
                        }
                      `}
                    >
                      <Icon size={28} />
                      <span className="text-center leading-tight">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* ── Resumo Final (Direita) ── */}
            <div className="lg:col-span-1">
              <div className="p-8 rounded-[20px] bg-white shadow-lg border border-gray-100 sticky top-28">
                <h2 className="text-xl font-black mb-6 font-['Poppins'] text-gray-800">Resumo do pedido</h2>
                
                {/* Lista Enxuta de Itens */}
                <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                      <div className="flex items-center gap-3">
                        {item.url_image ? (
                          <img
                            src={item.url_image}
                            alt={item.name}
                            className="w-12 h-12 object-contain bg-gray-50 rounded-lg"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-lg">🍔</div>
                        )}
                        <div>
                          <p className="font-bold text-gray-800 text-sm font-['Poppins'] leading-tight">{item.name}</p>
                          <p className="text-xs text-gray-400 font-['Poppins'] mt-0.5">
                            {item.qty}x {(item.price / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-[15px] text-gray-800">
                        {((item.price * item.qty) / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Valores */}
                <div className="space-y-3 mb-8 font-['Poppins']">
                  <div className="flex justify-between text-gray-500">
                    <span>Itens</span>
                    <span className="font-semibold text-gray-800">
                      {(total / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Taxa de entrega</span>
                    <span className="font-semibold text-gray-800">
                      {(deliveryFee / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-500 text-lg">Total</span>
                      <span className="font-black text-3xl text-[#9758a6]">
                        {((total + deliveryFee) / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleOrder}
                  disabled={loading}
                  className="w-full py-4 rounded-[12px] font-black text-white text-[16px] flex items-center justify-center gap-2 transition-all hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                  style={{ background: '#9758a6', boxShadow: '0 8px 20px rgba(151,88,166,0.3)' }}
                >
                  {loading ? 'Processando...' : 'Confirmar Pedido'}
                </button>
              </div>
            </div>
          </div>
          
        </motion.div>
      </div>
    </div>
  )
}
