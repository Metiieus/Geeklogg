import { useNavigate } from 'react-router-dom';

export default function PremiumFailure() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Pagamento Não Realizado</h2>
        <p className="text-gray-600 mb-6">
          Houve um problema com seu pagamento ou ele foi cancelado. 
          Não se preocupe, você pode tentar novamente quando quiser.
        </p>
        <div className="space-y-3">
          <button
            onClick={() => navigate('/premium')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
          >
            Tentar Novamente
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg"
          >
            Voltar ao Dashboard
          </button>
        </div>
        
        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="text-sm font-medium text-yellow-800 mb-2">Precisa de ajuda?</h3>
          <p className="text-sm text-yellow-700">
            Se você continuar tendo problemas com o pagamento, entre em contato conosco.
          </p>
        </div>
      </div>
    </div>
  );
}
