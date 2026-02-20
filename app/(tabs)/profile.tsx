import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useAuth } from "../../src/context/AuthContext";
import { useToast } from "../../src/context/ToastContext";

interface SettingItemProps {
  icon: string;
  label: string;
  value?: string;
  onPress?: () => void;
  danger?: boolean;
}

function SettingItem({ icon, label, value, onPress, danger }: SettingItemProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center px-4 py-4 border-b border-[#2a2a3e]"
    >
      <Text className="text-xl mr-3">{icon}</Text>
      <Text className={`flex-1 font-medium text-base ${danger ? "text-red-400" : "text-white"}`}>
        {label}
      </Text>
      {value && <Text className="text-slate-400 text-sm mr-2">{value}</Text>}
      {!danger && <Text className="text-slate-600">›</Text>}
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const { user, userProfile, signOut } = useAuth();
  const { showSuccess } = useToast();

  const displayName = userProfile?.displayName || user?.displayName || "Usuário";
  const email = user?.email || "";
  const isPremium = userProfile?.isPremium || false;

  const handleSignOut = () => {
    Alert.alert(
      "Sair da conta",
      "Tem certeza que deseja sair?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sair",
          style: "destructive",
          onPress: async () => {
            await signOut();
            showSuccess("Até logo!");
            router.replace("/(auth)/login");
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0a0a0f]">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-5 pt-4 pb-2">
          <Text className="text-white text-2xl font-bold">Perfil</Text>
        </View>

        {/* Profile Card */}
        <View className="mx-5 mt-4 bg-[#12121a] rounded-2xl p-5 border border-[#2a2a3e]">
          <View className="flex-row items-center gap-4">
            <View className="w-16 h-16 rounded-full bg-violet-600 items-center justify-center">
              <Text className="text-white text-2xl font-bold">
                {displayName.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View className="flex-1">
              <View className="flex-row items-center gap-2">
                <Text className="text-white text-xl font-bold">{displayName}</Text>
                {isPremium && (
                  <View className="bg-amber-500/20 border border-amber-500/50 rounded-full px-2 py-0.5">
                    <Text className="text-amber-400 text-xs font-bold">PRO</Text>
                  </View>
                )}
              </View>
              <Text className="text-slate-400 text-sm mt-0.5">{email}</Text>
            </View>
            <TouchableOpacity className="bg-[#2a2a3e] rounded-xl px-3 py-2">
              <Text className="text-violet-400 text-sm font-medium">Editar</Text>
            </TouchableOpacity>
          </View>

          {/* Stats Row */}
          <View className="flex-row mt-5 pt-4 border-t border-[#2a2a3e]">
            {[
              { label: "Mídias", value: "0" },
              { label: "Concluídos", value: "0" },
              { label: "Reviews", value: "0" },
              { label: "Conquistas", value: "0" },
            ].map((stat, i, arr) => (
              <View
                key={stat.label}
                className={`flex-1 items-center ${i < arr.length - 1 ? "border-r border-[#2a2a3e]" : ""}`}
              >
                <Text className="text-white text-xl font-bold">{stat.value}</Text>
                <Text className="text-slate-400 text-xs mt-0.5">{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Premium Banner */}
        {!isPremium && (
          <TouchableOpacity
            className="mx-5 mt-4 rounded-2xl p-4 border border-amber-500/30 flex-row items-center gap-3"
            style={{ backgroundColor: "#1a1500" }}
          >
            <Text className="text-2xl">👑</Text>
            <View className="flex-1">
              <Text className="text-amber-400 font-bold">Upgrade para Premium</Text>
              <Text className="text-amber-600 text-xs mt-0.5">
                Desbloqueie recursos exclusivos e sem limites
              </Text>
            </View>
            <Text className="text-amber-400">›</Text>
          </TouchableOpacity>
        )}

        {/* Settings Sections */}
        <View className="mx-5 mt-5">
          <Text className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2 px-1">
            Conta
          </Text>
          <View className="bg-[#12121a] rounded-2xl border border-[#2a2a3e] overflow-hidden">
            <SettingItem icon="👤" label="Editar perfil" />
            <SettingItem icon="🔒" label="Segurança" />
            <SettingItem icon="🔔" label="Notificações" />
          </View>
        </View>

        <View className="mx-5 mt-4">
          <Text className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2 px-1">
            App
          </Text>
          <View className="bg-[#12121a] rounded-2xl border border-[#2a2a3e] overflow-hidden">
            <SettingItem icon="🎨" label="Aparência" />
            <SettingItem icon="🌐" label="Idioma" value="Português" />
            <SettingItem icon="📤" label="Exportar dados" />
            <SettingItem icon="⭐" label="Avaliar o app" />
          </View>
        </View>

        <View className="mx-5 mt-4">
          <Text className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2 px-1">
            Suporte
          </Text>
          <View className="bg-[#12121a] rounded-2xl border border-[#2a2a3e] overflow-hidden">
            <SettingItem icon="❓" label="Ajuda e suporte" />
            <SettingItem icon="📜" label="Termos de uso" />
            <SettingItem icon="🔐" label="Política de privacidade" />
          </View>
        </View>

        <View className="mx-5 mt-4 mb-8">
          <View className="bg-[#12121a] rounded-2xl border border-[#2a2a3e] overflow-hidden">
            <SettingItem icon="🚪" label="Sair da conta" onPress={handleSignOut} danger />
          </View>
        </View>

        <Text className="text-center text-slate-600 text-xs mb-8">
          Geeklogg v1.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
