import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { FavoriteItem } from "../App";

export interface UserProfile {
  name: string;
  avatar?: string;
  bio?: string;
  favorites: {
    characters: FavoriteItem[];
    games: FavoriteItem[];
    movies: FavoriteItem[];
  };
  defaultLibrarySort: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      console.warn("Firebase auth not initialized");
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          // Check if we're using mock Firestore (demo mode)
          if (db && typeof db.collection === "function") {
            console.log("🎭 Using mock user profile for demo mode");
            const normalizedProfile: UserProfile = {
              name:
                currentUser.displayName ||
                currentUser.email?.split("@")[0] ||
                "Demo User",
              avatar: undefined,
              bio: "This is a demo profile using mock authentication.",
              favorites: {
                characters: [],
                games: [],
                movies: [],
              },
              defaultLibrarySort: "updatedAt",
            };
            setProfile(normalizedProfile);
          } else if (db) {
            // Real Firestore
            const userRef = doc(db, "users", currentUser.uid);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
              const userData = userSnap.data();
              console.log("📥 Dados do usuário carregados:", userData);
              // Normalize favorites data to ensure consistent structure
              const normalizedProfile: UserProfile = {
                name:
                  userData.nome ||
                  userData.name ||
                  userData.apelido ||
                  "Usuário",
                avatar: userData.avatar,
                bio: userData.bio || "",
                favorites: {
                  characters: Array.isArray(userData.favorites?.characters)
                    ? userData.favorites.characters.map((item: any) =>
                        typeof item === "string"
                          ? { id: Math.random().toString(), name: item }
                          : item,
                      )
                    : [],
                  games: Array.isArray(userData.favorites?.games)
                    ? userData.favorites.games.map((item: any) =>
                        typeof item === "string"
                          ? { id: Math.random().toString(), name: item }
                          : item,
                      )
                    : [],
                  movies: Array.isArray(userData.favorites?.movies)
                    ? userData.favorites.movies.map((item: any) =>
                        typeof item === "string"
                          ? { id: Math.random().toString(), name: item }
                          : item,
                      )
                    : [],
                },
                defaultLibrarySort: userData.defaultLibrarySort || "updatedAt",
              } as UserProfile;
              console.log("✅ Perfil normalizado:", normalizedProfile);
              setProfile(normalizedProfile);
            } else {
              console.log("Perfil não encontrado no Firestore.");
              setProfile(null);
            }
          } else {
            console.log("Firestore não disponível.");
            setProfile(null);
          }
        } catch (error) {
          console.error("Erro ao buscar perfil no Firestore:", error);
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    if (!auth) {
      throw new Error("Firebase auth not initialized");
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      throw error;
    }
  };

  const logout = async () => {
    if (!auth) {
      console.warn("Firebase auth not initialized");
      return;
    }
    await signOut(auth);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
