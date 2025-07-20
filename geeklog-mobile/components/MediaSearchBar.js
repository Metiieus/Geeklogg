import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { ExternalMediaService } from "../services/externalMediaService";

const MediaSearchBar = ({ selectedType, onTypeChange, onResultSelect, placeholder = "Buscar por título..." }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  const timeoutRef = useRef(null);
  const inputRef = useRef(null);

  const mediaTypeOptions = [
    { value: "books", label: "Livros", icon: "library-books" },
    { value: "movies", label: "Filmes", icon: "movie" },
    { value: "series", label: "Séries", icon: "tv" },
    { value: "anime", label: "Anime", icon: "animation" },
    { value: "dorama", label: "Doramas", icon: "tv" },
  ];

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Perform search with debounce
  const performSearch = async (searchQuery, mediaType) => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setResults([]);
      setIsVisible(false);
      return;
    }

    setIsLoading(true);
    setHasError(false);

    try {
      const searchResults = await ExternalMediaService.searchMedia({
        query: searchQuery,
        type: mediaType,
        limit: 8,
      });

      setResults(searchResults);
      setIsVisible(true);

      if (searchResults.length === 0) {
        Alert.alert("Nenhum resultado", `Nenhum resultado encontrado para "${searchQuery}"`);
      }
    } catch (error) {
      console.error("Error searching:", error);
      setHasError(true);
      setResults([]);
      Alert.alert("Erro na busca", "Não foi possível realizar a busca. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input change with debounce
  const handleInputChange = (value) => {
    setQuery(value);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      performSearch(value, selectedType);
    }, 500);
  };

  // Handle result selection
  const handleResultSelect = (result) => {
    onResultSelect(result);
    setQuery("");
    setResults([]);
    setIsVisible(false);
    Keyboard.dismiss();
  };

  // Clear search
  const handleClearSearch = () => {
    setQuery("");
    setResults([]);
    setIsVisible(false);
    inputRef.current?.focus();
  };

  // Format result subtitle
  const formatResultSubtitle = (result) => {
    const parts = [];

    if (result.year) parts.push(result.year.toString());
    if (result.authors && result.authors.length > 0) {
      parts.push(result.authors.slice(0, 2).join(", "));
    }
    if (result.publisher) parts.push(result.publisher);
    if (result.genres && result.genres.length > 0) {
      parts.push(result.genres.slice(0, 2).join(", "));
    }

    return parts.join(" • ");
  };

  // Get icon for media type
  const getTypeIcon = (type) => {
    const option = mediaTypeOptions.find((opt) => opt.value === type);
    return option ? option.icon : "search";
  };

  // Render search result item
  const renderResultItem = ({ item }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => handleResultSelect(item)}
      activeOpacity={0.7}
    >
      {/* Cover Image */}
      <View style={styles.resultImage}>
        {item.image ? (
          <Image
            source={{ uri: item.image }}
            style={styles.coverImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderImage}>
            <MaterialIcons
              name={getTypeIcon(selectedType)}
              size={24}
              color="#64748b"
            />
          </View>
        )}
      </View>

      {/* Result Info */}
      <View style={styles.resultInfo}>
        <Text style={styles.resultTitle} numberOfLines={2}>
          {item.title}
        </Text>

        {formatResultSubtitle(item) ? (
          <Text style={styles.resultSubtitle} numberOfLines={1}>
            {formatResultSubtitle(item)}
          </Text>
        ) : null}

        {item.description ? (
          <Text style={styles.resultDescription} numberOfLines={2}>
            {item.description.slice(0, 120)}
            {item.description.length > 120 ? "..." : ""}
          </Text>
        ) : null}

        {/* Source indicator */}
        <View style={styles.sourceContainer}>
          <View
            style={[
              styles.sourceTag,
              item.source === "google-books" ? styles.googleBooksTag : styles.tmdbTag,
            ]}
          >
            <Text
              style={[
                styles.sourceText,
                item.source === "google-books" ? styles.googleBooksText : styles.tmdbText,
              ]}
            >
              {item.source === "google-books" ? "Google Books" : "TMDb"}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

    return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      {/* Media type selector */}
      <View style={styles.typeSelector}>
        <FlatList
          data={mediaTypeOptions}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.value}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.typeButton,
                selectedType === item.value && styles.typeButtonActive,
              ]}
              onPress={() => onTypeChange(item.value)}
              activeOpacity={0.7}
            >
              <MaterialIcons
                name={item.icon}
                size={18}
                color={selectedType === item.value ? "#ffffff" : "#94a3b8"}
              />
              <Text
                style={[
                  styles.typeButtonText,
                  selectedType === item.value && styles.typeButtonTextActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.typeSelectorContent}
        />
      </View>

      {/* Search input */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <MaterialIcons
            name={getTypeIcon(selectedType)}
            size={20}
            color="#64748b"
            style={styles.searchIcon}
          />

          <TextInput
            ref={inputRef}
            style={styles.searchInput}
            value={query}
            onChangeText={handleInputChange}
            placeholder={placeholder}
            placeholderTextColor="#64748b"
            returnKeyType="search"
            onSubmitEditing={() => performSearch(query, selectedType)}
            onFocus={() => {
              // Ensure results are visible when keyboard opens
              if (results.length > 0) {
                setIsVisible(true);
              }
            }}
            blurOnSubmit={false}
          />

          <View style={styles.searchActions}>
            {isLoading && (
              <ActivityIndicator size="small" color="#8b5cf6" style={styles.loadingIndicator} />
            )}

            {query && !isLoading && (
              <TouchableOpacity onPress={handleClearSearch} style={styles.clearButton}>
                <MaterialIcons name="close" size={20} color="#64748b" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {/* Search results */}
      {isVisible && (
        <View style={[styles.resultsContainer, { maxHeight: Dimensions.get('window').height * 0.4 }]}>
          {hasError ? (
            <View style={styles.errorContainer}>
              <MaterialIcons name="error-outline" size={24} color="#ef4444" />
              <Text style={styles.errorText}>Erro ao buscar resultados</Text>
            </View>
          ) : results.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {query.length < 2
                  ? "Digite pelo menos 2 caracteres"
                  : "Nenhum resultado encontrado"}
              </Text>
            </View>
          ) : (
            <FlatList
              data={results}
              keyExtractor={(item) => `${item.source}-${item.id}`}
              renderItem={renderResultItem}
              showsVerticalScrollIndicator={false}
              style={styles.resultsList}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="on-drag"
            />
          )}
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  typeSelector: {
    marginBottom: 16,
  },
  typeSelectorContent: {
    paddingHorizontal: 4,
  },
  typeButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
    backgroundColor: "rgba(30, 41, 59, 0.5)",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(100, 116, 139, 0.3)",
    gap: 6,
  },
  typeButtonActive: {
    backgroundColor: "#8b5cf6",
    borderColor: "#8b5cf6",
  },
  typeButtonText: {
    fontSize: 14,
    color: "#94a3b8",
    fontWeight: "500",
  },
  typeButtonTextActive: {
    color: "#ffffff",
    fontWeight: "600",
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(30, 41, 59, 0.5)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(100, 116, 139, 0.3)",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#ffffff",
    paddingVertical: 4,
  },
  searchActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  loadingIndicator: {
    marginLeft: 8,
  },
  clearButton: {
    padding: 4,
  },
    resultsContainer: {
    backgroundColor: "rgba(30, 41, 59, 0.5)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(100, 116, 139, 0.3)",
    maxHeight: 400,
    minHeight: 200,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    gap: 8,
  },
  errorText: {
    color: "#ef4444",
    fontSize: 14,
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    color: "#94a3b8",
    fontSize: 14,
    textAlign: "center",
  },
  resultsList: {
    flex: 1,
  },
  resultItem: {
    flexDirection: "row",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(100, 116, 139, 0.2)",
    gap: 12,
  },
  resultImage: {
    width: 48,
    height: 64,
    borderRadius: 6,
    overflow: "hidden",
  },
  coverImage: {
    width: "100%",
    height: "100%",
  },
  placeholderImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(100, 116, 139, 0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  resultInfo: {
    flex: 1,
    gap: 4,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
    lineHeight: 20,
  },
  resultSubtitle: {
    fontSize: 12,
    color: "#94a3b8",
  },
  resultDescription: {
    fontSize: 12,
    color: "#64748b",
    lineHeight: 16,
  },
  sourceContainer: {
    flexDirection: "row",
    marginTop: 4,
  },
  sourceTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  googleBooksTag: {
    backgroundColor: "rgba(59, 130, 246, 0.2)",
  },
  tmdbTag: {
    backgroundColor: "rgba(34, 197, 94, 0.2)",
  },
  sourceText: {
    fontSize: 10,
    fontWeight: "500",
  },
  googleBooksText: {
    color: "#3b82f6",
  },
  tmdbText: {
    color: "#22c55e",
  },
});

export default MediaSearchBar;
