import React from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircle, ArrowLeft, Crown } from 'lucide-react';

const PremiumCancel: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-800/50 backdrop-blur-xl border-2 border-gray-600/30 rounded-2xl p-8 text-center">
        {/* Ícone de cancelamento */}
        <div className="w-20 h-20 mx-auto mb-6 bg-gray-700/50 rounded-full flex items-center justify-center">
          <XCircle className="w-12 h-12 text-gray-400" />
        </div>

        {/* Título */}
        <h1 className="text-3xl font-bold text-white mb-4">
          Pagamento Cancelado
        </h1>

        {/* Mensagem */}
        <p className="text-gray-300 mb-6">
          Você cancelou o processo de pagamento. Não se preocupe, você pode tentar
          novamente quando quiser!
        </p>

        {/* Benefícios Premium */}
        <div className="bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border border-amber-500/30 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Crown className="w-5 h-5 text-amber-500 fill-current" />
            <p className="text-sm font-semibold text-amber-400">
              Não perca os benefícios Premium:
            </p>
          </div>
          <div className="space-y-1 text-sm text-gray-300">
            <p>🧠 Archivius IA - Assistente inteligente</p>
            <p>💡 Recomendações personalizadas</p>
            <p>⭐ Análise de perfil avançada</p>
          </div>
        </div>

        {/* Botões */}
        <div className="space-y-3">
          <button
            onClick={() => navigate('/profile')}
            className="w-full py-3 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-600 hover:via-yellow-600 hover:to-amber-700 text-black font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-amber-500/50 flex items-center justify-center gap-2"
          >
            <Crown className="w-5 h-5 fill-current" />
            Tentar Novamente
          </button>

          <button
            onClick={() => navigate('/')}
            className="w-full py-3 bg-gray-700/50 hover:bg-gray-700 text-gray-300 font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Início
          </button>
        </div>

        {/* Suporte */}
        <p className="text-xs text-gray-500 mt-6">
          Problemas com o pagamento? Entre em contato com o suporte.
        </p>
      </div>
    </div>
  );
};

export default PremiumCancel;
