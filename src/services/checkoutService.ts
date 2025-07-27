import { auth } from '../firebase';

// Usa rotas relativas que serão proxy pelo Vite
const getApiUrl = () => {
  // Em desenvolvimento, o Vite fará proxy de /api para localhost:8080
  // Em produção, /api deve estar servido pelo mesmo servidor
  return '';
};

export interface CheckoutResponse {
  success: boolean;
  init_point?: string;
  preference_id?: string;
  error?: string;
}

// Testa se o backend está acessível
async function testBackendConnectivity(url: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

    const response = await fetch(`${url}/health`, {
      method: 'GET',
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    console.log(`Backend não acessível em: ${url}`, error);
    return false;
  }
}

export async function createPreference(): Promise<CheckoutResponse> {
  try {
    const user = auth.currentUser;

    if (!user) {
      throw new Error('Usuário não está logado');
    }

    const apiUrl = getApiUrl();
    console.log('Conectando com backend:', apiUrl);

    const response = await fetch(`${apiUrl}/api/create-preference`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        uid: user.uid,
        email: user.email
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro na resposta:', response.status, errorText);
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
