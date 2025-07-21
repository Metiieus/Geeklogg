import { useNavigate } from 'react-router-dom';

export default function PremiumPending() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Pagamento Pendente</h2>
        <p className="text-gray-600 mb-6">
          Seu pagamento está sendo processado. Isso pode levar alguns minutos.
          Você receberá uma confirmação por email quando o pagamento for aprovado.
        </p>
        
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800 mb-2">O que acontece agora?</h3>
          <ul className="text-sm text-blue-700 space-y-1 text-left">
            <li>• Seu pagamento está sendo verificado</li>
            <li>• Você receberá um email de confirmação</li>
            <li>• O premium será ativado automaticamente</li>
          </ul>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
          >
            Voltar ao Dashboard
          </button>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg"
          >
            Verificar Status
          </button>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>Em caso de dúvidas, entre em contato conosco.</p>
        </div>
      </div>
    </div>
  );
}
