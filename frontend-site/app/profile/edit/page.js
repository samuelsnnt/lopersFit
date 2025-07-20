'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  User, 
  Mail, 
  Lock, 
  Save, 
  X,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  Camera,
  Upload
} from 'lucide-react'
import Layout from '@/components/layout/Layout'
import { useAuth } from '@/components/providers/AuthProvider'
import { useTheme } from '@/components/providers/ThemeProvider'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

export default function EditProfilePage() {
  const router = useRouter()
  const { userData, updateProfile, loading } = useAuth()
  const { isDarkMode } = useTheme()
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  })
  
  const [profileImage, setProfileImage] = useState(null)
  const [previewImage, setPreviewImage] = useState(null)
  
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })

  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Preencher formulário com dados do usuário
  useEffect(() => {
    if (userData) {
      setFormData(prev => ({
        ...prev,
        username: userData.username,
        email: userData.email
      }))
      if (userData.avatar) {
        setPreviewImage(userData.avatar)
      }
    }
  }, [userData])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }

    // Limpar mensagem de sucesso
    if (success) setSuccess('')
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione apenas arquivos de imagem.')
        return
      }

      // Validar tamanho (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('A imagem deve ter no máximo 5MB.')
        return
      }

      setProfileImage(file)
      
      // Criar preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewImage(e.target.result)
      }
      reader.readAsDataURL(file)
      
      // Limpar mensagem de sucesso quando alterar imagem
      if (success) setSuccess('')
    }
  }

  const handleRemoveImage = () => {
    setProfileImage(null)
    setPreviewImage(userData?.avatar || null)
  }

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.username.trim()) {
      newErrors.username = 'Username é obrigatório'
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username deve ter pelo menos 3 caracteres'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido'
    }

    // Se está tentando alterar a senha
    if (formData.newPassword || formData.confirmNewPassword) {
      if (!formData.currentPassword) {
        newErrors.currentPassword = 'Senha atual é obrigatória para alterar a senha'
      }

      if (!formData.newPassword) {
        newErrors.newPassword = 'Nova senha é obrigatória'
      } else if (formData.newPassword.length < 6) {
        newErrors.newPassword = 'Nova senha deve ter pelo menos 6 caracteres'
      }

      if (formData.newPassword !== formData.confirmNewPassword) {
        newErrors.confirmNewPassword = 'Confirmação de senha não confere'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm() || isSubmitting || loading) {
      return
    }

    setIsSubmitting(true)
    setSuccess('')

    try {
      // Preparar dados para envio
      const updatedData = {
        username: formData.username,
        email: formData.email
      }

      // Se está alterando a senha, incluir no update
      if (formData.newPassword) {
        updatedData.password = formData.newPassword
        updatedData.currentPassword = formData.currentPassword
      }

      // Se há uma nova imagem, incluir no update
      if (profileImage) {
        // Converter imagem para base64 para armazenamento local
        const reader = new FileReader()
        reader.onload = (e) => {
          updatedData.avatar = e.target.result
          updateProfile(updatedData)
          setSuccess('Perfil atualizado com sucesso!')
          
          // Limpar campos de senha
          setFormData(prev => ({
            ...prev,
            currentPassword: '',
            newPassword: '',
            confirmNewPassword: ''
          }))

          // Limpar imagem selecionada
          setProfileImage(null)

          // Redirecionar após 2 segundos
          setTimeout(() => {
            router.push('/profile')
          }, 2000)
        }
        reader.readAsDataURL(profileImage)
        return
      }

      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 1500))

      updateProfile(updatedData)
      setSuccess('Perfil atualizado com sucesso!')
      
      // Limpar campos de senha
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      }))

      // Limpar imagem selecionada
      setProfileImage(null)

      // Redirecionar após 2 segundos
      setTimeout(() => {
        router.push('/profile')
      }, 2000)

    } catch (error) {
      setErrors({ general: 'Erro ao atualizar perfil. Tente novamente.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.push('/profile')
  }

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen pt-16 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>
              Carregando...
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
            <Button variant="primary" onClick={() => router.push('/accounts/login')}>
              Fazer Login
            </Button>
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
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center mb-8">
            <button
              onClick={handleCancel}
              className={`mr-4 p-2 rounded-lg transition-all duration-200 ${
                isDarkMode 
                  ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-700' 
                  : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
              }`}
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className={`text-3xl font-bold mb-2 ${
                isDarkMode ? 'text-white' : 'text-slate-800'
              }`}>Editar Perfil</h1>
              <p className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>
                Atualize suas informações pessoais
              </p>
            </div>
          </div>

          {/* Form Card */}
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
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt={userData.username}
                    className="w-16 h-16 rounded-full border-4 border-white shadow-lg mr-4"
                  />
                ) : (
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mr-4 backdrop-blur-sm border-4 border-white shadow-lg">
                    <User className="w-8 h-8 text-white" />
                  </div>
                )}
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">Editar Informações</h2>
                  <p className={`text-sm ${
                    isDarkMode ? 'text-slate-300' : 'text-blue-100'
                  }`}>Mantenha seus dados sempre atualizados</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-8">
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

              {/* General Error */}
              {errors.general && (
                <div className={`mb-6 p-4 rounded-xl border flex items-center ${
                  isDarkMode 
                    ? 'bg-red-900/20 border-red-700 text-red-400' 
                    : 'bg-red-50 border-red-200 text-red-700'
                }`}>
                  <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                  <span className="text-sm">{errors.general}</span>
                </div>
              )}

              <div className="space-y-6">
                {/* Image Upload */}
                <div className="space-y-4">
                  <label className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    Foto de Perfil
                  </label>

                  {/* Preview da imagem atual */}
                  {previewImage && (
                    <div className="flex items-center justify-center mb-4">
                      <div className="relative">
                        <img
                          src={previewImage}
                          alt="Preview"
                          className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                        />
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className={`absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                            isDarkMode 
                              ? 'bg-red-600 hover:bg-red-700 text-white' 
                              : 'bg-red-500 hover:bg-red-600 text-white'
                          }`}
                          title="Remover imagem"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Botões de ação */}
                  <div className="flex gap-3">
                    <label className={`flex-1 flex items-center justify-center py-3 px-4 rounded-xl font-medium transition-all duration-200 cursor-pointer ${
                      isDarkMode
                        ? 'bg-slate-700 text-slate-300 hover:bg-slate-600 border border-slate-600'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                    }`}>
                      <Camera className="w-5 h-5 mr-2" />
                      Escolher Arquivo
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>

                    {profileImage && (
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className={`flex items-center justify-center py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                          isDarkMode
                            ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50 border border-red-700'
                            : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                        }`}
                      >
                        <X className="w-5 h-5 mr-2" />
                        Remover
                      </button>
                    )}
                  </div>
                </div>

                {/* Username */}
                <Input
                  label="Username *"
                  type="text"
                  value={formData.username}
                  onChange={(value) => handleInputChange('username', value)}
                  placeholder="Digite seu username"
                  icon={User}
                  error={errors.username}
                  required
                />

                {/* Email */}
                <Input
                  label="Email *"
                  type="email"
                  value={formData.email}
                  onChange={(value) => handleInputChange('email', value)}
                  placeholder="Digite seu email"
                  icon={Mail}
                  error={errors.email}
                  required
                />

                {/* Divisor */}
                <div className={`border-t pt-6 ${
                  isDarkMode ? 'border-slate-700' : 'border-slate-200'
                }`}>
                  <h3 className={`text-lg font-semibold mb-4 ${
                    isDarkMode ? 'text-white' : 'text-slate-800'
                  }`}>Alterar Senha</h3>
                  <p className={`text-sm mb-6 ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-600'
                  }`}>Deixe em branco se não quiser alterar a senha</p>
                </div>

                {/* Senha Atual */}
                <Input
                  label="Senha Atual"
                  type="password"
                  value={formData.currentPassword}
                  onChange={(value) => handleInputChange('currentPassword', value)}
                  placeholder="Digite sua senha atual"
                  icon={Lock}
                  showPassword={showPasswords.current}
                  onTogglePassword={() => togglePasswordVisibility('current')}
                  error={errors.currentPassword}
                />

                {/* Nova Senha */}
                <Input
                  label="Nova Senha"
                  type="password"
                  value={formData.newPassword}
                  onChange={(value) => handleInputChange('newPassword', value)}
                  placeholder="Digite sua nova senha (mín. 6 caracteres)"
                  icon={Lock}
                  showPassword={showPasswords.new}
                  onTogglePassword={() => togglePasswordVisibility('new')}
                  error={errors.newPassword}
                />

                {/* Confirmar Nova Senha */}
                <Input
                  label="Confirmar Nova Senha"
                  type="password"
                  value={formData.confirmNewPassword}
                  onChange={(value) => handleInputChange('confirmNewPassword', value)}
                  placeholder="Confirme sua nova senha"
                  icon={Lock}
                  showPassword={showPasswords.confirm}
                  onTogglePassword={() => togglePasswordVisibility('confirm')}
                  error={errors.confirmNewPassword}
                />
              </div>

              {/* Buttons */}
              <div className={`flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t ${
                isDarkMode ? 'border-slate-700' : 'border-slate-200'
              }`}>
                <Button 
                  type="submit" 
                  variant="primary" 
                  className="flex-1 flex items-center justify-center group"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span>Salvando...</span>
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
                      Salvar Alterações
                    </>
                  )}
                </Button>
                
                <Button 
                  type="button" 
                  variant="secondary" 
                  onClick={handleCancel}
                  className="flex-1 flex items-center justify-center"
                  disabled={isSubmitting}
                >
                  <X className="w-5 h-5 mr-2" />
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  )
}