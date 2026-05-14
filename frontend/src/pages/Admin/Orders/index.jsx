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
    <div className="admin-orders-container p-8">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <p className="font-['Poppins'] text-[14px] text-gray-400">
          Gerenciar <span className="mx-1">&gt;</span> <span className="text-gray-600 font-semibold">Pedidos</span>
        </p>
      </nav>

      {/* Tabs */}
      <div className="flex justify-center gap-10 mb-10">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`admin-tab ${activeTab === tab.id ? 'active' : ''}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-[20px] shadow-sm overflow-hidden min-h-[400px]">
        {/* Table Header */}
        <div className="order-table-header">
          <div className="flex items-center gap-4">
             <input
              type="checkbox"
              checked={filtered.length > 0 && selected.length === filtered.length}
              onChange={() => toggleAll(filtered)}
              className="admin-checkbox"
            />
            <span className="header-label">PEDIDO <span className="sort-arrows">⇅</span></span>
          </div>
          <span className="header-label">NOME DO CLIENTE <span className="sort-arrows">⇅</span></span>
          <span className="header-label text-right pr-10">STATUS</span>
        </div>

        {/* Rows */}
        <div className="order-rows-container">
          {loading ? (
            <div className="loading-state">Carregando pedidos...</div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">Nenhum pedido encontrado.</div>
          ) : (
            filtered.map((order) => (
              <div key={order.id} className="order-row">
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={selected.includes(order.id)}
                    onChange={() => toggleSelect(order.id)}
                    className="admin-checkbox"
                  />
                  <span className="order-id">
                    {String(order.id).slice(0, 6)} {String(order.id).slice(6, 9)}
                  </span>
                </div>
                <span className="customer-name">
                  {order.user?.name || 'Cliente'}
                </span>
                <div className="flex justify-end pr-4">
                  <div className="custom-select-wrapper">
                    <select
                      value={order.status || 'Em preparação'}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      className="admin-status-select"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                    <div className="select-arrow">▾</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
