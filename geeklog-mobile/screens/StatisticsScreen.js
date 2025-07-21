import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { useAppContext } from "../contexts/AppContext";
import { useResponsive } from "../hooks/useResponsive";

const mediaTypeLabels = {
  games: "Jogos",
  anime: "Anime",
  series: "Séries",
  books: "Livros",
  movies: "Filmes",
  dorama: "Doramas",
};

const mediaTypeIcons = {
  games: "videogame-asset",
  anime: "auto-awesome",
  series: "tv",
  books: "menu-book",
  movies: "movie",
  dorama: "live-tv",
};

const StatisticsScreen = ({ navigation }) => {
  const {
    mediaItems,
    reviews,
    milestones,
    settings,
    loading,
    loadUserData,
  } = useAppContext();
  const responsive = useResponsive();
  const [refreshing, setRefreshing] = React.useState(false);

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

  const getMediaStats = () => {
    const stats = {
      games: { count: 0, hours: 0, avgRating: 0, completed: 0 },
      anime: { count: 0, hours: 0, avgRating: 0, completed: 0 },
      series: { count: 0, hours: 0, avgRating: 0, completed: 0 },
      books: { count: 0, hours: 0, avgRating: 0, completed: 0 },
      movies: { count: 0, hours: 0, avgRating: 0, completed: 0 },
      dorama: { count: 0, hours: 0, avgRating: 0, completed: 0 },
    };

    mediaItems.forEach((item) => {
      if (stats[item.type]) {
        stats[item.type].count++;
        stats[item.type].hours += item.hoursSpent || 0;
        if (item.rating) {
          const currentAvg = stats[item.type].avgRating;
          const currentCount = stats[item.type].count;
          stats[item.type].avgRating =
            currentCount === 1
              ? item.rating
              : (currentAvg * (currentCount - 1) + item.rating) / currentCount;
        }
        if (item.status === "completed") {
          stats[item.type].completed++;
        }
      }
    });

    return stats;
  };

  const getTotalStats = () => {
    const totalHours = mediaItems.reduce(
      (sum, item) => sum + (item.hoursSpent || 0),
      0,
    );
    const totalCompleted = mediaItems.filter(
      (item) => item.status === "completed",
    ).length;
    const ratedItems = mediaItems.filter((item) => item.rating);
    const avgRating =
      ratedItems.length > 0
        ? ratedItems.reduce((sum, item) => sum + (item.rating || 0), 0) /
          ratedItems.length
        : 0;

    return {
      totalHours,
      totalCompleted,
      avgRating,
      totalItems: mediaItems.length,
    };
  };

  const getTopRated = () => {
    return mediaItems
      .filter((item) => item.rating)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 5);
  };

  const getMostPlayed = () => {
    return mediaItems
      .filter((item) => item.hoursSpent)
      .sort((a, b) => (b.hoursSpent || 0) - (a.hoursSpent || 0))
      .slice(0, 5);
  };

  const mediaStats = getMediaStats();
  const totalStats = getTotalStats();
  const topRated = getTopRated();
  const mostPlayed = getMostPlayed();

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
          <Text style={styles.title}>Estatísticas</Text>
          <Text style={styles.subtitle}>
            Insights sobre seu consumo de mídia e preferências
          </Text>
        </View>

        {/* Overview Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Visão Geral</Text>
          <View style={styles.overviewGrid}>
            <View style={[styles.overviewCard, { backgroundColor: "rgba(6, 182, 212, 0.1)" }]}>
              <MaterialIcons
                name="schedule"
                size={responsive.fontSize.xl}
                color="#06b6d4"
              />
              <Text style={styles.overviewValue}>
                {totalStats.totalHours.toLocaleString()}
              </Text>
              <Text style={styles.overviewLabel}>Total de Horas</Text>
            </View>

            <View style={[styles.overviewCard, { backgroundColor: "rgba(34, 197, 94, 0.1)" }]}>
              <MaterialIcons
                name="trending-up"
                size={responsive.fontSize.xl}
                color="#22c55e"
              />
              <Text style={styles.overviewValue}>{totalStats.totalCompleted}</Text>
              <Text style={styles.overviewLabel}>Concluídos</Text>
            </View>

            <View style={[styles.overviewCard, { backgroundColor: "rgba(251, 191, 36, 0.1)" }]}>
              <MaterialIcons
                name="star"
                size={responsive.fontSize.xl}
                color="#fbbf24"
              />
              <Text style={styles.overviewValue}>
                {totalStats.avgRating.toFixed(1)}
              </Text>
              <Text style={styles.overviewLabel}>Nota Média</Text>
            </View>

            <View style={[styles.overviewCard, { backgroundColor: "rgba(139, 92, 246, 0.1)" }]}>
              <MaterialIcons
                name="rate-review"
                size={responsive.fontSize.xl}
                color="#8b5cf6"
              />
              <Text style={styles.overviewValue}>{reviews.length}</Text>
              <Text style={styles.overviewLabel}>Resenhas</Text>
            </View>
          </View>
        </View>

        {/* Media Type Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Por Tipo de Mídia</Text>
          <View style={styles.mediaTypesGrid}>
            {Object.entries(mediaStats).map(([type, stats]) => (
              <View key={type} style={styles.mediaTypeCard}>
                <View style={styles.mediaTypeHeader}>
                  <MaterialIcons
                    name={mediaTypeIcons[type]}
                    size={responsive.fontSize.lg}
                    color="#ffffff"
                  />
                  <Text style={styles.mediaTypeTitle}>
                    {mediaTypeLabels[type]}
                  </Text>
                </View>
                <View style={styles.mediaTypeStats}>
                  <View style={styles.statRow}>
                    <Text style={styles.statRowLabel}>Total</Text>
                    <Text style={styles.statRowValue}>{stats.count}</Text>
                  </View>
                  <View style={styles.statRow}>
                    <Text style={styles.statRowLabel}>Horas</Text>
                    <Text style={styles.statRowValue}>{stats.hours.toFixed(1)}</Text>
                  </View>
                  <View style={styles.statRow}>
                    <Text style={styles.statRowLabel}>Concluídos</Text>
                    <Text style={styles.statRowValue}>{stats.completed}</Text>
                  </View>
                  <View style={styles.statRow}>
                    <Text style={styles.statRowLabel}>Nota Média</Text>
                    <Text style={styles.statRowValue}>{stats.avgRating.toFixed(1)}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Top Rated */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons
              name="star"
              size={responsive.fontSize.lg}
              color="#fbbf24"
            />
            <Text style={styles.sectionTitle}>Melhor Avaliados</Text>
          </View>
          <View style={styles.topListCard}>
            {topRated.length > 0 ? (
              topRated.map((item, index) => (
                <View key={item.id} style={styles.topListItem}>
                  <View style={[styles.topListRank, { backgroundColor: "#fbbf24" }]}>
                    <Text style={styles.topListRankText}>{index + 1}</Text>
                  </View>
                  <View style={styles.topListCover}>
                    <MaterialIcons
                      name="star"
                      size={responsive.fontSize.md}
                      color="#64748b"
                    />
                  </View>
                  <View style={styles.topListInfo}>
                    <Text style={styles.topListTitle} numberOfLines={1}>
                      {item.title}
                    </Text>
                    <Text style={styles.topListType}>
                      {mediaTypeLabels[item.type]}
                    </Text>
                  </View>
                  <View style={styles.topListRating}>
                    <MaterialIcons
                      name="star"
                      size={responsive.fontSize.sm}
                      color="#fbbf24"
                    />
                    <Text style={styles.topListRatingText}>{item.rating}</Text>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>Nenhum item avaliado ainda</Text>
            )}
          </View>
        </View>

        {/* Most Time Spent */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons
              name="schedule"
              size={responsive.fontSize.lg}
              color="#06b6d4"
            />
            <Text style={styles.sectionTitle}>Mais Tempo Gasto</Text>
          </View>
          <View style={styles.topListCard}>
            {mostPlayed.length > 0 ? (
              mostPlayed.map((item, index) => (
                <View key={item.id} style={styles.topListItem}>
                  <View style={[styles.topListRank, { backgroundColor: "#06b6d4" }]}>
                    <Text style={styles.topListRankText}>{index + 1}</Text>
                  </View>
                  <View style={styles.topListCover}>
                    <MaterialIcons
                      name="schedule"
                      size={responsive.fontSize.md}
                      color="#64748b"
                    />
                  </View>
                  <View style={styles.topListInfo}>
                    <Text style={styles.topListTitle} numberOfLines={1}>
                      {item.title}
                    </Text>
                    <Text style={styles.topListType}>
                      {mediaTypeLabels[item.type]}
                    </Text>
                  </View>
                  <View style={styles.topListRating}>
                    <MaterialIcons
                      name="schedule"
                      size={responsive.fontSize.sm}
                      color="#06b6d4"
                    />
                    <Text style={styles.topListRatingText}>{item.hoursSpent}h</Text>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>Nenhum dado de tempo ainda</Text>
            )}
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const createStyles = (responsive) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollView: {
      flex: 1,
      paddingHorizontal: responsive.padding.md,
    },
    header: {
      paddingTop: responsive.padding.lg,
      paddingBottom: responsive.padding.lg,
    },
    title: {
      fontSize: responsive.fontSize.xxl,
      fontWeight: "bold",
      color: "#ffffff",
      marginBottom: responsive.spacing.xs,
    },
    subtitle: {
      fontSize: responsive.fontSize.sm,
      color: "#94a3b8",
    },
    section: {
      marginBottom: responsive.spacing.xl,
    },
    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: responsive.spacing.md,
      gap: responsive.spacing.sm,
    },
    sectionTitle: {
      fontSize: responsive.fontSize.lg,
      fontWeight: "bold",
      color: "#ffffff",
    },
    overviewGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: responsive.spacing.sm,
    },
    overviewCard: {
      width: responsive.getItemWidth(2, responsive.spacing.sm),
      padding: responsive.padding.md,
      borderRadius: 12,
      alignItems: "center",
      gap: responsive.spacing.sm,
    },
    overviewValue: {
      fontSize: responsive.fontSize.xl,
      fontWeight: "bold",
      color: "#ffffff",
    },
    overviewLabel: {
      fontSize: responsive.fontSize.xs,
      color: "#94a3b8",
      textAlign: "center",
    },
    mediaTypesGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: responsive.spacing.sm,
    },
    mediaTypeCard: {
      width: responsive.getItemWidth(responsive.isSmallDevice ? 1 : 2, responsive.spacing.sm),
      backgroundColor: "rgba(30, 41, 59, 0.5)",
      borderRadius: 12,
      padding: responsive.padding.md,
      borderWidth: 1,
      borderColor: "rgba(100, 116, 139, 0.2)",
    },
    mediaTypeHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: responsive.spacing.sm,
      marginBottom: responsive.spacing.md,
    },
    mediaTypeTitle: {
      fontSize: responsive.fontSize.md,
      fontWeight: "bold",
      color: "#ffffff",
    },
    mediaTypeStats: {
      gap: responsive.spacing.xs,
    },
    statRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    statRowLabel: {
      fontSize: responsive.fontSize.sm,
      color: "#94a3b8",
    },
    statRowValue: {
      fontSize: responsive.fontSize.sm,
      fontWeight: "600",
      color: "#ffffff",
    },
    topListCard: {
      backgroundColor: "rgba(30, 41, 59, 0.5)",
      borderRadius: 16,
      padding: responsive.padding.md,
      borderWidth: 1,
      borderColor: "rgba(100, 116, 139, 0.2)",
    },
    topListItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: responsive.spacing.sm,
      paddingVertical: responsive.spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: "rgba(100, 116, 139, 0.1)",
    },
    topListRank: {
      width: 24,
      height: 24,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
    },
    topListRankText: {
      fontSize: responsive.fontSize.xs,
      fontWeight: "bold",
      color: "#ffffff",
    },
    topListCover: {
      width: 32,
      height: 40,
      backgroundColor: "rgba(100, 116, 139, 0.2)",
      borderRadius: 4,
      alignItems: "center",
      justifyContent: "center",
    },
    topListInfo: {
      flex: 1,
      gap: responsive.spacing.xs,
    },
    topListTitle: {
      fontSize: responsive.fontSize.sm,
      fontWeight: "600",
      color: "#ffffff",
    },
    topListType: {
      fontSize: responsive.fontSize.xs,
      color: "#94a3b8",
    },
    topListRating: {
      flexDirection: "row",
      alignItems: "center",
      gap: responsive.spacing.xs,
    },
    topListRatingText: {
      fontSize: responsive.fontSize.sm,
      fontWeight: "600",
      color: "#ffffff",
    },
    emptyText: {
      color: "#94a3b8",
      fontSize: responsive.fontSize.md,
      textAlign: "center",
      paddingVertical: responsive.padding.lg,
    },
  });

export default StatisticsScreen;
