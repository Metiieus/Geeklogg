/**
 * Serviço de integração com Stripe
 * Gerencia checkout, assinaturas e portal de gerenciamento
 */

const FUNCTIONS_URL = import.meta.env.VITE_FUNCTIONS_URL || 'http://localhost:5001/geeklog-diary/us-central1/api';

interface CheckoutSessionResponse {
  sessionId: string;
  url: string;
}

interface CustomerPortalResponse {
  url: string;
}

/**
 * Criar sessão de checkout do Stripe
 */
export async function createStripeCheckout(
  userId: string,
  email: string,
  priceId?: string
): Promise<CheckoutSessionResponse> {
  try {
    const response = await fetch(`${FUNCTIONS_URL}/stripe-create-checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        email,
        priceId,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao criar checkout');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('❌ Erro ao criar checkout Stripe:', error);
    throw error;
  }
}

/**
 * Criar portal de gerenciamento de assinatura
 */
export async function createCustomerPortal(
  userId: string
): Promise<CustomerPortalResponse> {
  try {
    const response = await fetch(`${FUNCTIONS_URL}/stripe-customer-portal`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao criar portal');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('❌ Erro ao criar portal Stripe:', error);
    throw error;
  }
}

/**
 * Redirecionar para checkout do Stripe
 */
export async function redirectToCheckout(
  userId: string,
  email: string,
  priceId?: string
): Promise<void> {
  try {
    const { url } = await createStripeCheckout(userId, email, priceId);
    
    // Redirecionar para o checkout do Stripe
    window.location.href = url;
  } catch (error) {
    console.error('❌ Erro ao redirecionar para checkout:', error);
    throw error;
  }
}

/**
 * Redirecionar para portal de gerenciamento
 */
export async function redirectToCustomerPortal(userId: string): Promise<void> {
  try {
    const { url } = await createCustomerPortal(userId);
    
    // Redirecionar para o portal do Stripe
    window.location.href = url;
  } catch (error) {
    console.error('❌ Erro ao redirecionar para portal:', error);
    throw error;
  }
}
