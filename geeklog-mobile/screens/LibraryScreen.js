import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { useAppContext } from "../contexts/AppContext";
import AddMediaModalEnhanced from "../modals/AddMediaModalEnhanced";

const LibraryScreen = () => {
  const { mediaItems, deleteMediaItem } = useAppContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [fragmentAnimation] = useState(new Animated.Value(0));

  const filteredItems = mediaItems.filter((item) => {
    const matchesSearch = item.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter =
      selectedFilter === "all" || item.type === selectedFilter;
    return matchesSearch && matchesFilter;
  });

    const filters = [
    { id: "all", label: "Todos", icon: "select-all" },
    { id: "games", label: "Jogos", icon: "sports-esports" },
    { id: "books", label: "Livros", icon: "library-books" },
    { id: "movies", label: "Filmes", icon: "movie" },
    { id: "series", label: "Séries", icon: "tv" },
    { id: "anime", label: "Anime", icon: "animation" },
  ];

  // Animação de fragmentos
  React.useEffect(() => {
    const animateFragments = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(fragmentAnimation, {
            toValue: 1,
            duration: 8000,
            useNativeDriver: true,
          }),
          Animated.timing(fragmentAnimation, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };
    animateFragments();
  }, []);

  const handleDeletePress = (item) => {
    if (!item.id || typeof item.id !== "string" || item.id.trim() === "") {
      Alert.alert('Erro', 'ID do item é inválido. Não é possível excluir este item.');
      return;
    }
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (itemToDelete && itemToDelete.id && typeof itemToDelete.id === "string" && itemToDelete.id.trim() !== "") {
      try {
        await deleteMediaItem(itemToDelete.id, itemToDelete.type);
        setShowDeleteModal(false);
        setItemToDelete(null);
      } catch (error) {
        console.error('Erro ao excluir item:', error);
        Alert.alert('Erro', 'Não foi possível excluir o item.');
      }
    } else {
      Alert.alert('Erro', 'ID do item é inválido. Não é possível excluir este item.');
      setShowDeleteModal(false);
      setItemToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  return (
    <LinearGradient
      colors={["#0f172a", "#1e293b", "#334155"]}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Biblioteca</Text>
          <Text style={styles.subtitle}>
            {mediaItems.length} itens na sua coleção
          </Text>
        </View>

        {/* Search */}
                <View style={styles.searchContainer}>
          <MaterialIcons
            name="search"
            size={24}
            color="#64748b"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar na biblioteca..."
            placeholderTextColor="#64748b"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersContainer}
        >
          {filters.map((filter) => (
                        <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterChip,
                selectedFilter === filter.id && styles.filterChipActive,
              ]}
              onPress={() => setSelectedFilter(filter.id)}
            >
              <MaterialIcons
                name={filter.icon}
                size={20}
                color={selectedFilter === filter.id ? "#ffffff" : "#94a3b8"}
              />
              <Text
                style={[
                  styles.filterText,
                  selectedFilter === filter.id && styles.filterTextActive,
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Items Grid */}
        <View style={styles.itemsContainer}>
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <View key={item.id} style={styles.itemCard}>
                                <View style={styles.itemCover}>
                  <MaterialIcons
                    name={getTypeIcon(item.type)}
                    size={40}
                    color={getTypeColor(item.type)}
                  />
                </View>
                                <View style={styles.itemInfo}>
                  <Text style={styles.itemTitle} numberOfLines={2}>
                    {item.title}
                  </Text>
                  <Text style={styles.itemType}>{item.type}</Text>
                  <View style={styles.itemMeta}>
                                        {item.rating && (
                      <View style={styles.ratingContainer}>
                        <MaterialIcons name="star" size={16} color="#fbbf24" />
                        <Text style={styles.ratingText}>{item.rating}</Text>
                      </View>
                    )}
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: getStatusColor(item.status) },
                      ]}
                    >
                      <Text style={styles.statusText}>
                        {getStatusLabel(item.status)}
                      </Text>
                    </View>
                  </View>
                </View>
                                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeletePress(item)}
                >
                  <MaterialIcons name="delete" size={22} color="#ef4444" />
                </TouchableOpacity>
              </View>
            ))
          ) : (
                        <View style={styles.emptyState}>
              <MaterialIcons name="library-books" size={80} color="#64748b" />
              <Text style={styles.emptyTitle}>Biblioteca vazia</Text>
              <Text style={styles.emptySubtitle}>
                {searchQuery
                  ? "Nenhum item encontrado"
                  : "Adicione seu primeiro item"}
              </Text>
            </View>
          )}
        </View>

        {/* Add Button */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <LinearGradient
            colors={["#06b6d4", "#ec4899"]}
            style={styles.addButtonGradient}
          >
                        <MaterialIcons name="add" size={28} color="#ffffff" />
            <Text style={styles.addButtonText}>Adicionar Item</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>

            {/* Add Media Modal */}
            {/* Fragmentos animados no fundo */}
      <Animated.View
        style={[
          styles.fragmentsContainer,
          {
            opacity: fragmentAnimation.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0.3, 0.6, 0.3],
            }),
            transform: [
              {
                translateY: fragmentAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -20],
                }),
              },
            ],
          },
        ]}
      >
        {[...Array(8)].map((_, i) => (
          <Animated.View
            key={i}
            style={[
              styles.fragment,
              {
                left: `${(i % 4) * 25 + Math.random() * 10}%`,
                top: `${Math.floor(i / 4) * 50 + Math.random() * 20}%`,
                transform: [
                  {
                    rotate: fragmentAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [`${i * 45}deg`, `${i * 45 + 360}deg`],
                    }),
                  },
                ],
              },
            ]}
          />
        ))}
      </Animated.View>

      {/* Modal de confirmação de exclusão */}
      <Modal
        visible={showDeleteModal}
        transparent={true}
        animationType="fade"
        onRequestClose={cancelDelete}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.deleteModalContainer}>
            <MaterialIcons name="warning" size={48} color="#ef4444" style={styles.warningIcon} />
            <Text style={styles.deleteModalTitle}>Excluir Item</Text>
            <Text style={styles.deleteModalText}>
              Tem certeza que deseja excluir "{itemToDelete?.title}"?
            </Text>
            <Text style={styles.deleteModalSubtext}>
              Esta ação não pode ser desfeita.
            </Text>
            <View style={styles.deleteModalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={cancelDelete}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmDeleteButton}
                onPress={confirmDelete}
              >
                <LinearGradient
                  colors={["#ef4444", "#dc2626"]}
                  style={styles.confirmDeleteGradient}
                >
                  <MaterialIcons name="delete" size={18} color="#ffffff" />
                  <Text style={styles.confirmDeleteText}>Excluir</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <AddMediaModalEnhanced
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </LinearGradient>
  );
};

const getStatusColor = (status) => {
  const colors = {
    completed: "#22c55e",
    "in-progress": "#06b6d4",
    dropped: "#ef4444",
    planned: "#8b5cf6",
  };
  return colors[status] || "#64748b";
};

const getStatusLabel = (status) => {
  const labels = {
    completed: "Concluído",
    "in-progress": "Em Progresso",
    dropped: "Abandonado",
    planned: "Planejado",
  };
    return labels[status] || status;
};

const getTypeIcon = (type) => {
  const icons = {
    games: "sports-esports",
    books: "library-books",
    movies: "movie",
    series: "tv",
    anime: "animation",
    dorama: "video-library",
  };
  return icons[type] || "library-books";
};

const getTypeColor = (type) => {
  const colors = {
    games: "#06b6d4",
    books: "#22c55e",
    movies: "#f59e0b",
    series: "#8b5cf6",
    anime: "#ec4899",
    dorama: "#ef4444",
  };
  return colors[type] || "#64748b";
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#94a3b8",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(30, 41, 59, 0.5)",
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(100, 116, 139, 0.3)",
  },
    searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: "#ffffff",
  },
  filtersContainer: {
    marginBottom: 20,
  },
    filterChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: "rgba(30, 41, 59, 0.5)",
    borderWidth: 1,
    borderColor: "rgba(100, 116, 139, 0.3)",
    gap: 8,
    minHeight: 44,
  },
  filterChipActive: {
    backgroundColor: "#06b6d4",
    borderColor: "#06b6d4",
  },
    filterText: {
    fontSize: 15,
    color: "#94a3b8",
    fontWeight: "500",
  },
  filterTextActive: {
    color: "#ffffff",
  },
  itemsContainer: {
    gap: 16,
    paddingBottom: 100,
  },
  itemCard: {
    flexDirection: "row",
    backgroundColor: "rgba(30, 41, 59, 0.5)",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(100, 116, 139, 0.2)",
    gap: 12,
  },
    itemCover: {
    width: 70,
    height: 90,
    backgroundColor: "rgba(100, 116, 139, 0.2)",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(100, 116, 139, 0.3)",
  },
  itemInfo: {
    flex: 1,
    gap: 4,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
  },
  itemType: {
    fontSize: 12,
    color: "#94a3b8",
    textTransform: "capitalize",
  },
  itemMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
    ratingText: {
    fontSize: 14,
    color: "#ffffff",
    fontWeight: "600",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    color: "#ffffff",
    fontWeight: "bold",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#94a3b8",
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    left: 20,
    borderRadius: 12,
    overflow: "hidden",
  },
  addButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 8,
  },
    addButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
    deleteButton: {
    position: "absolute",
    top: 12,
    right: 12,
    padding: 10,
    backgroundColor: "rgba(239, 68, 68, 0.15)",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.4)",
    minWidth: 44,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  fragmentsContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  fragment: {
    position: "absolute",
    width: 4,
    height: 4,
    backgroundColor: "rgba(6, 182, 212, 0.3)",
    borderRadius: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  deleteModalContainer: {
    backgroundColor: "#1e293b",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    maxWidth: 320,
    width: "100%",
    borderWidth: 1,
    borderColor: "rgba(100, 116, 139, 0.3)",
  },
  warningIcon: {
    marginBottom: 16,
  },
  deleteModalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 8,
  },
  deleteModalText: {
    fontSize: 16,
    color: "#94a3b8",
    textAlign: "center",
    marginBottom: 4,
  },
  deleteModalSubtext: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
    marginBottom: 24,
  },
  deleteModalButtons: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: "rgba(100, 116, 139, 0.2)",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(100, 116, 139, 0.3)",
  },
  cancelButtonText: {
    color: "#94a3b8",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  confirmDeleteButton: {
    flex: 1,
    borderRadius: 8,
    overflow: "hidden",
  },
  confirmDeleteGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    gap: 6,
  },
  confirmDeleteText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default LibraryScreen;
