'use client'

import { ArrowLeft, Shield, Eye, Database, Lock, Users } from 'lucide-react'
import Link from 'next/link'
import Layout from '@/components/layout/Layout'
import { useTheme } from '@/components/providers/ThemeProvider'
import Button from '@/components/ui/Button'

export default function PrivacyPage() {
  const { isDarkMode } = useTheme()

  const sections = [
    {
      id: 'introduction',
      title: '1. Introdução',
      icon: Shield,
      content: `Esta Política de Privacidade descreve como o LopersFit coleta, usa e protege suas informações pessoais. Estamos comprometidos em proteger sua privacidade e garantir a transparência sobre nossas práticas de dados.`
    },
    {
      id: 'information-collected',
      title: '2. Informações que Coletamos',
      icon: Database,
      content: `Coletamos as seguintes informações:

      • Informações de Conta: Nome, email, senha (criptografada)
      • Dados de Perfil: Foto, preferências de treino, objetivos
      • Dados de Atividade: Treinos realizados, progresso, métricas
      • Informações Técnicas: Endereço IP, tipo de dispositivo, navegador
      • Dados de Uso: Como você interage com nossa plataforma`
    },
    {
      id: 'how-we-use',
      title: '3. Como Usamos suas Informações',
      icon: Eye,
      content: `Utilizamos suas informações para:

      • Fornecer e melhorar nossos serviços
      • Personalizar sua experiência de treino
      • Comunicar atualizações e novidades
      • Garantir a segurança da plataforma
      • Analisar o uso para melhorias
      • Cumprir obrigações legais`
    },
    {
      id: 'data-sharing',
      title: '4. Compartilhamento de Dados',
      icon: Users,
      content: `Não vendemos suas informações pessoais. Podemos compartilhar dados apenas:

      • Com seu consentimento explícito
      • Para cumprir obrigações legais
      • Com prestadores de serviços confiáveis (sob contrato de confidencialidade)
      • Em caso de fusão ou aquisição da empresa
      • Para proteger direitos e segurança`
    },
    {
      id: 'data-security',
      title: '5. Segurança dos Dados',
      icon: Lock,
      content: `Implementamos medidas de segurança robustas:

      • Criptografia de dados em trânsito e em repouso
      • Autenticação de dois fatores disponível
      • Monitoramento contínuo de segurança
      • Acesso restrito aos dados pessoais
      • Auditorias regulares de segurança
      • Backup seguro dos dados`
    },
    {
      id: 'your-rights',
      title: '6. Seus Direitos',
      icon: Shield,
      content: `Você tem direito a:

      • Acessar suas informações pessoais
      • Corrigir dados incorretos
      • Solicitar exclusão de sua conta
      • Portabilidade dos seus dados
      • Retirar consentimento a qualquer momento
      • Receber informações sobre violações de dados`
    },
    {
      id: 'cookies',
      title: '7. Cookies e Tecnologias Similares',
      icon: Database,
      content: `Utilizamos cookies para:

      • Manter você logado na plataforma
      • Lembrar suas preferências
      • Analisar o uso da plataforma
      • Personalizar conteúdo
      
      Você pode gerenciar cookies através das configurações do seu navegador.`
    },
    {
      id: 'data-retention',
      title: '8. Retenção de Dados',
      icon: Database,
      content: `Mantemos suas informações pelo tempo necessário para:

      • Fornecer nossos serviços
      • Cumprir obrigações legais
      • Resolver disputas
      
      Dados de contas inativas por mais de 2 anos podem ser excluídos após notificação.`
    },
    {
      id: 'international-transfers',
      title: '9. Transferências Internacionais',
      icon: Shield,
      content: `Seus dados podem ser processados em servidores localizados em diferentes países. Garantimos que todas as transferências atendem aos padrões de proteção de dados aplicáveis.`
    },
    {
      id: 'changes',
      title: '10. Alterações nesta Política',
      icon: Eye,
      content: `Podemos atualizar esta política periodicamente. Notificaremos sobre mudanças significativas por email ou através da plataforma. A data da última atualização está sempre indicada no topo desta página.`
    },
    {
      id: 'contact',
      title: '11. Contato',
      icon: Users,
      content: `Para questões sobre privacidade, entre em contato:

      • Email: privacy@lopersfit.com
      • Endereço: [Endereço da empresa]
      • Telefone: [Número de telefone]
      
      Responderemos a todas as solicitações dentro de 30 dias.`
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
              <div className="w-20 h-20 bg-gradient-to-r from-green-600 to-green-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h1 className={`text-4xl font-bold mb-4 ${
                isDarkMode ? 'text-white' : 'text-slate-800'
              }`}>
                Política de Privacidade
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
                          isDarkMode ? 'bg-green-900/30' : 'bg-green-100'
                        }`}>
                          <IconComponent className={`w-6 h-6 ${
                            isDarkMode ? 'text-green-400' : 'text-green-600'
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
              Esta política é efetiva a partir de {new Date().toLocaleDateString('pt-BR')} e substitui todas as políticas anteriores.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  )
}