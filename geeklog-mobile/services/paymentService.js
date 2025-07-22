// MercadoPago Payment Service for React Native
import { Alert } from 'react-native';

const MERCADO_PAGO_PUBLIC_KEY = process.env.EXPO_PUBLIC_MERCADO_PAGO_PUBLIC_KEY || "your_public_key_here";
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:4242";

class PaymentService {
  constructor() {
    this.initialized = true;
  }

  // Create payment preference
  async createPayment(amount, currency = "BRL", description = "GeekLog Premium") {
    try {
      const response = await fetch(`${API_BASE_URL}/api/create-preference`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency,
          description,
          uid: global.currentUser?.uid,
          email: global.currentUser?.email,
        }),
      });

      const data = await response.json();
      
      if (data.init_point) {
        return {
          success: true,
          checkoutUrl: data.init_point,
          preferenceId: data.preference_id,
        };
      } else {
        throw new Error('Failed to create payment preference');
      }
    } catch (error) {
      console.error('Payment creation error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Process one-time payment
  async processOneTimePayment(amount, currency = "BRL") {
    try {
      const result = await this.createPayment(amount, currency, "GeekLog Premium - Pagamento Único");
      
      if (result.success) {
        // In React Native, you would open the checkout URL in WebView or external browser
        Alert.alert(
          "Redirecionando para Pagamento",
          "Você será redirecionado para o MercadoPago para completar o pagamento.",
          [
            {
              text: "Continuar",
              onPress: () => {
                // Here you would navigate to WebView or open external browser
                console.log('Open checkout URL:', result.checkoutUrl);
              }
            },
            {
              text: "Cancelar",
              style: "cancel"
            }
          ]
        );
        
        return result;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('One-time payment error:', error);
      Alert.alert("Erro no Pagamento", error.message);
      throw error;
    }
  }

  // Process subscription payment
  async processSubscriptionPayment(planType = "premium") {
    try {
      const amount = planType === "premium" ? 19.99 : 9.99;
      const description = `GeekLog ${planType} - Assinatura`;
      
      return await this.processOneTimePayment(amount, "BRL");
    } catch (error) {
      console.error('Subscription payment error:', error);
      Alert.alert("Erro na Assinatura", error.message);
      throw error;
    }
  }

  // Handle card payment (placeholder for future MercadoPago SDK integration)
  async handleCardPayment(paymentData) {
    try {
      // This would integrate with MercadoPago SDK for React Native
      // For now, redirect to web checkout
      return await this.processOneTimePayment(paymentData.amount);
    } catch (error) {
      console.error('Card payment error:', error);
      throw error;
    }
  }

  // Update user premium status
  async updateUserPremium(uid, paymentId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/update-premium`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uid, paymentId }),
      });

      if (response.ok) {
        return { success: true };
      } else {
        throw new Error('Failed to update premium status');
      }
    } catch (error) {
      console.error('Update premium error:', error);
      return { success: false, error: error.message };
    }
  }
}

// Create singleton instance
export const paymentService = new PaymentService();

// Hook for using payment service in components
export const usePaymentService = () => {
  return {
    paymentService,
    isReady: true,
  };
};

// Initialize function (for compatibility)
export const initializePayments = async () => {
  try {
    console.log("✅ MercadoPago payment service initialized");
    return true;
  } catch (error) {
    console.error("❌ MercadoPago initialization failed:", error);
    return false;
  }
};
