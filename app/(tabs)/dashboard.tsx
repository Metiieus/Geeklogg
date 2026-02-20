import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useCallback } from "react";
import { router } from "expo-router";
import { useAuth } from "../../src/context/AuthContext";

export default function DashboardScreen() {
  const { user, userProfile, signOut } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  const displayName = userProfile?.displayName || user?.displayName || "Geek";
  const firstName = displayName.split(" ")[0];

  return (
    <SafeAreaView className="flex-1 bg-[#0a0a0f]">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#7c3aed"
            colors={["#7c3aed"]}
          />
        }
      >
        {/* Header */}
        <View className="px-5 pt-4 pb-2 flex-row items-center justify-between">
          <View>
            <Text className="text-slate-400 text-sm">Bem-vindo de volta,</Text>
            <Text className="text-white text-2xl font-bold">{firstName} 👋</Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/profile")}
            className="w-11 h-11 rounded-full bg-violet-600 items-center justify-center"
          >
            <Text className="text-white font-bold text-lg">
              {firstName.charAt(0).toUpperCase()}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Streak Card */}
        <View className="mx-5 mt-4 bg-gradient-to-r from-violet-900 to-violet-700 rounded-2xl p-5 border border-violet-600/30"
          style={{ backgroundColor: "#2d1b69" }}>
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-violet-300 text-sm font-medium">Sequência atual</Text>
              <View className="flex-row items-baseline gap-1 mt-1">
                <Text className="text-white text-4xl font-bold">0</Text>
                <Text className="text-violet-300 text-lg">dias 🔥</Text>
              </View>
              <Text className="text-violet-400 text-xs mt-1">
                Adicione uma mídia hoje para começar!
              </Text>
            </View>
            <View className="w-16 h-16 rounded-2xl bg-violet-500/30 items-center justify-center">
              <Text className="text-4xl">🔥</Text>
            </View>
          </View>
        </View>

        {/* Quick Stats */}
        <View className="mx-5 mt-4 flex-row gap-3">
          {[
            { label: "Mídias", value: "0", icon: "📊", color: "#7c3aed" },
            { label: "Concluídos", value: "0", icon: "✅", color: "#10b981" },
            { label: "Reviews", value: "0", icon: "⭐", color: "#f59e0b" },
          ].map((stat) => (
            <View
              key={stat.label}
              className="flex-1 bg-[#12121a] rounded-2xl p-4 border border-[#2a2a3e]"
            >
              <Text className="text-2xl mb-1">{stat.icon}</Text>
              <Text className="text-white text-xl font-bold">{stat.value}</Text>
              <Text className="text-slate-400 text-xs">{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View className="mx-5 mt-6">
          <Text className="text-white text-lg font-bold mb-3">Ações rápidas</Text>
          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/add")}
              className="flex-1 bg-violet-600 rounded-2xl py-4 items-center"
            >
              <Text className="text-2xl mb-1">➕</Text>
              <Text className="text-white font-semibold text-sm">Adicionar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/library")}
              className="flex-1 bg-[#12121a] border border-[#2a2a3e] rounded-2xl py-4 items-center"
            >
              <Text className="text-2xl mb-1">📚</Text>
              <Text className="text-white font-semibold text-sm">Biblioteca</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/timeline")}
              className="flex-1 bg-[#12121a] border border-[#2a2a3e] rounded-2xl py-4 items-center"
            >
              <Text className="text-2xl mb-1">📅</Text>
              <Text className="text-white font-semibold text-sm">Timeline</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activity */}
        <View className="mx-5 mt-6 mb-6">
          <Text className="text-white text-lg font-bold mb-3">Atividade recente</Text>
          <View className="bg-[#12121a] rounded-2xl p-6 border border-[#2a2a3e] items-center">
            <Text className="text-4xl mb-3">🎮</Text>
            <Text className="text-white font-semibold text-base">Nenhuma atividade ainda</Text>
            <Text className="text-slate-400 text-sm text-center mt-1">
              Adicione sua primeira mídia para começar a registrar sua jornada geek!
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/add")}
              className="bg-violet-600 rounded-xl px-6 py-3 mt-4"
            >
              <Text className="text-white font-semibold">Adicionar mídia</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
