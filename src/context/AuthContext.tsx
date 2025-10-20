// src/context/AuthContext.tsx
import type { ReactNode } from "react";
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  deleteUser,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  isPremium?: boolean;
  bio?: string;
  favoriteGenres?: string[];
  profileImage?: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      console.warn("⚠️ Firebase auth não inicializado");
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("🔐 Auth state changed:", user?.uid);
      setUser(user);

      if (user && db) {
        try {
          // ✅ Verificar se o documento do usuário existe
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);

          if (!userDoc.exists()) {
            // 🆕 Criar documento do usuário
            console.log("📝 Criando documento do usuário...");
            const userData = {
              uid: user.uid,
              email: user.email || "",
              name: user.displayName || user.email?.split("@")[0] || "Usuário",
              bio: "",
              avatar: "",
              cover: "",
              isPremium: false,
              favoriteGenres: [],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };

            await setDoc(userDocRef, userData);
            console.log("✅ Documento do usuário criado com sucesso!");
          } else {
            console.log("✅ Documento do usuário já existe");
          }

          // Carregar dados do perfil
          const userData = userDoc.exists() ? userDoc.data() : null;
          
          setProfile({
            uid: user.uid,
            email: user.email || "",
            displayName: userData?.name || user.displayName || user.email?.split("@")[0] || "User",
            isPremium: userData?.isPremium || false,
            bio: userData?.bio || "",
            favoriteGenres: userData?.favoriteGenres || [],
            profileImage: userData?.avatar || "",
          });

          console.log("✅ Perfil carregado:", profile);
        } catch (error) {
          console.error("❌ Erro ao configurar usuário:", error);
        }
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    return () => unsubscribe && unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    if (!auth) throw new Error("Auth não inicializado");
    await signInWithEmailAndPassword(auth, email, password);
  };

  const register = async (email: string, password: string) => {
    if (!auth) throw new Error("Auth não inicializado");
    await createUserWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    if (!auth) throw new Error("Auth não inicializado");
    await signOut(auth);
  };

  const resetPassword = async (email: string) => {
    if (!auth) throw new Error("Auth não inicializado");
    await sendPasswordResetEmail(auth, email);
  };

  const deleteAccount = async () => {
    if (!user) throw new Error("Nenhum usuário logado.");
    await deleteUser(user);
  };

  const value: AuthContextType = {
    user,
    profile,
    loading,
    login,
    register,
    logout,
    resetPassword,
    deleteAccount,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};