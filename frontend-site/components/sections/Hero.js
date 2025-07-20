'use client'

import { 
  Dumbbell, 
  Users, 
  TrendingUp, 
  Play, 
  ArrowRight,
  Heart
} from 'lucide-react'
import Link from 'next/link'
import { useTheme } from '@/components/providers/ThemeProvider'
import Button from '@/components/ui/Button'

export default function Hero() {
  const { isDarkMode } = useTheme()

  return (
    <section className={`relative overflow-hidden transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900' 
        : 'bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800'
    }`}>
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-white">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              Transforme seu
              <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Corpo e Mente
              </span>
            </h1>
            <p className={`text-xl lg:text-2xl mb-8 leading-relaxed ${
              isDarkMode ? 'text-slate-300' : 'text-blue-100'
            }`}>
              Descubra o poder da tecnologia aplicada ao fitness. Treinos personalizados, 
              comunidade engajada e resultados comprovados.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/accounts/register">
                <Button 
                  variant="primary" 
                  className={`px-8 py-4 text-lg shadow-xl hover:shadow-2xl ${
                    isDarkMode 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'bg-white text-blue-700 hover:bg-blue-50'
                  }`}
                >
                  Começar Agora
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                </Button>
              </Link>
              <Button 
                variant="outline" 
                className={`px-8 py-4 text-lg border-2 ${
                  isDarkMode 
                    ? 'border-slate-400 text-slate-300 hover:bg-slate-700 hover:text-white' 
                    : 'border-white text-white hover:bg-white hover:text-blue-700'
                }`}
              >
                <Play className="w-5 h-5 mr-2" />
                Ver Demonstração
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className={`backdrop-blur-sm rounded-2xl p-8 border transition-colors duration-300 ${
              isDarkMode 
                ? 'bg-slate-800/50 border-slate-600/50' 
                : 'bg-white/10 border-white/20'
            }`}>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-yellow-400 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Dumbbell className="w-8 h-8 text-yellow-800" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">Treinos</h3>
                  <p className={isDarkMode ? 'text-slate-300' : 'text-blue-100'}>Personalizados</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-400 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-green-800" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">Comunidade</h3>
                  <p className={isDarkMode ? 'text-slate-300' : 'text-blue-100'}>Ativa</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-400 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-8 h-8 text-purple-800" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">Progresso</h3>
                  <p className={isDarkMode ? 'text-slate-300' : 'text-blue-100'}>Detalhado</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-400 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-red-800" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">Saúde</h3>
                  <p className={isDarkMode ? 'text-slate-300' : 'text-blue-100'}>Completa</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}