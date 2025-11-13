import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, CheckCircle, Sparkles } from 'lucide-react';

const PremiumSuccess: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirecionar para o perfil após 5 segundos
    const timer = setTimeout(() => {
      navigate('/profile');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-800/50 backdrop-blur-xl border-2 border-amber-500/30 rounded-2xl p-8 text-center shadow-2xl shadow-amber-500/20">
        {/* Ícone de sucesso */}
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-full flex items-center justify-center animate-bounce">
          <CheckCircle className="w-12 h-12 text-white" />
        </div>

        {/* Título */}
        <h1 className="text-3xl font-bold text-white mb-4 flex items-center justify-center gap-2">
          <Crown className="w-8 h-8 text-amber-500 fill-current" />
          Bem-vindo ao Premium!
          <Sparkles className="w-6 h-6 text-yellow-400" />
        </h1>

        {/* Mensagem */}
        <p className="text-gray-300 mb-6">
          Sua assinatura foi ativada com sucesso! Agora você tem acesso a todos os
          recursos Premium do GeekLogg.
        </p>

        {/* Features desbloqueadas */}
        <div className="bg-gray-900/50 rounded-lg p-4 mb-6 text-left space-y-2">
          <p className="text-sm font-semibold text-amber-400 mb-2">
            ✨ Recursos Desbloqueados:
          </p>
          <div className="space-y-1 text-sm text-gray-300">
            <p>🧠 Archivius IA - Assistente inteligente</p>
            <p>💡 Recomendações personalizadas</p>
            <p>⭐ Análise de perfil avançada</p>
            <p>👑 Badge Premium exclusiva</p>
            <p>⚡ Suporte prioritário</p>
          </div>
        </div>

        {/* Botões */}
        <div className="space-y-3">
          <button
            onClick={() => navigate('/profile')}
            className="w-full py-3 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-600 hover:via-yellow-600 hover:to-amber-700 text-black font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-amber-500/50"
          >
            Ir para o Perfil
          </button>

          <button
            onClick={() => navigate('/')}
            className="w-full py-3 bg-gray-700/50 hover:bg-gray-700 text-gray-300 font-medium rounded-xl transition-colors"
          >
            Voltar ao Início
          </button>
        </div>

        {/* Redirecionamento automático */}
        <p className="text-xs text-gray-500 mt-6">
          Você será redirecionado automaticamente em 5 segundos...
        </p>
      </div>
    </div>
  );
};

export default PremiumSuccess;
