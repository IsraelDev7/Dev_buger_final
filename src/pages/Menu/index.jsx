import { useEffect, useState, useCallback } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ShoppingCart, Plus, Check } from 'lucide-react'
import api from '../../services/api.js'
import { useCart } from '../../hooks/CartContext.jsx'
import { toast } from 'react-toastify'

function MenuProductCard({ product }) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  function handleAdd() {
    addItem(product)
    toast.success(`${product.name} adicionado!`, { icon: '🍔' })
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  const price = (product.price / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  return (
    <div className="bg-white rounded-[20px] p-4 flex flex-col relative transition-all duration-300 shadow-[0_4px_15px_rgba(0,0,0,0.05)] w-full max-w-[280px] mx-auto h-full hover:-translate-y-1">
      {/* Imagem do Produto saindo pra fora (Negative Margin) - Similar ao da Home */}
      <div className="w-full flex items-center justify-center relative z-10 mb-4 mt-2">
        {product.url_image ? (
          <img
            src={product.url_image}
            alt={product.name}
            className="w-full h-[140px] object-contain drop-shadow-xl hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-[120px] h-[120px] bg-gray-200 rounded-full flex items-center justify-center text-3xl">🍔</div>
        )}
        {product.offer && (
          <span className="absolute top-0 right-0 bg-[#82c91e] px-3 py-1 rounded-full text-[10px] font-black text-white">
            OFERTA
          </span>
        )}
      </div>

      <div className="flex flex-col flex-1 items-center text-center mt-2 px-2">
        <h3 className="text-[#e89d15] font-black text-[16px] mb-1 font-['Poppins'] line-clamp-2 w-full leading-tight">
          {product.name}
        </h3>
        
        <p className="text-black font-black text-[18px] font-['Poppins'] mb-4 mt-auto">
          {price}
        </p>

        <button 
          onClick={handleAdd}
          style={{ backgroundColor: added ? '#4ade80' : '#9758a6' }}
          className="hover:brightness-110 transition-all w-full py-2.5 rounded-[8px] flex items-center justify-center text-white shrink-0 shadow-md gap-2"
        >
          {added ? <Check size={22} className="text-white" /> : <ShoppingCart size={22} className="text-white" />}
          {added ? <span className="font-bold">Adicionado</span> : null}
        </button>
      </div>
    </div>
  )
}

export default function Menu() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  
  const activeCategory = searchParams.get('category') || 'all'

  useEffect(() => {
    async function load() {
      try {
        const [prodRes, catRes] = await Promise.all([api.get('/products'), api.get('/categories')])
        setProducts(prodRes.data)
        setCategories(catRes.data)
      } catch { /* silent */ }
      finally { setLoading(false) }
    }
    load()
  }, [])

  const setCategory = useCallback((id) => {
    if (id === 'all') {
      setSearchParams({})
    } else {
      setSearchParams({ category: id })
    }
  }, [setSearchParams])

  const filtered = products.filter((p) => {
    return activeCategory === 'all' || String(p.category_id) === String(activeCategory)
  })

  return (
    <div 
      className="min-h-screen bg-[#efefef] flex flex-col pt-[80px]"
      style={{ 
        backgroundImage: `url('/assets/login/Padrão 2.png')`,
        backgroundSize: '300px',
        backgroundRepeat: 'repeat',
        backgroundBlendMode: 'color-burn'
      }}
    >
      {/* ── Banner (Hero do Menu) ── */}
      <div className="w-full h-[400px] relative bg-[#1c1c1c] flex items-center justify-center overflow-hidden">
        {/* Usando o Banner fotográfico gigante extraído do Figma */}
        <div 
          className="absolute inset-0 bg-center bg-cover bg-no-repeat opacity-90"
          style={{ backgroundImage: `url('/assets/menu/pexels-valeria-boltneva-1639562 1.svg')` }}
        />
        <div className="absolute inset-0 bg-black/40 z-10" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-20 text-center px-4"
        >
          <h1 className="text-white font-['Road_Rage'] text-[60px] md:text-[90px] drop-shadow-xl leading-none">
            O HAMBÚRGUER MAIS<br/>
            <span className="text-[#9758a6]">DELICIOSO</span> ESTÁ AQUI!
          </h1>
        </motion.div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 w-full py-12">
        {/* Botão de Voltar pra Home */}
        <div className="mb-8">
          <button 
            onClick={() => navigate('/home')}
            className="text-[#9758a6] font-['Poppins'] font-bold flex items-center gap-2 hover:underline"
          >
            ← Voltar para a Home
          </button>
        </div>

        {/* ── Navegação de Categorias (Filtros) ── */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          <button
            onClick={() => setCategory('all')}
            className={`px-8 py-3 rounded-[20px] font-['Poppins'] font-bold text-[16px] transition-all shadow-sm ${
              activeCategory === 'all' 
                ? 'bg-[#9758a6] text-white scale-105 shadow-md' 
                : 'bg-white text-gray-500 hover:bg-gray-100'
            }`}
          >
            Todos
          </button>
          
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`px-8 py-3 rounded-[20px] font-['Poppins'] font-bold text-[16px] transition-all shadow-sm ${
                activeCategory === String(cat.id)
                  ? 'bg-[#9758a6] text-white scale-105 shadow-md'
                  : 'bg-white text-gray-500 hover:bg-gray-100'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* ── Grid de Produtos ── */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-[280px] bg-white rounded-[20px] animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white/50 rounded-[20px] backdrop-blur-sm">
            <p className="text-6xl mb-4">🍔</p>
            <p className="font-['Poppins'] font-bold text-gray-500 text-xl">Nenhum produto encontrado nesta categoria.</p>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
          >
            <AnimatePresence>
              {filtered.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <MenuProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  )
}
