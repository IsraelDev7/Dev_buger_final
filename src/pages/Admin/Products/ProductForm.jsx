import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { ImagePlus } from 'lucide-react'
import api from '../../../services/api.js'
import { toast } from 'react-toastify'

const schema = yup.object({
  name: yup.string().required('Nome é obrigatório'),
  price: yup.number().typeError('Informe o preço').positive('Preço deve ser positivo').required('Preço é obrigatório'),
  category_id: yup.string().required('Selecione uma categoria'),
})

function Field({ label, error, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="font-['Poppins'] text-[13px] font-semibold text-gray-700">{label}</label>
      <input
        {...props}
        className="w-full px-4 py-3 rounded-[8px] border font-['Poppins'] text-[14px] outline-none transition-all"
        style={{ borderColor: error ? '#ef4444' : '#ddd', color: '#333' }}
      />
      {error && <p className="text-xs text-red-400 font-semibold">{error}</p>}
    </div>
  )
}

export default function ProductForm() {
  const { id } = useParams()
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
    api.get('/categories').then(({ data }) => setCategories(Array.isArray(data) ? data : []))

    if (isEdit) {
      api.get('/products').then(({ data }) => {
        const product = (Array.isArray(data) ? data : []).find((p) => String(p.id) === String(id))
        if (product) {
          reset({ name: product.name, price: product.price / 100, category_id: String(product.category_id) })
          setOffer(product.offer || false)
          if (product.url_image) setPreview(`http://localhost:3000${product.url_image}`)
        }
      })
    }
  }, [id, isEdit, reset])

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
      if (file) formData.append('file', file)

      if (isEdit) {
        await api.put(`/products/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
        toast.success('Produto atualizado!')
      } else {
        await api.post('/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
        toast.success('Produto criado!')
      }
      navigate('/admin/products')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erro ao salvar produto')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-[560px]">
      {/* Breadcrumb */}
      <p className="font-['Poppins'] text-[13px] text-gray-500 mb-6">
        Gerenciar &gt; <span className="font-semibold text-gray-700">{isEdit ? 'Editar Produto' : 'Cadastrar Produto'}</span>
      </p>

      <div className="bg-white rounded-[20px] overflow-hidden shadow-sm">
        {/* Card header */}
        <div className="px-6 py-4" style={{ backgroundColor: '#2a2a2a' }}>
          <span className="text-white font-['Poppins'] font-semibold text-[15px]">
            {isEdit ? 'Editar produto' : 'Adicionar produto'}
          </span>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-6 space-y-5">
          {/* Nome */}
          <Field
            label="Nome"
            type="text"
            placeholder="Ex: Classic Smash Burger"
            error={errors.name?.message}
            {...register('name')}
          />

          {/* Preço */}
          <Field
            label="Preço"
            type="number"
            step="0.01"
            placeholder="Ex: 32.90"
            error={errors.price?.message}
            {...register('price')}
          />

          {/* Upload imagem */}
          <div className="flex flex-col gap-1">
            <label className="font-['Poppins'] text-[13px] font-semibold text-gray-700">Imagem do produto</label>
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center w-full h-40 rounded-[8px] border-2 border-dashed cursor-pointer transition-all hover:border-[#9758a6] overflow-hidden"
              style={{ borderColor: preview ? 'transparent' : '#ddd' }}
            >
              {preview ? (
                <img src={preview} alt="Preview" className="w-full h-full object-contain" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-gray-400">
                  <ImagePlus size={32} />
                  <p className="font-['Poppins'] text-[13px]">Clique para selecionar</p>
                </div>
              )}
            </label>
            <input id="file-upload" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </div>

          {/* Categoria */}
          <div className="flex flex-col gap-1">
            <label className="font-['Poppins'] text-[13px] font-semibold text-gray-700">Categoria</label>
            <select
              {...register('category_id')}
              className="w-full px-4 py-3 rounded-[8px] border font-['Poppins'] text-[14px] outline-none cursor-pointer"
              style={{ borderColor: errors.category_id ? '#ef4444' : '#ddd', color: '#333' }}
            >
              <option value="">Selecione uma categoria</option>
              {categories.map((cat) => (
                <option key={cat.id} value={String(cat.id)}>{cat.name}</option>
              ))}
            </select>
            {errors.category_id && <p className="text-xs text-red-400 font-semibold">{errors.category_id.message}</p>}
          </div>

          {/* Oferta toggle */}
          <div className="flex items-center justify-between py-2">
            <span className="font-['Poppins'] text-[13px] font-semibold text-gray-700">Marcar como Oferta</span>
            <button
              type="button"
              onClick={() => setOffer((v) => !v)}
              className="relative w-11 h-6 rounded-full transition-all duration-300"
              style={{ backgroundColor: offer ? '#9758a6' : '#ddd' }}
            >
              <span
                className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-all duration-300"
                style={{ transform: offer ? 'translateX(20px)' : 'translateX(0)' }}
              />
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-[8px] font-['Poppins'] font-bold text-white text-[15px] hover:brightness-110 transition-all disabled:opacity-60"
            style={{ backgroundColor: '#9758a6' }}
          >
            {loading ? 'Salvando...' : isEdit ? 'Salvar alterações' : 'Adicionar produto'}
          </button>
        </form>
      </div>
    </div>
  )
}
