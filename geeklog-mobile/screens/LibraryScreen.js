import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { useAppContext } from "../contexts/AppContext";
import AddMediaModal from "../modals/AddMediaModal";

const LibraryScreen = () => {
  const { mediaItems } = useAppContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);

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
            size={20}
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
                size={16}
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
                    name="library-books"
                    size={32}
                    color="#64748b"
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
                        <MaterialIcons name="star" size={14} color="#fbbf24" />
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
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <MaterialIcons name="library-books" size={64} color="#64748b" />
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
            <MaterialIcons name="add" size={24} color="#ffffff" />
            <Text style={styles.addButtonText}>Adicionar Item</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
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
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: "rgba(30, 41, 59, 0.5)",
    borderWidth: 1,
    borderColor: "rgba(100, 116, 139, 0.3)",
    gap: 6,
  },
  filterChipActive: {
    backgroundColor: "#06b6d4",
    borderColor: "#06b6d4",
  },
  filterText: {
    fontSize: 14,
    color: "#94a3b8",
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
    width: 60,
    height: 80,
    backgroundColor: "rgba(100, 116, 139, 0.2)",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
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
    fontSize: 12,
    color: "#ffffff",
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
});

export default LibraryScreen;
