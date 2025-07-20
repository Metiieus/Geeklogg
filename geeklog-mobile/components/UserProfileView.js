import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";

const UserProfileView = ({ userId, userName, userAvatar, onBack, navigation }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    loadUserProfile();
  }, [userId]);

  const loadUserProfile = async () => {
    try {
      // In a real implementation, you would fetch the full profile from your backend
      // For now, we'll create a mock profile based on the passed data
      const mockProfile = {
        uid: userId,
        name: userName,
        avatar: userAvatar,
        bio: "Um amante de tecnologia e cultura geek que adora compartilhar suas experiências.",
        isPublic: true,
        followers: ["user1", "user2", "user3"],
        following: ["user4", "user5"],
        createdAt: new Date().toISOString(),
        stats: {
          totalHours: 1250,
          completed: 45,
          avgRating: 8.7,
        },
      };
      
      setProfile(mockProfile);
      // Mock following status
      setIsFollowing(Math.random() > 0.5);
    } catch (error) {
      console.error("Erro ao carregar perfil:", error);
      Alert.alert("Erro", "Não foi possível carregar o perfil do usuário");
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = () => {
    Alert.alert(
      isFollowing ? "Deixar de seguir" : "Seguir",
      `Deseja ${isFollowing ? "deixar de seguir" : "seguir"} ${userName}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: isFollowing ? "Deixar de seguir" : "Seguir",
          onPress: () => {
            setIsFollowing(!isFollowing);
            // In a real app, you would call your follow/unfollow API here
          },
        },
      ]
    );
  };

  const handleMessage = () => {
    Alert.alert("Mensagem", "Funcionalidade de mensagens em desenvolvimento", [
      { text: "OK" },
    ]);
  };

  if (loading) {
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

  if (!profile) {
    return (
      <LinearGradient
        colors={["#0f172a", "#1e293b", "#334155"]}
        style={[styles.container, styles.loadingContainer]}
      >
        <MaterialIcons name="person-off" size={48} color="#64748b" />
        <Text style={styles.errorText}>Usuário não encontrado</Text>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  if (!profile.isPublic) {
    return (
      <LinearGradient
        colors={["#0f172a", "#1e293b", "#334155"]}
        style={[styles.container, styles.loadingContainer]}
      >
        <MaterialIcons name="lock" size={48} color="#64748b" />
        <Text style={styles.privateTitle}>Perfil Privado</Text>
        <Text style={styles.privateText}>
          Este usuário mantém seu perfil privado
        </Text>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={["#0f172a", "#1e293b", "#334155"]}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backIcon} onPress={onBack}>
            <MaterialIcons name="arrow-back" size={24} color="#94a3b8" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Perfil do Usuário</Text>
        </View>

        {/* Profile Info */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            {profile.avatar ? (
              <Image source={{ uri: profile.avatar }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>
                  {(profile.name || "?").charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
          </View>

          <Text style={styles.userName}>{profile.name}</Text>
          {profile.bio && <Text style={styles.userBio}>{profile.bio}</Text>}

          <View style={styles.socialStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{profile.followers.length}</Text>
              <Text style={styles.statLabel}>Seguidores</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{profile.following.length}</Text>
              <Text style={styles.statLabel}>Seguindo</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {new Date(profile.createdAt).getFullYear()}
              </Text>
              <Text style={styles.statLabel}>Desde</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[
                styles.followButton,
                isFollowing && styles.followingButton,
              ]}
              onPress={handleFollow}
            >
              <MaterialIcons
                name={isFollowing ? "person-remove" : "person-add"}
                size={20}
                color="#ffffff"
              />
              <Text style={styles.followButtonText}>
                {isFollowing ? "Seguindo" : "Seguir"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.messageButton} onPress={handleMessage}>
              <MaterialIcons name="message" size={20} color="#06b6d4" />
              <Text style={styles.messageButtonText}>Mensagem</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <MaterialIcons name="schedule" size={24} color="#06b6d4" />
            <Text style={styles.statCardLabel}>Total de Horas</Text>
            <Text style={styles.statCardValue}>
              {profile.stats.totalHours.toLocaleString()}
            </Text>
          </View>

          <View style={styles.statCard}>
            <MaterialIcons name="check-circle" size={24} color="#10b981" />
            <Text style={styles.statCardLabel}>Concluídos</Text>
            <Text style={styles.statCardValue}>{profile.stats.completed}</Text>
          </View>

          <View style={styles.statCard}>
            <MaterialIcons name="star" size={24} color="#f59e0b" />
            <Text style={styles.statCardLabel}>Nota Média</Text>
            <Text style={styles.statCardValue}>
              {profile.stats.avgRating.toFixed(1)}/10
            </Text>
          </View>
        </View>

        {/* Recent Activity Placeholder */}
        <View style={styles.activitySection}>
          <Text style={styles.sectionTitle}>Atividade Recente</Text>
          <View style={styles.noActivityContainer}>
            <MaterialIcons name="timeline" size={48} color="#64748b" />
            <Text style={styles.noActivityText}>
              Nenhuma atividade recente disponível
            </Text>
          </View>
        </View>
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
  errorText: {
    color: "#94a3b8",
    fontSize: 16,
    marginTop: 10,
  },
  privateTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
  },
  privateText: {
    color: "#94a3b8",
    fontSize: 14,
    marginTop: 5,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  backButton: {
    backgroundColor: "rgba(6, 182, 212, 0.2)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 20,
  },
  backButtonText: {
    color: "#06b6d4",
    fontSize: 16,
    fontWeight: "600",
  },
  scrollView: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  backIcon: {
    padding: 8,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
  },
  profileSection: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(6, 182, 212, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ffffff",
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 8,
  },
  userBio: {
    fontSize: 14,
    color: "#94a3b8",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },
  socialStats: {
    flexDirection: "row",
    marginBottom: 24,
  },
  statItem: {
    alignItems: "center",
    marginHorizontal: 20,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
  },
  statLabel: {
    fontSize: 12,
    color: "#94a3b8",
    marginTop: 2,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  followButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#06b6d4",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  followingButton: {
    backgroundColor: "#10b981",
  },
  followButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  messageButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(6, 182, 212, 0.2)",
    borderWidth: 1,
    borderColor: "#06b6d4",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  messageButtonText: {
    color: "#06b6d4",
    fontSize: 16,
    fontWeight: "600",
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 30,
  },
  statCard: {
    flex: 1,
    backgroundColor: "rgba(30, 41, 59, 0.5)",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(100, 116, 139, 0.2)",
  },
  statCardLabel: {
    fontSize: 12,
    color: "#94a3b8",
    marginTop: 8,
    textAlign: "center",
  },
  statCardValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
    marginTop: 4,
  },
  activitySection: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 16,
  },
  noActivityContainer: {
    backgroundColor: "rgba(30, 41, 59, 0.5)",
    borderRadius: 12,
    padding: 40,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(100, 116, 139, 0.2)",
  },
  noActivityText: {
    color: "#94a3b8",
    fontSize: 14,
    marginTop: 12,
    textAlign: "center",
  },
});

export default UserProfileView;
