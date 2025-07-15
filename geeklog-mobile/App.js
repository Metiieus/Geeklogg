import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StripeProvider } from "@stripe/stripe-react-native";
import { AuthProvider } from "./contexts/AuthContext";
import { AppProvider } from "./contexts/AppContext";
import AppNavigator from "./navigation/AppNavigator";
import { initializeStripe } from "./services/paymentService";

const STRIPE_PUBLISHABLE_KEY =
  process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_your_key_here";

export default function App() {
  useEffect(() => {
    // Initialize Stripe when app starts
    initializeStripe();
  }, []);

  return (
    <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
      <AuthProvider>
        <AppProvider>
          <StatusBar style="light" />
          <AppNavigator />
        </AppProvider>
      </AuthProvider>
    </StripeProvider>
  );
}
