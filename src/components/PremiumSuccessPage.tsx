import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { updateUserPremium } from '../services/checkoutService';
import { CheckCircle, AlertCircle, Loader2, ArrowRight, User, Home } from 'lucide-react';

export default function PremiumSuccessPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const processSuccess = async () => {
      if (!user) {
        setStatus('error');
        setMessage('Usuário não encontrado');
        return;
      }

      try {
        // Extrai parâmetros da URL
        const urlParams = new URLSearchParams(window.location.search);
        const paymentId = urlParams.get('payment_id');
        const status = urlParams.get('status');
        const preferenceId = urlParams.get('preference_id');
        
        console.log('Payment params:', { paymentId, status, preferenceId });
        
        if (status === 'approved' && paymentId) {
          // Atualiza status premium do usuário
          const updateSuccess = await updateUserPremium(user.uid, paymentId);
          
          if (updateSuccess) {
            setStatus('success');
            setMessage('Pagamento confirmado! Seu premium foi ativado com sucesso.');
          } else {
            setStatus('error');
            setMessage('Pagamento aprovado, mas houve erro ao ativar premium. Entre em contato conosco.');
          }
        } else if (status === 'pending') {
          setStatus('error');
          setMessage('Pagamento está pendente. Você receberá confirmação por email quando for aprovado.');
        } else {
          setStatus('error');
          setMessage('Pagamento não foi aprovado ou parâmetros inválidos.');
        }
      } catch (error) {
        console.error('Erro ao processar sucesso:', error);
        setStatus('error');
        setMessage('Erro ao processar pagamento. Tente novamente ou entre em contato conosco.');
      }
    };

    // Delay para melhor UX
    setTimeout(processSuccess, 1500);
  }, [user]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950/60 to-slate-950">
        <div className="text-center bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50">
          <Loader2 className="w-16 h-16 text-blue-500 animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Processando Pagamento</h2>
          <p className="text-slate-300">Aguarde enquanto confirmamos seu pagamento...</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950/60 to-slate-950 p-4">
        <div className="text-center max-w-md bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-red-500/30">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Ops! Algo deu errado</h2>
          <p className="text-slate-300 mb-6">{message}</p>
          
          <div className="space-y-3">
            <button
              onClick={() => navigate('/premium')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              Tentar Novamente
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full bg-slate-600 hover:bg-slate-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              Voltar ao Dashboard
            </button>
          </div>
          
          <div className="mt-6 p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
            <p className="text-sm text-yellow-200">
              Se o problema persistir, entre em contato conosco com o ID do pagamento.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950/60 to-slate-950 p-4">
      <div className="text-center max-w-md bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-green-500/30">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        
        <h2 className="text-3xl font-bold text-white mb-2">🎉 Bem-vindo ao Premium!</h2>
        <p className="text-slate-300 mb-6">{message}</p>
        
        <div className="bg-gradient-to-r from-cyan-500/10 to-pink-500/10 border border-cyan-500/20 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-white mb-2">Recursos Desbloqueados:</h3>
          <ul className="text-sm text-slate-300 space-y-1 text-left">
            <li>✓ Biblioteca ilimitada</li>
            <li>✓ Estatísticas avançadas</li>
            <li>✓ Temas personalizados</li>
            <li>✓ Backup na nuvem</li>
            <li>✓ Suporte prioritário</li>
          </ul>
        </div>
        
        <div className="space-y-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full bg-gradient-to-r from-cyan-500 to-pink-500 hover:from-cyan-600 hover:to-pink-600 text-white font-medium py-3 px-4 rounded-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Explorar Premium
            <ArrowRight className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => navigate('/profile')}
            className="w-full bg-slate-600 hover:bg-slate-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <User className="w-4 h-4" />
            Ver Perfil Premium
          </button>
        </div>
      </div>
    </div>
  );
}
