'use client'

import { useTheme } from '@/components/providers/ThemeProvider'

export default function Stats() {
  const { isDarkMode } = useTheme()

  const stats = [
    { number: '50K+', label: 'Usuários Ativos' },
    { number: '1M+', label: 'Treinos Realizados' },
    { number: '95%', label: 'Taxa de Satisfação' },
    { number: '24/7', label: 'Suporte Disponível' }
  ]

  return (
    <section className={`py-16 transition-colors duration-300 ${
      isDarkMode ? 'bg-slate-800' : 'bg-white'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className={`text-3xl lg:text-4xl font-bold mb-2 ${
                isDarkMode ? 'text-blue-400' : 'text-blue-700'
              }`}>
                {stat.number}
              </div>
              <div className={`font-medium ${
                isDarkMode ? 'text-slate-300' : 'text-slate-600'
              }`}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}