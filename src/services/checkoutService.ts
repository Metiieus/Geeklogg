import { auth } from '../firebase';

// --- Interfaces ---
export interface CheckoutResponse {
  success: boolean;
  init_point?: string;
  preference_id?: string;
  error?: string;
}

// --- Funções Auxiliares ---

/**
 * Define qual URL de API usar com base no ambiente (desenvolvimento ou produção).
 */
const getApiUrl = (): string => {
  const { hostname } = window.location;
  const isDevelopment = hostname === 'localhost' || hostname.startsWith('192.168');

  if (isDevelopment) {
    return 'http://localhost:8080';
  } else {
    // ✅ Aponta para a sua Cloud Function do Firebase
    return 'https://us-central1-geeklog-26b2c.cloudfunctions.net/api';
  }
};

// --- Funções Principais Exportadas ---

/**
 * Chama o backend para criar uma preferência de pagamento no Mercado Pago.
 */
export async function createPreference(): Promise<CheckoutResponse> {
  const user = auth.currentUser;
  if (!user) {
    console.error("Tentativa de checkout sem usuário logado.");
    return { success: false, error: 'Você precisa estar logado para continuar.' };
  }

  const apiUrl = getApiUrl();
  
  try {
    // --- CORREÇÃO INICIA AQUI ---
    // 1. Obter o token de autenticação do usuário do Firebase.
    const token = await user.getIdToken();
    // --- CORREÇÃO TERMINA AQUI ---

    console.log(`Iniciando criação de preferência na API: ${apiUrl}`);
    const response = await fetch(`${apiUrl}/create-preference`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        // --- CORREÇÃO INICIA AQUI ---
        // 2. Enviar o token no cabeçalho 'Authorization'.
        'Authorization': `Bearer ${token}`,
        // --- CORREÇÃO TERMINA AQUI ---
      },
      body: JSON.stringify({ uid: user.uid, email: user.email }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || `O servidor retornou um erro ${response.status}.`);
    }

    return {
      success: true,
      init_point: data.init_point,
      preference_id: data.preference_id,
    };

  } catch (error) {
    console.error('Falha ao criar preferência de pagamento:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Um erro inesperado ocorreu.',
    };
  }
}

/**
 * Orquestra o processo de checkout completo, redirecionando o usuário.
 */
export async function handleCheckout(): Promise<void> {
  try {
    const result = await createPreference();

    if (result.success && result.init_point) {
      window.location.href = result.init_point;
    } else {
      throw new Error(result.error || 'Não foi possível obter o link de pagamento.');
    }
  } catch (error) {
    console.error('Erro final no fluxo de checkout:', error);
    // Evite usar alert() em produção. Considere usar um componente de notificação (toast).
    alert(`Erro ao iniciar o pagamento: ${error instanceof Error ? error.message : 'Tente novamente mais tarde.'}`);
  }
}

/**
 * Chama o backend para atualizar o status do plano do usuário para Premium.
 */
export async function updateUserPremium(uid: string, preference_id: string): Promise<boolean> {
  if (!uid || !preference_id) {
    console.error("UID ou Preference ID faltando para atualizar o plano.");
    return false;
  }
  
  const apiUrl = getApiUrl();
  const user = auth.currentUser;

  try {
    // É uma boa prática autenticar esta chamada também.
    const token = user ? await user.getIdToken() : null;
    if (!token) {
        throw new Error("Usuário não autenticado para atualizar o plano.");
    }

    const response = await fetch(`${apiUrl}/update-premium`, {
      method: 'POST',
      headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ uid, preference_id }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Erro ${response.status} ao atualizar o plano.`);
    }

    console.log("Plano do usuário atualizado para Premium com sucesso!");
    return true;
    
  } catch (error) {
    console.error('Falha ao atualizar o plano do usuário:', error);
    return false;
  }
}
