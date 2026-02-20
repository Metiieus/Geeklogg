/**
 * Firebase configuration for React Native (via @react-native-firebase)
 *
 * IMPORTANTE: No React Native com @react-native-firebase, a inicialização
 * do Firebase é feita automaticamente via google-services.json (Android)
 * e GoogleService-Info.plist (iOS). NÃO é necessário chamar initializeApp().
 *
 * Para configurar:
 * 1. Acesse o Firebase Console: https://console.firebase.google.com
 * 2. Selecione o projeto Geeklogg
 * 3. Vá em Configurações do Projeto > Seus apps > Android
 * 4. Baixe o google-services.json
 * 5. Coloque o arquivo na raiz do projeto: /GeekloggApp/google-services.json
 */

import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";

export { auth, firestore, storage };

// Referências às coleções do Firestore (mesmas do projeto web)
export const Collections = {
  USERS: "users",
  MEDIA: "media",
  REVIEWS: "reviews",
  MILESTONES: "milestones",
  ACHIEVEMENTS: "achievements",
  STREAKS: "streaks",
  CHALLENGES: "challenges",
  SOCIAL: "social",
  SETTINGS: "settings",
} as const;
