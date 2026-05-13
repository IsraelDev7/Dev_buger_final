import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react'
import api from '../../services/api.js'

function ProductCard({ product }) {
  return (
    <div 
      className="bg-white rounded-[20px] p-4 flex flex-col relative transition-all duration-300 shadow-[0_4px_15px_rgba(0,0,0,0.05)] mx-auto flex-shrink-0"
      style={{ width: '273px', height: '263px' }}
    >
      {/* Imagem do Produto saindo pra fora e rotacionada */}
      <div className="w-full flex items-center justify-center -mt-[60px] relative z-10 mb-2">
        {product.url_image ? (
          <img
            src={product.url_image}
            alt={product.name}
            style={{ width: '148px', height: '98px', transform: 'rotate(5.31deg)' }}
            className="object-contain drop-shadow-xl hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-[120px] h-[120px] bg-gray-200 rounded-full" />
        )}
      </div>

      <div className="flex flex-col flex-1 items-center text-center mt-2 px-2">
        <h3 className="text-[#e89d15] font-black text-[16px] mb-1 font-['Poppins'] line-clamp-2 w-full leading-tight">
          {product.name}
        </h3>
        
        <p className="text-black font-black text-[18px] font-['Poppins'] mb-4 mt-auto">
          {(product.price / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </p>

        <button 
          style={{ backgroundColor: '#9758a6' }}
          className="hover:brightness-110 transition-all w-full py-2.5 rounded-[8px] flex items-center justify-center text-white shrink-0 shadow-md"
        >
          {/* Vetor do carrinho com dimensões do Figma */}
          <ShoppingCart style={{ width: '21px', height: '18px' }} className="text-white" />
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
      } catch { /* silent error */ }
      finally { setLoading(false) }
    }
    load()
  }, [])

  const scrollLeft = (ref) => {
    if (ref.current) ref.current.scrollBy({ left: -300, behavior: 'smooth' })
  }

  const scrollRight = (ref) => {
    if (ref.current) ref.current.scrollBy({ left: 300, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* ── Hero Section ── */}
      <section 
        className="relative w-full flex justify-end items-center bg-[#1c1c1c]"
        style={{ height: '457px' }}
      >
        {/* Banner SVG de Fundo recuado */}
        <div 
          className="absolute inset-0 bg-no-repeat z-0"
          style={{ 
            backgroundImage: `url('/assets/home/pexels-kiro-wang-7133605 1.svg')`, 
            backgroundPosition: 'center center',
            backgroundSize: 'contain'
          }}
        />
        
        {/* Camada superior para aplicar o degrade */}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#efefef] via-transparent to-transparent opacity-100"></div>

        {/* Texto "Bem-vindo!" alinhado à direita */}
        <div className="relative z-20 text-right max-w-[1200px] mx-auto w-full px-6 md:px-16 mt-16 md:mt-0">
          <h1 className="text-white font-['Road_Rage'] text-[60px] md:text-[90px] drop-shadow-lg tracking-wide leading-none">
            Bem-vindo!
          </h1>
        </div>
      </section>

      {/* ── Seção Inferior com Padrão de Fundo ── */}
      <div 
        className="flex-1 w-full bg-[#efefef]"
        style={{ 
          backgroundImage: `url('/assets/login/Padrão 2.png')`,
          backgroundSize: '300px',
          backgroundRepeat: 'repeat',
          backgroundBlendMode: 'color-burn'
        }}
      >
        {/* Wrapper central com largura máxima próxima a 1159px para as Categorias */}
        <div className="max-w-[1159px] mx-auto px-4 py-16">
          
          {/* ── Categorias ── */}
          <section className="mb-24 relative">
            <div className="text-center mb-10">
              <h2 className="text-[#9758a6] font-['Poppins'] font-black text-[28px] tracking-wide uppercase inline-block relative">
                Categorias
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-1 bg-[#9758a6]"></div>
              </h2>
            </div>
            
            <div className="relative flex items-center justify-center">
              {/* Seta Esquerda */}
              <button 
                onClick={() => scrollLeft(catRef)}
                className="absolute -left-4 md:-left-12 z-30 text-[#9758a6] opacity-70 hover:opacity-100 transition-opacity hidden md:flex"
              >
                <ChevronLeft size={60} strokeWidth={3} />
              </button>

              <div className="w-full overflow-hidden px-4 md:px-8">
                {loading ? (
                  <div className="flex gap-6 pt-4 pb-8">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="min-w-[260px] h-[232px] bg-gray-300 rounded-[20px] animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <div 
                    ref={catRef}
                    className="flex overflow-x-auto gap-6 pt-4 pb-8 snap-x snap-mandatory scrollbar-hide justify-start md:justify-center"
                  >
                    {categories.map((cat) => (
                      <Link
                        to={`/menu?category=${cat.id}`}
                        key={cat.id}
                        className="shrink-0 relative rounded-[20px] overflow-hidden group/card cursor-pointer shadow-lg snap-center"
                        style={{ height: '232px', minWidth: '260px' }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent z-10 transition-all group-hover/card:via-black/40" />
                        {cat.url_image ? (
                          <img
                            src={cat.url_image}
                            alt={cat.name}
                            className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-400" />
                        )}
                        <div className="absolute bottom-4 left-4 z-20 flex flex-col">
                          <span className="text-white font-['Poppins'] font-bold text-[22px] leading-tight drop-shadow-md">
                            {cat.name}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Seta Direita */}
              <button 
                onClick={() => scrollRight(catRef)}
                className="absolute -right-4 md:-right-12 z-30 text-[#9758a6] opacity-70 hover:opacity-100 transition-opacity hidden md:flex"
              >
                <ChevronRight size={60} strokeWidth={3} />
              </button>
            </div>
          </section>

          {/* ── Ofertas ── */}
          {(offers.length > 0 || loading) && (
            <section className="mb-10 relative">
              <div className="text-center mb-16">
                <h2 className="text-[#82c91e] font-['Poppins'] font-black text-[28px] tracking-wide uppercase inline-block relative">
                  Ofertas do Dia
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-1 bg-[#82c91e]"></div>
                </h2>
              </div>
              
              <div className="relative flex items-center justify-center">
                {/* Seta Esquerda */}
                <button 
                  onClick={() => scrollLeft(offerRef)}
                  className="absolute -left-4 md:-left-12 z-30 text-[#9758a6]/40 hover:text-[#9758a6] transition-colors hidden md:flex"
                >
                  <ChevronLeft size={60} strokeWidth={3} />
                </button>

                <div className="w-full overflow-hidden px-4 md:px-8">
                  {loading ? (
                    <div className="flex gap-6 pt-[60px] pb-12">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="min-w-[220px] h-[220px] bg-white rounded-[20px] animate-pulse" />
                      ))}
                    </div>
                  ) : (
                    <div 
                      ref={offerRef}
                      className="flex overflow-x-auto gap-6 pt-[60px] pb-12 snap-x snap-mandatory scrollbar-hide justify-start md:justify-center"
                    >
                      {offers.map((p) => (
                        <div key={p.id} className="min-w-[220px] shrink-0 snap-center flex h-auto">
                          <ProductCard product={p} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Seta Direita */}
                <button 
                  onClick={() => scrollRight(offerRef)}
                  className="absolute -right-4 md:-right-12 z-30 text-[#9758a6]/40 hover:text-[#9758a6] transition-colors hidden md:flex"
                >
                  <ChevronRight size={60} strokeWidth={3} />
                </button>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
