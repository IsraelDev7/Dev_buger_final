import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useAuth } from '../../hooks/AuthContext.jsx'
import { toast } from 'react-toastify'

const schema = yup.object({
  name: yup.string().min(2, 'Nome muito curto').required('Nome é obrigatório'),
  email: yup.string().email('Email inválido').required('Email é obrigatório'),
  password: yup.string().min(6, 'Mínimo 6 caracteres').required('Senha é obrigatória'),
  confirm: yup.string().oneOf([yup.ref('password')], 'As senhas não conferem').required('Confirme a senha'),
})

function Field({ label, error, ...props }) {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium mb-2 text-white font-['Poppins']">{label}</label>
      <input
        {...props}
        className="w-full px-4 py-3 rounded-[5px] text-sm outline-none transition-all"
        style={{
          background: '#ffffff',
          color: '#000000',
          border: error ? '2px solid #ef4444' : 'none',
        }}
      />
      {error && <p className="text-xs mt-1 text-red-400 font-semibold">{error}</p>}
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
      toast.error(err.response?.data?.message || 'Erro ao criar conta. Tente novamente.')
    }
  }

  return (
    <div className="min-h-screen flex w-full">
      {/* Left Column — grunge photo + logo */}
      <div
        className="hidden lg:flex w-1/2 relative items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('/assets/login/bg1.png')` }}
      >
        <div className="absolute inset-0 bg-black/20" />
        <img
          src="/assets/login/logo2.svg"
          alt="DevBurguer Logo"
          className="relative z-10 w-[55%] max-w-[380px] drop-shadow-2xl"
        />
      </div>

      {/* Right Column — dark + repeating icon pattern */}
      <div
        className="w-full lg:w-1/2 flex flex-col items-center justify-center px-8 sm:px-16 py-12 relative overflow-hidden"
        style={{ backgroundColor: '#2a2a2a' }}
      >
        {/* Repeating icon pattern overlay */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url('/assets/login/Padrão 2.png')`,
            backgroundSize: '220px',
            backgroundRepeat: 'repeat',
            opacity: 0.12,
          }}
        />

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[420px] relative z-10"
        >
          {/* Mobile logo */}
          <div className="flex lg:hidden justify-center mb-6">
            <img src="/assets/login/logo2.svg" alt="DevBurguer Logo" className="w-[160px]" />
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1
              className="text-3xl font-bold font-['Poppins']"
              style={{ color: '#9758a6' }}
            >
              Criar conta
            </h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Field
              label="Nome"
              type="text"
              error={errors.name?.message}
              {...register('name')}
            />

            <Field
              label="Email"
              type="email"
              error={errors.email?.message}
              {...register('email')}
            />

            <Field
              label="Senha"
              type="password"
              error={errors.password?.message}
              {...register('password')}
            />

            <Field
              label="Confirmar senha"
              type="password"
              error={errors.confirm?.message}
              {...register('confirm')}
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 text-white text-[14px] font-bold tracking-[2px] uppercase rounded-[5px] transition-all hover:brightness-110 disabled:opacity-60 font-['Poppins'] mt-2"
              style={{ backgroundColor: '#9758a6' }}
            >
              {isSubmitting ? 'CADASTRANDO...' : 'CONFIRMAR CADASTRO'}
            </button>
          </form>

          <p className="text-center text-white mt-8 text-sm font-['Poppins']">
            Já possui conta ?{' '}
            <Link to="/login" className="underline font-bold hover:text-gray-300 transition-colors">
              Clique aqui.
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
