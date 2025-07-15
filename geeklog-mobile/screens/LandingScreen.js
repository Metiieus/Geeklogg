import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

const LandingScreen = ({ navigation }) => {
  return (
    <LinearGradient
      colors={["#0f172a", "#1e293b", "#334155"]}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logo}>
            <MaterialIcons name="library-books" size={32} color="#06b6d4" />
            <Text style={styles.logoText}>GeekLog</Text>
          </View>
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>
            <Text style={styles.gradientText}>Viva sua jornada geek</Text>
            {"\n"}
            <Text style={styles.whiteText}>com estilo e inteligência</Text>
          </Text>

          <Text style={styles.heroSubtitle}>
            O diário definitivo para gamers, leitores e nerds. Registre suas
            aventuras, descubra novos mundos e deixe nossa IA guiar sua próxima
            missão épica.
          </Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => navigation.navigate("Register")}
            >
              <LinearGradient
                colors={["#06b6d4", "#ec4899"]}
                style={styles.gradientButton}
              >
                <MaterialIcons name="bolt" size={20} color="#ffffff" />
                <Text style={styles.primaryButtonText}>Comece AGORA</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => navigation.navigate("Login")}
            >
              <Text style={styles.secondaryButtonText}>Já tenho conta</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Suas aventuras, organizadas</Text>

          <View style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureCard}>
                <LinearGradient
                  colors={feature.colors}
                  style={styles.featureIcon}
                >
                  <MaterialIcons
                    name={feature.icon}
                    size={24}
                    color="#ffffff"
                  />
                </LinearGradient>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>
                  {feature.description}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* AI Section */}
        <View style={styles.aiSection}>
          <View style={styles.aiHeader}>
            <MaterialIcons name="auto-awesome" size={48} color="#06b6d4" />
            <Text style={styles.aiTitle}>Conheça o Archivius IA</Text>
            <Text style={styles.aiSubtitle}>
              Seu assistente pessoal que entende seus gostos, analisa seu perfil
              e cria missões personalizadas para expandir seus horizontes geek
            </Text>
          </View>
        </View>

        {/* CTA Section */}
        <View style={styles.ctaSection}>
          <Text style={styles.ctaTitle}>Comece sua jornada épica</Text>
          <Text style={styles.ctaSubtitle}>
            Junte-se a milhares de nerds que já transformaram suas experiências
            em aventuras organizadas
          </Text>

          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => navigation.navigate("Register")}
          >
            <LinearGradient
              colors={["#06b6d4", "#ec4899"]}
              style={styles.gradientButton}
            >
              <MaterialIcons name="bolt" size={24} color="#ffffff" />
              <Text style={styles.ctaButtonText}>COMECE AGORA - É GRÁTIS</Text>
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.ctaNote}>
            ⚡ Cadastro em 30 segundos • 🎮 Sem cartão de crédito • 🚀 Comece a
            usar imediatamente
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const features = [
  {
    icon: "library-books",
    title: "Biblioteca Pessoal",
    description: "Organize livros, mangás, quadrinhos e sua lista de leitura",
    colors: ["#06b6d4", "#3b82f6"],
  },
  {
    icon: "sports-esports",
    title: "Gaming Journal",
    description: "Acompanhe jogos, conquistas, tempo de jogo e reviews",
    colors: ["#ec4899", "#8b5cf6"],
  },
  {
    icon: "tv",
    title: "Watchlist",
    description: "Filmes, séries, animes - nunca mais esqueça o que assistir",
    colors: ["#8b5cf6", "#6366f1"],
  },
  {
    icon: "bar-chart",
    title: "Estatísticas",
    description: "Veja seus padrões, evolução e marcos da sua jornada",
    colors: ["#6366f1", "#06b6d4"],
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 50,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  logo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  logoText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#06b6d4",
  },
  heroSection: {
    paddingHorizontal: 20,
    paddingVertical: 60,
    alignItems: "center",
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 40,
  },
  gradientText: {
    color: "#06b6d4",
  },
  whiteText: {
    color: "#ffffff",
  },
  heroSubtitle: {
    fontSize: 16,
    color: "#94a3b8",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 24,
  },
  buttonContainer: {
    width: "100%",
    gap: 16,
  },
  primaryButton: {
    borderRadius: 12,
    overflow: "hidden",
  },
  gradientButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 8,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "#06b6d4",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  secondaryButtonText: {
    color: "#06b6d4",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  featuresSection: {
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#06b6d4",
    textAlign: "center",
    marginBottom: 40,
  },
  featuresGrid: {
    gap: 20,
  },
  featureCard: {
    backgroundColor: "rgba(30, 41, 59, 0.5)",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(100, 116, 139, 0.2)",
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: "#94a3b8",
    lineHeight: 20,
  },
  aiSection: {
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  aiHeader: {
    alignItems: "center",
  },
  aiTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#06b6d4",
    textAlign: "center",
    marginVertical: 20,
  },
  aiSubtitle: {
    fontSize: 16,
    color: "#94a3b8",
    textAlign: "center",
    lineHeight: 24,
  },
  ctaSection: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    alignItems: "center",
  },
  ctaTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#06b6d4",
    textAlign: "center",
    marginBottom: 16,
  },
  ctaSubtitle: {
    fontSize: 16,
    color: "#94a3b8",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 24,
  },
  ctaButton: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 20,
  },
  ctaButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  ctaNote: {
    fontSize: 12,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 18,
  },
});

export default LandingScreen;
