'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '@/lib/api'

const AuthContext = createContext(undefined)

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (authAPI.isAuthenticated()) {
          const response = await authAPI.collectData()
          if (response.success && response.data) {
            setUserData({
              id: '1',
              username: response.data.username,
              email: response.data.email,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              workouts: [
                {
                  id: 1,
                  name: 'Treino de Peito e Tríceps',
                  exercises: ['Supino Reto', 'Supino Inclinado', 'Crucifixo', 'Tríceps Testa'],
                  createdAt: '2024-02-01'
                },
                {
                  id: 2,
                  name: 'Treino de Costas e Bíceps',
                  exercises: ['Puxada Frontal', 'Remada Curvada', 'Rosca Direta', 'Rosca Martelo'],
                  createdAt: '2024-02-05'
                },
                {
                  id: 3,
                  name: 'Treino de Pernas',
                  exercises: ['Agachamento', 'Leg Press', 'Extensora', 'Flexora'],
                  createdAt: '2024-02-10'
                }
              ]
            })
            setIsLoggedIn(true)
          } else {
            authAPI.logout()
          }
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error)
        authAPI.logout()
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (credentials) => {
    try {
      setLoading(true)
      const response = await authAPI.login({
        username: credentials.username,
        email: credentials.email,
        password: credentials.password
      })
      
      if (response.success && response.data) {
        const user = response.data.user
        setUserData({
          ...user,
          workouts: [
            {
              id: 1,
              name: 'Treino de Peito e Tríceps',
              exercises: ['Supino Reto', 'Supino Inclinado', 'Crucifixo', 'Tríceps Testa'],
              createdAt: '2024-02-01'
            },
            {
              id: 2,
              name: 'Treino de Costas e Bíceps',
              exercises: ['Puxada Frontal', 'Remada Curvada', 'Rosca Direta', 'Rosca Martelo'],
              createdAt: '2024-02-05'
            }
          ]
        })
        setIsLoggedIn(true)
        return { success: true }
      } else {
        return { 
          success: false, 
          message: response.error || 'Erro ao fazer login' 
        }
      }
    } catch (error) {
      console.error('Erro no login:', error)
      return { 
        success: false, 
        message: 'Erro de conexão. Tente novamente.' 
      }
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData) => {
    try {
      setLoading(true)
      
      if (userData.password !== userData.confirmPassword) {
        return { 
          success: false, 
          message: 'As senhas não coincidem' 
        }
      }

      if (userData.password.length < 6) {
        return { 
          success: false, 
          message: 'A senha deve ter pelo menos 6 caracteres' 
        }
      }

      const response = await authAPI.register(userData)
      
      if (response.success && response.data) {
        const loginResponse = await authAPI.login({
          username: userData.username,
          email: userData.email,
          password: userData.password
        })

        if (loginResponse.success && loginResponse.data) {
          const user = loginResponse.data.user
          setUserData({
            ...user,
            workouts: []
          })
          setIsLoggedIn(true)
        }

        return { success: true }
      } else {
        return { 
          success: false, 
          message: response.error || 'Erro ao criar conta' 
        }
      }
    } catch (error) {
      console.error('Erro no registro:', error)
      return { 
        success: false, 
        message: 'Erro de conexão. Tente novamente.' 
      }
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      setLoading(true)
      await authAPI.logout()
    } catch (error) {
      console.error('Erro no logout:', error)
    } finally {
      setIsLoggedIn(false)
      setUserData(null)
      setLoading(false)
    }
  }

  const updateProfile = (data) => {
    if (userData) {
      const updatedData = {
        ...userData,
        ...data
      }
      setUserData(updatedData)
      
      // Atualizar localStorage se necessário
      if (typeof window !== 'undefined') {
        localStorage.setItem('userData', JSON.stringify(updatedData))
      }
    }
  }

  return (
    <AuthContext.Provider value={{ 
      isLoggedIn, 
      userData, 
      loading, 
      login, 
      register, 
      logout, 
      updateProfile 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}