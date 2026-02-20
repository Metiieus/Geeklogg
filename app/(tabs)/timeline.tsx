import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";

const MONTHS = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez",
];

export default function TimelineScreen() {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  return (
    <SafeAreaView className="flex-1 bg-[#0a0a0f]">
      {/* Header */}
      <View className="px-5 pt-4 pb-3">
        <Text className="text-white text-2xl font-bold">Timeline</Text>
        <Text className="text-slate-400 text-sm mt-0.5">{currentYear}</Text>
      </View>

      {/* Month Selector */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mb-4"
        contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
      >
        {MONTHS.map((month, index) => (
          <TouchableOpacity
            key={month}
            onPress={() => setSelectedMonth(index)}
            className={`px-4 py-2 rounded-xl border ${
              selectedMonth === index
                ? "bg-violet-600 border-violet-600"
                : "bg-[#12121a] border-[#2a2a3e]"
            }`}
          >
            <Text
              className={`font-medium text-sm ${
                selectedMonth === index ? "text-white" : "text-slate-400"
              }`}
            >
              {month}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Year Progress Bar */}
      <View className="mx-5 mb-5">
        <View className="bg-[#12121a] rounded-2xl p-4 border border-[#2a2a3e]">
          <View className="flex-row justify-between mb-2">
            <Text className="text-slate-400 text-sm">Progresso do ano</Text>
            <Text className="text-violet-400 text-sm font-semibold">
              {Math.round(((currentMonth + 1) / 12) * 100)}%
            </Text>
          </View>
          <View className="h-2 bg-[#2a2a3e] rounded-full overflow-hidden">
            <View
              className="h-full bg-violet-600 rounded-full"
              style={{ width: `${((currentMonth + 1) / 12) * 100}%` }}
            />
          </View>
          <Text className="text-slate-500 text-xs mt-2">
            0 mídias em {currentYear}
          </Text>
        </View>
      </View>

      {/* Empty State */}
      <View className="flex-1 items-center justify-center px-10">
        <Text className="text-6xl mb-4">📅</Text>
        <Text className="text-white text-xl font-bold text-center">
          Nenhuma atividade em {MONTHS[selectedMonth]}
        </Text>
        <Text className="text-slate-400 text-sm text-center mt-2">
          Adicione mídias para ver sua timeline de consumo ao longo do ano.
        </Text>
      </View>
    </SafeAreaView>
  );
}
