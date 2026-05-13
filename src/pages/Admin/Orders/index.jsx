import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Clock, CheckCircle, ChefHat, RefreshCw } from 'lucide-react'
import api from '../../../services/api.js'
import { toast } from 'react-toastify'

const STATUS_OPTIONS = [
  { value: 'Pedido realizado', label: 'Pedido Realizado', color: '#f4a261' },
  { value: 'Em preparação', label: 'Em Preparação', color: '#e63946' },
  { value: 'Saiu para entrega', label: 'Saiu para Entrega', color: '#a8dadc' },
  { value: 'Entregue', label: 'Entregue', color: '#22c55e' },
]

function statusColor(status) {
  return STATUS_OPTIONS.find((s) => s.value === status)?.color || '#888'
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  async function loadOrders() {
    try {
      const { data } = await api.get('/orders')
      setOrders(Array.isArray(data) ? data : [])
    } catch {
      toast.error('Erro ao carregar pedidos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
    const interval = setInterval(loadOrders, 30000)
    return () => clearInterval(interval)
  }, [])

  async function updateStatus(id, status) {
    try {
      await api.put(`/orders/${id}`, { status })
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)))
      toast.success('Status atualizado!')
    } catch {
      toast.error('Erro ao atualizar status')
    }
  }

  return (
    <div className="p-8" style={{ color: 'var(--color-text)' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black">Gerenciar Pedidos</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
            {orders.length} pedido{orders.length !== 1 ? 's' : ''} encontrado{orders.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={loadOrders}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}
        >
          <RefreshCw size={15} /> Atualizar
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {STATUS_OPTIONS.map((s) => {
          const count = orders.filter((o) => o.status === s.value).length
          return (
            <div
              key={s.value}
              className="p-4 rounded-xl border"
              style={{ background: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}
            >
              <p className="text-2xl font-black">{count}</p>
              <p className="text-xs mt-1" style={{ color: s.color }}>{s.label}</p>
            </div>
          )
        })}
      </div>

      {/* Orders list */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 rounded-2xl animate-pulse" style={{ background: 'var(--color-bg-card)' }} />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20">
          <ChefHat size={48} className="mx-auto mb-4" style={{ color: 'var(--color-text-muted)' }} />
          <p style={{ color: 'var(--color-text-muted)' }}>Nenhum pedido ainda.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, i) => {
            let products = []
            try { products = typeof order.products === 'string' ? JSON.parse(order.products) : order.products } catch {}
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center gap-4"
                style={{ background: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}
              >
                {/* Order info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs font-mono px-2 py-0.5 rounded-md" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--color-text-muted)' }}>
                      #{order.id?.slice(0, 8)}
                    </span>
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{ background: `${statusColor(order.status)}22`, color: statusColor(order.status) }}
                    >
                      {order.status}
                    </span>
                  </div>
                  <p className="font-semibold text-sm truncate">{order.user?.name || 'Cliente'}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                    {Array.isArray(products) ? `${products.length} item(s)` : 'Pedido'} •{' '}
                    {new Date(order.created_at).toLocaleString('pt-BR')}
                  </p>
                </div>

                {/* Status update */}
                <select
                  value={order.status}
                  onChange={(e) => updateStatus(order.id, e.target.value)}
                  className="px-3 py-2 rounded-xl text-sm font-semibold outline-none cursor-pointer"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--color-border)',
                    color: statusColor(order.status),
                  }}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s.value} value={s.value} style={{ background: '#161616', color: s.color }}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
