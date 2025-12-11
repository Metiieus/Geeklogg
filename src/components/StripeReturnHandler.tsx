import React, { useEffect, useState } from 'react';
import { Crown, CheckCircle, Sparkles, XCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * Componente que detecta retorno do Stripe e mostra mensagem apropriada
 * Uso: Adicionar no App.tsx para detectar query params
 */
export const StripeReturnHandler: React.FC = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'success' | 'cancel' | null>(null);

  useEffect(() => {
    // Detectar query params da URL
    const params = new URLSearchParams(window.location.search);
    const path = window.location.pathname;

    if (path.includes('/premium/success') || params.get('payment') === 'success') {
      setStatus('success');
      // Limpar URL após 5 segundos
      setTimeout(() => {
        window.history.replaceState({}, '', '/');
        setStatus(null);
        navigate('/profile');
      }, 5000);
    } else if (path.includes('/premium/cancel') || params.get('payment') === 'cancel') {
      setStatus('cancel');
    }
  }, [navigate]);

  if (!status) return null;

  const handleClose = () => {
    window.history.replaceState({}, '', '/');
    setStatus(null);
    navigate('/profile');
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      {status === 'success' ? (
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

          {/* Botão */}
          <button
            onClick={handleClose}
            className="w-full py-3 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-600 hover:via-yellow-600 hover:to-amber-700 text-black font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-amber-500/50"
          >
            Ir para o Perfil
          </button>

          {/* Redirecionamento automático */}
          <p className="text-xs text-gray-500 mt-6">
            Você será redirecionado automaticamente em 5 segundos...
          </p>
        </div>
      ) : (
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
              onClick={handleClose}
              className="w-full py-3 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-600 hover:via-yellow-600 hover:to-amber-700 text-black font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-amber-500/50 flex items-center justify-center gap-2"
            >
              <Crown className="w-5 h-5 fill-current" />
              Tentar Novamente
            </button>

            <button
              onClick={() => {
                window.history.replaceState({}, '', '/');
                setStatus(null);
                navigate('/dashboard');
              }}
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
      )}
    </div>
  );
};
