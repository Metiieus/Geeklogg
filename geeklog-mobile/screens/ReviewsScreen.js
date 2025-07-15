import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";

const ReviewsScreen = () => {
  return (
    <LinearGradient
      colors={["#0f172a", "#1e293b", "#334155"]}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Reviews</Text>
          <Text style={styles.subtitle}>Suas análises e avaliações</Text>
        </View>

        <View style={styles.emptyState}>
          <MaterialIcons name="rate-review" size={64} color="#64748b" />
          <Text style={styles.emptyTitle}>Nenhum review ainda</Text>
          <Text style={styles.emptySubtitle}>
            Comece criando seu primeiro review
          </Text>
        </View>
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
