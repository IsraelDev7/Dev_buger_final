import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useAuth } from '../../hooks/AuthContext.jsx'
import { toast } from 'react-toastify'
import { Lock, Mail, User, UserPlus } from 'lucide-react'

const schema = yup.object({
  name: yup.string().min(2, 'Nome muito curto').required('Nome é obrigatório'),
  email: yup.string().email('Email inválido').required('Email é obrigatório'),
  password: yup.string().min(6, 'Mínimo 6 caracteres').required('Senha é obrigatória'),
  confirm: yup.string().oneOf([yup.ref('password')], 'As senhas não conferem').required('Confirme a senha'),
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

export default function Register() {
  const { register: registerUser, login } = useAuth()
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: yupResolver(schema) })

  async function onSubmit({ name, email, password }) {
    try {
      await registerUser(name, email, password)
      await login(email, password)
      toast.success('Conta criada com sucesso! 🎉')
      navigate('/home')
    } catch (err) {
      toast.error(err.response?.data?.error || err.response?.data?.message || 'Erro ao criar conta. Tente novamente.')
    }
  }

  return (
    <div className="auth-wrapper register-form">
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
          {/* Title */}
          <div className="text-center mb-8">
             <div className="flex justify-center mb-4 text-[#5bb333]">
                <UserPlus size={48} />
             </div>
            <h1
              className="text-3xl font-bold font-['Poppins']"
              style={{ color: '#5bb333' }}
            >
              Criar conta
            </h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <AuthField
              label="Nome"
              type="text"
              icon={User}
              error={errors.name?.message}
              {...register('name')}
            />

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

            <AuthField
              label="Confirmar senha"
              type="password"
              icon={Lock}
              error={errors.confirm?.message}
              {...register('confirm')}
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-auth"
            >
              {isSubmitting ? 'CADASTRANDO...' : 'CONFIRMAR CADASTRO'}
            </button>
          </form>

          <p className="auth-link-text">
            Já possui conta ?{' '}
            <Link to="/login" className="auth-link">
              Clique aqui.
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
