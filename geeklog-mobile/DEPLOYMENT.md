# 📱 GeekLog Mobile - Guia de Deployment

Este guia explica como fazer o deploy do GeekLog Mobile para iOS e Android usando Capacitor.

## 🚀 Configuração Inicial

### 1. Pré-requisitos

#### Para Android:

- **Android Studio** (versão mais recente)
- **Java Development Kit (JDK)** 11 ou superior
- **Android SDK** (através do Android Studio)
- **Gradle** (instalado automaticamente com Android Studio)

#### Para iOS (somente no macOS):

- **Xcode** (versão mais recente)
- **iOS SDK** (através do Xcode)
- **CocoaPods** (`sudo gem install cocoapods`)
- **Conta de Desenvolvedor Apple** (para deployment na App Store)

### 2. Configuração do Ambiente

```bash
# Clone o repositório (se ainda não fez)
git clone <repo-url>
cd geeklog-mobile

# Instale as dependências
npm install

# Instale o Capacitor CLI globalmente (se ainda não fez)
npm install -g @capacitor/cli

# Instale o Expo CLI globalmente (se ainda não fez)
npm install -g @expo/cli
```

## 🔧 Build e Configuração

### 1. Build Automático (Recomendado)

```bash
# Este script faz tudo automaticamente
npm run build:capacitor
```

### 2. Build Manual (Passo a Passo)

```bash
# 1. Build da aplicação web
npm run build:web

# 2. Sincronizar com Capacitor
npx cap sync

# 3. Adicionar plataformas (se ainda não foram adicionadas)
npx cap add android
npx cap add ios

# 4. Copiar assets e sincronizar
npx cap copy
npx cap sync
```

## 📱 Deployment Android

### 1. Desenvolvimento

```bash
# Abrir no Android Studio
npm run cap:android

# Ou executar diretamente com live reload
npm run cap:livereload:android
```

### 2. Build de Produção

1. **Abra o Android Studio:**

   ```bash
   npm run cap:android
   ```

2. **Configure o signing no Android Studio:**
   - Build → Generate Signed Bundle/APK
   - Crie ou selecione uma keystore
   - Configure alias e senhas

3. **Build do APK/AAB:**
   - Para Play Store: Android App Bundle (AAB)
   - Para instalação direta: APK

### 3. Configurações Importantes

No arquivo `android/app/src/main/AndroidManifest.xml`, verifique:

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
```

## 🍎 Deployment iOS

### 1. Desenvolvimento

```bash
# Abrir no Xcode
npm run cap:ios

# Ou executar diretamente com live reload
npm run cap:livereload:ios
```

### 2. Build de Produção

1. **Abra o Xcode:**

   ```bash
   npm run cap:ios
   ```

2. **Configure o projeto:**
   - Selecione o target "App"
   - Configure Bundle Identifier: `com.geeklog.mobile`
   - Configure Team/Signing

3. **Archive e Upload:**
   - Product → Archive
   - Window → Organizer
   - Distribute App → App Store Connect

### 3. Configurações Importantes

No arquivo `ios/App/App/Info.plist`, verifique as permissões:

```xml
<key>NSCameraUsageDescription</key>
<string>Este app usa a câmera para tirar fotos da sua coleção.</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>Este app acessa sua biblioteca de fotos para selecionar imagens.</string>
```

## ⚙️ Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Firebase Configuration
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key_here
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# Stripe Configuration
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key_here
```

## 📦 Scripts Disponíveis

```bash
# Desenvolvimento
npm start                    # Expo development server
npm run android             # Expo Android
npm run ios                 # Expo iOS

# Build e Capacitor
npm run build:web           # Build para web
npm run build:capacitor     # Build completo para Capacitor
npm run cap:sync           # Sincronizar com native

# Capacitor - Android
npm run cap:android         # Abrir Android Studio
npm run cap:run:android     # Executar no Android
npm run cap:livereload:android  # Live reload Android

# Capacitor - iOS
npm run cap:ios             # Abrir Xcode
npm run cap:run:ios         # Executar no iOS
npm run cap:livereload:ios  # Live reload iOS
```

## 🔍 Troubleshooting

### Problemas Comuns Android:

1. **Gradle Build Failed:**

   ```bash
   cd android
   ./gradlew clean
   ./gradlew build
   ```

2. **SDK Path Issues:**
   - Configure ANDROID_HOME no sistema
   - Verifique local.properties no Android Studio

3. **Memory Issues:**
   - Aumente heap size no gradle.properties
   - `org.gradle.jvmargs=-Xmx4096m`

### Problemas Comuns iOS:

1. **CocoaPods Issues:**

   ```bash
   cd ios/App
   pod repo update
   pod install
   ```

2. **Signing Issues:**
   - Verifique Bundle ID único
   - Configure equipe de desenvolvimento
   - Renove certificados se necessário

3. **Build Errors:**
   - Clean build folder: Product → Clean Build Folder
   - Delete derived data

## 📈 Performance e Otimização

### 1. Build Optimization

- Use `--prod` flag para builds de produção
- Minifique assets e imagens
- Configure code splitting se necessário

### 2. Native Performance

- Use `--release` para builds otimizados
- Configure ProGuard (Android) para ofuscação
- Otimize imagens e assets

### 3. Network

- Configure timeout appropriado para APIs
- Implemente retry logic para requests
- Use cache para dados estáticos

## 🚀 Deploy nas Lojas

### Google Play Store:

1. Build AAB com `--release`
2. Upload no Play Console
3. Configure store listing
4. Submit para review

### Apple App Store:

1. Archive no Xcode
2. Upload via Organizer
3. Configure App Store Connect
4. Submit para review

## 📝 Notas Importantes

- **Versioning:** Sempre incremente version/buildNumber antes de fazer upload
- **Testing:** Teste em dispositivos reais antes do deploy
- **Certificates:** Mantenha certificados e keystores seguros
- **Backup:** Faça backup das chaves de assinatura
- **Updates:** Para updates, use a mesma keystore/certificate

## 🆘 Suporte

Para problemas específicos:

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
