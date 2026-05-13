import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { motion } from 'framer-motion'
import { ImagePlus, ArrowLeft, Save } from 'lucide-react'
import api from '../../../services/api.js'
import { toast } from 'react-toastify'

const schema = yup.object({
  name: yup.string().required('Nome é obrigatório'),
  price: yup.number().typeError('Informe o preço').positive('Preço deve ser positivo').required('Preço é obrigatório'),
  category_id: yup.string().required('Selecione uma categoria'),
})

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
          reset({
            name: product.name,
            price: product.price / 100,
            category_id: String(product.category_id),
          })
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
    <div className="p-8 max-w-2xl" style={{ color: 'var(--color-text)' }}>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate('/admin/products')}
          className="flex items-center gap-2 text-sm font-semibold hover:opacity-70 transition-opacity"
          style={{ color: 'var(--color-text-muted)' }}
        >
          <ArrowLeft size={18} /> Voltar
        </button>
        <h1 className="text-2xl font-black">{isEdit ? 'Editar Produto' : 'Novo Produto'}</h1>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >
        {/* Image upload */}
        <div>
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center w-full h-48 rounded-2xl border-2 border-dashed cursor-pointer transition-all hover:opacity-80"
            style={{ borderColor: preview ? 'transparent' : 'var(--color-border)', background: 'var(--color-bg-card)', overflow: 'hidden' }}
          >
            {preview ? (
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-2">
                <ImagePlus size={32} style={{ color: 'var(--color-text-muted)' }} />
                <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  Clique para selecionar a imagem do produto
                </p>
              </div>
            )}
          </label>
          <input id="file-upload" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
        </div>

        {/* Name */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--color-text-muted)' }}>
            Nome do Produto
          </label>
          <input
            {...register('name')}
            placeholder="Ex: Classic Smash Burger"
            className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
            style={{
              background: 'var(--color-bg-card)',
              border: `1px solid ${errors.name ? '#ef4444' : 'var(--color-border)'}`,
              color: 'var(--color-text)',
            }}
          />
          {errors.name && <p className="text-xs mt-1 text-red-400">{errors.name.message}</p>}
        </div>

        {/* Price */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--color-text-muted)' }}>
            Preço (R$)
          </label>
          <input
            {...register('price')}
            type="number"
            step="0.01"
            placeholder="Ex: 32.90"
            className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
            style={{
              background: 'var(--color-bg-card)',
              border: `1px solid ${errors.price ? '#ef4444' : 'var(--color-border)'}`,
              color: 'var(--color-text)',
            }}
          />
          {errors.price && <p className="text-xs mt-1 text-red-400">{errors.price.message}</p>}
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--color-text-muted)' }}>
            Categoria
          </label>
          <select
            {...register('category_id')}
            className="w-full px-4 py-3 rounded-xl text-sm outline-none cursor-pointer"
            style={{
              background: 'var(--color-bg-card)',
              border: `1px solid ${errors.category_id ? '#ef4444' : 'var(--color-border)'}`,
              color: 'var(--color-text)',
            }}
          >
            <option value="">Selecione uma categoria</option>
            {categories.map((cat) => (
              <option key={cat.id} value={String(cat.id)} style={{ background: '#161616' }}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.category_id && <p className="text-xs mt-1 text-red-400">{errors.category_id.message}</p>}
        </div>

        {/* Offer toggle */}
        <div
          className="flex items-center justify-between p-4 rounded-xl border"
          style={{ background: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}
        >
          <div>
            <p className="text-sm font-semibold">Marcar como Oferta 🔥</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
              O produto aparecerá na seção de ofertas da Home
            </p>
          </div>
          <button
            type="button"
            onClick={() => setOffer((v) => !v)}
            className="relative w-12 h-6 rounded-full transition-all duration-300"
            style={{ background: offer ? 'var(--color-primary)' : 'rgba(255,255,255,0.12)' }}
          >
            <span
              className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-all duration-300"
              style={{ transform: offer ? 'translateX(24px)' : 'translateX(0)' }}
            />
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-full font-black text-white flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 disabled:opacity-60"
          style={{ background: 'var(--gradient-primary)', boxShadow: '0 8px 24px rgba(230,57,70,0.35)' }}
        >
          <Save size={18} />
          {loading ? 'Salvando...' : isEdit ? 'Salvar Alterações' : 'Criar Produto'}
        </button>
      </motion.form>
    </div>
  )
}
