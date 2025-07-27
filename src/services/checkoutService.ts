import { auth } from '../firebase';

// Função corrigida e simplificada para obter a URL da API
const getApiUrl = () => {
  const hostname = window.location.hostname;
  const isDevelopment = hostname === 'localhost' || hostname.startsWith('192.168');

  if (isDevelopment) {
    // Em desenvolvimento, o backend está rodando localmente
    return 'http://localhost:8080'; 
  } else {
    // Em produção, usa o domínio do seu site
    return 'https://geeklogg.com'; 
  }
};

// --- Interfaces ---
export interface CheckoutResponse {
  success: boolean;
  init_point?: string;
  preference_id?: string;
  error?: string;
}

// --- Funções Exportadas ---

/**
 * Cria a preferência de pagamento no backend.
 */
export async function createPreference(): Promise<CheckoutResponse> {
  const user = auth.currentUser;
  if (!user) {
    return { success: false, error: 'Usuário não autenticado.' };
  }

  const apiUrl = getApiUrl();
  console.log(`API URL: ${apiUrl}`);

  try {
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
      const errorData = await response.json();
      throw new Error(errorData.error || `Erro ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      init_point: data.init_point,
      preference_id: data.preference_id,
    };
  } catch (error) {
    console.error('Erro ao criar preferência:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }
}

/**
 * Inicia o fluxo de pagamento.
 */
export async function handleCheckout(): Promise<void> {
  try {
    const result = await createPreference();
    
    if (result.success && result.init_point) {
      window.location.href = result.init_point;
    } else {
      throw new Error(result.error || 'Falha ao obter o link de pagamento.');
    }
  } catch (error) {
    console.error('Erro no checkout:', error);
    alert(`Erro ao iniciar pagamento: ${error instanceof Error ? error.message : 'Tente novamente.'}`);
  }
}