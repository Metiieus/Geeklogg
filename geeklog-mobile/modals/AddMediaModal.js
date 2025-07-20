import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useAppContext } from "../contexts/AppContext";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const AddMediaModal = ({ visible, onClose }) => {
  const { addMediaItem } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    type: "books",
    status: "planned",
    rating: "",
    hoursSpent: "",
    totalPages: "",
    currentPage: "",
    platform: "",
    tags: "",
    description: "",
    cover: null,
  });

  const mediaTypes = [
    { id: "books", label: "Livros", icon: "library-books" },
    { id: "games", label: "Jogos", icon: "sports-esports" },
    { id: "movies", label: "Filmes", icon: "movie" },
    { id: "series", label: "Séries", icon: "tv" },
    { id: "anime", label: "Anime", icon: "animation" },
  ];

  const statusOptions = [
    { id: "planned", label: "Planejado", color: "#8b5cf6" },
    { id: "in-progress", label: "Em Progresso", color: "#06b6d4" },
    { id: "completed", label: "Concluído", color: "#22c55e" },
    { id: "dropped", label: "Abandonado", color: "#ef4444" },
  ];

  const handleImagePicker = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setFormData((prev) => ({
          ...prev,
          cover: result.assets[0].uri,
        }));
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível selecionar a imagem");
    }
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      Alert.alert("Erro", "Título é obrigatório");
      return;
    }

    setIsLoading(true);
    try {
      const mediaData = {
        title: formData.title.trim(),
        type: formData.type,
        status: formData.status,
        rating: formData.rating ? parseFloat(formData.rating) : null,
        hoursSpent: formData.hoursSpent
          ? parseFloat(formData.hoursSpent)
          : null,
        totalPages: formData.totalPages ? parseInt(formData.totalPages) : null,
        currentPage: formData.currentPage
          ? parseInt(formData.currentPage)
          : null,
        platform: formData.platform.trim() || null,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag),
        description: formData.description.trim() || null,
        cover: formData.cover,
      };

      await addMediaItem(mediaData);
      Alert.alert("Sucesso", "Mídia adicionada com sucesso!");
      handleReset();
      onClose();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível adicionar a mídia");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      title: "",
      type: "books",
      status: "planned",
      rating: "",
      hoursSpent: "",
      totalPages: "",
      currentPage: "",
      platform: "",
      tags: "",
      description: "",
      cover: null,
    });
  };

  return (
        <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <LinearGradient
        colors={["#0f172a", "#1e293b", "#334155"]}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <MaterialIcons name="close" size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.title}>Adicionar Mídia</Text>
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={isLoading}
            style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <MaterialIcons name="check" size={24} color="#ffffff" />
            )}
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Cover Upload - Skoob Style Grid Item */}
          <TouchableOpacity
            onPress={handleImagePicker}
            style={styles.coverContainer}
          >
            {formData.cover ? (
              <View style={styles.coverImageContainer}>
                <Image
                  source={{ uri: formData.cover }}
                  style={styles.coverImage}
                />
                <View style={styles.bookmarkIcon}>
                  <MaterialIcons name="bookmark" size={20} color="#06b6d4" />
                </View>
                <TouchableOpacity style={styles.moreOptions}>
                  <MaterialIcons name="more-horiz" size={20} color="#ffffff" />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.coverPlaceholder}>
                <MaterialIcons
                  name="add-photo-alternate"
                  size={40}
                  color="#64748b"
                />
                <Text style={styles.coverPlaceholderText}>Adicionar Capa</Text>
                <View style={styles.bookmarkIcon}>
                  <MaterialIcons name="bookmark" size={20} color="#64748b" />
                </View>
                <TouchableOpacity style={styles.moreOptions}>
                  <MaterialIcons name="more-horiz" size={20} color="#64748b" />
                </TouchableOpacity>
              </View>
            )}
          </TouchableOpacity>

          {/* Title */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Título *</Text>
            <TextInput
              style={styles.input}
              value={formData.title}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, title: text }))
              }
              placeholder="Digite o título..."
              placeholderTextColor="#64748b"
            />
          </View>

          {/* Media Type Grid */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tipo de Mídia</Text>
            <View style={styles.grid}>
              {mediaTypes.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.gridItem,
                    formData.type === type.id && styles.gridItemActive,
                  ]}
                  onPress={() =>
                    setFormData((prev) => ({ ...prev, type: type.id }))
                  }
                >
                  <MaterialIcons
                    name={type.icon}
                    size={24}
                    color={formData.type === type.id ? "#ffffff" : "#94a3b8"}
                  />
                  <Text
                    style={[
                      styles.gridItemText,
                      formData.type === type.id && styles.gridItemTextActive,
                    ]}
                  >
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Status Grid */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Status</Text>
            <View style={styles.grid}>
              {statusOptions.map((status) => (
                <TouchableOpacity
                  key={status.id}
                  style={[
                    styles.gridItem,
                    formData.status === status.id && styles.gridItemActive,
                    formData.status === status.id && {
                      backgroundColor: status.color,
                    },
                  ]}
                  onPress={() =>
                    setFormData((prev) => ({ ...prev, status: status.id }))
                  }
                >
                  <Text
                    style={[
                      styles.gridItemText,
                      formData.status === status.id &&
                        styles.gridItemTextActive,
                    ]}
                  >
                    {status.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Rating & Hours */}
          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.flex1]}>
              <Text style={styles.label}>Avaliação (0-10)</Text>
              <TextInput
                style={styles.input}
                value={formData.rating}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, rating: text }))
                }
                placeholder="8.5"
                placeholderTextColor="#64748b"
                keyboardType="numeric"
              />
            </View>
            <View style={styles.spacer} />
            <View style={[styles.inputGroup, styles.flex1]}>
              <Text style={styles.label}>Horas Gastas</Text>
              <TextInput
                style={styles.input}
                value={formData.hoursSpent}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, hoursSpent: text }))
                }
                placeholder="25.5"
                placeholderTextColor="#64748b"
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Pages (only for books) */}
          {formData.type === "books" && (
            <View style={styles.row}>
              <View style={[styles.inputGroup, styles.flex1]}>
                <Text style={styles.label}>Páginas Totais</Text>
                <TextInput
                  style={styles.input}
                  value={formData.totalPages}
                  onChangeText={(text) =>
                    setFormData((prev) => ({ ...prev, totalPages: text }))
                  }
                  placeholder="350"
                  placeholderTextColor="#64748b"
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.spacer} />
              <View style={[styles.inputGroup, styles.flex1]}>
                <Text style={styles.label}>Página Atual</Text>
                <TextInput
                  style={styles.input}
                  value={formData.currentPage}
                  onChangeText={(text) =>
                    setFormData((prev) => ({ ...prev, currentPage: text }))
                  }
                  placeholder="42"
                  placeholderTextColor="#64748b"
                  keyboardType="numeric"
                />
              </View>
            </View>
          )}

          {/* Platform */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Plataforma</Text>
            <TextInput
              style={styles.input}
              value={formData.platform}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, platform: text }))
              }
              placeholder="Steam, Netflix, Amazon..."
              placeholderTextColor="#64748b"
            />
          </View>

          {/* Tags */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tags</Text>
            <TextInput
              style={styles.input}
              value={formData.tags}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, tags: text }))
              }
              placeholder="RPG, Fantasia, Multiplayer (separadas por vírgula)"
              placeholderTextColor="#64748b"
            />
          </View>

          {/* Description */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Descrição</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.description}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, description: text }))
              }
              placeholder="Suas anotações sobre esta mídia..."
              placeholderTextColor="#64748b"
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.bottomSpacing} />
                </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
    header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(100, 116, 139, 0.2)",
  },
    closeButton: {
    padding: 12,
    margin: -4,
    minWidth: 44,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
  },
    saveButton: {
    padding: 12,
    margin: -4,
    minWidth: 44,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
    content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
    coverContainer: {
    alignSelf: "center",
    marginVertical: 20,
    minWidth: 44,
    minHeight: 44,
  },
  coverImageContainer: {
    width: 120,
    height: 160,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
  },
  coverImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  coverPlaceholder: {
    width: 120,
    height: 160,
    backgroundColor: "rgba(30, 41, 59, 0.8)",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "rgba(100, 116, 139, 0.3)",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  coverPlaceholderText: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 8,
    textAlign: "center",
  },
  bookmarkIcon: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 4,
    padding: 4,
  },
  moreOptions: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 4,
    padding: 4,
  },
  inputGroup: {
    marginBottom: 20,
  },
    label: {
    fontSize: Math.max(16, screenWidth * 0.04),
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 8,
  },
    input: {
    backgroundColor: "rgba(30, 41, 59, 0.5)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: Math.max(16, screenHeight * 0.02),
    fontSize: Math.max(16, screenWidth * 0.04),
    color: "#ffffff",
    borderWidth: 1,
    borderColor: "rgba(100, 116, 139, 0.3)",
    minHeight: 48,
  },
    textArea: {
    height: Math.max(100, screenHeight * 0.12),
    textAlignVertical: "top",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
    gridItem: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: Math.max((screenWidth - 64) / 3, 100),
    height: Math.max((screenWidth - 64) / 3, 100),
    minWidth: 88,
    minHeight: 88,
    backgroundColor: "rgba(30, 41, 59, 0.5)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(100, 116, 139, 0.3)",
    gap: 6,
    marginBottom: 8,
  },
  gridItemActive: {
    backgroundColor: "#06b6d4",
    borderColor: "#06b6d4",
  },
    gridItemText: {
    fontSize: Math.max(12, screenWidth * 0.03),
    color: "#94a3b8",
    textAlign: "center",
    paddingHorizontal: 4,
  },
  gridItemTextActive: {
    color: "#ffffff",
    fontWeight: "600",
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  flex1: {
    flex: 1,
  },
    spacer: {
    width: Math.max(12, screenWidth * 0.03),
  },
    bottomSpacing: {
    height: Math.max(40, screenHeight * 0.08),
  },
});

export default AddMediaModal;
