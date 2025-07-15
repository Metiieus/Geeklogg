import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { usePaymentService } from "../services/paymentService";

const SubscriptionScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("premium");
  const { paymentService, isReady } = usePaymentService();

  const plans = {
    premium: {
      id: "premium",
      name: "GeekLog Premium",
      price: 9.99,
      currency: "R$",
      period: "mês",
      features: [
        "Backup automático na nuvem",
        "Estatísticas avançadas",
        "Temas personalizados",
        "Suporte prioritário",
        "Sem anúncios",
        "Exportação de dados",
      ],
      popular: true,
    },
  };

  const handleSubscribe = async () => {
    if (!isReady) {
      Alert.alert(
        "Erro",
        "Sistema de pagamento não está pronto. Tente novamente.",
      );
      return;
    }

    setLoading(true);
    try {
      // For demo purposes, show alert about Stripe integration
      Alert.alert(
        "Integração Stripe",
        "A integração com Stripe está configurada!\n\nPara ativar pagamentos reais:\n\n1. Configure suas chaves do Stripe no arquivo .env\n2. Implemente o backend para criar payment intents\n3. Configure webhook para confirmar pagamentos\n\nPor enquanto, esta é uma demonstração da interface.",
        [
          {
            text: "Entendi",
            onPress: () => {
              // Simulate successful subscription
              Alert.alert(
                "Sucesso! 🎉",
                "Bem-vindo ao GeekLog Premium!\n\nTodos os recursos premium foram desbloqueados.",
                [
                  {
                    text: "Continuar",
                    onPress: () => navigation.goBack(),
                  },
                ],
              );
            },
          },
        ],
      );

      // In production, you would call:
      // await paymentService.processSubscriptionPayment(selectedPlan);
    } catch (error) {
      Alert.alert("Erro", "Falha ao processar pagamento. Tente novamente.");
      console.error("Subscription error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCardPayment = () => {
    Alert.alert(
      "Cartão de Crédito",
      "Funcionalidade de pagamento com cartão em desenvolvimento.",
      [{ text: "OK" }],
    );
  };

  const handleApplePay = () => {
    if (Platform.OS !== "ios") {
      Alert.alert("Erro", "Apple Pay disponível apenas no iOS.");
      return;
    }

    Alert.alert("Apple Pay", "Funcionalidade Apple Pay em desenvolvimento.", [
      { text: "OK" },
    ]);
  };

  const handleGooglePay = () => {
    if (Platform.OS !== "android") {
      Alert.alert("Erro", "Google Pay disponível apenas no Android.");
      return;
    }

    Alert.alert("Google Pay", "Funcionalidade Google Pay em desenvolvimento.", [
      { text: "OK" },
    ]);
  };

  const plan = plans[selectedPlan];

  return (
    <LinearGradient
      colors={["#0f172a", "#1e293b", "#334155"]}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Assinatura Premium</Text>
        </View>

        {/* Premium Badge */}
        <View style={styles.premiumBadge}>
          <MaterialIcons name="star" size={32} color="#f59e0b" />
          <Text style={styles.premiumTitle}>Desbloqueie todo o potencial</Text>
          <Text style={styles.premiumSubtitle}>
            Acesse recursos exclusivos do GeekLog
          </Text>
        </View>

        {/* Plan Card */}
        <View style={styles.planCard}>
          {plan.popular && (
            <View style={styles.popularBadge}>
              <Text style={styles.popularText}>MAIS POPULAR</Text>
            </View>
          )}

          <Text style={styles.planName}>{plan.name}</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.currency}>{plan.currency}</Text>
            <Text style={styles.price}>{plan.price}</Text>
            <Text style={styles.period}>/{plan.period}</Text>
          </View>

          <View style={styles.featuresContainer}>
            {plan.features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <MaterialIcons name="check-circle" size={20} color="#10b981" />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Payment Methods */}
        <View style={styles.paymentSection}>
          <Text style={styles.sectionTitle}>Métodos de Pagamento</Text>

          <TouchableOpacity
            style={styles.paymentMethod}
            onPress={handleCardPayment}
          >
            <MaterialIcons name="credit-card" size={24} color="#06b6d4" />
            <Text style={styles.paymentMethodText}>Cartão de Crédito</Text>
            <MaterialIcons name="chevron-right" size={24} color="#64748b" />
          </TouchableOpacity>

          {Platform.OS === "ios" && (
            <TouchableOpacity
              style={styles.paymentMethod}
              onPress={handleApplePay}
            >
              <MaterialIcons name="apple" size={24} color="#06b6d4" />
              <Text style={styles.paymentMethodText}>Apple Pay</Text>
              <MaterialIcons name="chevron-right" size={24} color="#64748b" />
            </TouchableOpacity>
          )}

          {Platform.OS === "android" && (
            <TouchableOpacity
              style={styles.paymentMethod}
              onPress={handleGooglePay}
            >
              <MaterialIcons name="payment" size={24} color="#06b6d4" />
              <Text style={styles.paymentMethodText}>Google Pay</Text>
              <MaterialIcons name="chevron-right" size={24} color="#64748b" />
            </TouchableOpacity>
          )}
        </View>

        {/* Subscribe Button */}
        <TouchableOpacity
          style={[
            styles.subscribeButton,
            loading && styles.subscribeButtonDisabled,
          ]}
          onPress={handleSubscribe}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <>
              <MaterialIcons name="star" size={20} color="#ffffff" />
              <Text style={styles.subscribeButtonText}>Assinar Premium</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Terms */}
        <Text style={styles.termsText}>
          Ao assinar, você concorda com nossos{" "}
          <Text style={styles.linkText}>Termos de Uso</Text> e{" "}
          <Text style={styles.linkText}>Política de Privacidade</Text>.{"\n\n"}
          Pagamento será cobrado na sua conta. A assinatura será renovada
          automaticamente a menos que seja cancelada pelo menos 24 horas antes
          do fim do período atual.
        </Text>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 20,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
  },
  premiumBadge: {
    alignItems: "center",
    paddingVertical: 30,
  },
  premiumTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginTop: 10,
    textAlign: "center",
  },
  premiumSubtitle: {
    fontSize: 16,
    color: "#94a3b8",
    marginTop: 5,
    textAlign: "center",
  },
  planCard: {
    backgroundColor: "rgba(30, 41, 59, 0.5)",
    borderRadius: 16,
    padding: 24,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "rgba(245, 158, 11, 0.3)",
    position: "relative",
  },
  popularBadge: {
    position: "absolute",
    top: -10,
    alignSelf: "center",
    backgroundColor: "#f59e0b",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1f2937",
  },
  planName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 10,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "center",
    marginBottom: 20,
  },
  currency: {
    fontSize: 18,
    color: "#94a3b8",
    marginRight: 2,
  },
  price: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#f59e0b",
  },
  period: {
    fontSize: 16,
    color: "#94a3b8",
    marginLeft: 2,
  },
  featuresContainer: {
    gap: 12,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  featureText: {
    fontSize: 16,
    color: "#ffffff",
    flex: 1,
  },
  paymentSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 16,
  },
  paymentMethod: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(30, 41, 59, 0.5)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(100, 116, 139, 0.2)",
    gap: 12,
  },
  paymentMethodText: {
    flex: 1,
    fontSize: 16,
    color: "#ffffff",
  },
  subscribeButton: {
    backgroundColor: "#f59e0b",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 30,
  },
  subscribeButtonDisabled: {
    opacity: 0.6,
  },
  subscribeButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
  },
  termsText: {
    fontSize: 12,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 40,
  },
  linkText: {
    color: "#06b6d4",
    textDecorationLine: "underline",
  },
});

export default SubscriptionScreen;
