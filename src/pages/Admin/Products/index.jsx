import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Pencil, Package, Trash2 } from 'lucide-react'
import api from '../../../services/api.js'
import { toast } from 'react-toastify'

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  async function loadProducts() {
    try {
      const { data } = await api.get('/products')
      setProducts(Array.isArray(data) ? data : [])
    } catch {
      toast.error('Erro ao carregar produtos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  return (
    <div className="p-8" style={{ color: 'var(--color-text)' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black">Produtos</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
            {products.length} produto{products.length !== 1 ? 's' : ''} cadastrado{products.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          to="/admin/products/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-white text-sm transition-all hover:-translate-y-0.5"
          style={{ background: 'var(--gradient-primary)', boxShadow: '0 8px 24px rgba(230,57,70,0.35)' }}
        >
          <Plus size={16} /> Novo Produto
        </Link>
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-16 rounded-xl animate-pulse" style={{ background: 'var(--color-bg-card)' }} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <Package size={48} className="mx-auto mb-4" style={{ color: 'var(--color-text-muted)' }} />
          <p style={{ color: 'var(--color-text-muted)' }}>Nenhum produto cadastrado.</p>
          <Link to="/admin/products/new" className="mt-4 inline-block text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>
            Cadastrar primeiro produto →
          </Link>
        </div>
      ) : (
        <div
          className="rounded-2xl border overflow-hidden"
          style={{ background: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}
        >
          {/* Table header */}
          <div
            className="grid grid-cols-12 px-5 py-3 text-xs font-bold uppercase tracking-wider border-b"
            style={{ color: 'var(--color-text-muted)', borderColor: 'var(--color-border)' }}
          >
            <div className="col-span-1">Img</div>
            <div className="col-span-4">Nome</div>
            <div className="col-span-2">Categoria</div>
            <div className="col-span-2">Preço</div>
            <div className="col-span-2">Oferta</div>
            <div className="col-span-1 text-right">Ação</div>
          </div>

          {/* Rows */}
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.03 }}
              className="grid grid-cols-12 px-5 py-3.5 items-center border-b last:border-0 hover:bg-white/5 transition-colors"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <div className="col-span-1">
                {product.url_image ? (
                  <img
                    src={`http://localhost:3000${product.url_image}`}
                    alt={product.name}
                    className="w-10 h-10 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <Package size={16} style={{ color: 'var(--color-text-muted)' }} />
                  </div>
                )}
              </div>
              <div className="col-span-4">
                <p className="font-semibold text-sm truncate">{product.name}</p>
              </div>
              <div className="col-span-2">
                <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--color-text-muted)' }}>
                  {product.category?.name || '—'}
                </span>
              </div>
              <div className="col-span-2">
                <span className="font-bold text-sm" style={{ color: 'var(--color-secondary)' }}>
                  {(product.price / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
              </div>
              <div className="col-span-2">
                <span
                  className="text-xs font-bold px-2 py-1 rounded-full"
                  style={{
                    background: product.offer ? 'rgba(230,57,70,0.15)' : 'rgba(255,255,255,0.06)',
                    color: product.offer ? 'var(--color-primary)' : 'var(--color-text-muted)',
                  }}
                >
                  {product.offer ? '🔥 Sim' : 'Não'}
                </span>
              </div>
              <div className="col-span-1 flex justify-end">
                <Link
                  to={`/admin/products/edit/${product.id}`}
                  className="p-2 rounded-lg transition-all hover:opacity-80"
                  style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--color-text-muted)' }}
                >
                  <Pencil size={14} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
