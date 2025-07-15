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

const DashboardScreen = ({ navigation }) => {
  const {
    mediaItems,
    reviews,
    milestones,
    settings,
    stats,
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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  const getRecentItem = () => {
    if (mediaItems.length === 0) return null;
    return mediaItems.sort(
      (a, b) =>
        new Date(b.updatedAt || b.createdAt).getTime() -
        new Date(a.updatedAt || a.createdAt).getTime(),
    )[0];
  };

  const getDetailedStats = () => {
    const totalHours = mediaItems.reduce(
      (sum, item) => sum + (item.hoursSpent || 0),
      0,
    );
    const completed = mediaItems.filter(
      (item) => item.status === "completed",
    ).length;
    const ratedItems = mediaItems.filter((item) => item.rating);
    const avgRating =
      ratedItems.length > 0
        ? ratedItems.reduce((sum, item) => sum + (item.rating || 0), 0) /
          ratedItems.length
        : 0;

    return { totalHours, completed, avgRating };
  };

  const getStatusCounts = () => {
    const counts = {
      completed: 0,
      "in-progress": 0,
      dropped: 0,
      planned: 0,
    };

    mediaItems.forEach((item) => {
      counts[item.status] = (counts[item.status] || 0) + 1;
    });

    return counts;
  };

  const getStatusLabel = (status) => {
    const labels = {
      completed: "Concluído",
      "in-progress": "Em Progresso",
      dropped: "Abandonado",
      planned: "Planejado",
    };
    return labels[status];
  };

  const recentItem = getRecentItem();
  const detailedStats = getDetailedStats();
  const statusCounts = getStatusCounts();

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
          <View style={styles.headerContent}>
            <Text style={styles.greeting}>
              {getGreeting()}, {settings.name || "Nerd"}
            </Text>
            <Text style={styles.subtitle}>
              Bem-vindo de volta à sua jornada nerd
            </Text>
          </View>
          <View style={styles.dateContainer}>
            <Text style={styles.date}>
              {new Date().toLocaleDateString("pt-BR")}
            </Text>
          </View>
        </View>

        {/* Quick Stats Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Visão Geral</Text>
          <View style={styles.quickStatsGrid}>
            <View style={styles.quickStatCard}>
              <Text style={styles.quickStatValue}>{stats.games}</Text>
              <Text style={styles.quickStatLabel}>Jogos</Text>
            </View>
            <View style={styles.quickStatCard}>
              <Text style={styles.quickStatValue}>{stats.books}</Text>
              <Text style={styles.quickStatLabel}>Livros</Text>
            </View>
            <View style={styles.quickStatCard}>
              <Text style={styles.quickStatValue}>{stats.movies}</Text>
              <Text style={styles.quickStatLabel}>Filmes</Text>
            </View>
            <View style={styles.quickStatCard}>
              <Text style={styles.quickStatValue}>{stats.reviews}</Text>
              <Text style={styles.quickStatLabel}>Reviews</Text>
            </View>
          </View>
        </View>

        {/* Featured Content */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons
              name="star"
              size={responsive.fontSize.lg}
              color="#fbbf24"
            />
            <Text style={styles.sectionTitle}>Atualizado Recentemente</Text>
          </View>

          <View style={styles.featuredCard}>
            {recentItem ? (
              <View style={styles.recentItemContainer}>
                <View style={styles.coverPlaceholder}>
                  <MaterialIcons
                    name="library-books"
                    size={responsive.fontSize.xxl}
                    color="#64748b"
                  />
                </View>
                <View style={styles.recentItemInfo}>
                  <Text style={styles.recentItemTitle} numberOfLines={2}>
                    {recentItem.title}
                  </Text>
                  <Text style={styles.recentItemStatus}>
                    {getStatusLabel(recentItem.status)}
                  </Text>
                  {recentItem.rating && (
                    <View style={styles.ratingContainer}>
                      <MaterialIcons
                        name="star"
                        size={responsive.fontSize.md}
                        color="#fbbf24"
                      />
                      <Text style={styles.ratingText}>
                        {recentItem.rating}/10
                      </Text>
                    </View>
                  )}
                  {recentItem.hoursSpent && (
                    <View style={styles.hoursContainer}>
                      <MaterialIcons
                        name="schedule"
                        size={responsive.fontSize.md}
                        color="#06b6d4"
                      />
                      <Text style={styles.hoursText}>
                        {recentItem.hoursSpent}h
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            ) : (
              <View style={styles.emptyState}>
                <MaterialIcons name="library-books" size={48} color="#64748b" />
                <Text style={styles.emptyText}>
                  Nenhum item na sua biblioteca ainda
                </Text>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => navigation.navigate("Library")}
                >
                  <LinearGradient
                    colors={["#ec4899", "#8b5cf6"]}
                    style={styles.gradientButton}
                  >
                    <Text style={styles.addButtonText}>
                      Adicionar Primeiro Item
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* Detailed Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estatísticas Detalhadas</Text>
          <View style={styles.statsGrid}>
            <View
              style={[
                styles.statCard,
                { backgroundColor: "rgba(6, 182, 212, 0.1)" },
              ]}
            >
              <MaterialIcons
                name="schedule"
                size={responsive.fontSize.xl}
                color="#06b6d4"
              />
              <Text style={styles.statValue}>
                {detailedStats.totalHours.toLocaleString()}
              </Text>
              <Text style={styles.statLabel}>Total de Horas</Text>
            </View>

            <View
              style={[
                styles.statCard,
                { backgroundColor: "rgba(34, 197, 94, 0.1)" },
              ]}
            >
              <MaterialIcons
                name="trending-up"
                size={responsive.fontSize.xl}
                color="#22c55e"
              />
              <Text style={styles.statValue}>{detailedStats.completed}</Text>
              <Text style={styles.statLabel}>Concluídos</Text>
            </View>

            <View
              style={[
                styles.statCard,
                { backgroundColor: "rgba(251, 191, 36, 0.1)" },
              ]}
            >
              <MaterialIcons
                name="star"
                size={responsive.fontSize.xl}
                color="#fbbf24"
              />
              <Text style={styles.statValue}>
                {detailedStats.avgRating.toFixed(1)}/10
              </Text>
              <Text style={styles.statLabel}>Nota Média</Text>
            </View>
          </View>
        </View>

        {/* Status Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Status dos Itens</Text>
          <View style={styles.statusGrid}>
            <View style={[styles.statusCard, { borderLeftColor: "#22c55e" }]}>
              <Text style={styles.statusValue}>{statusCounts.completed}</Text>
              <Text style={styles.statusLabel}>Concluídos</Text>
            </View>
            <View style={[styles.statusCard, { borderLeftColor: "#06b6d4" }]}>
              <Text style={styles.statusValue}>
                {statusCounts["in-progress"]}
              </Text>
              <Text style={styles.statusLabel}>Em Progresso</Text>
            </View>
            <View style={[styles.statusCard, { borderLeftColor: "#ef4444" }]}>
              <Text style={styles.statusValue}>{statusCounts.dropped}</Text>
              <Text style={styles.statusLabel}>Abandonados</Text>
            </View>
            <View style={[styles.statusCard, { borderLeftColor: "#8b5cf6" }]}>
              <Text style={styles.statusValue}>{statusCounts.planned}</Text>
              <Text style={styles.statusLabel}>Planejados</Text>
            </View>
          </View>
        </View>

        {/* Recent Milestones */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons
              name="event"
              size={responsive.fontSize.lg}
              color="#8b5cf6"
            />
            <Text style={styles.sectionTitle}>Marcos Recentes</Text>
          </View>

          <View style={styles.milestonesCard}>
            {milestones.length > 0 ? (
              milestones.slice(0, 3).map((milestone) => (
                <View key={milestone.id} style={styles.milestoneItem}>
                  <Text style={styles.milestoneIcon}>{milestone.icon}</Text>
                  <View style={styles.milestoneInfo}>
                    <Text style={styles.milestoneTitle}>{milestone.title}</Text>
                    <Text style={styles.milestoneDate}>
                      {new Date(
                        milestone.date || milestone.createdAt,
                      ).toLocaleDateString("pt-BR")}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.emptyMilestones}>
                <Text style={styles.emptyText}>
                  Nenhum marco registrado ainda
                </Text>
                <Text style={styles.emptySubtext}>
                  Suas conquistas aparecerão aqui
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ações Rápidas</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => navigation.navigate("Library")}
            >
              <MaterialIcons
                name="add"
                size={responsive.fontSize.xl}
                color="#06b6d4"
              />
              <Text style={styles.quickActionText}>Adicionar Item</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => navigation.navigate("Reviews")}
            >
              <MaterialIcons
                name="rate-review"
                size={responsive.fontSize.xl}
                color="#ec4899"
              />
              <Text style={styles.quickActionText}>Nova Review</Text>
            </TouchableOpacity>
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
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    headerContent: {
      flex: 1,
    },
    greeting: {
      fontSize: responsive.fontSize.xxl,
      fontWeight: "bold",
      color: "#ffffff",
      marginBottom: responsive.spacing.xs,
    },
    subtitle: {
      fontSize: responsive.fontSize.sm,
      color: "#94a3b8",
    },
    dateContainer: {
      marginLeft: responsive.spacing.md,
    },
    date: {
      fontSize: responsive.fontSize.xs,
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
    quickStatsGrid: {
      flexDirection: "row",
      gap: responsive.spacing.sm,
    },
    quickStatCard: {
      flex: 1,
      backgroundColor: "rgba(30, 41, 59, 0.5)",
      borderRadius: 12,
      padding: responsive.padding.sm,
      alignItems: "center",
      borderWidth: 1,
      borderColor: "rgba(100, 116, 139, 0.2)",
    },
    quickStatValue: {
      fontSize: responsive.fontSize.xl,
      fontWeight: "bold",
      color: "#ffffff",
      marginBottom: responsive.spacing.xs,
    },
    quickStatLabel: {
      fontSize: responsive.fontSize.xs,
      color: "#94a3b8",
      textAlign: "center",
    },
    featuredCard: {
      backgroundColor: "rgba(30, 41, 59, 0.5)",
      borderRadius: 16,
      padding: responsive.padding.md,
      borderWidth: 1,
      borderColor: "rgba(100, 116, 139, 0.2)",
    },
    recentItemContainer: {
      flexDirection: "row",
      gap: responsive.spacing.md,
    },
    coverPlaceholder: {
      width: responsive.getResponsiveValue(60, 70, 80),
      height: responsive.getResponsiveValue(80, 90, 100),
      backgroundColor: "rgba(100, 116, 139, 0.2)",
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
    },
    recentItemInfo: {
      flex: 1,
      gap: responsive.spacing.xs,
    },
    recentItemTitle: {
      fontSize: responsive.fontSize.md,
      fontWeight: "bold",
      color: "#ffffff",
    },
    recentItemStatus: {
      fontSize: responsive.fontSize.sm,
      color: "#94a3b8",
    },
    ratingContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: responsive.spacing.xs,
    },
    ratingText: {
      fontSize: responsive.fontSize.sm,
      color: "#ffffff",
    },
    hoursContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: responsive.spacing.xs,
    },
    hoursText: {
      fontSize: responsive.fontSize.sm,
      color: "#ffffff",
    },
    emptyState: {
      alignItems: "center",
      paddingVertical: responsive.padding.lg,
    },
    emptyText: {
      color: "#94a3b8",
      fontSize: responsive.fontSize.md,
      marginVertical: responsive.spacing.md,
      textAlign: "center",
    },
    addButton: {
      borderRadius: 8,
      overflow: "hidden",
    },
    gradientButton: {
      paddingHorizontal: responsive.padding.md,
      paddingVertical: responsive.padding.sm,
    },
    addButtonText: {
      color: "#ffffff",
      fontWeight: "bold",
      fontSize: responsive.fontSize.sm,
    },
    statsGrid: {
      flexDirection: responsive.isSmallDevice ? "column" : "row",
      gap: responsive.spacing.sm,
    },
    statCard: {
      flex: responsive.isSmallDevice ? undefined : 1,
      padding: responsive.padding.md,
      borderRadius: 12,
      alignItems: "center",
      gap: responsive.spacing.sm,
    },
    statValue: {
      fontSize: responsive.fontSize.xl,
      fontWeight: "bold",
      color: "#ffffff",
    },
    statLabel: {
      fontSize: responsive.fontSize.xs,
      color: "#94a3b8",
      textAlign: "center",
    },
    statusGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: responsive.spacing.sm,
    },
    statusCard: {
      width: responsive.getItemWidth(2, responsive.spacing.sm),
      backgroundColor: "rgba(30, 41, 59, 0.3)",
      borderRadius: 12,
      padding: responsive.padding.md,
      borderLeftWidth: 4,
    },
    statusValue: {
      fontSize: responsive.fontSize.xxl,
      fontWeight: "bold",
      color: "#ffffff",
      marginBottom: responsive.spacing.xs,
    },
    statusLabel: {
      fontSize: responsive.fontSize.sm,
      color: "#94a3b8",
    },
    milestonesCard: {
      backgroundColor: "rgba(30, 41, 59, 0.5)",
      borderRadius: 16,
      padding: responsive.padding.md,
      borderWidth: 1,
      borderColor: "rgba(100, 116, 139, 0.2)",
    },
    milestoneItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: responsive.spacing.sm,
      paddingVertical: responsive.spacing.sm,
    },
    milestoneIcon: {
      fontSize: responsive.fontSize.xl,
    },
    milestoneInfo: {
      flex: 1,
    },
    milestoneTitle: {
      fontSize: responsive.fontSize.md,
      fontWeight: "600",
      color: "#ffffff",
    },
    milestoneDate: {
      fontSize: responsive.fontSize.xs,
      color: "#94a3b8",
    },
    emptyMilestones: {
      alignItems: "center",
      paddingVertical: responsive.padding.lg,
    },
    emptySubtext: {
      fontSize: responsive.fontSize.xs,
      color: "#64748b",
      marginTop: responsive.spacing.xs,
    },
    quickActionsGrid: {
      flexDirection: "row",
      gap: responsive.spacing.sm,
    },
    quickActionCard: {
      flex: 1,
      backgroundColor: "rgba(30, 41, 59, 0.5)",
      borderRadius: 12,
      padding: responsive.padding.md,
      alignItems: "center",
      gap: responsive.spacing.sm,
      borderWidth: 1,
      borderColor: "rgba(100, 116, 139, 0.2)",
    },
    quickActionText: {
      fontSize: responsive.fontSize.sm,
      color: "#ffffff",
      fontWeight: "600",
    },
  });

export default DashboardScreen;
