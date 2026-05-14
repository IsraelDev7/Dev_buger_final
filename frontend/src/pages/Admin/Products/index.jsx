import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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

  // FUNÇÃO PARA DELETAR
  const deleteProduct = async (id) => {
    if (window.confirm("Deseja realmente excluir este produto?")) {
      try {
        await api.delete(`/products/${id}`)
        // Filtra o estado para remover o item deletado instantaneamente
        setProducts(products.filter(p => p.id !== id))
        toast.success("Produto excluído com sucesso!")
      } catch (err) {
        toast.error("Erro ao deletar produto.")
      }
    }
  }

  const navigate = useNavigate()

  const handleEditProduct = (product) => {
    navigate(`/admin/products/edit/${product.id}`, { state: { product } })
  }

  return (
    <div className="admin-page-container">
      {/* Header Area */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="admin-title !text-left !mb-0">Gestão de Produtos</h1>
          <p className="text-gray-500 font-['Poppins'] text-sm">
            Visualize, edite ou remova produtos do seu cardápio
          </p>
        </div>
        <Link to="/admin/products/new" className="btn-finalize-admin flex items-center gap-2">
          <Plus size={20} /> Novo Produto
        </Link>
      </div>

      {/* Table Card */}
      <div className="admin-card-list">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Preço</th>
              <th>Oferta</th>
              <th>Imagem</th>
              <th className="text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td className="font-bold text-[#333]">{product.name}</td>
                <td className="font-semibold">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price / 100)}
                </td>
                <td>
                  <span 
                    className="px-3 py-1 rounded-full font-bold text-[11px] uppercase tracking-wider"
                    style={{ 
                      backgroundColor: product.offer ? 'rgba(151, 88, 166, 0.1)' : '#f5f5f5',
                      color: product.offer ? '#9758a6' : '#999'
                    }}
                  >
                    {product.offer ? '🔥 Em Oferta' : 'Normal'}
                  </span>
                </td>
                <td>
                  <img
                    src={product.url_image}
                    alt={product.name}
                    className="table-img"
                  />
                </td>
                <td className="text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      className="action-btn btn-edit" 
                      title="Editar"
                      onClick={() => handleEditProduct(product)}
                    >
                      ✏️
                    </button>
                    <button 
                      className="action-btn btn-delete" 
                      title="Excluir"
                      onClick={() => deleteProduct(product.id)}
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {products.length === 0 && !loading && (
          <div className="text-center py-16">
            <Package size={50} className="mx-auto mb-4 text-gray-300" />
            <p className="text-gray-400 font-['Poppins']">Nenhum produto encontrado no sistema.</p>
          </div>
        )}

        {loading && (
          <div className="text-center py-20">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#9758a6] border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
            <p className="mt-4 text-[#9758a6] font-bold font-['Poppins']">Carregando cardápio...</p>
          </div>
        )}
      </div>
    </div>
  )
}
