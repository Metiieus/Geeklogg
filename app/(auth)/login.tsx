import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Link, router } from "expo-router";
import { useAuth } from "../../src/context/AuthContext";
import { useToast } from "../../src/context/ToastContext";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { signIn } = useAuth();
  const { showError, showSuccess } = useToast();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      showError("Preencha todos os campos");
      return;
    }

    setLoading(true);
    try {
      await signIn(email.trim(), password);
      showSuccess("Bem-vindo de volta!");
      router.replace("/(tabs)/dashboard");
    } catch (error: any) {
      const msg =
        error.code === "auth/user-not-found" || error.code === "auth/wrong-password"
          ? "Email ou senha incorretos"
          : error.code === "auth/too-many-requests"
          ? "Muitas tentativas. Tente novamente mais tarde."
          : "Erro ao fazer login. Tente novamente.";
      showError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-[#0a0a0f]"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 px-6 pt-20 pb-10">
          {/* Header */}
          <View className="items-center mb-12">
            <View className="w-20 h-20 rounded-2xl bg-violet-600 items-center justify-center mb-4 shadow-lg">
              <Text className="text-white text-4xl font-bold">G</Text>
            </View>
            <Text className="text-white text-3xl font-bold tracking-tight">Geeklogg</Text>
            <Text className="text-slate-400 text-base mt-2">
              Seu universo geek em um só lugar
            </Text>
          </View>

          {/* Form */}
          <View className="gap-4">
            <View>
              <Text className="text-slate-300 text-sm font-medium mb-2">Email</Text>
              <TextInput
                className="bg-[#12121a] border border-[#2a2a3e] rounded-xl px-4 py-4 text-white text-base"
                placeholder="seu@email.com"
                placeholderTextColor="#64748b"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View>
              <Text className="text-slate-300 text-sm font-medium mb-2">Senha</Text>
              <View className="relative">
                <TextInput
                  className="bg-[#12121a] border border-[#2a2a3e] rounded-xl px-4 py-4 text-white text-base pr-14"
                  placeholder="••••••••"
                  placeholderTextColor="#64748b"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-4"
                >
                  <Text className="text-slate-400 text-sm">
                    {showPassword ? "Ocultar" : "Ver"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity className="items-end">
              <Text className="text-violet-400 text-sm">Esqueceu a senha?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              onPress={handleLogin}
              disabled={loading}
              className="bg-violet-600 rounded-xl py-4 items-center mt-2 active:bg-violet-700"
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-bold text-base">Entrar</Text>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View className="flex-row items-center gap-3 my-2">
              <View className="flex-1 h-px bg-[#2a2a3e]" />
              <Text className="text-slate-500 text-sm">ou</Text>
              <View className="flex-1 h-px bg-[#2a2a3e]" />
            </View>

            {/* Google Button */}
            <TouchableOpacity className="bg-[#12121a] border border-[#2a2a3e] rounded-xl py-4 items-center flex-row justify-center gap-3">
              <Text className="text-2xl">🌐</Text>
              <Text className="text-white font-medium text-base">Continuar com Google</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View className="flex-row justify-center mt-8">
            <Text className="text-slate-400">Não tem conta? </Text>
            <Link href="/(auth)/register">
              <Text className="text-violet-400 font-semibold">Criar conta</Text>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
