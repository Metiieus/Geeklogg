import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { useAppContext } from "../contexts/AppContext";

const { width } = Dimensions.get("window");

const DashboardScreen = ({ navigation }) => {
  const { mediaItems, reviews, milestones, settings } = useAppContext();

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
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )[0];
  };

  const getStats = () => {
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
      counts[item.status]++;
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
  const stats = getStats();
  const statusCounts = getStatusCounts();

  return (
    <LinearGradient
      colors={["#0f172a", "#1e293b", "#334155"]}
      style={styles.container}
    >
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              {getGreeting()}, {settings.name || "Nerd"}
            </Text>
            <Text style={styles.subtitle}>
              Bem-vindo de volta à sua jornada nerd
            </Text>
          </View>
          <Text style={styles.date}>
            {new Date().toLocaleDateString("pt-BR")}
          </Text>
        </View>

        {/* Featured Content */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <MaterialIcons name="star" size={20} color="#fbbf24" /> Atualizado
            Recentemente
          </Text>

          <View style={styles.featuredCard}>
            {recentItem ? (
              <View style={styles.recentItemContainer}>
                <View style={styles.coverPlaceholder}>
                  <MaterialIcons
                    name="library-books"
                    size={32}
                    color="#64748b"
                  />
                </View>
                <View style={styles.recentItemInfo}>
                  <Text style={styles.recentItemTitle}>{recentItem.title}</Text>
                  <Text style={styles.recentItemStatus}>
                    {getStatusLabel(recentItem.status)}
                  </Text>
                  {recentItem.rating && (
                    <View style={styles.ratingContainer}>
                      <MaterialIcons name="star" size={16} color="#fbbf24" />
                      <Text style={styles.ratingText}>
                        {recentItem.rating}/10
                      </Text>
                    </View>
                  )}
                  {recentItem.hoursSpent && (
                    <View style={styles.hoursContainer}>
                      <MaterialIcons
                        name="schedule"
                        size={16}
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

        {/* Quick Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estatísticas Rápidas</Text>
          <View style={styles.statsGrid}>
            <View
              style={[
                styles.statCard,
                { backgroundColor: "rgba(6, 182, 212, 0.1)" },
              ]}
            >
              <MaterialIcons name="schedule" size={24} color="#06b6d4" />
              <Text style={styles.statValue}>
                {stats.totalHours.toLocaleString()}
              </Text>
              <Text style={styles.statLabel}>Total de Horas</Text>
            </View>

            <View
              style={[
                styles.statCard,
                { backgroundColor: "rgba(34, 197, 94, 0.1)" },
              ]}
            >
              <MaterialIcons name="trending-up" size={24} color="#22c55e" />
              <Text style={styles.statValue}>{stats.completed}</Text>
              <Text style={styles.statLabel}>Concluídos</Text>
            </View>

            <View
              style={[
                styles.statCard,
                { backgroundColor: "rgba(251, 191, 36, 0.1)" },
              ]}
            >
              <MaterialIcons name="star" size={24} color="#fbbf24" />
              <Text style={styles.statValue}>
                {stats.avgRating.toFixed(1)}/10
              </Text>
              <Text style={styles.statLabel}>Nota Média</Text>
            </View>
          </View>
        </View>

        {/* Status Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Visão Geral</Text>
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

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <MaterialIcons name="event" size={20} color="#8b5cf6" /> Marcos
            Recentes
          </Text>

          <View style={styles.milestonesCard}>
            {milestones.length > 0 ? (
              milestones.slice(0, 3).map((milestone) => (
                <View key={milestone.id} style={styles.milestoneItem}>
                  <Text style={styles.milestoneIcon}>{milestone.icon}</Text>
                  <View style={styles.milestoneInfo}>
                    <Text style={styles.milestoneTitle}>{milestone.title}</Text>
                    <Text style={styles.milestoneDate}>
                      {new Date(milestone.date).toLocaleDateString("pt-BR")}
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
      </ScrollView>
    </LinearGradient>
  );
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
    paddingBottom: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#94a3b8",
  },
  date: {
    fontSize: 12,
    color: "#94a3b8",
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  featuredCard: {
    backgroundColor: "rgba(30, 41, 59, 0.5)",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(100, 116, 139, 0.2)",
  },
  recentItemContainer: {
    flexDirection: "row",
    gap: 16,
  },
  coverPlaceholder: {
    width: 60,
    height: 80,
    backgroundColor: "rgba(100, 116, 139, 0.2)",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  recentItemInfo: {
    flex: 1,
    gap: 6,
  },
  recentItemTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
  },
  recentItemStatus: {
    fontSize: 14,
    color: "#94a3b8",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    color: "#ffffff",
  },
  hoursContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  hoursText: {
    fontSize: 14,
    color: "#ffffff",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 20,
  },
  emptyText: {
    color: "#94a3b8",
    fontSize: 16,
    marginBottom: 16,
  },
  addButton: {
    borderRadius: 8,
    overflow: "hidden",
  },
  gradientButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  addButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    gap: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
  },
  statLabel: {
    fontSize: 12,
    color: "#94a3b8",
    textAlign: "center",
  },
  statusGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statusCard: {
    width: (width - 52) / 2,
    backgroundColor: "rgba(30, 41, 59, 0.3)",
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
  },
  statusValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 4,
  },
  statusLabel: {
    fontSize: 14,
    color: "#94a3b8",
  },
  milestonesCard: {
    backgroundColor: "rgba(30, 41, 59, 0.5)",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(100, 116, 139, 0.2)",
  },
  milestoneItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 8,
  },
  milestoneIcon: {
    fontSize: 24,
  },
  milestoneInfo: {
    flex: 1,
  },
  milestoneTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
  milestoneDate: {
    fontSize: 12,
    color: "#94a3b8",
  },
  emptyMilestones: {
    alignItems: "center",
    paddingVertical: 20,
  },
  emptySubtext: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 4,
  },
});

export default DashboardScreen;
