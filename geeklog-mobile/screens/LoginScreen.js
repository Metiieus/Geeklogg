import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "../contexts/AuthContext";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erro", "Por favor, preencha todos os campos");
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
    } catch (error) {
      Alert.alert("Erro", "Email ou senha incorretos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={["#0f172a", "#1e293b", "#334155"]}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <MaterialIcons name="arrow-back" size={24} color="#06b6d4" />
            </TouchableOpacity>

            <View style={styles.logo}>
              <MaterialIcons name="library-books" size={32} color="#06b6d4" />
              <Text style={styles.logoText}>GeekLog</Text>
            </View>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            <Text style={styles.title}>Bem-vindo de volta!</Text>
            <Text style={styles.subtitle}>
              Entre na sua conta para continuar sua jornada
            </Text>

            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <MaterialIcons
                  name="email"
                  size={20}
                  color="#64748b"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor="#64748b"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputContainer}>
                <MaterialIcons
                  name="lock"
                  size={20}
                  color="#64748b"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, { paddingRight: 50 }]}
                  placeholder="Senha"
                  placeholderTextColor="#64748b"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <MaterialIcons
                    name={showPassword ? "visibility-off" : "visibility"}
                    size={20}
                    color="#64748b"
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.loginButton}
                onPress={handleLogin}
                disabled={loading}
              >
                <LinearGradient
                  colors={["#06b6d4", "#ec4899"]}
                  style={styles.gradientButton}
                >
                  {loading ? (
                    <MaterialIcons
                      name="hourglass-empty"
                      size={20}
                      color="#ffffff"
                    />
                  ) : (
                    <MaterialIcons name="login" size={20} color="#ffffff" />
                  )}
                  <Text style={styles.loginButtonText}>
                    {loading ? "Entrando..." : "Entrar"}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>ou</Text>
                <View style={styles.dividerLine} />
              </View>

              <TouchableOpacity
                style={styles.registerButton}
                onPress={() => navigation.navigate("Register")}
              >
                <Text style={styles.registerButtonText}>
                  Não tem uma conta?{" "}
                  <Text style={styles.registerButtonLink}>Cadastre-se</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  backButton: {
    marginRight: 20,
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
  formContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#94a3b8",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 24,
  },
  form: {
    gap: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(30, 41, 59, 0.5)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(100, 116, 139, 0.3)",
    position: "relative",
  },
  inputIcon: {
    marginLeft: 16,
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    paddingRight: 16,
    fontSize: 16,
    color: "#ffffff",
  },
  eyeIcon: {
    position: "absolute",
    right: 16,
    padding: 4,
  },
  loginButton: {
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 8,
  },
  gradientButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 8,
  },
  loginButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(100, 116, 139, 0.3)",
  },
  dividerText: {
    color: "#64748b",
    paddingHorizontal: 16,
    fontSize: 14,
  },
  registerButton: {
    alignItems: "center",
  },
  registerButtonText: {
    color: "#94a3b8",
    fontSize: 14,
  },
  registerButtonLink: {
    color: "#06b6d4",
    fontWeight: "600",
  },
});

export default LoginScreen;
