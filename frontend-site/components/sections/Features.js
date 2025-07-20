'use client'

import { Target, Users, TrendingUp, Award } from 'lucide-react'
import { useTheme } from '@/components/providers/ThemeProvider'

export default function Features() {
  const { isDarkMode } = useTheme()

  const features = [
    {
      icon: Target,
      title: 'Treinos Personalizados',
      description: 'Planos de treino adaptados aos seus objetivos e nível de condicionamento físico.'
    },
    {
      icon: Users,
      title: 'Comunidade Ativa',
      description: 'Conecte-se com outros atletas, compartilhe conquistas e motive-se mutuamente.'
    },
    {
      icon: TrendingUp,
      title: 'Acompanhamento de Progresso',
      description: 'Monitore sua evolução com gráficos detalhados e métricas precisas.'
    },
    {
      icon: Award,
      title: 'Conquistas e Medalhas',
      description: 'Desbloqueie conquistas e ganhe medalhas conforme atinge seus objetivos.'
    }
  ]

  return (
    <section className={`py-20 transition-colors duration-300 ${
      isDarkMode ? 'bg-slate-900' : 'bg-slate-50'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className={`text-3xl lg:text-4xl font-bold mb-4 ${
            isDarkMode ? 'text-white' : 'text-slate-800'
          }`}>
            Por que escolher o LopersFit?
          </h2>
          <p className={`text-xl max-w-3xl mx-auto ${
            isDarkMode ? 'text-slate-300' : 'text-slate-600'
          }`}>
            Oferecemos uma experiência completa de fitness com tecnologia de ponta 
            e uma comunidade que te apoia em cada passo da jornada.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <div key={index} className={`group rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border ${
                isDarkMode 
                  ? 'bg-slate-800 border-slate-700 hover:border-blue-500' 
                  : 'bg-white border-slate-100 hover:border-blue-200'
              }`}>
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <h3 className={`text-xl font-bold mb-4 ${
                  isDarkMode ? 'text-white' : 'text-slate-800'
                }`}>
                  {feature.title}
                </h3>
                <p className={`leading-relaxed ${
                  isDarkMode ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}