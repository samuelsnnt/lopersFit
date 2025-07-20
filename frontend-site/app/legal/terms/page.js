'use client'

import { ArrowLeft, FileText, Shield, Users, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import Layout from '@/components/layout/Layout'
import { useTheme } from '@/components/providers/ThemeProvider'
import Button from '@/components/ui/Button'

export default function TermsPage() {
  const { isDarkMode } = useTheme()

  const sections = [
    {
      id: 'acceptance',
      title: '1. Aceitação dos Termos',
      icon: FileText,
      content: `Ao acessar e usar o LopersFit, você concorda em cumprir e estar vinculado a estes Termos de Uso. Se você não concordar com qualquer parte destes termos, não deve usar nosso serviço.`
    },
    {
      id: 'services',
      title: '2. Descrição dos Serviços',
      icon: Shield,
      content: `O LopersFit é uma plataforma de fitness que oferece treinos personalizados, acompanhamento de progresso e uma comunidade ativa. Nossos serviços incluem:
      
      • Criação de planos de treino personalizados
      • Acompanhamento de progresso e métricas
      • Comunidade social para interação entre usuários
      • Recursos educacionais sobre fitness e saúde`
    },
    {
      id: 'user-responsibilities',
      title: '3. Responsabilidades do Usuário',
      icon: Users,
      content: `Como usuário do LopersFit, você concorda em:
      
      • Fornecer informações precisas e atualizadas
      • Manter a confidencialidade de sua conta
      • Usar o serviço apenas para fins legais
      • Respeitar outros usuários da comunidade
      • Não compartilhar conteúdo inadequado ou ofensivo`
    },
    {
      id: 'health-disclaimer',
      title: '4. Aviso de Saúde',
      icon: AlertTriangle,
      content: `IMPORTANTE: Antes de iniciar qualquer programa de exercícios, consulte um médico. O LopersFit não substitui orientação médica profissional. Você assume total responsabilidade por sua saúde e segurança ao usar nossos serviços.`
    },
    {
      id: 'intellectual-property',
      title: '5. Propriedade Intelectual',
      icon: Shield,
      content: `Todo o conteúdo do LopersFit, incluindo textos, gráficos, logos, ícones, imagens e software, é propriedade do LopersFit ou de seus licenciadores e está protegido por leis de direitos autorais.`
    },
    {
      id: 'privacy',
      title: '6. Privacidade',
      icon: Shield,
      content: `Sua privacidade é importante para nós. Nossa coleta e uso de informações pessoais são regidos por nossa Política de Privacidade, que faz parte integrante destes Termos de Uso.`
    },
    {
      id: 'modifications',
      title: '7. Modificações dos Termos',
      icon: FileText,
      content: `Reservamo-nos o direito de modificar estes Termos de Uso a qualquer momento. As alterações entrarão em vigor imediatamente após a publicação. É sua responsabilidade revisar periodicamente estes termos.`
    },
    {
      id: 'termination',
      title: '8. Rescisão',
      icon: AlertTriangle,
      content: `Podemos suspender ou encerrar sua conta a qualquer momento, por qualquer motivo, incluindo violação destes Termos de Uso. Você também pode encerrar sua conta a qualquer momento.`
    },
    {
      id: 'limitation',
      title: '9. Limitação de Responsabilidade',
      icon: Shield,
      content: `O LopersFit não será responsável por quaisquer danos diretos, indiretos, incidentais, especiais ou consequenciais resultantes do uso ou incapacidade de usar nossos serviços.`
    },
    {
      id: 'contact',
      title: '10. Contato',
      icon: Users,
      content: `Se você tiver dúvidas sobre estes Termos de Uso, entre em contato conosco através do email: legal@lopersfit.com`
    }
  ]

  return (
    <Layout>
      <div className={`min-h-screen pt-16 transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-slate-900 to-slate-800' 
          : 'bg-gradient-to-br from-slate-50 to-blue-50'
      }`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-12">
            <Link href="/">
              <Button variant="secondary" className="mb-6 flex items-center">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Voltar ao Início
              </Button>
            </Link>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <FileText className="w-10 h-10 text-white" />
              </div>
              <h1 className={`text-4xl font-bold mb-4 ${
                isDarkMode ? 'text-white' : 'text-slate-800'
              }`}>
                Termos de Uso
              </h1>
              <p className={`text-xl ${
                isDarkMode ? 'text-slate-300' : 'text-slate-600'
              }`}>
                Última atualização: {new Date().toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>

          {/* Content */}
          <div className={`rounded-2xl shadow-xl border overflow-hidden transition-colors duration-300 ${
            isDarkMode 
              ? 'bg-slate-800 border-slate-700' 
              : 'bg-white border-slate-100'
          }`}>
            <div className="p-8 lg:p-12">
              <div className="prose prose-lg max-w-none">
                {sections.map((section) => {
                  const IconComponent = section.icon
                  return (
                    <div key={section.id} className="mb-12 last:mb-0">
                      <div className="flex items-start mb-6">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 flex-shrink-0 ${
                          isDarkMode ? 'bg-blue-900/30' : 'bg-blue-100'
                        }`}>
                          <IconComponent className={`w-6 h-6 ${
                            isDarkMode ? 'text-blue-400' : 'text-blue-600'
                          }`} />
                        </div>
                        <div>
                          <h2 className={`text-2xl font-bold mb-4 ${
                            isDarkMode ? 'text-white' : 'text-slate-800'
                          }`}>
                            {section.title}
                          </h2>
                        </div>
                      </div>
                      <div className={`text-base leading-relaxed whitespace-pre-line ${
                        isDarkMode ? 'text-slate-300' : 'text-slate-700'
                      }`}>
                        {section.content}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 text-center">
            <p className={`text-sm ${
              isDarkMode ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Estes termos são efetivos a partir de {new Date().toLocaleDateString('pt-BR')} e substituem todos os acordos anteriores.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  )
}