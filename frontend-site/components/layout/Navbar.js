'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X, User, LogIn, UserPlus, Home, Users, Dumbbell, Moon, Sun, Shield } from 'lucide-react'
import { useAuth } from '@/components/providers/AuthProvider'
import { useTheme } from '@/components/providers/ThemeProvider'

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { isLoggedIn, userData, logout, loading } = useAuth()
  const { isDarkMode, toggleDarkMode } = useTheme()

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleLogout = async () => {
    await logout()
    router.push('/')
    setIsMobileMenuOpen(false)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  const navItems = [
    { name: 'Início', path: '/', icon: Home },
    { name: 'Rede Social', path: '/social', icon: Users, protected: true },
    { name: 'Treinos', path: '/workouts', icon: Dumbbell, protected: true },
  ]

  // Adicionar item Admin apenas se for admin
  if (isLoggedIn && userData?.username === 'admin') {
    navItems.push({ name: 'Admin', path: '/admin', icon: Shield, protected: true, adminOnly: true })
  }

  const authItems = isLoggedIn
    ? [{ name: 'Perfil', path: '/profile', icon: User }]
    : [
        { name: 'Login', path: '/accounts/login', icon: LogIn },
        { name: 'Registro', path: '/accounts/register', icon: UserPlus },
      ]

  return (
    <nav className={`shadow-lg border-b sticky top-0 z-50 transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-slate-800 border-slate-700' 
        : 'bg-white border-slate-100'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link 
              href="/"
              className="flex-shrink-0 flex items-center hover:opacity-80 transition-opacity duration-200"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                <Dumbbell className="w-6 h-6 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                LopersFit
              </span>
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-1">
              {navItems.map((item) => {
                if (item.protected && !isLoggedIn) return null
                if (item.adminOnly && userData?.username !== 'admin') return null
                
                const IconComponent = item.icon
                const isActive = pathname === item.path
                return (
                  <Link
                    key={item.name}
                    href={item.path}
                    className={`group inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive 
                        ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400' 
                        : isDarkMode
                          ? 'text-slate-300 hover:text-blue-400 hover:bg-blue-900/30'
                          : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    <IconComponent className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="hidden md:block">
            <div className="ml-4 flex items-center space-x-2">
              {isLoggedIn && (
                <button
                  onClick={toggleDarkMode}
                  className={`p-2 rounded-xl transition-all duration-200 ${
                    isDarkMode
                      ? 'text-yellow-400 hover:bg-slate-700'
                      : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                  title={isDarkMode ? 'Modo Claro' : 'Modo Escuro'}
                >
                  {isDarkMode ? (
                    <Sun className="w-5 h-5" />
                  ) : (
                    <Moon className="w-5 h-5" />
                  )}
                </button>
              )}

              {loading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              ) : (
                authItems.map((item, index) => {
                  const IconComponent = item.icon
                  const isProfile = item.name === 'Perfil'
                  const isLogin = item.name === 'Login'
                  const isActive = pathname === item.path
                  
                  if (isProfile && userData) {
                    return (
                      <div key={item.name} className="relative group">
                        <Link 
                          href={item.path}
                          className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                            isActive 
                              ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400' 
                              : isDarkMode
                                ? 'text-slate-300 hover:text-blue-400 hover:bg-blue-900/30'
                                : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
                          }`}
                        >
                          {userData.avatar ? (
                            <img
                              src={userData.avatar}
                              alt={userData.username}
                              className="w-6 h-6 rounded-full mr-2"
                            />
                          ) : (
                            <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mr-2">
                              <User className="w-3 h-3 text-white" />
                            </div>
                          )}
                          {userData.username}
                        </Link>
                        <div className={`absolute right-0 mt-2 w-48 rounded-xl shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ${
                          isDarkMode 
                            ? 'bg-slate-800 border-slate-700' 
                            : 'bg-white border-slate-100'
                        }`}>
                          <button
                            onClick={handleLogout}
                            className={`w-full text-left px-4 py-2 text-sm rounded-xl transition-colors duration-200 ${
                              isDarkMode
                                ? 'text-slate-300 hover:text-red-400 hover:bg-red-900/30'
                                : 'text-slate-600 hover:text-red-600 hover:bg-red-50'
                            }`}
                          >
                            Sair
                          </button>
                        </div>
                      </div>
                    )
                  }
                  
                  return (
                    <Link
                      key={item.name}
                      href={item.path}
                      className={`group inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                        isLogin
                          ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg'
                          : isDarkMode
                            ? 'text-slate-300 hover:text-blue-400 hover:bg-blue-900/30 border border-slate-600 hover:border-blue-500'
                            : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 hover:border-blue-200'
                      }`}
                    >
                      <IconComponent className={`w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200 ${
                        isLogin ? 'text-white' : ''
                      }`} />
                      {item.name}
                    </Link>
                  )
                })
              )}
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className={`inline-flex items-center justify-center p-2 rounded-xl transition-all duration-200 ${
                isDarkMode
                  ? 'text-slate-300 hover:text-blue-400 hover:bg-blue-900/30'
                  : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className={`md:hidden border-t transition-colors duration-300 ${
          isDarkMode 
            ? 'border-slate-700 bg-slate-800' 
            : 'border-slate-100 bg-white'
        }`}>
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => {
              if (item.protected && !isLoggedIn) return null
              if (item.adminOnly && userData?.username !== 'admin') return null
              
              const IconComponent = item.icon
              const isActive = pathname === item.path
              return (
                <Link
                  key={item.name}
                  href={item.path}
                  onClick={closeMobileMenu}
                  className={`w-full group flex items-center px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                    isActive 
                      ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400' 
                      : isDarkMode
                        ? 'text-slate-300 hover:text-blue-400 hover:bg-blue-900/30'
                        : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <IconComponent className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-200" />
                  {item.name}
                </Link>
              )
            })}
            
            <div className={`pt-4 border-t space-y-1 ${
              isDarkMode ? 'border-slate-700' : 'border-slate-100'
            }`}>
              {isLoggedIn && (
                <button
                  onClick={toggleDarkMode}
                  className={`w-full flex items-center px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                    isDarkMode
                      ? 'text-yellow-400 hover:bg-slate-700'
                      : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  {isDarkMode ? (
                    <Sun className="w-5 h-5 mr-3" />
                  ) : (
                    <Moon className="w-5 h-5 mr-3" />
                  )}
                  {isDarkMode ? 'Modo Claro' : 'Modo Escuro'}
                </button>
              )}

              {loading ? (
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                authItems.map((item) => {
                  const IconComponent = item.icon
                  const isProfile = item.name === 'Perfil'
                  const isLogin = item.name === 'Login'
                  const isActive = pathname === item.path
                  
                  if (isProfile && userData) {
                    return (
                      <div key={item.name} className="space-y-1">
                        <Link
                          href={item.path}
                          onClick={closeMobileMenu}
                          className={`w-full flex items-center px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                            isActive 
                              ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400' 
                              : isDarkMode
                                ? 'text-slate-300 hover:text-blue-400 hover:bg-blue-900/30'
                                : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
                          }`}
                        >
                          {userData.avatar ? (
                            <img
                              src={userData.avatar}
                              alt={userData.username}
                              className="w-6 h-6 rounded-full mr-3"
                            />
                          ) : (
                            <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mr-3">
                              <User className="w-3 h-3 text-white" />
                            </div>
                          )}
                          {userData.username}
                        </Link>
                        <button
                          onClick={handleLogout}
                          className={`w-full flex items-center px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                            isDarkMode
                              ? 'text-slate-300 hover:text-red-400 hover:bg-red-900/30'
                              : 'text-slate-600 hover:text-red-600 hover:bg-red-50'
                          }`}
                        >
                          <LogIn className="w-5 h-5 mr-3 rotate-180" />
                          Sair
                        </button>
                      </div>
                    )
                  }
                  
                  return (
                    <Link
                      key={item.name}
                      href={item.path}
                      onClick={closeMobileMenu}
                      className={`w-full group flex items-center px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                        isLogin
                          ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-md'
                          : isDarkMode
                            ? 'text-slate-300 hover:text-blue-400 hover:bg-blue-900/30 border border-slate-600 hover:border-blue-500'
                            : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 hover:border-blue-200'
                      }`}
                    >
                      <IconComponent className={`w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-200 ${
                        isLogin ? 'text-white' : ''
                      }`} />
                      {item.name}
                    </Link>
                  )
                })
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}