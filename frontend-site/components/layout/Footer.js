'use client'

import Link from 'next/link'
import { Heart, Github, Linkedin, Mail, Dumbbell } from 'lucide-react'
import { useTheme } from '@/components/providers/ThemeProvider'

export default function Footer() {
  const { isDarkMode } = useTheme()

  const currentYear = new Date().getFullYear()

  const footerLinks = {
    product: [
      { name: 'Recursos', href: '#features' },
      { name: 'Preços', href: '#pricing' },
      { name: 'Demonstração', href: '#demo' },
      { name: 'Suporte', href: '#support' }
    ],
    legal: [
      { name: 'Termos de Uso', href: '/legal/terms' },
      { name: 'Política de Privacidade', href: '/legal/privacy' },
      { name: 'Cookies', href: '/legal/cookies' },
      { name: 'Contato', href: '/contact' }
    ],
    social: [
      { name: 'GitHub', href: 'https://github.com/samuelsantana', icon: Github },
      { name: 'LinkedIn', href: 'https://linkedin.com/in/samuelsantana', icon: Linkedin },
      { name: 'Email', href: 'mailto:samuel@lopersfit.com', icon: Mail }
    ]
  }

  return (
    <footer className={`transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-slate-900 border-slate-700' 
        : 'bg-slate-50 border-slate-200'
    } border-t`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center mr-3">
                <Dumbbell className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                LopersFit
              </span>
            </div>
            <p className={`text-base mb-6 max-w-md leading-relaxed ${
              isDarkMode ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Transforme seu corpo e mente com tecnologia de ponta. 
              Treinos personalizados, comunidade ativa e resultados comprovados.
            </p>
            <div className="flex items-center space-x-4">
              {footerLinks.social.map((social) => {
                const IconComponent = social.icon
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      isDarkMode
                        ? 'text-slate-400 hover:text-blue-400 hover:bg-slate-800'
                        : 'text-slate-500 hover:text-blue-600 hover:bg-white'
                    }`}
                    title={social.name}
                  >
                    <IconComponent className="w-5 h-5" />
                  </a>
                )
              })}
            </div>
          </div>

          <div>
            <h3 className={`text-lg font-semibold mb-4 ${
              isDarkMode ? 'text-white' : 'text-slate-800'
            }`}>
              Produto
            </h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className={`text-base transition-colors duration-200 ${
                      isDarkMode
                        ? 'text-slate-400 hover:text-blue-400'
                        : 'text-slate-600 hover:text-blue-600'
                    }`}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className={`text-lg font-semibold mb-4 ${
              isDarkMode ? 'text-white' : 'text-slate-800'
            }`}>
              Legal
            </h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className={`text-base transition-colors duration-200 ${
                      isDarkMode
                        ? 'text-slate-400 hover:text-blue-400'
                        : 'text-slate-600 hover:text-blue-600'
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={`mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center ${
          isDarkMode ? 'border-slate-700' : 'border-slate-200'
        }`}>
          <div className={`text-base mb-4 md:mb-0 ${
            isDarkMode ? 'text-slate-400' : 'text-slate-600'
          }`}>
            © {currentYear} LopersFit. Todos os direitos reservados.
          </div>
          
          <div className="flex items-center">
            <span className={`text-base mr-2 ${
              isDarkMode ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Desenvolvido com
            </span>
            <Heart className="w-4 h-4 text-red-500 mx-1" />
            <span className={`text-base ml-2 ${
              isDarkMode ? 'text-slate-400' : 'text-slate-600'
            }`}>
              por{' '}
              <a
                href="https://github.com/samuelsantana"
                target="_blank"
                rel="noopener noreferrer"
                className={`font-semibold transition-colors duration-200 ${
                  isDarkMode
                    ? 'text-blue-400 hover:text-blue-300'
                    : 'text-blue-600 hover:text-blue-700'
                }`}
              >
                Samuel Santana
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}