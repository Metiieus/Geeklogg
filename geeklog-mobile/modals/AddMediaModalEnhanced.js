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
import MediaSearchBar from "../components/MediaSearchBar";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const AddMediaModalEnhanced = ({ visible, onClose }) => {
  const { addMediaItem } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [activeMode, setActiveMode] = useState("options"); // "options", "search", "manual"
  const [selectedSearchResult, setSelectedSearchResult] = useState(null);
  
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

  const handleSearchResultSelect = (result) => {
    setSelectedSearchResult(result);
    setFormData(prev => ({
      ...prev,
      title: result.title,
      description: result.description || "",
      cover: result.image,
      totalPages: result.pageCount?.toString() || "",
      // Auto-detect type based on result
      type: getTypeFromSearchResult(result),
    }));
    setActiveMode("manual");
  };

  const getTypeFromSearchResult = (result) => {
    if (result.source === "google-books") return "books";
    if (result.originalType === "movie") return "movies";
    if (result.originalType === "tv") return "series";
    return formData.type;
  };

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
        hoursSpent: formData.hoursSpent ? parseFloat(formData.hoursSpent) : null,
        totalPages: formData.totalPages ? parseInt(formData.totalPages) : null,
        currentPage: formData.currentPage ? parseInt(formData.currentPage) : null,
        platform: formData.platform.trim() || null,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag),
        description: formData.description.trim() || null,
        cover: formData.cover,
        // Add external source info if available
        externalSource: selectedSearchResult ? {
          source: selectedSearchResult.source,
          externalId: selectedSearchResult.id,
          isbn: selectedSearchResult.isbn,
          tmdbId: selectedSearchResult.tmdbId,
        } : null,
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
    setActiveMode("options");
    setSelectedSearchResult(null);
  };

  const handleClose = () => {
    if (activeMode === "search" || activeMode === "manual") {
      setActiveMode("options");
    } else {
      handleReset();
      onClose();
    }
  };

  const renderOptionsView = () => (
    <View style={styles.optionsContainer}>
      <View style={styles.optionsHeader}>
        <MaterialIcons name="add-circle-outline" size={48} color="#8b5cf6" />
        <Text style={styles.optionsTitle}>Adicionar Nova Mídia</Text>
        <Text style={styles.optionsSubtitle}>
          Escolha como deseja adicionar sua mídia
        </Text>
      </View>

      <View style={styles.optionsButtons}>
        <TouchableOpacity
          style={[styles.optionButton, styles.primaryOption]}
          onPress={() => setActiveMode("search")}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["#8b5cf6", "#ec4899"]}
            style={styles.optionGradient}
          >
            <MaterialIcons name="search" size={32} color="#ffffff" />
            <Text style={styles.optionTitle}>Buscar Online</Text>
            <Text style={styles.optionDescription}>
              Encontre livros, filmes e séries automaticamente
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.optionButton, styles.secondaryOption]}
          onPress={() => setActiveMode("manual")}
          activeOpacity={0.8}
        >
          <MaterialIcons name="edit" size={32} color="#06b6d4" />
          <Text style={[styles.optionTitle, { color: "#ffffff" }]}>
            Adicionar Manualmente
          </Text>
          <Text style={[styles.optionDescription, { color: "#94a3b8" }]}>
            Preencha os dados da mídia você mesmo
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSearchView = () => (
    <View style={styles.searchContainer}>
      <View style={styles.searchHeader}>
        <MaterialIcons name="search" size={24} color="#8b5cf6" />
        <View style={styles.searchHeaderText}>
          <Text style={styles.searchTitle}>Buscar Mídia Online</Text>
          <Text style={styles.searchSubtitle}>
            Encontre livros, filmes e séries
          </Text>
        </View>
      </View>

      <MediaSearchBar
        selectedType={formData.type}
        onTypeChange={(type) => setFormData(prev => ({ ...prev, type }))}
        onResultSelect={handleSearchResultSelect}
        placeholder="Digite o nome da mídia..."
      />

      <View style={styles.searchFooter}>
        <TouchableOpacity
          style={styles.manualLinkButton}
          onPress={() => setActiveMode("manual")}
        >
          <MaterialIcons name="edit" size={16} color="#8b5cf6" />
          <Text style={styles.manualLinkText}>
            Ou adicione manualmente
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderManualView = () => (
    <ScrollView style={styles.manualContainer} showsVerticalScrollIndicator={false}>
      {/* Show selected search result info */}
      {selectedSearchResult && (
        <View style={styles.selectedResultContainer}>
          <View style={styles.selectedResultHeader}>
            <MaterialIcons name="check-circle" size={20} color="#22c55e" />
            <Text style={styles.selectedResultText}>
              Dados preenchidos da busca online
            </Text>
          </View>
          <TouchableOpacity
            style={styles.clearSelectionButton}
            onPress={() => {
              setSelectedSearchResult(null);
              setFormData(prev => ({ ...prev, title: "", description: "", cover: null, totalPages: "" }));
            }}
          >
            <MaterialIcons name="close" size={16} color="#ef4444" />
            <Text style={styles.clearSelectionText}>Limpar</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Cover Upload */}
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
              <MaterialIcons name="bookmark" size={16} color="#06b6d4" />
            </View>
          </View>
        ) : (
          <View style={styles.coverPlaceholder}>
            <MaterialIcons
              name="add-photo-alternate"
              size={32}
              color="#64748b"
            />
            <Text style={styles.coverPlaceholderText}>Adicionar Capa</Text>
            <View style={styles.bookmarkIcon}>
              <MaterialIcons name="bookmark" size={16} color="#64748b" />
            </View>
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
                size={20}
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
          <Text style={styles.label}>Avaliaç��o (0-10)</Text>
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
          placeholder="RPG, Fantasia (separadas por vírgula)"
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
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <LinearGradient
        colors={["#0f172a", "#1e293b", "#334155"]}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <MaterialIcons 
                name={activeMode === "options" ? "close" : "arrow-back"} 
                size={24} 
                color="#ffffff" 
              />
            </TouchableOpacity>
            <Text style={styles.title}>
              {activeMode === "options" && "Adicionar Mídia"}
              {activeMode === "search" && "Buscar Online"}
              {activeMode === "manual" && "Preencher Dados"}
            </Text>
            {activeMode === "manual" && (
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
            )}
            {(activeMode === "options" || activeMode === "search") && <View style={styles.saveButton} />}
          </View>

          {/* Content */}
          <View style={styles.content}>
            {activeMode === "options" && renderOptionsView()}
            {activeMode === "search" && renderSearchView()}
            {activeMode === "manual" && renderManualView()}
          </View>
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
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(100, 116, 139, 0.2)",
  },
  closeButton: {
    padding: 8,
    width: 40,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    flex: 1,
    textAlign: "center",
  },
  saveButton: {
    padding: 8,
    width: 40,
    alignItems: "center",
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  // Options view styles
  optionsContainer: {
    flex: 1,
    justifyContent: "center",
    paddingVertical: 40,
  },
  optionsHeader: {
    alignItems: "center",
    marginBottom: 40,
  },
  optionsTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginTop: 16,
    marginBottom: 8,
  },
  optionsSubtitle: {
    fontSize: 16,
    color: "#94a3b8",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  optionsButtons: {
    gap: 16,
  },
  optionButton: {
    borderRadius: 16,
    overflow: "hidden",
  },
  primaryOption: {
    shadowColor: "#8b5cf6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  secondaryOption: {
    backgroundColor: "rgba(30, 41, 59, 0.8)",
    borderWidth: 1,
    borderColor: "rgba(100, 116, 139, 0.3)",
    padding: 24,
    alignItems: "center",
  },
  optionGradient: {
    padding: 24,
    alignItems: "center",
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    marginTop: 12,
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
  },
  // Search view styles
  searchContainer: {
    flex: 1,
    paddingTop: 20,
  },
  searchHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 12,
  },
  searchHeaderText: {
    flex: 1,
  },
  searchTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
  },
  searchSubtitle: {
    fontSize: 14,
    color: "#94a3b8",
  },
  searchFooter: {
    alignItems: "center",
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(100, 116, 139, 0.2)",
  },
  manualLinkButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
  },
  manualLinkText: {
    fontSize: 14,
    color: "#8b5cf6",
    fontWeight: "500",
  },
  // Manual view styles (reuse existing styles)
  manualContainer: {
    flex: 1,
    paddingTop: 20,
  },
  selectedResultContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(34, 197, 94, 0.1)",
    borderColor: "rgba(34, 197, 94, 0.3)",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  selectedResultHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  selectedResultText: {
    color: "#22c55e",
    fontSize: 14,
    fontWeight: "500",
  },
  clearSelectionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  clearSelectionText: {
    color: "#ef4444",
    fontSize: 12,
    fontWeight: "500",
  },
  coverContainer: {
    alignSelf: "center",
    marginBottom: 20,
  },
  coverImageContainer: {
    width: 100,
    height: 133,
    borderRadius: 10,
    overflow: "hidden",
    position: "relative",
  },
  coverImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  coverPlaceholder: {
    width: 100,
    height: 133,
    backgroundColor: "rgba(30, 41, 59, 0.8)",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "rgba(100, 116, 139, 0.3)",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  coverPlaceholderText: {
    fontSize: 11,
    color: "#64748b",
    marginTop: 6,
    textAlign: "center",
  },
  bookmarkIcon: {
    position: "absolute",
    top: 6,
    left: 6,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 3,
    padding: 3,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "rgba(30, 41, 59, 0.5)",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: "#ffffff",
    borderWidth: 1,
    borderColor: "rgba(100, 116, 139, 0.3)",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  gridItem: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: (screenWidth - 56) / 3, // Responsive width
    aspectRatio: 1,
    backgroundColor: "rgba(30, 41, 59, 0.5)",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(100, 116, 139, 0.3)",
    gap: 4,
  },
  gridItemActive: {
    backgroundColor: "#06b6d4",
    borderColor: "#06b6d4",
  },
  gridItemText: {
    fontSize: 11,
    color: "#94a3b8",
    textAlign: "center",
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
    width: 12,
  },
  bottomSpacing: {
    height: 40,
  },
});

export default AddMediaModalEnhanced;
