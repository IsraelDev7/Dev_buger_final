import { useEffect, useState } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { ImagePlus, XCircle } from 'lucide-react'
import api from '../../../services/api.js'
import { toast } from 'react-toastify'

const schema = yup.object({
  name: yup.string().required('Nome é obrigatório'),
  price: yup.number().typeError('Informe o preço').positive('Preço deve ser positivo').required('Preço é obrigatório'),
  category_id: yup.string().required('Selecione uma categoria'),
})

export default function ProductForm() {
  const { id } = useParams()
  const location = useLocation()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const [categories, setCategories] = useState([])
  const [preview, setPreview] = useState(null)
  const [file, setFile] = useState(null)
  const [offer, setOffer] = useState(false)
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  })

  useEffect(() => {
    // Carrega categorias
    api.get('/categories').then(({ data }) => setCategories(Array.isArray(data) ? data : []))

    // Se estiver editando, tenta pegar os dados do state ou buscar da API
    if (isEdit) {
      if (location.state?.product) {
        const product = location.state.product
        fillForm(product)
      } else {
        // Fallback: Busca da API se o state estiver vazio (ex: F5 na página)
        api.get('/products').then(({ data }) => {
          const product = (Array.isArray(data) ? data : []).find((p) => String(p.id) === String(id))
          if (product) fillForm(product)
        })
      }
    }
  }, [id, isEdit, location.state, reset])

  function fillForm(product) {
    reset({ 
      name: product.name, 
      price: product.price / 100, 
      category_id: String(product.category_id) 
    })
    setOffer(product.offer || false)
    if (product.url_image) setPreview(product.url_image)
  }

  function handleFileChange(e) {
    const f = e.target.files[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  async function onSubmit(values) {
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('name', values.name)
      formData.append('price', Math.round(values.price * 100))
      formData.append('category_id', values.category_id)
      formData.append('offer', offer)
      
      // Só anexa o arquivo se um novo foi selecionado
      if (file) {
        formData.append('file', file)
      }

      if (isEdit) {
        await api.put(`/products/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
        toast.success('Produto atualizado com sucesso!')
      } else {
        await api.post('/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
        toast.success('Produto criado com sucesso!')
      }
      navigate('/admin/products')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erro ao processar solicitação')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-page-container">
      <div className="flex items-center justify-between mb-8">
        <h1 className="admin-title !text-left !mb-0">{isEdit ? '✏️ Editar Produto' : '✨ Cadastrar Novo Produto'}</h1>
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors font-bold"
        >
          <XCircle size={24} /> Cancelar
        </button>
      </div>

      <div className="admin-form-card">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Nome */}
          <div className="flex flex-col gap-1">
            <label className="font-['Poppins'] text-[14px] font-bold text-[#333]">Nome do Produto</label>
            <input
              type="text"
              placeholder="Digite o nome..."
              {...register('name')}
              className="admin-input"
            />
            {errors.name && <p className="text-xs text-red-400 font-semibold">{errors.name.message}</p>}
          </div>

          {/* Preço */}
          <div className="flex flex-col gap-1">
            <label className="font-['Poppins'] text-[14px] font-bold text-[#333]">Preço (R$)</label>
            <input
              type="number"
              step="0.01"
              placeholder="Ex: 34.90"
              {...register('price')}
              className="admin-input"
            />
            {errors.price && <p className="text-xs text-red-400 font-semibold">{errors.price.message}</p>}
          </div>

          {/* Categoria */}
          <div className="flex flex-col gap-1">
            <label className="font-['Poppins'] text-[14px] font-bold text-[#333]">Categoria</label>
            <select {...register('category_id')} className="admin-input cursor-pointer">
              <option value="">Selecione...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={String(cat.id)}>{cat.name}</option>
              ))}
            </select>
            {errors.category_id && <p className="text-xs text-red-400 font-semibold">{errors.category_id.message}</p>}
          </div>

          {/* Upload Imagem */}
          <div className="flex flex-col gap-1">
            <label className="font-['Poppins'] text-[14px] font-bold text-[#333]">Imagem do Produto</label>
            <label 
              htmlFor="file-upload" 
              className="upload-area"
              style={{ borderColor: file ? '#4caf50' : '#9758a6' }}
            >
              {preview ? (
                <div className="flex flex-col items-center gap-3">
                  <img src={preview} alt="Preview" className="h-32 mx-auto object-contain rounded-lg" />
                  <span className="text-green-500 text-xs font-bold">
                    {file ? `✅ Nova imagem: ${file.name}` : '🖼️ Imagem atual mantida'}
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <ImagePlus size={32} />
                  <span>☁️ Carregar imagem do hambúrguer</span>
                </div>
              )}
            </label>
            <input id="file-upload" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </div>

          {/* Oferta Toggle */}
          <div className="flex items-center justify-between p-5 bg-gray-50 rounded-2xl border border-gray-100">
            <div>
              <span className="font-['Poppins'] font-bold text-[#333] block">Produto em Oferta?</span>
              <span className="text-xs text-gray-500">Ative para destacar este item no cardápio</span>
            </div>
            <button
              type="button"
              onClick={() => setOffer(!offer)}
              className="relative w-14 h-7 rounded-full transition-all duration-300 shadow-inner"
              style={{ backgroundColor: offer ? '#9758a6' : '#e2e2e2' }}
            >
              <div
                className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 shadow-md"
                style={{ transform: offer ? 'translateX(28px)' : 'translateX(0)' }}
              />
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#9758a6] text-white py-4 rounded-xl font-bold font-['Poppins'] text-lg shadow-lg hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {loading ? 'Processando...' : isEdit ? 'Salvar Alterações' : 'Cadastrar Produto'}
          </button>
        </form>
      </div>
    </div>
  )
}
