import { View, Text, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { router } from "expo-router";
import { MediaTypes, StatusOptions } from "../../src/constants";

const MEDIA_ICONS: Record<string, string> = {
  film: "🎬",
  tv: "📺",
  star: "⭐",
  "game-controller": "🎮",
  book: "📖",
  library: "📕",
};

export default function AddMediaScreen() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [rating, setRating] = useState(0);

  return (
    <SafeAreaView className="flex-1 bg-[#0a0a0f]">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-5 pt-4 pb-2">
          <Text className="text-white text-2xl font-bold">Adicionar mídia</Text>
          <Text className="text-slate-400 text-sm mt-0.5">
            Registre o que você está consumindo
          </Text>
        </View>

        {/* Search from API */}
        <View className="mx-5 mt-4">
          <View className="bg-[#12121a] border border-[#2a2a3e] rounded-xl flex-row items-center px-4 py-3 gap-3">
            <Text className="text-slate-400 text-lg">🔍</Text>
            <TextInput
              className="flex-1 text-white text-base"
              placeholder="Buscar título (TMDb, RAWG, Google Books...)"
              placeholderTextColor="#64748b"
              value={title}
              onChangeText={setTitle}
            />
          </View>
        </View>

        {/* Media Type Selection */}
        <View className="mx-5 mt-6">
          <Text className="text-white font-semibold text-base mb-3">Tipo de mídia</Text>
          <View className="flex-row flex-wrap gap-3">
            {MediaTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                onPress={() => setSelectedType(type.id)}
                className={`flex-row items-center gap-2 px-4 py-3 rounded-xl border ${
                  selectedType === type.id
                    ? "bg-violet-600 border-violet-600"
                    : "bg-[#12121a] border-[#2a2a3e]"
                }`}
              >
                <Text className="text-lg">{MEDIA_ICONS[type.icon]}</Text>
                <Text
                  className={`font-medium ${
                    selectedType === type.id ? "text-white" : "text-slate-300"
                  }`}
                >
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Status Selection */}
        <View className="mx-5 mt-6">
          <Text className="text-white font-semibold text-base mb-3">Status</Text>
          <View className="gap-2">
            {StatusOptions.map((status) => (
              <TouchableOpacity
                key={status.id}
                onPress={() => setSelectedStatus(status.id)}
                className={`flex-row items-center gap-3 px-4 py-3 rounded-xl border ${
                  selectedStatus === status.id
                    ? "bg-[#1a1a2e] border-violet-500"
                    : "bg-[#12121a] border-[#2a2a3e]"
                }`}
              >
                <View
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: status.color }}
                />
                <Text
                  className={`font-medium ${
                    selectedStatus === status.id ? "text-white" : "text-slate-300"
                  }`}
                >
                  {status.label}
                </Text>
                {selectedStatus === status.id && (
                  <Text className="text-violet-400 ml-auto">✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Rating */}
        <View className="mx-5 mt-6">
          <Text className="text-white font-semibold text-base mb-3">Avaliação</Text>
          <View className="flex-row gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setRating(star)}>
                <Text className={`text-3xl ${star <= rating ? "opacity-100" : "opacity-30"}`}>
                  ⭐
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Add Button */}
        <View className="mx-5 mt-8 mb-8">
          <TouchableOpacity
            className={`rounded-2xl py-4 items-center ${
              selectedType && selectedStatus && title
                ? "bg-violet-600"
                : "bg-[#2a2a3e]"
            }`}
            disabled={!selectedType || !selectedStatus || !title}
          >
            <Text
              className={`font-bold text-base ${
                selectedType && selectedStatus && title ? "text-white" : "text-slate-500"
              }`}
            >
              Adicionar à biblioteca
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
