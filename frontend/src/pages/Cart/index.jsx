import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Minus, Plus, ArrowRight } from 'lucide-react'
import { useCart } from '../../hooks/CartContext.jsx'
import { useAuth } from '../../hooks/AuthContext.jsx'
import { toast } from 'react-toastify'

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
      <div className="main-wrapper-checkout">
        <div className="hero-banner" style={{ height: '220px' }}>
          <img 
            src="/assets/login/bg1.png" 
            alt="Cart Banner" 
            className="hero-img" 
          />
        <div className="hero-overlay flex items-center justify-center w-full h-full" style={{ paddingRight: 0, justifyContent: 'center' }}>
          <img src="/assets/login/logo2.svg" alt="DevBurguer" className="h-40 drop-shadow-2xl" />
        </div>
        </div>

        <main className="main-content">
          <div className="section-container flex flex-col items-center justify-center gap-8 py-24">
            <div className="text-8xl animate-bounce">🛒</div>
            <h2 className="text-3xl font-black font-['Poppins'] text-gray-800">Seu carrinho está vazio</h2>
            <p className="text-gray-500 font-['Poppins'] max-w-[300px] text-center">
              Parece que você ainda não escolheu suas delícias. Que tal dar uma olhada no cardápio?
            </p>
            <Link to="/menu" className="flex items-center gap-3 px-10 py-4 rounded-[12px] font-bold text-white shadow-lg hover:scale-105 transition-all" style={{ backgroundColor: '#9758a6' }}>
              Explorar Cardápio <ArrowRight size={20} />
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="main-wrapper-checkout">
      {/* ── Hero Banner ── */}
      <div className="hero-banner" style={{ height: '220px' }}>
        <img 
          src="/assets/login/bg1.png" 
          alt="Cart Banner" 
          className="hero-img" 
        />
        <div className="hero-overlay" style={{ justifyContent: 'center' }}>
          <img src="/assets/login/logo2.svg" alt="DevBurguer" className="h-40 drop-shadow-2xl" />
        </div>
      </div>

      <main className="main-content">
        <div className="section-container">
          {/* Title */}
          <div className="text-center mb-12" style={{ marginTop: '40px' }}>
            <h1 className="section-title offers-title" style={{ fontSize: '28px' }}>
              CHECKOUT - PEDIDO
            </h1>
          </div>

          <div className="checkout-wrapper">
            {/* ── COLUNA DA ESQUERDA (ITENS) ── */}
            <div className="left-column">
              <div className="checkout-card">
                <div className="cart-items-header">
                  <span>Item</span>
                  <span>Preço</span>
                  <span>Quantidade</span>
                  <span>Total</span>
                </div>
                
                <div className="card-body" style={{ padding: '0 0 25px 0' }}>
                  {items.map((item) => {
                    const price = item.price / 100
                    const lineTotal = (item.price * item.qty) / 100
                    return (
                      <div key={item.id} className="cart-item">
                        {/* Imagem e Nome */}
                        <div className="flex items-center gap-4">
                           <img src={item.url_image || "/assets/login/logo2.svg"} alt={item.name} />
                           <span className="cart-item-name">{item.name}</span>
                        </div>

                        {/* Preço */}
                        <span className="font-bold text-gray-700">
                          R$ {price.toFixed(2).replace('.', ',')}
                        </span>

                        {/* Quantidade */}
                        <div className="quantity-control">
                          <button
                            onClick={() => updateQty(item.id, item.qty - 1)}
                            className="btn-quantity"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="font-bold w-6 text-center">{item.qty}</span>
                          <button
                            onClick={() => updateQty(item.id, item.qty + 1)}
                            className="btn-quantity"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        {/* Total */}
                        <span className="font-bold text-gray-900">
                          R$ {lineTotal.toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                    )
                  })}

                  <Link to="/menu" className="link-back">
                    &lt; Adicionar mais produtos
                  </Link>
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

                <button
                  onClick={handleProceed}
                  className="btn-finalize"
                >
                  Continuar
                </button>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  )
}
