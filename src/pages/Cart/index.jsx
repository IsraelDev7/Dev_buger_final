import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCart } from '../../hooks/CartContext.jsx'
import { useAuth } from '../../hooks/AuthContext.jsx'
import { toast } from 'react-toastify'

export default function Cart() {
  const { items, removeItem, updateQty, clearCart, total, cartCount } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  function handleProceed() {
    if (!user) {
      toast.info('Faça login para continuar.', { icon: '🔒' })
      navigate('/login')
      return
    }
    if (items.length === 0) return
    navigate('/checkout')
  }

  if (items.length === 0) {
    return (
      <div 
        className="min-h-screen flex flex-col items-center pt-[150px] gap-6 px-4"
        style={{ 
          backgroundImage: `url('/assets/login/Padrão 2.png')`,
          backgroundSize: '300px',
          backgroundRepeat: 'repeat',
          backgroundBlendMode: 'color-burn',
          backgroundColor: '#efefef'
        }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-7xl bg-white p-8 rounded-full shadow-lg"
        >
          🛒
        </motion.div>
        <div className="text-center mt-4">
          <h2 className="text-3xl font-['Poppins'] font-black mb-2 text-gray-800">Seu carrinho está vazio</h2>
          <p className="mb-8 text-gray-500 font-['Poppins'] font-medium">Adicione itens do cardápio para continuar.</p>
          <Link
            to="/menu"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-[12px] font-bold text-white transition-all hover:scale-105 shadow-md bg-[#9758a6]"
          >
            Ver Cardápio <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    )
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
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
        
        <div className="flex items-center justify-between mb-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-black font-['Poppins'] text-gray-800"
          >
            Seu Carrinho <span className="text-[#9758a6] text-lg">({cartCount} {cartCount === 1 ? 'item' : 'itens'})</span>
          </motion.h1>

          <Link to="/menu" className="text-[#9758a6] font-bold hover:underline hidden sm:flex items-center gap-1">
            Continuar Comprando
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Lista de Itens (Esquerda) ── */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col sm:flex-row gap-4 p-5 rounded-[20px] bg-white shadow-sm border border-gray-100 items-center relative"
                >
                  <div className="w-24 h-24 shrink-0 flex items-center justify-center bg-gray-50 rounded-[15px]">
                    {item.url_image ? (
                      <img
                        src={item.url_image}
                        alt={item.name}
                        className="w-[80%] h-[80%] object-contain drop-shadow-md"
                      />
                    ) : (
                      <span className="text-3xl">🍔</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 text-center sm:text-left">
                    <h3 className="font-bold text-gray-800 text-lg mb-1 font-['Poppins'] leading-tight">{item.name}</h3>
                    <p className="font-black text-[#e89d15] text-[18px] font-['Poppins']">
                      {(item.price / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </p>
                  </div>
                  
                  {/* Controles de Quantidade */}
                  <div className="flex flex-col items-center sm:items-end justify-between gap-4 w-full sm:w-auto">
                    <button 
                      onClick={() => removeItem(item.id)} 
                      className="absolute top-4 right-4 sm:relative sm:top-0 sm:right-0 text-gray-400 hover:text-red-500 transition-colors"
                      title="Remover item"
                    >
                      <Trash2 size={20} />
                    </button>
                    
                    <div className="flex items-center gap-3 bg-[#efefef] p-1.5 rounded-full border border-gray-200 shadow-inner">
                      <button
                        onClick={() => updateQty(item.id, item.qty - 1)}
                        className="w-8 h-8 rounded-full flex items-center justify-center font-bold transition-all bg-white text-gray-600 hover:bg-gray-100 shadow-sm"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-6 text-center font-bold text-gray-800 font-['Poppins']">{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.id, item.qty + 1)}
                        className="w-8 h-8 rounded-full flex items-center justify-center font-bold transition-all bg-[#9758a6] text-white hover:brightness-110 shadow-sm"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <button
              onClick={clearCart}
              className="mt-6 flex items-center gap-2 text-red-500 font-bold hover:underline text-sm px-2"
            >
              <Trash2 size={16} /> Esvaziar carrinho inteiro
            </button>
          </div>

          {/* ── Resumo do Pedido (Direita) ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="lg:col-span-1"
          >
            <div className="bg-white p-6 rounded-[20px] shadow-lg border border-gray-100 sticky top-28">
              <h2 className="font-black text-xl mb-6 text-gray-800 font-['Poppins']">Resumo do Pedido</h2>

              <div className="space-y-4 mb-6 font-['Poppins']">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-800">
                    {(total / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Taxa de Entrega</span>
                  <span className="font-semibold text-[#82c91e]">
                    A calcular
                  </span>
                </div>
                
                <div className="border-t border-gray-100 pt-4 mt-4">
                  <div className="flex justify-between font-black text-xl text-gray-800">
                    <span>Total Previsto</span>
                    <span className="text-[#9758a6]">
                      {(total / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleProceed}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-[12px] font-black text-white text-[16px] transition-all hover:-translate-y-1 bg-[#9758a6] shadow-[0_8px_20px_rgba(151,88,166,0.3)]"
              >
                <ShoppingBag size={20} />
                Continuar para Pagamento
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
