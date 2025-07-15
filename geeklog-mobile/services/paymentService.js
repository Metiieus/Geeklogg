import { initStripe, useStripe } from "@stripe/stripe-react-native";

// Initialize Stripe
const STRIPE_PUBLISHABLE_KEY =
  process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_your_key_here";

// Initialize Stripe (call this in App.js)
export const initializeStripe = async () => {
  try {
    await initStripe({
      publishableKey: STRIPE_PUBLISHABLE_KEY,
      merchantIdentifier: "merchant.com.geeklog.app", // Required for Apple Pay
    });
    console.log("✅ Stripe initialized successfully");
  } catch (error) {
    console.error("❌ Stripe initialization failed:", error);
  }
};

// Payment service class
export class PaymentService {
  constructor() {
    this.stripe = null;
  }

  // Set the stripe instance (called from components that use useStripe)
  setStripe(stripeInstance) {
    this.stripe = stripeInstance;
  }

  // Create payment intent on your backend
  async createPaymentIntent(amount, currency = "brl") {
    try {
      // This should call your backend API
      // For now, we'll simulate the response
      const response = await fetch(
        "https://your-backend.com/create-payment-intent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: amount * 100, // Stripe expects cents
            currency,
            metadata: {
              app: "geeklog-mobile",
              type: "subscription",
            },
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to create payment intent");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error creating payment intent:", error);
      throw error;
    }
  }

  // Process subscription payment
  async processSubscriptionPayment(planType = "premium") {
    if (!this.stripe) {
      throw new Error("Stripe not initialized");
    }

    try {
      // Define subscription plans
      const plans = {
        premium: {
          amount: 9.99,
          currency: "brl",
          name: "GeekLog Premium",
          description: "Acesso a recursos premium por 1 mês",
        },
      };

      const plan = plans[planType];
      if (!plan) {
        throw new Error("Invalid plan type");
      }

      // For demo purposes, we'll show an alert
      // In production, you would:
      // 1. Create payment intent on your backend
      // 2. Confirm payment with Stripe
      // 3. Update user subscription status

      return {
        success: true,
        message: "Pagamento processado com sucesso!",
        plan: plan,
      };
    } catch (error) {
      console.error("Payment processing error:", error);
      throw error;
    }
  }

  // Handle payment with card
  async handleCardPayment(paymentIntentClientSecret, billingDetails) {
    if (!this.stripe) {
      throw new Error("Stripe not initialized");
    }

    try {
      const { error, paymentIntent } = await this.stripe.confirmPayment(
        paymentIntentClientSecret,
        {
          paymentMethodType: "Card",
          billingDetails,
        },
      );

      if (error) {
        console.error("Payment confirmation error:", error);
        throw error;
      }

      return paymentIntent;
    } catch (error) {
      console.error("Card payment error:", error);
      throw error;
    }
  }

  // Handle Apple Pay (iOS only)
  async handleApplePay(paymentIntentClientSecret, merchantName = "GeekLog") {
    if (!this.stripe) {
      throw new Error("Stripe not initialized");
    }

    try {
      const { error } = await this.stripe.confirmApplePayPayment(
        paymentIntentClientSecret,
      );

      if (error) {
        console.error("Apple Pay error:", error);
        throw error;
      }

      return { success: true };
    } catch (error) {
      console.error("Apple Pay error:", error);
      throw error;
    }
  }

  // Handle Google Pay (Android only)
  async handleGooglePay(paymentIntentClientSecret) {
    if (!this.stripe) {
      throw new Error("Stripe not initialized");
    }

    try {
      const { error } = await this.stripe.confirmGooglePayPayment(
        paymentIntentClientSecret,
        {
          testEnv: __DEV__, // Use test environment in development
        },
      );

      if (error) {
        console.error("Google Pay error:", error);
        throw error;
      }

      return { success: true };
    } catch (error) {
      console.error("Google Pay error:", error);
      throw error;
    }
  }
}

// Export singleton instance
export const paymentService = new PaymentService();

// Hook for using payment service in components
export const usePaymentService = () => {
  const stripe = useStripe();

  React.useEffect(() => {
    if (stripe) {
      paymentService.setStripe(stripe);
    }
  }, [stripe]);

  return {
    stripe,
    paymentService,
    isReady: !!stripe,
  };
};
