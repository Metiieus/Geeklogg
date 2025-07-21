import { auth } from '../firebase';

// Detecta automaticamente o ambiente
const getApiUrl = () => {
  const isDev = window.location.hostname === 'localhost';
  return isDev ? 'http://localhost:4242' : 'https://geeklog-backend.your-domain.com';
};

export interface CheckoutResponse {
  success: boolean;
  init_point?: string;
  preference_id?: string;
  error?: string;
}

export async function createPreference(): Promise<CheckoutResponse> {
  try {
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('Usuário não está logado');
    }

    const apiUrl = getApiUrl();
    
    const response = await fetch(`${apiUrl}/api/create-preference`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uid: user.uid,
        email: user.email,
        title: 'GeekLog Premium',
        description: 'Assinatura Premium do GeekLog',
        price: 19.99,
        currency: 'BRL'
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    
    return {
      success: true,
      init_point: data.init_point,
      preference_id: data.preference_id
    };
    
  } catch (error) {
    console.error('Erro ao criar preferência:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    };
  }
}

export async function handleCheckout(): Promise<void> {
  try {
    const result = await createPreference();
    
    if (result.success && result.init_point) {
      // Redireciona para o checkout do MercadoPago
      window.location.href = result.init_point;
    } else {
      throw new Error(result.error || 'Falha ao criar sessão de pagamento');
    }
    
  } catch (error) {
    console.error('Erro no checkout:', error);
    alert(`Erro ao iniciar pagamento: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
  }
}

export async function updateUserPremium(uid: string, paymentId: string): Promise<boolean> {
  try {
    const apiUrl = getApiUrl();
    
    const response = await fetch(`${apiUrl}/api/update-premium`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ uid, paymentId }),
    });

    return response.ok;
  } catch (error) {
    console.error('Erro ao atualizar premium:', error);
    return false;
  }
}
