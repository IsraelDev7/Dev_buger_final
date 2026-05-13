import { useEffect, useState } from 'react'
import api from '../../../services/api.js'
import { toast } from 'react-toastify'

const STATUS_OPTIONS = [
  { value: 'Em preparação', label: 'Em preparação' },
  { value: 'Pronto', label: 'Pronto' },
  { value: 'A Caminho', label: 'A Caminho' },
  { value: 'Entregue', label: 'Entregue' },
]

const TABS = [
  { id: 'all', label: 'Todos' },
  { id: 'Em preparação', label: 'Em preparo' },
  { id: 'Entregue', label: 'Entregues' },
]

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')
  const [selected, setSelected] = useState([])

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

  function toggleSelect(id) {
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])
  }

  function toggleAll(filteredOrders) {
    if (selected.length === filteredOrders.length) setSelected([])
    else setSelected(filteredOrders.map((o) => o.id))
  }

  const filtered = activeTab === 'all' ? orders : orders.filter((o) => o.status === activeTab)

  return (
    <div className="p-8">
      {/* Breadcrumb */}
      <p className="font-['Poppins'] text-[13px] text-gray-500 mb-6">
        Gerenciar &gt; <span className="font-semibold text-gray-700">Pedidos</span>
      </p>

      {/* Tabs */}
      <div className="flex gap-3 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="px-6 py-2 font-['Poppins'] font-semibold text-[14px] rounded-[6px] transition-all"
            style={
              activeTab === tab.id
                ? { color: '#e89d15', border: '2px solid #e89d15', backgroundColor: 'white' }
                : { color: '#888', border: '2px solid transparent', backgroundColor: 'white' }
            }
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-[16px] overflow-hidden shadow-sm">
        {/* Table header */}
        <div
          className="grid items-center px-6 py-4"
          style={{ backgroundColor: '#2a2a2a', gridTemplateColumns: '40px 1fr 1fr 160px' }}
        >
          <input
            type="checkbox"
            checked={filtered.length > 0 && selected.length === filtered.length}
            onChange={() => toggleAll(filtered)}
            className="w-4 h-4 cursor-pointer accent-[#9758a6]"
          />
          <span className="text-white font-['Poppins'] font-semibold text-[13px] flex items-center gap-1">
            PEDIDO
            <svg width="10" height="12" viewBox="0 0 10 12" fill="none" className="opacity-60">
              <path d="M5 1v10M1 4l4-4 4 4M1 8l4 4 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </span>
          <span className="text-white font-['Poppins'] font-semibold text-[13px] flex items-center gap-1">
            NOME DO CLIENTE
            <svg width="10" height="12" viewBox="0 0 10 12" fill="none" className="opacity-60">
              <path d="M5 1v10M1 4l4-4 4 4M1 8l4 4 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </span>
          <span className="text-white font-['Poppins'] font-semibold text-[13px]">STATUS</span>
        </div>

        {/* Rows */}
        {loading ? (
          <div className="p-8 text-center text-gray-400 font-['Poppins']">Carregando...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-gray-400 font-['Poppins']">Nenhum pedido encontrado.</div>
        ) : (
          filtered.map((order) => (
            <div
              key={order.id}
              className="grid items-center px-6 py-4 border-b border-gray-100 last:border-0"
              style={{ gridTemplateColumns: '40px 1fr 1fr 160px' }}
            >
              <input
                type="checkbox"
                checked={selected.includes(order.id)}
                onChange={() => toggleSelect(order.id)}
                className="w-4 h-4 cursor-pointer accent-[#9758a6]"
              />
              <span className="font-['Poppins'] text-[13px] text-gray-700 font-mono">
                #{String(order.id).slice(0, 8)}
              </span>
              <span className="font-['Poppins'] text-[13px] text-gray-700">
                {order.user?.name || 'Cliente'}
              </span>
              <select
                value={order.status || 'Em preparação'}
                onChange={(e) => updateStatus(order.id, e.target.value)}
                className="px-3 py-1.5 rounded-[6px] font-['Poppins'] text-[13px] font-semibold outline-none cursor-pointer border"
                style={{ borderColor: '#ddd', color: '#555' }}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
