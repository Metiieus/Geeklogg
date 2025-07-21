import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { handleCheckout } from '../services/checkoutService';

interface MercadoPagoButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export default function MercadoPagoButton({
  className = "",
  children = "Assinar Premium - R$ 19,99"
}: MercadoPagoButtonProps) {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handlePayment = async () => {
    if (!user) {
      alert('Você precisa estar logado para assinar o premium');
      return;
    }

    if (loading) return;

    setLoading(true);

    try {
      // Detecta ambiente automaticamente
      const isDev = window.location.hostname === 'localhost';
      const apiUrl = isDev ? 'http://localhost:4242' : window.location.origin;

      const response = await fetch(`${apiUrl}/api/create-preference`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: user.uid,
          email: user.email,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.init_point) {
        window.location.href = data.init_point;
      } else {
        throw new Error('Falha ao criar sessão de pagamento');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Erro ao processar pagamento. Verifique se o servidor está rodando.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading || !user}
      className={`
        inline-flex items-center justify-center px-6 py-3 
        bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400
        text-white font-medium rounded-lg transition-colors duration-200
        disabled:cursor-not-allowed
        ${className}
      `}
    >
      {loading ? (
        <>
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processando...
        </>
      ) : (
        children
      )}
    </button>
  );
}
