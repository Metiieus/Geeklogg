import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "./contexts/AuthContext";
import { AppProvider } from "./contexts/AppContext";
import AppNavigator from "./navigation/AppNavigator";
import { initializePayments } from "./services/paymentService";

export default function App() {
  useEffect(() => {
    // Initialize MercadoPago when app starts
    initializePayments();
  }, []);

  return (
    <AuthProvider>
      <AppProvider>
        <StatusBar style="light" />
        <AppNavigator />
      </AppProvider>
    </AuthProvider>
  );
}
