import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { User, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, sendPasswordResetEmail, deleteUser } from 'firebase/auth';
import { getAuth, isFirebaseOffline, waitForFirebaseInit } from '../firebase';

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
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const setupAuth = async () => {
      try {
        // Wait for Firebase initialization to complete
        await waitForFirebaseInit();
        
        const auth = getAuth();

        if (!auth || isFirebaseOffline()) {
          console.warn('Firebase Auth not available - running in offline mode');
          setLoading(false);
          return;
        }

        unsubscribe = onAuthStateChanged(auth, (user) => {
          setUser(user);
          if (user) {
            // Create a basic profile from user data
            setProfile({
              uid: user.uid,
              email: user.email || '',
              displayName: user.displayName || user.email?.split('@')[0] || 'User',
              isPremium: false,
              bio: '',
              favoriteGenres: [],
              profileImage: ''
            });
          } else {
            setProfile(null);
          }
          setLoading(false);
        });
      } catch (error) {
        console.error('Failed to setup auth:', error);
        setLoading(false);
      }
    };

    setupAuth();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const login = async (email: string, password: string) => {
    // Wait for Firebase initialization before attempting login
    await waitForFirebaseInit();
    
    const auth = getAuth();

    if (!auth || isFirebaseOffline()) {
      throw new Error('Firebase Auth not available. Running in offline mode.');
    }

    await signInWithEmailAndPassword(auth, email, password);
  };

  const register = async (email: string, password: string) => {
    // Wait for Firebase initialization before attempting registration
    await waitForFirebaseInit();
    
    const auth = getAuth();

    if (!auth || isFirebaseOffline()) {
      throw new Error('Firebase Auth not available. Running in offline mode.');
    }

    await createUserWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    // Wait for Firebase initialization before attempting logout
    await waitForFirebaseInit();
    
    const auth = getAuth();

    if (!auth || isFirebaseOffline()) {
      throw new Error('Firebase Auth not available. Running in offline mode.');
    }

    await signOut(auth);
  };

  const resetPassword = async (email: string) => {
    // Wait for Firebase initialization before attempting password reset
    await waitForFirebaseInit();
    
    const auth = getAuth();

    if (!auth || isFirebaseOffline()) {
      throw new Error('Firebase Auth not available. Running in offline mode.');
    }

    // Verificar conectividade básica
    if (typeof navigator !== 'undefined' && 'onLine' in navigator && !navigator.onLine) {
      throw new Error('auth/network-request-failed');
    }

    console.log('🔄 Tentando enviar email de reset');
    console.log('🔧 Current origin:', window.location.origin);
    console.log('🔧 Firebase config check:', {
      hasAuth: !!auth,
      authDomain: 'configured',
      apiKey: auth?.config?.apiKey ? 'Present' : 'Missing'
    });

    try {
      // Enviar email sem configurações customizadas para evitar problemas de CORS/rede
      await sendPasswordResetEmail(auth, email);
      console.log('✅ Email de reset enviado com sucesso');
    } catch (error) {
      console.error('❌ Erro ao enviar email de reset:', error);
      throw error;
    }
  };

  const deleteAccount = async () => {
    // Wait for Firebase initialization before attempting account deletion
    await waitForFirebaseInit();
    
    const auth = getAuth();

    if (!auth || !user || isFirebaseOffline()) {
      throw new Error('Firebase Auth not available or user not logged in.');
    }

    try {
      console.log('🗑️ Iniciando exclusão da conta do usuário');

      // TODO: Em uma implementação real, aqui você faria:
      // 1. Exclusão de todos os dados do usuário no Firestore
      // 2. Exclusão de arquivos no Storage
      // 3. Outros cleanup necessários

      // Por enquanto, apenas deletamos o usuário do Auth
      await deleteUser(user);
      console.log('✅ Conta excluída com sucesso');

      // O onAuthStateChanged vai lidar com a limpeza do estado
    } catch (error) {
      console.error('❌ Erro ao excluir conta:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    profile,
    loading,
    login,
    register,
    logout,
    resetPassword,
    deleteAccount
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
