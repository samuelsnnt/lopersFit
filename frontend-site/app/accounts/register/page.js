'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { User, Mail, Lock, ArrowRight, UserPlus, AlertCircle, CheckCircle } from 'lucide-react'
import { useAuth } from '@/components/providers/AuthProvider'
import { useTheme } from '@/components/providers/ThemeProvider'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

export default function RegisterPage() {
  const router = useRouter()
  const { register, loading } = useAuth()
  const { isDarkMode } = useTheme()
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    // Limpar mensagens quando usuário começar a digitar
    if (error) setError('')
    if (success) setSuccess('')
  }

  const validateForm = () => {
    if (!formData.username.trim()) {
      setError('Username é obrigatório')
      return false
    }

    if (formData.username.length < 3) {
      setError('Username deve ter pelo menos 3 caracteres')
      return false
    }

    if (!formData.email.trim()) {
      setError('Email é obrigatório')
      return false
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Email inválido')
      return false
    }

    if (!formData.password.trim()) {
      setError('Senha é obrigatória')
      return false
    }

    if (formData.password.length < 6) {
      setError('Senha deve ter pelo menos 6 caracteres')
      return false
    }

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem')
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (isSubmitting || loading) return

    if (!validateForm()) return

    setIsSubmitting(true)
    setError('')
    setSuccess('')

    try {
      const result = await register(formData)
      
      if (result.success) {
        setSuccess('Conta criada com sucesso! Redirecionando...')
        setTimeout(() => {
          router.push('/')
        }, 2000)
      } else {
        setError(result.message || 'Erro ao criar conta')
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
                <UserPlus className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">
                Criar nova conta
              </h1>
              <p className={`text-sm ${
                isDarkMode ? 'text-slate-300' : 'text-blue-100'
              }`}>
                Preencha os dados para criar sua conta
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

              {/* Success Message */}
              {success && (
                <div className={`mb-6 p-4 rounded-xl border flex items-center ${
                  isDarkMode 
                    ? 'bg-green-900/20 border-green-700 text-green-400' 
                    : 'bg-green-50 border-green-200 text-green-700'
                }`}>
                  <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                  <span className="text-sm">{success}</span>
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
                  placeholder="Digite sua senha (mín. 6 caracteres)"
                  icon={Lock}
                  showPassword={showPassword}
                  onTogglePassword={() => setShowPassword(!showPassword)}
                  required
                />

                {/* Confirm Password Field */}
                <Input
                  label="Confirmar senha *"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(value) => handleInputChange('confirmPassword', value)}
                  placeholder="Confirme sua senha"
                  icon={Lock}
                  showPassword={showConfirmPassword}
                  onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
                  required
                />

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  variant="primary" 
                  className="w-full"
                  disabled={isSubmitting || loading}
                >
                  {isSubmitting ? (
                    <span>Criando conta...</span>
                  ) : (
                    <>
                      <span>Criar conta</span>
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
                  Já possui uma conta?
                </p>
                <Link
                  href="/accounts/login"
                  className={`font-semibold text-sm transition-colors duration-200 hover:underline ${
                    isDarkMode 
                      ? 'text-blue-400 hover:text-blue-300' 
                      : 'text-blue-600 hover:text-blue-700'
                  }`}
                >
                  Fazer login
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