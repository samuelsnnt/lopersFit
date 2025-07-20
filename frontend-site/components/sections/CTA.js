'use client'

import { ArrowRight, Clock } from 'lucide-react'
import Link from 'next/link'
import { useTheme } from '@/components/providers/ThemeProvider'
import Button from '@/components/ui/Button'

export default function CTA() {
  const { isDarkMode } = useTheme()

  return (
    <section className={`py-20 transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-r from-slate-700 to-slate-800' 
        : 'bg-gradient-to-r from-blue-600 to-blue-700'
    }`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
          Pronto para começar sua transformação?
        </h2>
        <p className={`text-xl mb-8 leading-relaxed ${
          isDarkMode ? 'text-slate-300' : 'text-blue-100'
        }`}>
          Junte-se a milhares de pessoas que já transformaram suas vidas com o LopersFit. 
          Comece hoje mesmo e veja os resultados em poucas semanas.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/accounts/register">
            <Button 
              variant="primary" 
              className={`px-8 py-4 text-lg shadow-xl hover:shadow-2xl ${
                isDarkMode 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-white text-blue-700 hover:bg-blue-50'
              }`}
            >
              Criar Conta Grátis
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
            <Clock className="w-5 h-5 mr-2" />
            Agendar Demo
          </Button>
        </div>
      </div>
    </section>
  )
}