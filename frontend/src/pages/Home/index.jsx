import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Autoplay } from 'swiper/modules'
import api from '../../services/api.js'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'

function ProductCard({ product }) {
  const price = (product.price / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  
  return (
    <div className="offer-card group">
      <img 
        src={product.url_image || '/assets/home/placeholder.png'} 
        alt={product.name} 
        className="offer-image group-hover:scale-110 transition-transform duration-500"
      />
      <div className="flex flex-col gap-1">
        <h3 className="font-bold text-[16px] text-gray-800 font-['Poppins'] line-clamp-1">{product.name}</h3>
        {product.description && (
          <p className="text-gray-400 text-[12px] font-['Poppins'] line-clamp-2 leading-snug">
            {product.description}
          </p>
        )}
        <p className="text-[#5bb333] font-black text-[18px] font-['Poppins']">{price}</p>
      </div>
      <Link 
        to={`/menu?category=${product.category_id}`}
        className="buy-button mt-4 hover:brightness-110 active:scale-95 transition-all"
      >
        ADICIONAR
      </Link>
    </div>
  )
}

export default function Home() {
  const [categories, setCategories] = useState([])
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [catRes, prodRes] = await Promise.all([
          api.get('/categories'),
          api.get('/products')
        ])
        setCategories(catRes.data)
        setOffers(prodRes.data.filter(p => p.offer))
      } catch (err) {
        console.error('Home load error:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="main-wrapper">
      {/* ── Hero Section ── */}
      <div className="hero-banner">
        <img 
          src="/assets/home/pexels-kiro-wang-7133605 1.svg" 
          alt="Burger" 
          className="hero-img" 
        />
        <div className="hero-overlay">
          <h1 className="welcome-text">Bem-vindo!</h1>
        </div>
      </div>

      <main className="main-content">
        {/* SEÇÃO CATEGORIAS */}
        <section className="section-container" style={{ marginTop: '40px' }}>
          <h2 className="section-title">CATEGORIAS</h2>
          
          {loading ? (
            <div className="grid grid-cols-4 gap-[30px]">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-[250px] bg-white/50 animate-pulse rounded-[20px]" />
              ))}
            </div>
          ) : (
            <Swiper
              modules={[Navigation]}
              spaceBetween={30}
              slidesPerView={4}
              navigation
              breakpoints={{
                320: { slidesPerView: 1 },
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
                1280: { slidesPerView: 4 }
              }}
              className="mySwiper"
            >
              {categories.map((cat) => (
                <SwiperSlide key={cat.id}>
                  <Link to={`/menu?category=${cat.id}`} className="category-card block group">
                    <img 
                      src={cat.url_image || '/assets/home/placeholder.png'} 
                      alt={cat.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="category-overlay">
                      <h3 className="font-['Poppins'] font-bold text-[22px] leading-tight">{cat.name}</h3>
                      <p className="text-[14px] opacity-80">Confira nossas opções</p>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </section>

        {/* SEÇÃO OFERTAS DO DIA */}
        <section className="section-container" style={{ marginTop: '80px' }}>
          <h2 className="offers-title">OFERTAS DO DIA</h2>
          
          {loading ? (
            <div className="grid grid-cols-4 gap-[30px] pt-10">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-[300px] bg-white/50 animate-pulse rounded-[25px]" />
              ))}
            </div>
          ) : (
            <div className="carousel-wrapper">
              <Swiper
                modules={[Navigation, Autoplay]}
                spaceBetween={30}
                slidesPerView={4}
                navigation
                autoplay={{
                  delay: 3500,
                  disableOnInteraction: false,
                }}
                breakpoints={{
                  320: { slidesPerView: 1 },
                  640: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 },
                  1280: { slidesPerView: 4 }
                }}
                className="my-offers-swiper"
              >
                {offers.map((product) => (
                  <SwiperSlide key={product.id}>
                    <ProductCard product={product} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
