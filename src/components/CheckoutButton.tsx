import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { handleCheckout } from '../services/checkoutService';
import { Crown, Loader2 } from 'lucide-react';

interface CheckoutButtonProps {
  className?: string;
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
}

export default function CheckoutButton({ 
  className = "", 
  children,
  variant = 'gradient',
  size = 'md'
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleClick = async () => {
    if (!user) {
      alert('Você precisa estar logado para assinar o premium');
      return;
    }

    if (loading) return;

    setLoading(true);
    
    try {
      await handleCheckout();
    } finally {
      setLoading(false);
    }
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
      disabled={loading || !user}
      className={baseClasses}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Processando...
        </>
      ) : (
        <>
          <Crown className="w-4 h-4" />
          {children || 'Assinar Premium - R$ 19,99'}
        </>
      )}
    </button>
  );
}
