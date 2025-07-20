import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  TextInput,
  RefreshControl,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import UserProfileView from "../components/UserProfileView";

const SocialScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState("feed");
  const [selectedUser, setSelectedUser] = useState(null);
  const [activities, setActivities] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (activeTab === "feed") {
      loadActivities();
    }
  }, [activeTab]);

  useEffect(() => {
    if (searchQuery.length >= 2) {
      searchUsers();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const loadActivities = async () => {
    setLoading(true);
    try {
      // Mock activities data
      const mockActivities = [
        {
          id: "1",
          userId: "user1",
          userName: "Alex Silva",
          userAvatar: null,
          type: "media_completed",
          title: "Completou The Witcher 3",
          description: "finalizou",
          mediaTitle: "The Witcher 3: Wild Hunt",
          mediaType: "game",
          timestamp: new Date().toISOString(),
        },
        {
          id: "2",
          userId: "user2",
          userName: "Luna Martins",
          userAvatar: null,
          type: "review_added",
          title: "Adicionou uma review",
          description: "escreveu uma review para",
          mediaTitle: "Attack on Titan",
          mediaType: "anime",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "3",
          userId: "user3",
          userName: "Marcus Costa",
          userAvatar: null,
          type: "milestone_added",
          title: "Conquistou um marco",
          description: "alcançou",
          mediaTitle: "100 jogos completados",
          mediaType: null,
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        },
      ];
      setActivities(mockActivities);
    } catch (error) {
      console.error("Erro ao carregar atividades:", error);
      Alert.alert("Erro", "Não foi possível carregar as atividades");
    } finally {
      setLoading(false);
    }
  };

  const searchUsers = async () => {
    try {
      // Mock search results
      const mockUsers = [
        {
          uid: "user1",
          name: "Alex Silva",
          avatar: null,
          bio: "Apaixonado por RPGs e jogos de estratégia",
          followers: ["user2", "user3"],
          following: ["user4"],
          isFollowing: false,
        },
        {
          uid: "user2",
          name: "Luna Martins",
          avatar: null,
          bio: "Otaku e leitora compulsiva de mangás",
          followers: ["user1", "user3", "user4"],
          following: ["user1", "user5"],
          isFollowing: true,
        },
        {
          uid: "user3",
          name: "Marcus Costa",
          avatar: null,
          bio: "Gamer veterano e colecionador de conquistas",
          followers: ["user1"],
          following: ["user1", "user2"],
          isFollowing: false,
        },
      ].filter((user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      setSearchResults(mockUsers);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadActivities();
    setRefreshing(false);
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  const handleFollow = (userId) => {
    Alert.alert(
      "Seguir Usuário",
      "Funcionalidade de seguir em desenvolvimento",
      [{ text: "OK" }]
    );
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return "Agora";
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case "media_added":
        return "library-books";
      case "media_completed":
        return "check-circle";
      case "review_added":
        return "rate-review";
      case "milestone_added":
        return "emoji-events";
      case "achievement_unlocked":
        return "military-tech";
      default:
        return "notifications";
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case "media_added":
        return "#06b6d4";
      case "media_completed":
        return "#10b981";
      case "review_added":
        return "#8b5cf6";
      case "milestone_added":
        return "#f59e0b";
      case "achievement_unlocked":
        return "#ec4899";
      default:
        return "#64748b";
    }
  };

  if (selectedUser) {
    return (
      <UserProfileView
        userId={selectedUser.uid}
        userName={selectedUser.name}
        userAvatar={selectedUser.avatar}
        onBack={() => setSelectedUser(null)}
        navigation={navigation}
      />
    );
  }

  return (
    <LinearGradient
      colors={["#0f172a", "#1e293b", "#334155"]}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Social</Text>
        <Text style={styles.headerSubtitle}>
          Conecte-se com outros nerds e acompanhe suas jornadas
        </Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "feed" && styles.activeTab]}
          onPress={() => setActiveTab("feed")}
        >
          <MaterialIcons
            name="timeline"
            size={20}
            color={activeTab === "feed" ? "#ffffff" : "#64748b"}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "feed" && styles.activeTabText,
            ]}
          >
            Feed
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "search" && styles.activeTab]}
          onPress={() => setActiveTab("search")}
        >
          <MaterialIcons
            name="search"
            size={20}
            color={activeTab === "search" ? "#ffffff" : "#64748b"}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "search" && styles.activeTabText,
            ]}
          >
            Buscar
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        refreshControl={
          activeTab === "feed" ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={["#06b6d4"]}
              tintColor="#06b6d4"
            />
          ) : undefined
        }
      >
        {activeTab === "feed" && (
          <View style={styles.feedContainer}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#06b6d4" />
                <Text style={styles.loadingText}>Carregando atividades...</Text>
              </View>
            ) : activities.length > 0 ? (
              activities.map((activity) => (
                <View key={activity.id} style={styles.activityItem}>
                  <TouchableOpacity
                    style={styles.activityAvatar}
                    onPress={() => handleUserSelect(activity)}
                  >
                    {activity.userAvatar ? (
                      <Image
                        source={{ uri: activity.userAvatar }}
                        style={styles.avatarImage}
                      />
                    ) : (
                      <View style={styles.avatarPlaceholder}>
                        <Text style={styles.avatarText}>
                          {(activity.userName || "?").charAt(0).toUpperCase()}
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>

                  <View style={styles.activityContent}>
                    <View style={styles.activityHeader}>
                      <MaterialIcons
                        name={getActivityIcon(activity.type)}
                        size={16}
                        color={getActivityColor(activity.type)}
                      />
                      <TouchableOpacity
                        onPress={() => handleUserSelect(activity)}
                      >
                        <Text style={styles.activityUserName}>
                          {activity.userName}
                        </Text>
                      </TouchableOpacity>
                      <Text style={styles.activityDescription}>
                        {activity.description}
                      </Text>
                      <Text style={styles.activityTime}>
                        {formatTimeAgo(activity.timestamp)}
                      </Text>
                    </View>

                    <Text style={styles.activityTitle}>{activity.title}</Text>

                    {activity.mediaTitle && (
                      <View style={styles.mediaInfo}>
                        <Text style={styles.mediaLabel}>Mídia:</Text>
                        <Text style={styles.mediaTitle}>{activity.mediaTitle}</Text>
                        {activity.mediaType && (
                          <View style={styles.mediaTypeTag}>
                            <Text style={styles.mediaTypeText}>
                              {activity.mediaType}
                            </Text>
                          </View>
                        )}
                      </View>
                    )}
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <MaterialIcons name="timeline" size={48} color="#64748b" />
                <Text style={styles.emptyTitle}>Nenhuma atividade ainda</Text>
                <Text style={styles.emptyText}>
                  Siga outros usuários para ver suas atividades aqui
                </Text>
                <TouchableOpacity
                  style={styles.searchButton}
                  onPress={() => setActiveTab("search")}
                >
                  <MaterialIcons name="search" size={20} color="#ffffff" />
                  <Text style={styles.searchButtonText}>Buscar Usuários</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {activeTab === "search" && (
          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <MaterialIcons name="search" size={20} color="#64748b" />
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar usuários..."
                placeholderTextColor="#64748b"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            {searchQuery.length < 2 ? (
              <View style={styles.searchEmptyContainer}>
                <MaterialIcons name="search" size={48} color="#64748b" />
                <Text style={styles.searchEmptyTitle}>Buscar Usuários</Text>
                <Text style={styles.searchEmptyText}>
                  Digite pelo menos 2 caracteres para buscar usuários
                </Text>
              </View>
            ) : searchResults.length > 0 ? (
              searchResults.map((user) => (
                <View key={user.uid} style={styles.userItem}>
                  <TouchableOpacity
                    style={styles.userAvatar}
                    onPress={() => handleUserSelect(user)}
                  >
                    {user.avatar ? (
                      <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
                    ) : (
                      <View style={styles.avatarPlaceholder}>
                        <Text style={styles.avatarText}>
                          {(user.name || "?").charAt(0).toUpperCase()}
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.userInfo}
                    onPress={() => handleUserSelect(user)}
                  >
                    <Text style={styles.userName}>{user.name}</Text>
                    {user.bio && <Text style={styles.userBio}>{user.bio}</Text>}
                    <View style={styles.userStats}>
                      <Text style={styles.userStat}>
                        {user.followers.length} seguidores
                      </Text>
                      <Text style={styles.userStat}>
                        {user.following.length} seguindo
                      </Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.followButton,
                      user.isFollowing && styles.followingButton,
                    ]}
                    onPress={() => handleFollow(user.uid)}
                  >
                    <MaterialIcons
                      name={user.isFollowing ? "person-remove" : "person-add"}
                      size={16}
                      color="#ffffff"
                    />
                    <Text style={styles.followButtonText}>
                      {user.isFollowing ? "Seguindo" : "Seguir"}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <View style={styles.noResultsContainer}>
                <MaterialIcons name="person-search" size={48} color="#64748b" />
                <Text style={styles.noResultsText}>
                  Nenhum usuário encontrado para "{searchQuery}"
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#94a3b8",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(30, 41, 59, 0.5)",
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 6,
    gap: 8,
  },
  activeTab: {
    backgroundColor: "#06b6d4",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748b",
  },
  activeTabText: {
    color: "#ffffff",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  loadingText: {
    color: "#94a3b8",
    marginTop: 10,
    fontSize: 16,
  },
  feedContainer: {
    paddingBottom: 20,
  },
  activityItem: {
    flexDirection: "row",
    backgroundColor: "rgba(30, 41, 59, 0.5)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(100, 116, 139, 0.2)",
  },
  activityAvatar: {
    marginRight: 12,
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(6, 182, 212, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
  },
  activityContent: {
    flex: 1,
  },
  activityHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 6,
  },
  activityUserName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
  },
  activityDescription: {
    fontSize: 14,
    color: "#94a3b8",
  },
  activityTime: {
    fontSize: 12,
    color: "#64748b",
    marginLeft: "auto",
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 4,
  },
  mediaInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  mediaLabel: {
    fontSize: 12,
    color: "#94a3b8",
  },
  mediaTitle: {
    fontSize: 12,
    color: "#06b6d4",
    fontWeight: "500",
  },
  mediaTypeTag: {
    backgroundColor: "rgba(100, 116, 139, 0.3)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  mediaTypeText: {
    fontSize: 10,
    color: "#94a3b8",
  },
  emptyContainer: {
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
  emptyText: {
    fontSize: 14,
    color: "#94a3b8",
    textAlign: "center",
    marginBottom: 20,
  },
  searchButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#06b6d4",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  searchButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  searchContainer: {
    paddingBottom: 20,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(30, 41, 59, 0.5)",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(100, 116, 139, 0.2)",
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#ffffff",
  },
  searchEmptyContainer: {
    alignItems: "center",
    paddingVertical: 60,
  },
  searchEmptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    marginTop: 16,
    marginBottom: 8,
  },
  searchEmptyText: {
    fontSize: 14,
    color: "#94a3b8",
    textAlign: "center",
  },
  userItem: {
    flexDirection: "row",
    backgroundColor: "rgba(30, 41, 59, 0.5)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(100, 116, 139, 0.2)",
    alignItems: "center",
  },
  userAvatar: {
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 4,
  },
  userBio: {
    fontSize: 14,
    color: "#94a3b8",
    marginBottom: 6,
  },
  userStats: {
    flexDirection: "row",
    gap: 12,
  },
  userStat: {
    fontSize: 12,
    color: "#64748b",
  },
  followButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#06b6d4",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 4,
  },
  followingButton: {
    backgroundColor: "#10b981",
  },
  followButtonText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
  },
  noResultsContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  noResultsText: {
    fontSize: 14,
    color: "#94a3b8",
    textAlign: "center",
    marginTop: 16,
  },
});

export default SocialScreen;
