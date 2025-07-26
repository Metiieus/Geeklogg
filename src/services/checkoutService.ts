import { auth } from '../firebase';

// Detecta automaticamente o ambiente
const getApiUrl = () => {
  const hostname = window.location.hostname;
  const isDev = hostname === 'localhost' || hostname === '127.0.0.1';

  if (isDev) {
    return 'http://localhost:8080';
  } else {
    // Para ambiente hospedado no Builder.io, vamos tentar várias opções
    const currentOrigin = window.location.origin;

    // Se estivermos no domínio do Builder.io, tenta usar a mesma URL mas porta 8080
    if (hostname.includes('fly.dev') || hostname.includes('builder.io')) {
      // Tenta usar HTTP na mesma porta para testar
      return currentOrigin;
    }

    // Fallback para localhost em desenvolvimento
    return 'http://localhost:8080';
  }
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
    console.log('Tentando conectar com backend:', apiUrl);

    // Testa conectividade primeiro
    const isBackendAvailable = await testBackendConnectivity(apiUrl);

    if (!isBackendAvailable) {
      // Tenta localhost como fallback
      const fallbackUrl = 'http://localhost:4242';
      console.log('Tentando fallback:', fallbackUrl);

      const isFallbackAvailable = await testBackendConnectivity(fallbackUrl);

      if (!isFallbackAvailable) {
        throw new Error('Backend não está acessível. Verifique se o servidor está rodando.');
      }

      // Usa o fallback
      const response = await fetch(`${fallbackUrl}/api/create-preference`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
    }

    // Backend principal está disponível
    const response = await fetch(`${apiUrl}/api/create-preference`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
