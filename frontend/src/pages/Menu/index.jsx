import { useEffect, useState, useCallback } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Heart, Star } from 'lucide-react'
import api from '../../services/api.js'
import { useCart } from '../../hooks/CartContext.jsx'
import { toast } from 'react-toastify'

function StarRating({ rating, onRate }) {
  const [hover, setHover] = useState(0);

  return (
    <div className="rating-stars">
      {Array.from({ length: 5 }).map((_, i) => {
        const starValue = i + 1;
        const isActive = starValue <= (hover || rating);
        
        return (
          <button
            key={i}
            type="button"
            onClick={() => onRate(starValue)}
            onMouseEnter={() => setHover(starValue)}
            onMouseLeave={() => setHover(0)}
            className="focus:outline-none transition-transform hover:scale-125 cursor-pointer"
          >
            <Star
              size={15}
              className={`${
                isActive ? 'fill-[#f7941d] text-[#f7941d]' : 'fill-[#D3D3D3] text-[#D3D3D3]'
              } transition-colors duration-200`}
            />
          </button>
        );
      })}
    </div>
  )
}

function MenuProductCard({ product }) {
  const { addItem } = useCart()
  const [liked, setLiked] = useState(false)
  const [currentRating, setCurrentRating] = useState(product.rating || 5)

  async function handleRate(newRating) {
    try {
      await api.patch(`/products/${product.id}/rating`, { rating: newRating });
      setCurrentRating(newRating);
      toast.info(`Você avaliou "${product.name}" com ${newRating} estrelas! ⭐`);
    } catch (err) {
      toast.error('Erro ao registrar avaliação.');
    }
  }

  function handleAdd() {
    addItem(product)
    toast.success(`${product.name} adicionado! 🍔`)
  }

  const price = (product.price / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  return (
    <div className="product-card">
      {/* Ícone de Favorito (Coração) */}
      <button
        onClick={() => setLiked((v) => !v)}
        className="favorite-btn"
      >
        <Heart
          size={20}
          strokeWidth={1.8}
          className={liked ? 'fill-[#9758A6] text-[#9758A6]' : 'text-[#9758A6]'}
        />
      </button>

      {/* Imagem Flutuante */}
      <div className="image-container">
        {product.url_image ? (
          <img
            src={product.url_image}
            alt={product.name}
            className="product-image"
          />
        ) : (
          <div className="w-[120px] h-[120px] bg-gray-100 rounded-full flex items-center justify-center text-4xl product-image" style={{ filter: 'none' }}>
            🍔
          </div>
        )}
      </div>

      {/* Info do Produto */}
      <div className="product-info">
        <h3 className="product-title">{product.name}</h3>
        
        <p className="product-description">
          {product.description || 'Uma experiência gastronômica única, preparada com ingredientes de alta qualidade.'}
        </p>
        
        <div className="product-footer">
          <span className="product-price">{price}</span>
          
          {/* Estrelas de Avaliação Interativas */}
          <StarRating rating={currentRating} onRate={handleRate} />

          {/* Botão Adicionar ao Carrinho */}
          <button className="add-to-cart-btn" onClick={handleAdd}>
            <ShoppingCart size={18} color="#FFF" />
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
    <div className="main-wrapper">
      {/* ── Hero Banner ── */}
      <div className="hero-banner">
        <img 
          src="/assets/menu/pexels-valeria-boltneva-1639562 1.svg" 
          alt="Menu Banner" 
          className="hero-img" 
        />
        <div className="hero-overlay">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-text-container"
          >
            <h1 className="text-white">
              O MELHOR<br />
              HAMBURGUER<br />
              ESTA AQUI!
            </h1>
            <p className="text-white">
              Esse cardápio está irresistível!
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── Conteúdo ── */}
      <main className="main-content">
        <div className="section-container">

          {/* ── Filtros de Categoria ── */}
          <div className="categories-menu">
            <button
              onClick={() => setCategory('all')}
              className={`category-button ${activeCategory === 'all' ? 'active' : ''}`}
            >
              Todos
            </button>
            {categories
              .sort((a, b) => {
                const order = ['Bebidas', 'Entradas', 'Hambúrgueres', 'Sobremesas'];
                return order.indexOf(a.name) - order.indexOf(b.name);
              })
              .map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`category-button ${activeCategory === String(cat.id) ? 'active' : ''}`}
                >
                  {cat.name}
                </button>
              ))}
          </div>

          {/* ── Section Title ── */}
          <div className="text-center mb-16">
            <h2 className="section-title offers-title" style={{ fontSize: '28px' }}>
              {sectionTitle}
            </h2>
          </div>

          {/* ── Grid de Produtos — 3 colunas ── */}
          {loading ? (
            <div className="products-grid">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-[320px] bg-white rounded-[20px] animate-pulse mt-10" />
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
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory} // Isso faz o React saber que mudou a sessão e deve animar
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="products-grid"
              >
                {filtered.map((product) => (
                  <MenuProductCard key={product.id} product={product} />
                ))}
              </motion.div>
            </AnimatePresence>
          )}

          {/* ── Botão Voltar (bottom center) ── */}
          <div className="flex justify-center mt-20 pb-10">
            <button
              onClick={() => navigate('/home')}
              className="font-['Poppins'] font-bold text-[16px] hover:opacity-70 transition-opacity flex items-center gap-2"
              style={{ color: '#1c1c1c' }}
            >
              &larr; Voltar para Home
            </button>
          </div>

        </div>
      </main>
    </div>
  )
}
