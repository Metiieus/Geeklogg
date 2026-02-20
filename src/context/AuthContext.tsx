import React, { createContext, useContext, useEffect, useState } from "react";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { Collections } from "../services/firebase";

interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isPremium?: boolean;
  createdAt?: Date;
}

interface AuthContextType {
  user: FirebaseAuthTypes.User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        // Buscar perfil do Firestore
        try {
          const doc = await firestore()
            .collection(Collections.USERS)
            .doc(firebaseUser.uid)
            .get();

          if (doc.exists) {
            setUserProfile(doc.data() as UserProfile);
          } else {
            // Criar perfil inicial
            const newProfile: UserProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
              isPremium: false,
              createdAt: new Date(),
            };
            await firestore()
              .collection(Collections.USERS)
              .doc(firebaseUser.uid)
              .set(newProfile);
            setUserProfile(newProfile);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    await auth().signInWithEmailAndPassword(email, password);
  };

  const signUp = async (email: string, password: string, displayName: string) => {
    const { user: newUser } = await auth().createUserWithEmailAndPassword(email, password);
    await newUser.updateProfile({ displayName });

    // Criar documento do usuário no Firestore
    await firestore().collection(Collections.USERS).doc(newUser.uid).set({
      uid: newUser.uid,
      email,
      displayName,
      photoURL: null,
      isPremium: false,
      createdAt: firestore.FieldValue.serverTimestamp(),
    });
  };

  const signOut = async () => {
    await auth().signOut();
  };

  const signInWithGoogle = async () => {
    // TODO: Implementar Google Sign-In com @react-native-google-signin/google-signin
    throw new Error("Google Sign-In: configure @react-native-google-signin/google-signin");
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;
    await firestore().collection(Collections.USERS).doc(user.uid).update(data);
    setUserProfile((prev) => (prev ? { ...prev, ...data } : null));
  };

  return (
    <AuthContext.Provider
      value={{ user, userProfile, loading, signIn, signUp, signOut, signInWithGoogle, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
