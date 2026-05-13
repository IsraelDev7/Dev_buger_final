import { useEffect, useState, useCallback } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Heart, Star } from 'lucide-react'
import api from '../../services/api.js'
import { useCart } from '../../hooks/CartContext.jsx'
import { toast } from 'react-toastify'

function StarRating() {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={14} strokeWidth={1.5} className="text-gray-300" />
      ))}
    </div>
  )
}

function MenuProductCard({ product }) {
  const { addItem } = useCart()
  const [liked, setLiked] = useState(false)

  function handleAdd() {
    addItem(product)
    toast.success(`${product.name} adicionado! 🍔`)
  }

  const price = (product.price / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  return (
    <div className="bg-white rounded-[20px] p-4 flex flex-col relative shadow-[0_4px_15px_rgba(0,0,0,0.08)] w-full hover:-translate-y-1 transition-transform duration-300">
      {/* Heart icon */}
      <button
        onClick={() => setLiked((v) => !v)}
        className="absolute top-4 right-4 z-10 transition-transform hover:scale-110"
      >
        <Heart
          size={20}
          strokeWidth={1.8}
          className={liked ? 'fill-[#9758a6] text-[#9758a6]' : 'text-[#9758a6]'}
        />
      </button>

      {/* Product image */}
      <div className="w-full flex items-center justify-center pt-2 pb-3">
        {product.url_image ? (
          <img
            src={product.url_image}
            alt={product.name}
            className="w-full h-[140px] object-contain drop-shadow-lg hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-[120px] h-[120px] bg-gray-100 rounded-full flex items-center justify-center text-4xl">
            🍔
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 gap-1">
        <h3
          className="font-black text-[15px] font-['Poppins'] line-clamp-2 leading-snug"
          style={{ color: product.offer ? '#e89d15' : '#e89d15' }}
        >
          {product.name}
        </h3>

        {product.description && (
          <p className="text-gray-500 text-[12px] font-['Poppins'] line-clamp-3 leading-relaxed">
            {product.description}
          </p>
        )}

        <p className="text-black font-black text-[16px] font-['Poppins'] mt-1">
          {price}
        </p>

        {/* Stars + Cart button */}
        <div className="flex items-center justify-between mt-2">
          <StarRating />
          <button
            onClick={handleAdd}
            className="p-2.5 rounded-[10px] text-white shadow-md hover:brightness-110 transition-all"
            style={{ backgroundColor: '#9758a6' }}
          >
            <ShoppingCart size={18} />
          </button>
        </div>
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
    if (id === 'all') setSearchParams({})
    else setSearchParams({ category: id })
  }, [setSearchParams])

  const filtered = products.filter((p) =>
    activeCategory === 'all' || String(p.category_id) === String(activeCategory)
  )

  const activeCatName = categories.find((c) => String(c.id) === String(activeCategory))?.name || 'Cardápio'
  const sectionTitle = activeCategory === 'all' ? 'CARDÁPIO' : `${activeCatName.toUpperCase()} - CARDÁPIO`

  return (
    <div
      className="min-h-screen bg-[#efefef] flex flex-col pt-[70px]"
      style={{
        backgroundImage: `url('/assets/login/Padrão 2.png')`,
        backgroundSize: '280px',
        backgroundRepeat: 'repeat',
        backgroundBlendMode: 'color-burn',
      }}
    >
      {/* ── Hero Banner ── */}
      <div className="w-full relative bg-[#1c1c1c] flex items-center overflow-hidden" style={{ height: '380px' }}>
        <div
          className="absolute inset-0 bg-center bg-cover bg-no-repeat"
          style={{ backgroundImage: `url('/assets/menu/pexels-valeria-boltneva-1639562 1.svg')` }}
        />
        <div className="absolute inset-0 bg-black/50 z-10" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-20 px-10 md:px-20"
        >
          <h1 className="text-white font-['Road_Rage'] text-[58px] md:text-[75px] leading-tight drop-shadow-xl">
            O MELHOR<br />
            HAMBURGUER<br />
            ESTA AQUI!
          </h1>
          <p className="text-white text-[16px] font-['Poppins'] mt-2 drop-shadow-md">
            Esse cardápio está irresistível!
          </p>
        </motion.div>
      </div>

      {/* ── Conteúdo ── */}
      <div className="max-w-[1100px] mx-auto px-4 w-full py-12">

        {/* ── Filtros de Categoria ── */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          <button
            onClick={() => setCategory('all')}
            className="px-6 py-2.5 rounded-[20px] font-['Poppins'] font-bold text-[14px] transition-all shadow-sm"
            style={activeCategory === 'all'
              ? { backgroundColor: '#9758a6', color: '#fff' }
              : { backgroundColor: '#fff', color: '#666' }
            }
          >
            Todos
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className="px-6 py-2.5 rounded-[20px] font-['Poppins'] font-bold text-[14px] transition-all shadow-sm"
              style={activeCategory === String(cat.id)
                ? { backgroundColor: '#9758a6', color: '#fff' }
                : { backgroundColor: '#fff', color: '#666' }
              }
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* ── Section Title ── */}
        <div className="text-center mb-10">
          <h2
            className="font-['Poppins'] font-black text-[24px] tracking-widest uppercase inline-block relative"
            style={{ color: '#82c91e' }}
          >
            {sectionTitle}
            <div
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-[3px] w-12"
              style={{ backgroundColor: '#9758a6' }}
            />
          </h2>
        </div>

        {/* ── Grid de Produtos — 3 colunas ── */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-[320px] bg-white rounded-[20px] animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white/60 rounded-[20px]">
            <p className="text-5xl mb-4">🍔</p>
            <p className="font-['Poppins'] font-bold text-gray-500 text-lg">
              Nenhum produto encontrado nesta categoria.
            </p>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            <AnimatePresence>
              {filtered.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.2 }}
                >
                  <MenuProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ── Botão Voltar (bottom center) ── */}
        <div className="flex justify-center mt-14">
          <button
            onClick={() => navigate('/home')}
            className="font-['Poppins'] font-bold text-[15px] hover:opacity-70 transition-opacity"
            style={{ color: '#1c1c1c' }}
          >
            &lt; Voltar
          </button>
        </div>

      </div>
    </div>
  )
}
