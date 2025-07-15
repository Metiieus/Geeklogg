import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "../contexts/AuthContext";
import { useAppContext } from "../contexts/AppContext";

const ProfileScreen = ({ navigation }) => {
  const { logout, user } = useAuth();
  const { settings, stats, loading, loadUserData } = useAppContext();
  const [refreshing, setRefreshing] = useState(false);

  const handleLogout = () => {
    Alert.alert("Sair", "Tem certeza que deseja sair?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Sair", style: "destructive", onPress: logout },
    ]);
  };

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

  const handleEditProfile = () => {
    Alert.alert("Editar Perfil", "Funcionalidade em desenvolvimento", [
      { text: "OK" },
    ]);
  };

  const handleFavorites = () => {
    Alert.alert("Favoritos", "Funcionalidade em desenvolvimento", [
      { text: "OK" },
    ]);
  };

  const handleSettings = () => {
    Alert.alert("Configurações", "Funcionalidade em desenvolvimento", [
      { text: "OK" },
    ]);
  };

  const handleHelp = () => {
    Alert.alert("Ajuda", "Entre em contato conosco em support@geeklog.com", [
      { text: "OK" },
    ]);
  };

  const handleAbout = () => {
    Alert.alert(
      "Sobre o GeekLog",
      "GeekLog v1.0.0\n\nSeu diário pessoal de entretenimento.\nAcompanhe jogos, livros, filmes e suas experiências.",
      [{ text: "OK" }],
    );
  };

  const handleSubscription = () => {
    navigation.navigate("Subscription");
  };

  const menuItems = [
    { icon: "person", title: "Editar Perfil", onPress: handleEditProfile },
    { icon: "favorite", title: "Favoritos", onPress: handleFavorites },
    {
      icon: "star",
      title: "Assinatura Premium",
      onPress: handleSubscription,
      isSpecial: true,
    },
    { icon: "settings", title: "Configurações", onPress: handleSettings },
    { icon: "help", title: "Ajuda", onPress: handleHelp },
    { icon: "info", title: "Sobre", onPress: handleAbout },
  ];

  if (loading && !refreshing) {
    return (
      <LinearGradient
        colors={["#0f172a", "#1e293b", "#334155"]}
        style={[styles.container, styles.loadingContainer]}
      >
        <ActivityIndicator size="large" color="#06b6d4" />
        <Text style={styles.loadingText}>Carregando perfil...</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={["#0f172a", "#1e293b", "#334155"]}
      style={styles.container}
    >
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={["#06b6d4"]}
            tintColor="#06b6d4"
          />
        }
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <MaterialIcons name="person" size={48} color="#ffffff" />
          </View>
          <Text style={styles.userName}>{settings.name || "Usuário"}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          {settings.bio && <Text style={styles.userBio}>{settings.bio}</Text>}
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.games}</Text>
            <Text style={styles.statLabel}>Jogos</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.books}</Text>
            <Text style={styles.statLabel}>Livros</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.movies}</Text>
            <Text style={styles.statLabel}>Filmes</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.reviews}</Text>
            <Text style={styles.statLabel}>Reviews</Text>
          </View>
        </View>

        {/* Menu */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.menuItem,
                item.isSpecial && styles.premiumMenuItem,
              ]}
              onPress={item.onPress}
            >
              <MaterialIcons
                name={item.icon}
                size={24}
                color={item.isSpecial ? "#f59e0b" : "#06b6d4"}
              />
              <Text
                style={[
                  styles.menuItemText,
                  item.isSpecial && styles.premiumMenuText,
                ]}
              >
                {item.title}
              </Text>
              <MaterialIcons name="chevron-right" size={24} color="#64748b" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <MaterialIcons name="logout" size={20} color="#ef4444" />
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#94a3b8",
    marginTop: 10,
    fontSize: 16,
  },
  scrollView: { flex: 1, paddingHorizontal: 20 },
  profileHeader: { alignItems: "center", paddingTop: 40, paddingBottom: 30 },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(6, 182, 212, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 4,
  },
  userEmail: { fontSize: 14, color: "#94a3b8", marginBottom: 8 },
  userBio: {
    fontSize: 14,
    color: "#94a3b8",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(30, 41, 59, 0.5)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "rgba(100, 116, 139, 0.2)",
  },
  statItem: { flex: 1, alignItems: "center" },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 4,
  },
  statLabel: { fontSize: 12, color: "#94a3b8" },
  menuContainer: { gap: 12, marginBottom: 40 },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(30, 41, 59, 0.5)",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(100, 116, 139, 0.2)",
    gap: 12,
  },
  premiumMenuItem: {
    backgroundColor: "rgba(245, 158, 11, 0.1)",
    borderColor: "rgba(245, 158, 11, 0.3)",
  },
  menuItemText: { flex: 1, fontSize: 16, color: "#ffffff" },
  premiumMenuText: {
    color: "#f59e0b",
    fontWeight: "600",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.2)",
    gap: 8,
    marginBottom: 40,
  },
  logoutText: { fontSize: 16, color: "#ef4444", fontWeight: "600" },
});

export default ProfileScreen;
