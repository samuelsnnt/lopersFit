const BASE_URL = 'http://localhost:3000'

async function login(credentials) {
  const res = await fetch(`${BASE_URL}/accounts/login`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(credentials)
  })
  return res.json()
}

const getStoredData = (key) => {
  if (typeof window === 'undefined') return null
  try {
    return JSON.parse(localStorage.getItem(key) || 'null')
  } catch {
    return null
  }
}

const setStoredData = (key, data) => {
  if (typeof window === 'undefined') return
  localStorage.setItem(key, JSON.stringify(data))
}

const removeStoredData = (key) => {
  if (typeof window === 'undefined') return
  localStorage.removeItem(key)
}

class MockApiClient {
  constructor() {
    this.token = null
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('authToken')
    }
  }

  setToken(token) {
    this.token = token
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token)
    }
  }

  clearToken() {
    this.token = null
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken')
      localStorage.removeItem('userData')
    }
  }

  async delay(ms = 1000) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  generateMockToken(user) {
    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
      exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60)
    }
    return btoa(JSON.stringify(payload))
  }

  validateToken() {
    if (!this.token) return null
    
    try {
      const payload = JSON.parse(atob(this.token))
      if (payload.exp < Math.floor(Date.now() / 1000)) {
        this.clearToken()
        return null
      }
      return {
        id: payload.id,
        username: payload.username,
        email: payload.email,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    } catch {
      this.clearToken()
      return null
    }
  }

  async register(userData) {
    await this.delay(1500)

    if (userData.password !== userData.confirmPassword) {
      return {
        success: false,
        error: 'As senhas não coincidem'
      }
    }

    if (userData.password.length < 6) {
      return {
        success: false,
        error: 'A senha deve ter pelo menos 6 caracteres'
      }
    }

    const existingUsers = getStoredData('registeredUsers') || []
    const userExists = existingUsers.some((user) => 
      user.email === userData.email || user.username === userData.username
    )

    if (userExists) {
      return {
        success: false,
        error: 'Username ou email já está em uso'
      }
    }

    const newUser = {
      id: Date.now().toString(),
      username: userData.username,
      email: userData.email,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    existingUsers.push(newUser)
    setStoredData('registeredUsers', existingUsers)

    const token = this.generateMockToken(newUser)

    return {
      success: true,
      data: {
        user: newUser,
        token
      }
    }
  }

  async login(credentials) {
    await this.delay(1500)

    const registeredUsers = getStoredData('registeredUsers') || []
    
    const user = registeredUsers.find((user) => 
      (user.email === credentials.email && user.username === credentials.username)
    )

    if (!user) {
      return {
        success: false,
        error: 'Username, email ou senha incorretos'
      }
    }

    const token = this.generateMockToken(user)

    return {
      success: true,
      data: {
        user,
        token
      }
    }
  }

  async logout() {
    await this.delay(500)
    this.clearToken()
    return {
      success: true,
      message: 'Logout realizado com sucesso'
    }
  }

  async collectUserData() {
    await this.delay(800)

    const user = this.validateToken()
    if (!user) {
      return {
        success: false,
        error: 'Token inválido ou expirado'
      }
    }

    const userData = getStoredData('userData') || user

    return {
      success: true,
      data: {
        username: userData.username,
        email: userData.email,
        avatar: userData.avatar,
        createdAt: userData.createdAt
      }
    }
  }

  isAuthenticated() {
    return !!this.token && !!this.validateToken()
  }

  getToken() {
    return this.token
  }
}

export const apiClient = new MockApiClient()

export const authAPI = {
  register: (userData) => apiClient.register(userData),
  login: (credentials) => apiClient.login(credentials),
  logout: () => apiClient.logout(),
  collectData: () => apiClient.collectUserData(),
  isAuthenticated: () => apiClient.isAuthenticated(),
  getToken: () => apiClient.getToken(),
}