import React, { useEffect, useState } from 'react'
import api from '../../../services/api.js'
import { toast } from 'react-toastify'
import { ChevronDown, ChevronUp } from 'lucide-react'

const STATUS_OPTIONS = [
  { value: 'Todos', label: 'Todos' },
  { value: 'Pedido realizado', label: 'Pedido realizado' },
  { value: 'Em preparação', label: 'Em preparação' },
  { value: 'Pedido pronto', label: 'Pedido pronto' },
  { value: 'Pedido à caminho', label: 'Pedido à caminho' },
  { value: 'Entregue', label: 'Entregue' }
]

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [activeStatus, setActiveStatus] = useState('Todos')
  const [expandedRows, setExpandedRows] = useState([])
  const [loading, setLoading] = useState(true)

  async function fetchOrders() {
    try {
      const { data } = await api.get('/orders')
      setOrders(data)
    } catch (error) {
      console.error('Erro ao buscar pedidos', error)
      toast.error('Erro ao carregar pedidos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
    const interval = setInterval(() => {
      fetchOrders()
    }, 15000) // Polling a cada 15 segundos

    return () => clearInterval(interval)
  }, [])

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}`, { status: newStatus })
      
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ))
      toast.success('Status atualizado com sucesso!')
    } catch (error) {
      toast.error('Erro ao atualizar o status do pedido.')
    }
  }

  const toggleRow = (orderId) => {
    setExpandedRows(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    )
  }

  const filteredOrders = orders.filter(order => 
    activeStatus === 'Todos' ? true : order.status === activeStatus
  )

  return (
    <div className="admin-orders-container p-8">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <p className="font-['Poppins'] text-[14px] text-gray-400">
          Gerenciar <span className="mx-1">&gt;</span> <span className="text-gray-600 font-semibold">Pedidos</span>
        </p>
      </nav>

      <div className="orders-container">
        {/* MENU DE ABAS (Filtros) */}
        <div className="status-tabs">
          {STATUS_OPTIONS.map(status => (
            <button 
              key={status.value}
              className={`tab-btn ${activeStatus === status.value ? 'active' : ''}`}
              onClick={() => setActiveStatus(status.value)}
            >
              {status.label}
            </button>
          ))}
        </div>

        {/* TABELA DE PEDIDOS */}
        <div className="table-wrapper">
          <table className="orders-table">
            <thead>
              <tr>
                <th width="50"></th>
                <th>Pedido</th>
                <th>Cliente</th>
                <th>Data do pedido</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-10 text-gray-500">Carregando pedidos...</td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-10 text-gray-500">Nenhum pedido encontrado.</td>
                </tr>
              ) : (
                filteredOrders.map(order => (
                  <React.Fragment key={order.id}>
                    {/* LINHA PRINCIPAL */}
                    <tr className={`main-row ${expandedRows.includes(order.id) ? 'expanded' : ''}`}>
                      <td onClick={() => toggleRow(order.id)} className="text-center cursor-pointer text-[#9758a6]">
                        {expandedRows.includes(order.id) ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </td>
                      <td className="font-medium text-gray-700">#{order.id.slice(0, 8)}...</td>
                      <td className="text-gray-600">{order.clientName}</td>
                      <td className="text-gray-500">{new Date(order.createdAt).toLocaleString('pt-BR')}</td>
                      <td>
                        <select 
                          className="status-select"
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        >
                          {STATUS_OPTIONS.filter(s => s.value !== 'Todos').map(opt => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>

                    {/* LINHA DE DETALHES (EXPANSÍVEL) */}
                    {expandedRows.includes(order.id) && (
                      <tr className="details-row">
                        <td colSpan="5">
                          <div className="details-content bg-[#fafafa]">
                            <div className="details-header text-gray-500 font-bold text-[13px] uppercase">
                              <span>Quantidade</span>
                              <span>Produto</span>
                              <span>Categoria</span>
                              <span>Imagem</span>
                            </div>
                            {order.products.map(product => (
                              <div className="detail-item" key={product.id}>
                                <span className="font-bold text-gray-700">{product.quantity}</span>
                                <span className="text-gray-600">{product.name}</span>
                                <span className="text-gray-500 italic">{product.category}</span>
                                <img src={product.url} alt={product.name} className="detail-img" />
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

