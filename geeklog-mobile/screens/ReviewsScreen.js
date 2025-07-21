import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Image,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { useAppContext } from "../contexts/AppContext";
import { useResponsive } from "../hooks/useResponsive";

const ReviewsScreen = ({ navigation }) => {
  const {
    reviews,
    updateReview,
    deleteReview,
    loading,
    loadUserData,
  } = useAppContext();
  const responsive = useResponsive();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadUserData();
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleToggleFavorite = async (reviewId) => {
    try {
      const review = reviews.find((r) => r.id === reviewId);
      if (review) {
        await updateReview(reviewId, {
          ...review,
          isFavorite: !review.isFavorite,
        });
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      Alert.alert("Erro", "Não foi possível atualizar o favorito");
    }
  };

  const handleDeleteReview = (reviewId) => {
    Alert.alert(
      "Excluir Review",
      "Tem certeza que deseja excluir esta review?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => deleteReview(reviewId),
        },
      ]
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <MaterialIcons key={i} name="star" size={16} color="#fbbf24" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <MaterialIcons
          key="half"
          name="star-half"
          size={16}
          color="#fbbf24"
        />
      );
    }

    const emptyStars = 10 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <MaterialIcons
          key={`empty-${i}`}
          name="star-border"
          size={16}
          color="#64748b"
        />
      );
    }

    return stars;
  };

  const styles = createStyles(responsive);

  return (
    <LinearGradient
      colors={["#0f172a", "#1e293b", "#334155"]}
      style={styles.container}
    >
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={["#06b6d4"]}
            tintColor="#06b6d4"
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Reviews</Text>
          <Text style={styles.subtitle}>Suas análises e avaliações</Text>
        </View>

        {/* Add Review Button */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => Alert.alert("Adicionar Review", "Funcionalidade em desenvolvimento")}
        >
          <LinearGradient
            colors={["#ec4899", "#8b5cf6"]}
            style={styles.addButtonGradient}
          >
            <MaterialIcons name="add" size={20} color="#ffffff" />
            <Text style={styles.addButtonText}>Nova Review</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Reviews List */}
        {reviews.length > 0 ? (
          <View style={styles.reviewsList}>
            {reviews.map((review) => (
              <View key={review.id} style={styles.reviewCard}>
                {/* Review Header */}
                <View style={styles.reviewHeader}>
                  <View style={styles.reviewTitleContainer}>
                    <Text style={styles.reviewTitle} numberOfLines={2}>
                      {review.title}
                    </Text>
                    <Text style={styles.reviewDate}>
                      {formatDate(review.createdAt)}
                    </Text>
                  </View>
                  <View style={styles.reviewActions}>
                    {/* Heart/Like Button */}
                    <TouchableOpacity
                      style={styles.favoriteButton}
                      onPress={() => handleToggleFavorite(review.id)}
                    >
                      <MaterialIcons
                        name={review.isFavorite ? "favorite" : "favorite-border"}
                        size={20}
                        color={review.isFavorite ? "#ef4444" : "#64748b"}
                      />
                    </TouchableOpacity>
                    {/* More Options */}
                    <TouchableOpacity
                      style={styles.moreButton}
                      onPress={() => handleDeleteReview(review.id)}
                    >
                      <MaterialIcons name="more-vert" size={20} color="#64748b" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Rating */}
                <View style={styles.ratingContainer}>
                  <Text style={styles.ratingLabel}>Nota:</Text>
                  <View style={styles.starsContainer}>
                    {renderStars(review.rating)}
                  </View>
                  <Text style={styles.ratingText}>{review.rating}/10</Text>
                </View>

                {/* Review Content */}
                <Text style={styles.reviewContent} numberOfLines={3}>
                  {review.content}
                </Text>

                {/* Review Footer */}
                <View style={styles.reviewFooter}>
                  {review.isFavorite && (
                    <View style={styles.favoriteTag}>
                      <MaterialIcons name="favorite" size={12} color="#ef4444" />
                      <Text style={styles.favoriteTagText}>Favorita</Text>
                    </View>
                  )}
                  <TouchableOpacity
                    style={styles.readMoreButton}
                    onPress={() =>
                      Alert.alert("Review Completa", review.content)
                    }
                  >
                    <Text style={styles.readMoreText}>Ler mais</Text>
                    <MaterialIcons name="arrow-forward" size={14} color="#06b6d4" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <MaterialIcons name="rate-review" size={64} color="#64748b" />
            <Text style={styles.emptyTitle}>Nenhuma review ainda</Text>
            <Text style={styles.emptySubtitle}>
              Comece criando sua primeira review
            </Text>
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1, paddingHorizontal: 20 },
  header: { paddingTop: 20, paddingBottom: 40 },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 4,
  },
  subtitle: { fontSize: 14, color: "#94a3b8" },
  emptyState: { alignItems: "center", paddingVertical: 100 },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: { fontSize: 14, color: "#94a3b8" },
});

export default ReviewsScreen;
