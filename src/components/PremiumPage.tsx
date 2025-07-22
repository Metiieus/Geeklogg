import React from 'react';
import { useAuth } from '../context/AuthContext';
import CheckoutButton from './CheckoutButton';
import { Crown, Check, Star, Zap, Shield, Cloud, Headphones, Download } from 'lucide-react';

const PremiumPage: React.FC = () => {
  const { user, profile } = useAuth();

  const features = [
    {
      icon: <Cloud className="w-6 h-6" />,
      title: "Backup na Nuvem",
      description: "Seus dados sempre seguros e sincronizados"
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "Estatísticas Avançadas",
      description: "Análises detalhadas do seu progresso"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Temas Personalizados",
      description: "Personalize a aparência do seu app"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Sem Anúncios",
      description: "Experiência limpa e sem interrupções"
    },
    {
      icon: <Headphones className="w-6 h-6" />,
      title: "Suporte Prioritário",
      description: "Atendimento exclusivo e mais rápido"
    },
    {
      icon: <Download className="w-6 h-6" />,
      title: "Exportação de Dados",
      description: "Baixe seus dados em diversos formatos"
    }
  ];

  if (profile?.isPremium) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950/60 to-slate-950 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center bg-gradient-to-r from-cyan-500/10 to-pink-500/10 border border-cyan-500/20 rounded-2xl p-8 mb-8">
            <Crown className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-white mb-2">Você é Premium! 🎉</h1>
            <p className="text-slate-300 text-lg">
              Aproveite todos os recursos exclusivos do GeekLog Premium
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
                <div className="text-cyan-400 mb-3">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-300 text-sm">{feature.description}</p>
                <div className="mt-3 text-green-400 text-sm flex items-center gap-1">
                  <Check className="w-4 h-4" />
                  Ativado
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950/60 to-slate-950 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Crown className="w-20 h-20 text-yellow-400 mx-auto mb-6" />
          <h1 className="text-5xl font-bold text-white mb-4">
            GeekLog <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-400">Premium</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Desbloqueie todo o potencial do GeekLog com recursos exclusivos para otimizar sua experiência geek
          </p>
        </div>

        {/* Pricing Card */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-gradient-to-l from-cyan-500 to-pink-500 text-white px-4 py-2 text-sm font-bold rounded-bl-lg">
            MAIS POPULAR
          </div>
          
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Plano Premium</h2>
            <div className="flex items-baseline justify-center gap-2 mb-4">
              <span className="text-5xl font-bold text-white">R$ 19</span>
              <span className="text-xl text-slate-400">,99</span>
              <span className="text-slate-400">/ pagamento único</span>
            </div>
            <p className="text-slate-300">Acesso vitalício a todos os recursos premium</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="text-cyan-400 mt-1">{feature.icon}</div>
                <div>
                  <h3 className="font-semibold text-white">{feature.title}</h3>
                  <p className="text-sm text-slate-300">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            {user ? (
              <CheckoutButton 
                variant="gradient" 
                size="lg"
                className="w-full md:w-auto"
              />
            ) : (
              <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/50">
                <p className="text-slate-300 mb-3">Faça login para assinar o Premium</p>
                <button 
                  onClick={() => window.location.href = '/login'}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Fazer Login
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Additional Benefits */}
        <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/50">
          <h3 className="text-xl font-semibold text-white mb-4 text-center">Por que escolher o Premium?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-green-400" />
              </div>
              <h4 className="font-medium text-white mb-2">Segurança Total</h4>
              <p className="text-sm text-slate-300">Seus dados protegidos com backup automático</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Zap className="w-6 h-6 text-blue-400" />
              </div>
              <h4 className="font-medium text-white mb-2">Recursos Exclusivos</h4>
              <p className="text-sm text-slate-300">Acesso a funcionalidades não disponíveis na versão gratuita</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Headphones className="w-6 h-6 text-purple-400" />
              </div>
              <h4 className="font-medium text-white mb-2">Suporte Premium</h4>
              <p className="text-sm text-slate-300">Atendimento prioritário e suporte técnico especializado</p>
            </div>
          </div>
        </div>

        {/* Demo Section */}
        <div className="mt-12 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            Demonstração do Checkout
          </h3>
          <p className="text-slate-300 text-sm mb-4">
            Clique no botão abaixo para testar o fluxo de pagamento com MercadoPago:
          </p>
          <CheckoutButton variant="primary" size="sm">
            Testar Checkout (R$ 19,99)
          </CheckoutButton>
        </div>
      </div>
    </div>
  );
};

export default PremiumPage;
