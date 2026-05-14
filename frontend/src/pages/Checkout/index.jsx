import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../../hooks/CartContext.jsx'
import { useAuth } from '../../hooks/AuthContext.jsx'
import api from '../../services/api.js'
import { toast } from 'react-toastify'

const PAYMENT_OPTIONS = [
  { id: 'dinheiro', label: 'Dinheiro' },
  { id: 'cartao', label: 'Cartão Crédito/Débito' },
  { id: 'pix', label: 'PIX' },
]

export default function Checkout() {
  const { items, total, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [payment, setPayment] = useState('pix')
  const [loading, setLoading] = useState(false)
  
  const [isEditingAddress, setIsEditingAddress] = useState(false)
  const [addressData, setAddressData] = useState({
    rua: 'Rua: Lorem Ipsum, 65',
    bairro: 'Bairro: Centro',
    cep: 'Cep: 77777000',
    cidade: 'Cidade: São Paulo - SP'
  })

  const DELIVERY_FEE = 500
  const grandTotal = total + DELIVERY_FEE

  if (items.length === 0) {
    return (
      <div className="main-wrapper-checkout">
        <div className="hero-banner" style={{ height: '220px' }}>
          <img 
            src="/assets/login/bg1.png" 
            alt="Checkout Banner" 
            className="hero-img" 
          />
          <div className="hero-overlay" style={{ justifyContent: 'center' }}>
            <img src="/assets/login/logo2.svg" alt="DevBurguer" className="h-40 drop-shadow-2xl" />
          </div>
        </div>

        <main className="main-content">
          <div className="section-container flex flex-col items-center justify-center gap-6 py-20">
            <h2 className="text-2xl font-black font-['Poppins'] text-gray-800">Carrinho vazio</h2>
            <Link to="/menu" className="px-8 py-3 rounded-[8px] font-bold text-white shadow-md" style={{ backgroundColor: '#9758a6' }}>
              Ver Cardápio
            </Link>
          </div>
        </main>
      </div>
    )
  }

  async function handleOrder() {
    setLoading(true)
    try {
      await api.post('/orders', {
        products: items.map((i) => ({ id: i.id, quantity: i.qty })),
        paymentMethod: payment,
        address: `${addressData.rua}, ${addressData.bairro}, ${addressData.cidade}`
      })
      clearCart()
      navigate('/checkout/success')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erro ao realizar pedido. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="main-wrapper-checkout">
      {/* ── Hero Banner ── */}
      <div className="hero-banner" style={{ height: '220px' }}>
        <img 
          src="/assets/login/bg1.png" 
          alt="Checkout Banner" 
          className="hero-img" 
        />
        <div className="hero-overlay flex items-center justify-center w-full h-full" style={{ paddingRight: 0, justifyContent: 'center' }}>
          <img src="/assets/login/logo2.svg" alt="DevBurguer" className="h-40 drop-shadow-2xl" />
        </div>
      </div>

      <main className="main-content">
        <div className="section-container">
          {/* Title */}
          <div className="text-center mb-12" style={{ marginTop: '40px' }}>
            <h1 className="section-title offers-title" style={{ fontSize: '28px' }}>
              CHECKOUT - FINALIZAR PEDIDO
            </h1>
          </div>

          <div className="checkout-wrapper">
            {/* ── COLUNA DA ESQUERDA (ENDEREÇO E PAGAMENTO) ── */}
            <div className="left-column flex flex-col gap-8">
              {/* Endereço */}
              <div className="checkout-card">
                <div className="card-header">Endereço entrega</div>
                <div className="card-body">
                   <AnimatePresence mode="wait">
                     {!isEditingAddress ? (
                       <motion.div
                         key="address-display"
                         initial={{ opacity: 0 }}
                         animate={{ opacity: 1 }}
                         exit={{ opacity: 0 }}
                       >
                         <p className="font-['Poppins'] font-bold text-[15px] text-gray-800 leading-relaxed">
                            {addressData.rua}
                         </p>
                         <p className="text-gray-600">{addressData.bairro}</p>
                         <p className="text-gray-600">{addressData.cep}</p>
                         <p className="text-gray-600">{addressData.cidade}</p>
                         <button 
                           className="mt-5 font-bold text-[14px] underline" 
                           style={{ color: '#9758a6' }}
                           onClick={() => setIsEditingAddress(true)}
                         >
                           Trocar endereço de entrega
                         </button>
                       </motion.div>
                     ) : (
                       <motion.div
                         key="address-form"
                         initial={{ opacity: 0, y: -20 }}
                         animate={{ opacity: 1, y: 0 }}
                         exit={{ opacity: 0, y: 20 }}
                         className="address-form"
                       >
                         <input 
                           type="text" 
                           placeholder="Rua e número" 
                           className="input-field" 
                           value={addressData.rua}
                           onChange={(e) => setAddressData({...addressData, rua: e.target.value})}
                         />
                         <input 
                           type="text" 
                           placeholder="Bairro" 
                           className="input-field" 
                           value={addressData.bairro}
                           onChange={(e) => setAddressData({...addressData, bairro: e.target.value})}
                         />
                         <div style={{ display: 'flex', gap: '10px' }}>
                             <input 
                               type="text" 
                               placeholder="CEP" 
                               className="input-field" 
                               value={addressData.cep}
                               onChange={(e) => setAddressData({...addressData, cep: e.target.value})}
                             />
                             <input 
                               type="text" 
                               placeholder="Cidade/UF" 
                               className="input-field" 
                               value={addressData.cidade}
                               onChange={(e) => setAddressData({...addressData, cidade: e.target.value})}
                             />
                         </div>
                         <button className="btn-save" onClick={() => setIsEditingAddress(false)}>
                             Salvar Endereço
                         </button>
                       </motion.div>
                     )}
                   </AnimatePresence>
                </div>
              </div>

              {/* Pagamento */}
              <div className="checkout-card">
                <div className="card-header">Forma de pagamento</div>
                <div className="card-body">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {PAYMENT_OPTIONS.map((opt) => (
                      <label 
                        key={opt.id} 
                        className={`flex items-center gap-4 p-4 rounded-[15px] border-2 cursor-pointer transition-all ${payment === opt.id ? 'border-[#9758a6] bg-[#9758a6]/5' : 'border-gray-100 bg-white hover:border-gray-200'}`}
                        onClick={() => setPayment(opt.id)}
                      >
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${payment === opt.id ? 'border-[#9758a6] bg-[#9758a6]' : 'border-gray-300'}`}
                        >
                          {payment === opt.id && (
                            <div className="w-2.5 h-2.5 rounded-full bg-white" />
                          )}
                        </div>
                        <span
                          className={`font-['Poppins'] font-bold text-[15px] ${payment === opt.id ? 'text-[#9758a6]' : 'text-gray-600'}`}
                        >
                          {opt.label}
                        </span>
                      </label>
                    ))}
                  </div>

                  <hr className="my-8 border-gray-100" />

                  <AnimatePresence mode="wait">
                    {payment === 'cartao' && (
                      <motion.div
                        key="cartao-details"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="card-form-animation overflow-hidden"
                      >
                        <h4>Dados do Cartão</h4>
                        <input type="text" className="input-field" placeholder="Número do Cartão" />
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <input type="text" className="input-field" placeholder="MM/AA" />
                          <input type="text" className="input-field" placeholder="CVC" />
                        </div>
                      </motion.div>
                    )}

                    {payment === 'pix' && (
                      <motion.div
                        key="pix-details"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="pix-area overflow-hidden"
                      >
                        <div className="pix-content">
                          <div>
                             <p className="font-bold text-[14px]">Chave Aleatória:</p>
                             <code className="pix-key">00020101021226870014br.gov.bcb.pix...</code>
                             <button className="btn-copy" onClick={() => toast.success('Chave copiada!')}>Copiar Chave</button>
                          </div>
                          <img 
                            src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ChavePixExemplo" 
                            alt="QR Code PIX" 
                            className="w-32 h-32 p-2 bg-white rounded-lg shadow-sm"
                          />
                        </div>
                      </motion.div>
                    )}

                    {payment === 'dinheiro' && (
                      <motion.div
                        key="dinheiro-details"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-6 bg-gray-50 rounded-xl text-center text-gray-600"
                      >
                        O entregador levará a maquininha ou troco para você.
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* ── COLUNA DA DIREITA (RESUMO) ── */}
            <aside className="checkout-card">
              <div className="card-header">Resumo do pedido</div>
              <div className="card-body">
                <div className="summary-row">
                  <span>Itens</span>
                  <span>R$ {(total / 100).toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="summary-row">
                  <span>Taxa de entrega</span>
                  <span>R$ {(DELIVERY_FEE / 100).toFixed(2).replace('.', ',')}</span>
                </div>
                
                <div className="summary-total">
                  <span>Total</span>
                  <span style={{ color: '#9758a6' }}>R$ {(grandTotal / 100).toFixed(2).replace('.', ',')}</span>
                </div>

                <div className="text-center mt-6">
                   <Link to="/cart" className="font-bold text-[14px] hover:underline" style={{ color: '#9758a6' }}>
                     Rever meu pedido
                   </Link>
                </div>

                <button
                  onClick={handleOrder}
                  disabled={loading}
                  className="btn-finalize"
                >
                  {loading ? 'Processando...' : 'Finalizar pedido'}
                </button>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  )
}
