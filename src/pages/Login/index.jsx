import { useState } from 'react'
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
      <label className="text-sm font-medium mb-2 text-white">{label}</label>
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
    <div className="min-h-screen flex w-full bg-[#1c1c1c]">
      {/* Left Column - Image Background */}
      <div 
        className="hidden lg:flex w-[55%] relative items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('/assets/login/bg1.png')` }}
      >
        <div className="absolute inset-0 bg-black/30"></div>
        <img 
          src="/assets/login/logo2.svg" 
          alt="DevBurguer Logo" 
          className="relative z-10 w-[60%] max-w-[400px] drop-shadow-2xl"
        />
      </div>

      {/* Right Column - Form */}
      <div 
        className="w-full lg:w-[45%] flex flex-col items-center justify-center px-8 sm:px-16 py-12 relative overflow-hidden"
      >
        {/* Texture Background */}
        <div 
          className="absolute inset-0 z-0 opacity-40 mix-blend-overlay"
          style={{ 
            backgroundImage: `url('/assets/login/Padrão 1.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        ></div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[400px] relative z-10"
        >
          {/* Mobile Logo fallback */}
          <div className="flex lg:hidden justify-center mb-10">
            <img src="/assets/login/logo2.svg" alt="DevBurguer Logo" className="w-[200px]" />
          </div>

          <div className="text-center mb-10">
            <h1 className="text-white text-xl sm:text-2xl font-bold mb-1" style={{ fontFamily: 'var(--font-family-sans)' }}>
              Olá, seja bem vindo ao <span style={{ color: '#9758a6' }}>Dev Burguer!</span>
            </h1>
            <p className="text-white text-xl sm:text-2xl font-bold" style={{ fontFamily: 'var(--font-family-sans)' }}>
              Acesse com seu <span style={{ color: '#9758a6' }}>Login</span> e senha.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative">
            
            {/* Cart Icon */}
            <div className="absolute -top-12 right-0">
              <svg xmlns="http://www.w3.org/-2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                <path d="M11 10h6"></path>
                <path d="M14 7v6"></path>
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
              className="w-full py-4 text-white text-[16px] font-bold mt-6 transition-all hover:opacity-80 disabled:opacity-60"
            >
              {isSubmitting ? 'ENTRANDO...' : 'ENTRAR'}
            </button>
          </form>

          <p className="text-center text-white mt-12 text-sm font-semibold">
            Não possui conta?{' '}
            <Link to="/register" className="underline hover:text-gray-300 transition-colors">
              Clique aqui.
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
