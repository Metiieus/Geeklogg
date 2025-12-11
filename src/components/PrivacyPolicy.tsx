import React from "react";
import { ArrowLeft, Shield, Eye, UserX, Database, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PrivacyPolicy: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors border border-gray-700/50"
          >
            <ArrowLeft size={20} className="text-gray-300" />
          </button>
          <div className="flex items-center">
            <Shield className="w-8 h-8 text-cyan-400 mr-3" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">
              Política de Privacidade
            </h1>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
          <div className="space-y-8">
            {/* Introdução */}
            <section>
              <div className="flex items-center mb-4">
                <Eye className="w-6 h-6 text-purple-400 mr-3" />
                <h2 className="text-xl font-semibold text-white">
                  1. Introdução
                </h2>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Esta Política de Privacidade descreve como o GeekLog coleta, usa
                e protege suas informações pessoais. Ao usar nosso aplicativo,
                você concorda com as práticas descritas nesta política.
              </p>
            </section>

            {/* Informações Coletadas */}
            <section>
              <div className="flex items-center mb-4">
                <Database className="w-6 h-6 text-blue-400 mr-3" />
                <h2 className="text-xl font-semibold text-white">
                  2. Informações que Coletamos
                </h2>
              </div>
              <div className="space-y-4 text-gray-300">
                <div>
                  <h3 className="font-medium text-white mb-2">
                    2.1 Informações de Conta
                  </h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Nome de usuário e email para criação da conta</li>
                    <li>Foto de perfil (opcional)</li>
                    <li>Preferências de perfil e configurações</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-white mb-2">
                    2.2 Dados de Uso
                  </h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>
                      Mídia adicionada à sua biblioteca (jogos, filmes, livros,
                      etc.)
                    </li>
                    <li>Avaliações e resenhas criadas</li>
                    <li>Marcos e conquistas alcançadas</li>
                    <li>Estatísticas de uso do aplicativo</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-white mb-2">
                    2.3 Dados Técnicos
                  </h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Informações do dispositivo e navegador</li>
                    <li>Endereço IP para funcionalidade do serviço</li>
                    <li>Logs de erro para melhorias do aplicativo</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Como Usamos */}
            <section>
              <div className="flex items-center mb-4">
                <Clock className="w-6 h-6 text-green-400 mr-3" />
                <h2 className="text-xl font-semibold text-white">
                  3. Como Usamos suas Informações
                </h2>
              </div>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>Fornecer e manter a funcionalidade do GeekLog</li>
                <li>Personalizar sua experiência no aplicativo</li>
                <li>Gerar estatísticas e relatórios personalizados</li>
                <li>Melhorar nossos serviços e detectar problemas</li>
                <li>Comunicar atualizações importantes do serviço</li>
                <li>Processar pagamentos (quando aplicável)</li>
              </ul>
            </section>

            {/* Compartilhamento */}
            <section>
              <div className="flex items-center mb-4">
                <UserX className="w-6 h-6 text-red-400 mr-3" />
                <h2 className="text-xl font-semibold text-white">
                  4. Compartilhamento de Dados
                </h2>
              </div>
              <p className="text-gray-300 leading-relaxed mb-4">
                Não vendemos, alugamos ou compartilhamos suas informações
                pessoais com terceiros para fins comerciais. Podemos
                compartilhar dados apenas nas seguintes situações:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-300 ml-4">
                <li>Com seu consentimento explícito</li>
                <li>Para cumprir obrigações legais</li>
                <li>Para proteger nossos direitos e segurança</li>
                <li>Com provedores de serviços confiáveis (Firebase, etc.)</li>
              </ul>
            </section>

            {/* Segurança */}
            <section>
              <div className="flex items-center mb-4">
                <Shield className="w-6 h-6 text-yellow-400 mr-3" />
                <h2 className="text-xl font-semibold text-white">
                  5. Segurança
                </h2>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Implementamos medidas de segurança técnicas e organizacionais
                apropriadas para proteger suas informações contra acesso não
                autorizado, alteração, divulgação ou destruição. Utilizamos
                criptografia SSL/TLS e seguimos as melhores práticas de
                segurança.
              </p>
            </section>

            {/* Seus Direitos */}
            <section>
              <div className="flex items-center mb-4">
                <Eye className="w-6 h-6 text-indigo-400 mr-3" />
                <h2 className="text-xl font-semibold text-white">
                  6. Seus Direitos
                </h2>
              </div>
              <p className="text-gray-300 leading-relaxed mb-4">
                Você tem os seguintes direitos em relação aos seus dados:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-300 ml-4">
                <li>Acessar suas informações pessoais</li>
                <li>Corrigir dados imprecisos</li>
                <li>Solicitar a exclusão de sua conta e dados</li>
                <li>Exportar seus dados em formato legível</li>
                <li>Retirar consentimento a qualquer momento</li>
              </ul>
            </section>

            {/* Retenção de Dados */}
            <section>
              <div className="flex items-center mb-4">
                <Database className="w-6 h-6 text-cyan-400 mr-3" />
                <h2 className="text-xl font-semibold text-white">
                  7. Retenção de Dados
                </h2>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Mantemos suas informações pessoais apenas pelo tempo necessário
                para fornecer nossos serviços ou conforme exigido por lei.
                Quando você excluir sua conta, seus dados serão removidos
                permanentemente dentro de 30 dias.
              </p>
            </section>

            {/* Alterações */}
            <section>
              <div className="flex items-center mb-4">
                <Clock className="w-6 h-6 text-purple-400 mr-3" />
                <h2 className="text-xl font-semibold text-white">
                  8. Alterações nesta Política
                </h2>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Podemos atualizar esta Política de Privacidade periodicamente.
                Notificaremos você sobre mudanças significativas através do
                aplicativo ou por email. O uso continuado do serviço após as
                alterações constitui aceitação da nova política.
              </p>
            </section>

            {/* Contato */}
            <section>
              <div className="flex items-center mb-4">
                <Shield className="w-6 h-6 text-green-400 mr-3" />
                <h2 className="text-xl font-semibold text-white">9. Contato</h2>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Para questões sobre esta Política de Privacidade ou para exercer
                seus direitos, entre em contato conosco em:{" "}
                <span className="text-cyan-400">privacy@geeklog.app</span>
              </p>
            </section>

            {/* Data de atualização */}
            <div className="mt-8 pt-6 border-t border-gray-700/50">
              <p className="text-sm text-gray-400">
                Última atualização: {new Date().toLocaleDateString("pt-BR")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
