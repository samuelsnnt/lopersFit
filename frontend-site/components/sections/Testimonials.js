'use client'

import { Star } from 'lucide-react'
import { useTheme } from '@/components/providers/ThemeProvider'

export default function Testimonials() {
  const { isDarkMode } = useTheme()

  const testimonials = [
    {
      name: 'Maria Silva',
      role: 'Personal Trainer',
      content: 'O LopersFit revolucionou a forma como acompanho meus alunos. Interface intuitiva e recursos completos.',
      rating: 5
    },
    {
      name: 'João Santos',
      role: 'Atleta Amador',
      content: 'Consegui atingir meus objetivos muito mais rápido com os treinos personalizados do app.',
      rating: 5
    },
    {
      name: 'Ana Costa',
      role: 'Iniciante',
      content: 'Mesmo sendo iniciante, me senti acolhida pela comunidade. Suporte incrível!',
      rating: 5
    }
  ]

  return (
    <section className={`py-20 transition-colors duration-300 ${
      isDarkMode ? 'bg-slate-800' : 'bg-white'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className={`text-3xl lg:text-4xl font-bold mb-4 ${
            isDarkMode ? 'text-white' : 'text-slate-800'
          }`}>
            O que nossos usuários dizem
          </h2>
          <p className={`text-xl ${
            isDarkMode ? 'text-slate-300' : 'text-slate-600'
          }`}>
            Histórias reais de transformação e sucesso
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className={`rounded-2xl p-8 border transition-colors duration-300 ${
              isDarkMode 
                ? 'bg-slate-900 border-slate-700' 
                : 'bg-slate-50 border-slate-100'
            }`}>
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className={`mb-6 italic leading-relaxed ${
                isDarkMode ? 'text-slate-300' : 'text-slate-700'
              }`}>
                "{testimonial.content}"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-semibold">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className={`font-semibold ${
                    isDarkMode ? 'text-white' : 'text-slate-800'
                  }`}>
                    {testimonial.name}
                  </div>
                  <div className={`text-sm ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}