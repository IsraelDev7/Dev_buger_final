import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useAuth } from '../../hooks/AuthContext.jsx'
import { toast } from 'react-toastify'
import { Lock, Mail, ShoppingCart } from 'lucide-react'

const schema = yup.object({
  email: yup.string().email('Email inválido').required('Email é obrigatório'),
  password: yup.string().min(6, 'Mínimo 6 caracteres').required('Senha é obrigatória'),
})

function AuthField({ label, error, icon: Icon, ...props }) {
  return (
    <div className="auth-input-group">
      <label className="auth-label">{label}</label>
      <div className="relative">
        <input
          {...props}
          className={`auth-input ${error ? 'border-red-500' : ''}`}
        />
        {Icon && (
          <div className="input-icon-wrapper">
            <Icon size={18} />
          </div>
        )}
      </div>
      {error && <p className="text-xs mt-1 text-red-400 font-semibold ml-4">{error}</p>}
    </div>
  )
}

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: yupResolver(schema) })

  async function onSubmit({ email, password }) {
    try {
      const user = await login(email, password)
      toast.success(`Bem-vindo, ${user.name || 'usuário'}! 🍔`)
      navigate(user.admin ? '/admin/orders' : '/home')
    } catch (err) {
      toast.error(err.response?.data?.error || err.response?.data?.message || 'Email ou senha incorretos.')
    }
  }

  return (
    <div className="auth-wrapper login-form">
      {/* Left Column — Hero Image + 3D Logo */}
      <div className="hero-auth-image">
        <div className="auth-logo-wrapper">
          <img
            src="/assets/login/logo2.svg"
            alt="DevBurguer Logo"
            className="auth-logo"
          />
        </div>
      </div>

      {/* Right Column — Form */}
      <div className="auth-form-column">
        {/* Repeating icon pattern overlay */}
        <div className="auth-pattern-overlay" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="auth-form-container"
        >
          {/* Heading */}
          <div className="text-center mb-10">
            <h1 className="text-white text-2xl font-bold font-['Poppins'] leading-snug">
              Olá, seja bem vindo ao{' '}
              <span style={{ color: '#9758a6' }}>Dev Burguer!</span>
            </h1>
            <p className="text-white text-2xl font-bold font-['Poppins'] leading-snug mt-1">
              Acesse com seu{' '}
              <span style={{ color: '#9758a6' }}>Login e senha.</span>
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Cart icon — visual only as per image */}
            <div className="auth-cart-icon">
              <ShoppingCart size={32} />
            </div>

            <AuthField
              label="Email"
              type="email"
              icon={Mail}
              error={errors.email?.message}
              {...register('email')}
            />

            <AuthField
              label="Senha"
              type="password"
              icon={Lock}
              error={errors.password?.message}
              {...register('password')}
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-auth"
            >
              {isSubmitting ? 'ENTRANDO...' : 'ENTRAR'}
            </button>
          </form>

          <p className="auth-link-text">
            Não possui conta?{' '}
            <Link to="/register" className="auth-link">
              Clique aqui.
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
