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
import { auth, db } from "../firebase"; // ✅ usa o auth e db exportados do firebase.ts
import { doc, getDoc } from "firebase/firestore";

import { UserProfile } from "../types";

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
      setUser(user);

      if (user) {
        // Carregar dados do perfil do Firestore
        try {
          if (db) {
            const userDocRef = doc(db, "users", user.uid);
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
              const userData = userDocSnap.data();
              console.log("✅ Dados do usuário carregados do Firestore:", userData);

              setProfile({
                uid: user.uid,
                email: user.email || "",
                displayName: userData.displayName || userData.name || user.email?.split("@")[0] || "User",
                isPremium: userData.isPremium || false,
                bio: userData.bio || "",
                favoriteGenres: userData.favoriteGenres || [],
                profileImage: userData.avatar || userData.profileImage || "",
              });
            } else {
              console.warn("⚠️ Documento do usuário não encontrado no Firestore");
              // Fallback para dados básicos do Firebase Auth
              setProfile({
                uid: user.uid,
                email: user.email || "",
                displayName: user.displayName || user.email?.split("@")[0] || "User",
                isPremium: false,
                bio: "",
                favoriteGenres: [],
                profileImage: "",
              });
            }
          } else {
            console.warn("⚠️ Firestore não inicializado");
            // Fallback para dados básicos do Firebase Auth
            setProfile({
              uid: user.uid,
              email: user.email || "",
              displayName: user.displayName || user.email?.split("@")[0] || "User",
              isPremium: false,
              bio: "",
              favoriteGenres: [],
              profileImage: "",
            });
          }
        } catch (error) {
          console.error("❌ Erro ao carregar dados do usuário do Firestore:", error);
          // Fallback para dados básicos do Firebase Auth
          setProfile({
            uid: user.uid,
            email: user.email || "",
            displayName: user.displayName || user.email?.split("@")[0] || "User",
            isPremium: false,
            bio: "",
            favoriteGenres: [],
            profileImage: "",
          });
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