'use client'

import Link from 'next/link'
import { Home, ArrowLeft } from 'lucide-react'
import { useTheme } from '@/components/providers/ThemeProvider'
import Button from '@/components/ui/Button'

export default function NotFound() {
  const { isDarkMode } = useTheme()

  return (
    <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-slate-900 to-slate-800' 
        : 'bg-gradient-to-br from-slate-50 to-blue-50'
    }`}>
      <div className="text-center px-4">
        <div className={`text-9xl font-bold mb-4 ${
          isDarkMode ? 'text-slate-700' : 'text-slate-200'
        }`}>
          404
        </div>
        
        <h1 className={`text-4xl font-bold mb-4 ${
          isDarkMode ? 'text-white' : 'text-slate-800'
        }`}>
          Página não encontrada
        </h1>
        
        <p className={`text-xl mb-8 max-w-md mx-auto ${
          isDarkMode ? 'text-slate-300' : 'text-slate-600'
        }`}>
          Desculpe, a página que você está procurando não existe ou ainda está em desenvolvimento.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button variant="primary" className="flex items-center">
              <Home className="w-5 h-5 mr-2" />
              Voltar ao Início
            </Button>
          </Link>
          
          <Button 
            variant="secondary" 
            onClick={() => window.history.back()}
            className="flex items-center"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Página Anterior
          </Button>
        </div>
        
        <div className="mt-12">
          <p className={`text-sm ${
            isDarkMode ? 'text-slate-500' : 'text-slate-500'
          }`}>
            Se você acredita que isso é um erro, entre em contato conosco.
          </p>
        </div>
      </div>
    </div>
  )
}