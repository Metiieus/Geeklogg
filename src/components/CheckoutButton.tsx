import { useAuth } from '../context/AuthContext';
import { Crown, ExternalLink } from 'lucide-react';

interface CheckoutButtonProps {
  className?: string;
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
}

// Link direto do MercadoPago para pagamento
const MERCADOPAGO_PAYMENT_LINK = 'https://mpago.li/1iUpG5e';

export default function CheckoutButton({
  className = "",
  children,
  variant = 'gradient',
  size = 'md'
}: CheckoutButtonProps) {
  const { user } = useAuth();

  const handleClick = () => {
    if (!user) {
      alert('Você precisa estar logado para assinar o premium');
      return;
    }

    // Redirecionar diretamente para o link do MercadoPago
    window.open(MERCADOPAGO_PAYMENT_LINK, '_blank');
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-600 hover:bg-blue-700 text-white';
      case 'secondary':
        return 'bg-gray-600 hover:bg-gray-700 text-white';
      case 'gradient':
      default:
        return 'bg-gradient-to-r from-cyan-500 to-pink-500 hover:from-cyan-600 hover:to-pink-600 text-white';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-2 text-sm';
      case 'lg':
        return 'px-8 py-4 text-lg';
      case 'md':
      default:
        return 'px-6 py-3 text-base';
    }
  };

  const baseClasses = `
    inline-flex items-center justify-center gap-2
    font-semibold rounded-lg transition-all duration-200
    disabled:opacity-50 disabled:cursor-not-allowed
    hover:shadow-lg transform hover:scale-105
    ${getSizeClasses()}
    ${getVariantClasses()}
    ${className}
  `;

  return (
    <button
      onClick={handleClick}
      disabled={!user}
      className={baseClasses}
    >
      <Crown className="w-4 h-4" />
      {children || 'Assinar Premium - R$ 19,99'}
      <ExternalLink className="w-3 h-3 opacity-70" />
    </button>
  );
}
