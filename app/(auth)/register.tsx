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

export default function RegisterScreen() {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { signUp } = useAuth();
  const { showError, showSuccess } = useToast();

  const handleRegister = async () => {
    if (!displayName.trim() || !email.trim() || !password.trim()) {
      showError("Preencha todos os campos");
      return;
    }
    if (password !== confirmPassword) {
      showError("As senhas não coincidem");
      return;
    }
    if (password.length < 6) {
      showError("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    setLoading(true);
    try {
      await signUp(email.trim(), password, displayName.trim());
      showSuccess("Conta criada! Bem-vindo ao Geeklogg!");
      router.replace("/(tabs)/dashboard");
    } catch (error: any) {
      const msg =
        error.code === "auth/email-already-in-use"
          ? "Este email já está em uso"
          : error.code === "auth/invalid-email"
          ? "Email inválido"
          : "Erro ao criar conta. Tente novamente.";
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
        <View className="flex-1 px-6 pt-16 pb-10">
          {/* Header */}
          <View className="items-center mb-10">
            <View className="w-16 h-16 rounded-2xl bg-violet-600 items-center justify-center mb-3">
              <Text className="text-white text-3xl font-bold">G</Text>
            </View>
            <Text className="text-white text-2xl font-bold">Criar conta</Text>
            <Text className="text-slate-400 text-sm mt-1">
              Junte-se à comunidade geek
            </Text>
          </View>

          {/* Form */}
          <View className="gap-4">
            <View>
              <Text className="text-slate-300 text-sm font-medium mb-2">Nome de usuário</Text>
              <TextInput
                className="bg-[#12121a] border border-[#2a2a3e] rounded-xl px-4 py-4 text-white text-base"
                placeholder="Seu nome ou apelido"
                placeholderTextColor="#64748b"
                value={displayName}
                onChangeText={setDisplayName}
                autoCapitalize="words"
              />
            </View>

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
              <TextInput
                className="bg-[#12121a] border border-[#2a2a3e] rounded-xl px-4 py-4 text-white text-base"
                placeholder="Mínimo 6 caracteres"
                placeholderTextColor="#64748b"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <View>
              <Text className="text-slate-300 text-sm font-medium mb-2">Confirmar senha</Text>
              <TextInput
                className="bg-[#12121a] border border-[#2a2a3e] rounded-xl px-4 py-4 text-white text-base"
                placeholder="Repita a senha"
                placeholderTextColor="#64748b"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </View>

            {/* Register Button */}
            <TouchableOpacity
              onPress={handleRegister}
              disabled={loading}
              className="bg-violet-600 rounded-xl py-4 items-center mt-2 active:bg-violet-700"
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-bold text-base">Criar conta</Text>
              )}
            </TouchableOpacity>

            <Text className="text-slate-500 text-xs text-center">
              Ao criar uma conta, você concorda com nossos{" "}
              <Text className="text-violet-400">Termos de Uso</Text> e{" "}
              <Text className="text-violet-400">Política de Privacidade</Text>
            </Text>
          </View>

          {/* Footer */}
          <View className="flex-row justify-center mt-8">
            <Text className="text-slate-400">Já tem conta? </Text>
            <Link href="/(auth)/login">
              <Text className="text-violet-400 font-semibold">Entrar</Text>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
