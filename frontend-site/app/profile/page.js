'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  User, 
  Mail, 
  Lock, 
  Calendar, 
  Edit, 
  Dumbbell,
  Trophy,
  Target,
  Clock,
  AlertCircle,
  Key
} from 'lucide-react'
import Layout from '@/components/layout/Layout'
import { useAuth } from '@/components/providers/AuthProvider'
import { useTheme } from '@/components/providers/ThemeProvider'
import Button from '@/components/ui/Button'

export default function ProfilePage() {
  const { userData, loading } = useAuth()
  const { isDarkMode } = useTheme()
  const [showResetPassword, setShowResetPassword] = useState(false)
  const [resetPasswordData, setResetPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [resetError, setResetError] = useState('')
  const [resetSuccess, setResetSuccess] = useState('')
  const [isResetting, setIsResetting] = useState(false)

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault()
    
    if (isResetting) return

    // Validações
    if (!resetPasswordData.currentPassword) {
      setResetError('Senha atual é obrigatória')
      return
    }

    if (!resetPasswordData.newPassword) {
      setResetError('Nova senha é obrigatória')
      return
    }

    if (resetPasswordData.newPassword.length < 6) {
      setResetError('Nova senha deve ter pelo menos 6 caracteres')
      return
    }

    if (resetPasswordData.newPassword !== resetPasswordData.confirmPassword) {
      setResetError('Confirmação de senha não confere')
      return
    }

    setIsResetting(true)
    setResetError('')

    try {
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setResetSuccess('Senha alterada com sucesso!')
      setResetPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      
      // Fechar modal após 2 segundos
      setTimeout(() => {
        setShowResetPassword(false)
        setResetSuccess('')
      }, 2000)

    } catch (error) {
      setResetError('Erro ao alterar senha. Tente novamente.')
    } finally {
      setIsResetting(false)
    }
  }

  const handleResetInputChange = (field, value) => {
    setResetPasswordData(prev => ({
      ...prev,
      [field]: value
    }))
    if (resetError) setResetError('')
    if (resetSuccess) setResetSuccess('')
  }

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen pt-16 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>
              Carregando perfil...
            </p>
          </div>
        </div>
      </Layout>
    )
  }

  if (!userData) {
    return (
      <Layout>
        <div className="min-h-screen pt-16 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className={`w-16 h-16 mx-auto mb-4 ${
              isDarkMode ? 'text-slate-500' : 'text-slate-400'
            }`} />
            <h1 className={`text-2xl font-bold mb-4 ${
              isDarkMode ? 'text-white' : 'text-slate-800'
            }`}>Acesso negado</h1>
            <p className={`mb-4 ${
              isDarkMode ? 'text-slate-300' : 'text-slate-600'
            }`}>Você precisa estar logado para ver esta página.</p>
            <Link href="/accounts/login">
              <Button variant="primary">Fazer Login</Button>
            </Link>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className={`min-h-screen pt-16 transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-slate-900 to-slate-800' 
          : 'bg-gradient-to-br from-slate-50 to-blue-50'
      }`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className={`text-3xl font-bold mb-2 ${
                isDarkMode ? 'text-white' : 'text-slate-800'
              }`}>Meu Perfil</h1>
              <p className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>
                Gerencie suas informações pessoais e treinos
              </p>
            </div>
            <Link href="/profile/edit">
              <Button variant="primary" className="flex items-center group">
                <Edit className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
                Editar Perfil
              </Button>
            </Link>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Informações Pessoais */}
            <div className="lg:col-span-2 space-y-6">
              {/* Card de Informações Básicas */}
              <div className={`rounded-2xl shadow-xl border overflow-hidden transition-colors duration-300 ${
                isDarkMode 
                  ? 'bg-slate-800 border-slate-700' 
                  : 'bg-white border-slate-100'
              }`}>
                <div className={`px-8 py-6 transition-colors duration-300 ${
                  isDarkMode 
                    ? 'bg-gradient-to-r from-slate-700 to-slate-800' 
                    : 'bg-gradient-to-r from-blue-600 to-blue-700'
                }`}>
                  <div className="flex items-center">
                    {userData.avatar ? (
                      <img
                        src={userData.avatar}
                        alt={userData.username}
                        className="w-20 h-20 rounded-full border-4 border-white shadow-lg mr-6"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mr-6 backdrop-blur-sm border-4 border-white shadow-lg">
                        <User className="w-10 h-10 text-white" />
                      </div>
                    )}
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-1">{userData.username}</h2>
                      <p className={isDarkMode ? 'text-slate-300' : 'text-blue-100'}>
                        Membro desde {formatDate(userData.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  <h3 className={`text-xl font-semibold mb-6 ${
                    isDarkMode ? 'text-white' : 'text-slate-800'
                  }`}>Informações Pessoais</h3>
                  <div className="space-y-6">
                    {/* Username */}
                    <div className="group">
                      <label className={`block text-sm font-medium mb-2 ${
                        isDarkMode ? 'text-slate-300' : 'text-slate-700'
                      }`}>
                        Username
                      </label>
                      <div className="relative">
                        <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                          isDarkMode ? 'text-slate-500' : 'text-slate-400'
                        }`}>
                          <User className="w-5 h-5" />
                        </div>
                        <input
                          type="text"
                          value={userData.username}
                          readOnly
                          className={`w-full pl-11 pr-4 py-3 border rounded-xl cursor-not-allowed ${
                            isDarkMode 
                              ? 'border-slate-600 bg-slate-700 text-slate-300' 
                              : 'border-slate-200 bg-slate-50 text-slate-700'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="group">
                      <label className={`block text-sm font-medium mb-2 ${
                        isDarkMode ? 'text-slate-300' : 'text-slate-700'
                      }`}>
                        Email
                      </label>
                      <div className="relative">
                        <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                          isDarkMode ? 'text-slate-500' : 'text-slate-400'
                        }`}>
                          <Mail className="w-5 h-5" />
                        </div>
                        <input
                          type="email"
                          value={userData.email}
                          readOnly
                          className={`w-full pl-11 pr-4 py-3 border rounded-xl cursor-not-allowed ${
                            isDarkMode 
                              ? 'border-slate-600 bg-slate-700 text-slate-300' 
                              : 'border-slate-200 bg-slate-50 text-slate-700'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Redefinir Senha */}
                    <div className="group">
                      <label className={`block text-sm font-medium mb-2 ${
                        isDarkMode ? 'text-slate-300' : 'text-slate-700'
                      }`}>
                        Senha
                      </label>
                      <div className="relative">
                        <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                          isDarkMode ? 'text-slate-500' : 'text-slate-400'
                        }`}>
                          <Lock className="w-5 h-5" />
                        </div>
                        <input
                          type="password"
                          value="••••••••"
                          readOnly
                          className={`w-full pl-11 pr-32 py-3 border rounded-xl cursor-not-allowed ${
                            isDarkMode 
                              ? 'border-slate-600 bg-slate-700 text-slate-300' 
                              : 'border-slate-200 bg-slate-50 text-slate-700'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowResetPassword(true)}
                          className={`absolute right-3 top-1/2 transform -translate-y-1/2 px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200 ${
                            isDarkMode 
                              ? 'text-blue-400 hover:text-blue-300 hover:bg-blue-900/30' 
                              : 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'
                          }`}
                        >
                          Redefinir
                        </button>
                      </div>
                    </div>

                    {/* Data de Criação */}
                    <div className="group">
                      <label className={`block text-sm font-medium mb-2 ${
                        isDarkMode ? 'text-slate-300' : 'text-slate-700'
                      }`}>
                        Conta Criada em
                      </label>
                      <div className="relative">
                        <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                          isDarkMode ? 'text-slate-500' : 'text-slate-400'
                        }`}>
                          <Calendar className="w-5 h-5" />
                        </div>
                        <input
                          type="text"
                          value={formatDate(userData.createdAt)}
                          readOnly
                          className={`w-full pl-11 pr-4 py-3 border rounded-xl cursor-not-allowed ${
                            isDarkMode 
                              ? 'border-slate-600 bg-slate-700 text-slate-300' 
                              : 'border-slate-200 bg-slate-50 text-slate-700'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Treinos e Exercícios */}
              <div className={`rounded-2xl shadow-xl border overflow-hidden transition-colors duration-300 ${
                isDarkMode 
                  ? 'bg-slate-800 border-slate-700' 
                  : 'bg-white border-slate-100'
              }`}>
                <div className={`px-8 py-6 border-b ${
                  isDarkMode ? 'border-slate-700' : 'border-slate-100'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-green-700 rounded-xl flex items-center justify-center mr-4">
                        <Dumbbell className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className={`text-xl font-semibold ${
                          isDarkMode ? 'text-white' : 'text-slate-800'
                        }`}>Meus Treinos</h3>
                        <p className={`text-sm ${
                          isDarkMode ? 'text-slate-400' : 'text-slate-600'
                        }`}>{userData.workouts.length} treinos criados</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  {userData.workouts.length > 0 ? (
                    <div className="space-y-6">
                      {userData.workouts.map((workout) => (
                        <div key={workout.id} className={`border rounded-xl p-6 hover:shadow-md transition-all duration-200 ${
                          isDarkMode 
                            ? 'border-slate-700 hover:border-slate-600' 
                            : 'border-slate-200 hover:border-slate-300'
                        }`}>
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h4 className={`text-lg font-semibold mb-2 ${
                                isDarkMode ? 'text-white' : 'text-slate-800'
                              }`}>{workout.name}</h4>
                              <div className={`flex items-center text-sm ${
                                isDarkMode ? 'text-slate-400' : 'text-slate-600'
                              }`}>
                                <Clock className="w-4 h-4 mr-1" />
                                Criado em {formatDate(workout.createdAt)}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className={`text-sm mb-1 ${
                                isDarkMode ? 'text-slate-400' : 'text-slate-600'
                              }`}>Exercícios</div>
                              <div className={`text-2xl font-bold ${
                                isDarkMode ? 'text-blue-400' : 'text-blue-600'
                              }`}>{workout.exercises.length}</div>
                            </div>
                          </div>
                          
                          <div>
                            <h5 className={`text-sm font-medium mb-3 ${
                              isDarkMode ? 'text-slate-300' : 'text-slate-700'
                            }`}>Exercícios:</h5>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {workout.exercises.map((exercise, index) => (
                                <div key={index} className={`flex items-center rounded-lg px-3 py-2 ${
                                  isDarkMode ? 'bg-slate-700' : 'bg-slate-50'
                                }`}>
                                  <Target className={`w-4 h-4 mr-2 flex-shrink-0 ${
                                    isDarkMode ? 'text-blue-400' : 'text-blue-600'
                                  }`} />
                                  <span className={`text-sm ${
                                    isDarkMode ? 'text-slate-300' : 'text-slate-700'
                                  }`}>{exercise}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                        isDarkMode ? 'bg-slate-700' : 'bg-slate-100'
                      }`}>
                        <Dumbbell className={`w-8 h-8 ${
                          isDarkMode ? 'text-slate-500' : 'text-slate-400'
                        }`} />
                      </div>
                      <h4 className={`text-lg font-semibold mb-2 ${
                        isDarkMode ? 'text-white' : 'text-slate-800'
                      }`}>Nenhum treino criado</h4>
                      <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
                        Comece criando seu primeiro treino personalizado
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar com Estatísticas */}
            <div className="space-y-6">
              {/* Estatísticas Rápidas */}
              <div className={`rounded-2xl shadow-xl border p-6 transition-colors duration-300 ${
                isDarkMode 
                  ? 'bg-slate-800 border-slate-700' 
                  : 'bg-white border-slate-100'
              }`}>
                <h3 className={`text-lg font-semibold mb-6 ${
                  isDarkMode ? 'text-white' : 'text-slate-800'
                }`}>Estatísticas</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                        isDarkMode ? 'bg-blue-900/30' : 'bg-blue-100'
                      }`}>
                        <Dumbbell className={`w-5 h-5 ${
                          isDarkMode ? 'text-blue-400' : 'text-blue-600'
                        }`} />
                      </div>
                      <div>
                        <div className={`text-sm ${
                          isDarkMode ? 'text-slate-400' : 'text-slate-600'
                        }`}>Total de Treinos</div>
                        <div className={`text-lg font-semibold ${
                          isDarkMode ? 'text-white' : 'text-slate-800'
                        }`}>{userData.workouts.length}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                        isDarkMode ? 'bg-green-900/30' : 'bg-green-100'
                      }`}>
                        <Target className={`w-5 h-5 ${
                          isDarkMode ? 'text-green-400' : 'text-green-600'
                        }`} />
                      </div>
                      <div>
                        <div className={`text-sm ${
                          isDarkMode ? 'text-slate-400' : 'text-slate-600'
                        }`}>Total de Exercícios</div>
                        <div className={`text-lg font-semibold ${
                          isDarkMode ? 'text-white' : 'text-slate-800'
                        }`}>
                          {userData.workouts.reduce((total, workout) => total + workout.exercises.length, 0)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                        isDarkMode ? 'bg-purple-900/30' : 'bg-purple-100'
                      }`}>
                        <Trophy className={`w-5 h-5 ${
                          isDarkMode ? 'text-purple-400' : 'text-purple-600'
                        }`} />
                      </div>
                      <div>
                        <div className={`text-sm ${
                          isDarkMode ? 'text-slate-400' : 'text-slate-600'
                        }`}>Dias Ativo</div>
                        <div className={`text-lg font-semibold ${
                          isDarkMode ? 'text-white' : 'text-slate-800'
                        }`}>
                          {Math.floor((new Date().getTime() - new Date(userData.createdAt).getTime()) / (1000 * 3600 * 24))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ações Rápidas */}
              <div className={`rounded-2xl shadow-xl border p-6 transition-colors duration-300 ${
                isDarkMode 
                  ? 'bg-slate-800 border-slate-700' 
                  : 'bg-white border-slate-100'
              }`}>
                <h3 className={`text-lg font-semibold mb-6 ${
                  isDarkMode ? 'text-white' : 'text-slate-800'
                }`}>Ações Rápidas</h3>
                <div className="space-y-3">
                  <Link href="/profile/edit">
                    <Button variant="primary" className="w-full flex items-center justify-center group">
                      <Edit className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
                      Editar Perfil
                    </Button>
                  </Link>
                  
                  <Button variant="secondary" className="w-full flex items-center justify-center">
                    <Dumbbell className="w-5 h-5 mr-2" />
                    Criar Treino
                  </Button>

                  <Button 
                    variant="outline" 
                    onClick={() => setShowResetPassword(true)}
                    className="w-full flex items-center justify-center"
                  >
                    <Key className="w-5 h-5 mr-2" />
                    Redefinir Senha
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal de Redefinir Senha */}
        {showResetPassword && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className={`w-full max-w-md rounded-2xl shadow-xl border overflow-hidden transition-colors duration-300 ${
              isDarkMode 
                ? 'bg-slate-800 border-slate-700' 
                : 'bg-white border-slate-100'
            }`}>
              {/* Header */}
              <div className={`px-6 py-4 border-b ${
                isDarkMode ? 'border-slate-700' : 'border-slate-100'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center mr-3">
                      <Key className="w-5 h-5 text-white" />
                    </div>
                    <h3 className={`text-lg font-semibold ${
                      isDarkMode ? 'text-white' : 'text-slate-800'
                    }`}>Redefinir Senha</h3>
                  </div>
                  <button
                    onClick={() => setShowResetPassword(false)}
                    className={`p-2 rounded-lg transition-colors duration-200 ${
                      isDarkMode 
                        ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-700' 
                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleResetPasswordSubmit} className="p-6">
                {/* Error Message */}
                {resetError && (
                  <div className={`mb-4 p-3 rounded-xl border flex items-center ${
                    isDarkMode 
                      ? 'bg-red-900/20 border-red-700 text-red-400' 
                      : 'bg-red-50 border-red-200 text-red-700'
                  }`}>
                    <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="text-sm">{resetError}</span>
                  </div>
                )}

                {/* Success Message */}
                {resetSuccess && (
                  <div className={`mb-4 p-3 rounded-xl border flex items-center ${
                    isDarkMode 
                      ? 'bg-green-900/20 border-green-700 text-green-400' 
                      : 'bg-green-50 border-green-200 text-green-700'
                  }`}>
                    <div className="w-4 h-4 mr-2 flex-shrink-0 rounded-full bg-green-500 flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <span className="text-sm">{resetSuccess}</span>
                  </div>
                )}

                <div className="space-y-4">
                  {/* Senha Atual */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      Senha Atual *
                    </label>
                    <div className="relative">
                      <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                        isDarkMode ? 'text-slate-500' : 'text-slate-400'
                      }`}>
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type="password"
                        value={resetPasswordData.currentPassword}
                        onChange={(e) => handleResetInputChange('currentPassword', e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                          isDarkMode 
                            ? 'border-slate-600 bg-slate-700 text-white placeholder-slate-400' 
                            : 'border-slate-200 bg-slate-50 text-slate-700 placeholder-slate-400'
                        }`}
                        placeholder="Digite sua senha atual"
                        required
                      />
                    </div>
                  </div>

                  {/* Nova Senha */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      Nova Senha *
                    </label>
                    <div className="relative">
                      <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                        isDarkMode ? 'text-slate-500' : 'text-slate-400'
                      }`}>
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type="password"
                        value={resetPasswordData.newPassword}
                        onChange={(e) => handleResetInputChange('newPassword', e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                          isDarkMode 
                            ? 'border-slate-600 bg-slate-700 text-white placeholder-slate-400' 
                            : 'border-slate-200 bg-slate-50 text-slate-700 placeholder-slate-400'
                        }`}
                        placeholder="Digite sua nova senha (mín. 6 caracteres)"
                        required
                      />
                    </div>
                  </div>

                  {/* Confirmar Nova Senha */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      Confirmar Nova Senha *
                    </label>
                    <div className="relative">
                      <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                        isDarkMode ? 'text-slate-500' : 'text-slate-400'
                      }`}>
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type="password"
                        value={resetPasswordData.confirmPassword}
                        onChange={(e) => handleResetInputChange('confirmPassword', e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                          isDarkMode 
                            ? 'border-slate-600 bg-slate-700 text-white placeholder-slate-400' 
                            : 'border-slate-200 bg-slate-50 text-slate-700 placeholder-slate-400'
                        }`}
                        placeholder="Confirme sua nova senha"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 mt-6">
                  <Button 
                    type="submit" 
                    variant="primary" 
                    className="flex-1"
                    disabled={isResetting}
                  >
                    {isResetting ? 'Alterando...' : 'Alterar Senha'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="secondary" 
                    onClick={() => setShowResetPassword(false)}
                    disabled={isResetting}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}