import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, ChevronLeft, ChevronRight, Heart } from 'lucide-react'
import api from '../../services/api.js'
import { useCart } from '../../hooks/CartContext.jsx'
import { toast } from 'react-toastify'

function ProductCard({ product }) {
  const { addItem } = useCart()
  const [liked, setLiked] = useState(false)

  function handleAdd() {
    addItem(product)
    toast.success(`${product.name} adicionado! 🍔`)
  }

  return (
    <div
      className="bg-white rounded-[20px] flex flex-col relative shadow-[0_4px_15px_rgba(0,0,0,0.08)] mx-auto flex-shrink-0 overflow-hidden"
      style={{ width: '250px', minHeight: '280px' }}
    >
      {/* Heart icon */}
      <button
        onClick={() => setLiked((v) => !v)}
        className="absolute top-3 right-3 z-10 transition-transform hover:scale-110"
      >
        <Heart
          size={20}
          strokeWidth={1.8}
          className={liked ? 'fill-[#9758a6] text-[#9758a6]' : 'text-[#9758a6]'}
        />
      </button>

      {/* Product image — inside the card at the top */}
      <div className="w-full flex items-center justify-center pt-6 pb-2 px-4">
        {product.url_image ? (
          <img
            src={product.url_image}
            alt={product.name}
            className="w-[130px] h-[100px] object-contain drop-shadow-lg hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-[120px] h-[100px] bg-gray-100 rounded-full flex items-center justify-center text-4xl">
            🍔
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 px-4 pb-4">
        <h3
          className="font-black text-[15px] font-['Poppins'] line-clamp-2 leading-snug mb-1"
          style={{ color: '#e89d15' }}
        >
          {product.name}
        </h3>

        <p className="text-black font-black text-[17px] font-['Poppins'] mb-3 mt-1">
          {(product.price / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </p>

        <button
          onClick={handleAdd}
          className="w-full py-2.5 rounded-[8px] flex items-center justify-center text-white shadow-md hover:brightness-110 transition-all mt-auto"
          style={{ backgroundColor: '#9758a6' }}
        >
          <ShoppingCart size={20} className="text-white" />
        </button>
      </div>
    </div>
  )
}

export default function Home() {
  const [offers, setOffers] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  const catRef = useRef(null)
  const offerRef = useRef(null)

  useEffect(() => {
    async function load() {
      try {
        const [prodRes, catRes] = await Promise.all([api.get('/products'), api.get('/categories')])
        setOffers(prodRes.data.filter((p) => p.offer))
        setCategories(catRes.data)
      } catch { /* silent */ }
      finally { setLoading(false) }
    }
    load()
  }, [])

  const scrollLeft = (ref) => ref.current?.scrollBy({ left: -300, behavior: 'smooth' })
  const scrollRight = (ref) => ref.current?.scrollBy({ left: 300, behavior: 'smooth' })

  return (
    <div className="min-h-screen flex flex-col">

      {/* ── Hero Section ── */}
      <section
        className="relative w-full flex justify-end items-start bg-[#1c1c1c] pt-[70px]"
        style={{ height: '420px' }}
      >
        <div
          className="absolute inset-0 bg-no-repeat bg-center bg-cover z-0"
          style={{ backgroundImage: `url('/assets/home/pexels-kiro-wang-7133605 1.svg')` }}
        />
        {/* Bottom fade to the section below */}
        <div className="absolute bottom-0 left-0 right-0 h-24 z-10 bg-gradient-to-t from-[#efefef] to-transparent" />

        <div className="relative z-20 text-right max-w-[1200px] mx-auto w-full px-6 md:px-16 pt-10">
          <h1 className="text-white font-['Road_Rage'] text-[70px] md:text-[90px] drop-shadow-lg tracking-wide leading-none">
            Bem-vindo!
          </h1>
        </div>
      </section>

      {/* ── Conteúdo Principal ── */}
      <div
        className="flex-1 w-full bg-[#efefef]"
        style={{
          backgroundImage: `url('/assets/login/Padrão 2.png')`,
          backgroundSize: '280px',
          backgroundRepeat: 'repeat',
          backgroundBlendMode: 'color-burn',
        }}
      >
        <div className="max-w-[1159px] mx-auto px-4 py-16">

          {/* ── Categorias ── */}
          <section className="mb-24 relative">
            <div className="text-center mb-10">
              <h2
                className="font-['Poppins'] font-black text-[26px] tracking-widest uppercase inline-block relative"
                style={{ color: '#9758a6' }}
              >
                Categorias
                <div
                  className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-[3px] w-12"
                  style={{ backgroundColor: '#9758a6' }}
                />
              </h2>
            </div>

            <div className="relative flex items-center justify-center">
              <button
                onClick={() => scrollLeft(catRef)}
                className="absolute -left-4 md:-left-10 z-30 opacity-60 hover:opacity-100 transition-opacity hidden md:flex"
                style={{ color: '#9758a6' }}
              >
                <ChevronLeft size={52} strokeWidth={2.5} />
              </button>

              <div className="w-full overflow-hidden px-2 md:px-6">
                {loading ? (
                  <div className="flex gap-6 py-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="min-w-[240px] h-[220px] bg-gray-300 rounded-[20px] animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <div
                    ref={catRef}
                    className="flex overflow-x-auto gap-5 py-4 snap-x snap-mandatory scrollbar-hide"
                    style={{ justifyContent: categories.length <= 4 ? 'center' : 'flex-start' }}
                  >
                    {categories.map((cat) => (
                      <Link
                        to={`/menu?category=${cat.id}`}
                        key={cat.id}
                        className="shrink-0 relative rounded-[20px] overflow-hidden group/card cursor-pointer shadow-lg snap-center"
                        style={{ height: '220px', minWidth: '240px' }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 transition-all group-hover/card:from-black/90" />
                        {cat.url_image ? (
                          <img
                            src={cat.url_image}
                            alt={cat.name}
                            className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-400" />
                        )}
                        <div className="absolute bottom-4 left-4 z-20">
                          <span className="text-white font-['Poppins'] font-bold text-[20px] leading-tight drop-shadow-md">
                            {cat.name}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => scrollRight(catRef)}
                className="absolute -right-4 md:-right-10 z-30 opacity-60 hover:opacity-100 transition-opacity hidden md:flex"
                style={{ color: '#9758a6' }}
              >
                <ChevronRight size={52} strokeWidth={2.5} />
              </button>
            </div>
          </section>

          {/* ── Ofertas do Dia ── */}
          {(offers.length > 0 || loading) && (
            <section className="mb-10 relative">
              <div className="text-center mb-12">
                <h2
                  className="font-['Poppins'] font-black text-[26px] tracking-widest uppercase inline-block relative"
                  style={{ color: '#82c91e' }}
                >
                  Ofertas do Dia
                  <div
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-[3px] w-12"
                    style={{ backgroundColor: '#82c91e' }}
                  />
                </h2>
              </div>

              <div className="relative flex items-center justify-center">
                <button
                  onClick={() => scrollLeft(offerRef)}
                  className="absolute -left-4 md:-left-10 z-30 opacity-40 hover:opacity-80 transition-opacity hidden md:flex"
                  style={{ color: '#9758a6' }}
                >
                  <ChevronLeft size={52} strokeWidth={2.5} />
                </button>

                <div className="w-full overflow-hidden px-2 md:px-6">
                  {loading ? (
                    <div className="flex gap-6 py-4">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="min-w-[220px] h-[240px] bg-white rounded-[20px] animate-pulse" />
                      ))}
                    </div>
                  ) : (
                    <div
                      ref={offerRef}
                      className="flex overflow-x-auto gap-6 py-4 snap-x snap-mandatory scrollbar-hide"
                      style={{ justifyContent: offers.length <= 4 ? 'center' : 'flex-start' }}
                    >
                      {offers.map((p) => (
                        <div key={p.id} className="shrink-0 snap-center">
                          <ProductCard product={p} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => scrollRight(offerRef)}
                  className="absolute -right-4 md:-right-10 z-30 opacity-40 hover:opacity-80 transition-opacity hidden md:flex"
                  style={{ color: '#9758a6' }}
                >
                  <ChevronRight size={52} strokeWidth={2.5} />
                </button>
              </div>
            </section>
          )}

        </div>
      </div>
    </div>
  )
}
