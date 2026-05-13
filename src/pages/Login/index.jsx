import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useAuth } from '../../hooks/AuthContext.jsx'
import { toast } from 'react-toastify'

const schema = yup.object({
  email: yup.string().email('Email inválido').required('Email é obrigatório'),
  password: yup.string().min(6, 'Mínimo 6 caracteres').required('Senha é obrigatória'),
})

function Field({ label, error, ...props }) {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium mb-2 text-white font-['Poppins']">{label}</label>
      <input
        {...props}
        className="w-full px-4 py-4 rounded-[5px] text-sm outline-none transition-all"
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
      toast.error(err.response?.data?.message || 'Email ou senha incorretos.')
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
          <div className="flex lg:hidden justify-center mb-10">
            <img src="/assets/login/logo2.svg" alt="DevBurguer Logo" className="w-[200px]" />
          </div>

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

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative">
            {/* Cart icon — top right */}
            <div className="absolute -top-14 right-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                <line x1="12" y1="9" x2="12" y2="15" />
                <line x1="9" y1="12" x2="15" y2="12" />
              </svg>
            </div>

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

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 text-white text-[15px] font-bold tracking-[3px] uppercase transition-all hover:opacity-80 disabled:opacity-60 font-['Poppins'] mt-4"
            >
              {isSubmitting ? 'ENTRANDO...' : 'ENTRAR'}
            </button>
          </form>

          <p className="text-center text-white mt-10 text-sm font-['Poppins']">
            Não possui conta?{' '}
            <Link to="/register" className="underline font-bold hover:text-gray-300 transition-colors">
              Clique aqui.
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
