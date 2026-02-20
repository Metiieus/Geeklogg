import { View, Text, ScrollView, TouchableOpacity, TextInput, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { MediaTypes } from "../../src/constants";

const STATUS_FILTERS = [
  { id: "all", label: "Todos" },
  { id: "watching", label: "Assistindo" },
  { id: "completed", label: "Concluído" },
  { id: "planning", label: "Planejando" },
  { id: "dropped", label: "Abandonado" },
];

export default function LibraryScreen() {
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  return (
    <SafeAreaView className="flex-1 bg-[#0a0a0f]">
      {/* Header */}
      <View className="px-5 pt-4 pb-3">
        <Text className="text-white text-2xl font-bold">Biblioteca</Text>
        <Text className="text-slate-400 text-sm mt-0.5">Suas mídias favoritas</Text>
      </View>

      {/* Search Bar */}
      <View className="mx-5 mb-3">
        <View className="bg-[#12121a] border border-[#2a2a3e] rounded-xl flex-row items-center px-4 py-3 gap-3">
          <Text className="text-slate-400 text-lg">🔍</Text>
          <TextInput
            className="flex-1 text-white text-base"
            placeholder="Buscar na biblioteca..."
            placeholderTextColor="#64748b"
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      {/* Media Type Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mb-3"
        contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
      >
        <TouchableOpacity
          onPress={() => setSelectedType("all")}
          className={`px-4 py-2 rounded-full border ${
            selectedType === "all"
              ? "bg-violet-600 border-violet-600"
              : "bg-[#12121a] border-[#2a2a3e]"
          }`}
        >
          <Text className={selectedType === "all" ? "text-white font-semibold" : "text-slate-400"}>
            Todos
          </Text>
        </TouchableOpacity>
        {MediaTypes.map((type) => (
          <TouchableOpacity
            key={type.id}
            onPress={() => setSelectedType(type.id)}
            className={`px-4 py-2 rounded-full border flex-row items-center gap-1 ${
              selectedType === type.id
                ? "bg-violet-600 border-violet-600"
                : "bg-[#12121a] border-[#2a2a3e]"
            }`}
          >
            <Text className="text-sm">{type.icon === "film" ? "🎬" : type.icon === "tv" ? "📺" : type.icon === "star" ? "⭐" : type.icon === "game-controller" ? "🎮" : type.icon === "book" ? "📖" : "📕"}</Text>
            <Text className={selectedType === type.id ? "text-white font-semibold" : "text-slate-400"}>
              {type.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Status Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mb-4"
        contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
      >
        {STATUS_FILTERS.map((status) => (
          <TouchableOpacity
            key={status.id}
            onPress={() => setSelectedStatus(status.id)}
            className={`px-3 py-1.5 rounded-lg border ${
              selectedStatus === status.id
                ? "bg-[#2a2a3e] border-violet-500"
                : "bg-transparent border-[#2a2a3e]"
            }`}
          >
            <Text
              className={`text-xs font-medium ${
                selectedStatus === status.id ? "text-violet-400" : "text-slate-500"
              }`}
            >
              {status.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Empty State */}
      <View className="flex-1 items-center justify-center px-10">
        <Text className="text-6xl mb-4">📚</Text>
        <Text className="text-white text-xl font-bold text-center">
          Biblioteca vazia
        </Text>
        <Text className="text-slate-400 text-sm text-center mt-2">
          Adicione filmes, séries, animes, games e livros para construir sua biblioteca geek!
        </Text>
      </View>
    </SafeAreaView>
  );
}
