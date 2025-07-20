'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { User, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react'
import { useAuth } from '@/components/providers/AuthProvider'
import { useTheme } from '@/components/providers/ThemeProvider'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

export default function LoginPage() {
  const router = useRouter()
  const { login, loading } = useAuth()
  const { isDarkMode } = useTheme()
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  })

  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    // Limpar erro quando usuário começar a digitar
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (isSubmitting || loading) return

    // Validações básicas
    if (!formData.username.trim() || !formData.email.trim() || !formData.password.trim()) {
      setError('Todos os campos são obrigatórios')
      return
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Email inválido')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const result = await login(formData)
      
      if (result.success) {
        router.push('/')
      } else {
        setError(result.message || 'Erro ao fazer login')
      }
    } catch (error) {
      setError('Erro de conexão. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-slate-900 to-slate-800' 
        : 'bg-gradient-to-br from-slate-50 to-blue-50'
    }`}>
      <div className="flex items-center justify-center p-4 pt-16">
        <div className="w-full max-w-md">
          {/* Card Container */}
          <div className={`rounded-2xl shadow-xl border overflow-hidden transition-colors duration-300 ${
            isDarkMode 
              ? 'bg-slate-800 border-slate-700' 
              : 'bg-white border-slate-100'
          }`}>
            {/* Header */}
            <div className={`px-8 py-6 text-center transition-colors duration-300 ${
              isDarkMode 
                ? 'bg-gradient-to-r from-slate-700 to-slate-800' 
                : 'bg-gradient-to-r from-blue-600 to-blue-700'
            }`}>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                <User className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">
                Bem-vindo de volta!
              </h1>
              <p className={`text-sm ${
                isDarkMode ? 'text-slate-300' : 'text-blue-100'
              }`}>
                Entre com suas credenciais para continuar
              </p>
            </div>

            {/* Form */}
            <div className="p-8">
              {/* Error Message */}
              {error && (
                <div className={`mb-6 p-4 rounded-xl border flex items-center ${
                  isDarkMode 
                    ? 'bg-red-900/20 border-red-700 text-red-400' 
                    : 'bg-red-50 border-red-200 text-red-700'
                }`}>
                  <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Username Field */}
                <Input
                  label="Username *"
                  type="text"
                  value={formData.username}
                  onChange={(value) => handleInputChange('username', value)}
                  placeholder="Digite seu username"
                  icon={User}
                  required
                />

                {/* Email Field */}
                <Input
                  label="Email *"
                  type="email"
                  value={formData.email}
                  onChange={(value) => handleInputChange('email', value)}
                  placeholder="Digite seu email"
                  icon={Mail}
                  required
                />

                {/* Password Field */}
                <Input
                  label="Senha *"
                  type="password"
                  value={formData.password}
                  onChange={(value) => handleInputChange('password', value)}
                  placeholder="Digite sua senha"
                  icon={Lock}
                  showPassword={showPassword}
                  onTogglePassword={() => setShowPassword(!showPassword)}
                  required
                />

                {/* Remember Me */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <span className={`ml-2 text-sm ${
                      isDarkMode ? 'text-slate-300' : 'text-slate-600'
                    }`}>Lembrar de mim</span>
                  </label>
                  <button
                    type="button"
                    className={`text-sm transition-colors duration-200 ${
                      isDarkMode 
                        ? 'text-blue-400 hover:text-blue-300' 
                        : 'text-blue-600 hover:text-blue-700'
                    }`}
                  >
                    Esqueceu a senha?
                  </button>
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  variant="primary" 
                  className="w-full"
                  disabled={isSubmitting || loading}
                >
                  {isSubmitting ? (
                    <span>Entrando...</span>
                  ) : (
                    <>
                      <span>Entrar</span>
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Footer */}
            <div className={`px-8 py-6 border-t transition-colors duration-300 ${
              isDarkMode 
                ? 'bg-slate-900 border-slate-700' 
                : 'bg-slate-50 border-slate-100'
            }`}>
              <div className="text-center">
                <p className={`text-sm mb-4 ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  Ainda não tem uma conta?
                </p>
                <Link
                  href="/accounts/register"
                  className={`font-semibold text-sm transition-colors duration-200 hover:underline ${
                    isDarkMode 
                      ? 'text-blue-400 hover:text-blue-300' 
                      : 'text-blue-600 hover:text-blue-700'
                  }`}
                >
                  Criar nova conta
                </Link>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-center">
            <p className={`text-xs ${
              isDarkMode ? 'text-slate-500' : 'text-slate-500'
            }`}>
              Ao continuar, você concorda com nossos{' '}
              <Link 
                href="/legal/terms"
                className={`underline ${
                  isDarkMode 
                    ? 'text-blue-400 hover:text-blue-300' 
                    : 'text-blue-600 hover:text-blue-700'
                }`}
              >
                Termos de Uso
              </Link>{' '}
              e{' '}
              <Link 
                href="/legal/privacy"
                className={`underline ${
                  isDarkMode 
                    ? 'text-blue-400 hover:text-blue-300' 
                    : 'text-blue-600 hover:text-blue-700'
                }`}
              >
                Política de Privacidade
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}