# 📱 GeekLog Mobile

Aplicativo mobile do GeekLog construído com React Native (Expo) e Capacitor para deployment nativo.

## ✨ Características

- 📊 **Dashboard interativo** com estatísticas em tempo real
- 📚 **Biblioteca pessoal** para jogos, livros, filmes e séries
- ⭐ **Sistema de reviews** e avaliações
- 🏆 **Marcos e conquistas**
- 💳 **Assinatura Premium** com Stripe
- 🔥 **Firebase** para autenticação e banco de dados
- 📱 **Apps nativos** para iOS e Android
- 🎨 **UI/UX responsiva** para todos os tamanhos de tela

## 🚀 Início Rápido

### 1. Instalação

```bash
cd geeklog-mobile
npm install
```

### 2. Configuração do Firebase

```bash
cp .env.example .env
# Edite o .env com suas credenciais do Firebase
```

### 3. Desenvolvimento

```bash
# Expo development server
npm start

# Executar no Android
npm run android

# Executar no iOS
npm run ios
```

### 4. Build para Dispositivos Nativos

```bash
# Build automático para Capacitor
npm run build:capacitor

# Abrir no Android Studio
npm run cap:android

# Abrir no Xcode (macOS)
npm run cap:ios
```

## 🔧 Tecnologias

- **React Native** (via Expo)
- **Capacitor** para deployment nativo
- **Firebase** (Auth, Firestore, Storage)
- **Stripe** para pagamentos
- **React Navigation** para navegação
- **Expo Vector Icons** para ícones
- **Linear Gradient** para efeitos visuais

## 📱 Funcionalidades Implementadas

### ✅ Autenticação

- Login/registro com Firebase Auth
- Gerenciamento de sessão
- Logout seguro

### ✅ Dashboard

- Estatísticas em tempo real
- Itens recentemente atualizados
- Visão geral de status
- Marcos recentes
- Design responsivo

### ✅ Perfil de Usuário

- Estatísticas pessoais (jogos, livros, filmes, reviews)
- Dados carregados do Firebase
- Pull-to-refresh
- Menu de configurações

### ✅ Sistema de Pagamento

- Integração com Stripe
- Tela de assinatura premium
- Suporte para Apple Pay e Google Pay
- Interface de pagamento segura

### ✅ Responsividade

- Hook customizado `useResponsive`
- Layouts adaptativos para diferentes tamanhos
- Otimização para devices pequenos e grandes
- Suporte para orientação landscape/portrait

### ✅ Capacitor

- Configuração completa para iOS/Android
- Scripts de build automatizados
- Documentação de deployment
- Configurações nativas otimizadas

## 📁 Estrutura do Projeto

```
geeklog-mobile/
├── screens/           # Telas da aplicação
│   ├── DashboardScreen.js
│   ├── ProfileScreen.js
│   ├── SubscriptionScreen.js
│   └── ...
├── contexts/          # Contextos React
│   ├── AuthContext.js
│   └── AppContext.js
├── services/          # Serviços externos
│   ├── database.js
│   └── paymentService.js
├── hooks/             # Hooks customizados
│   └── useResponsive.js
├── navigation/        # Configuração de navegação
│   └── AppNavigator.js
├── assets/           # Imagens e recursos
├── android/          # Projeto Android (gerado)
├── ios/              # Projeto iOS (gerado)
└── dist/             # Build web (gerado)
```

## 🔑 Variáveis de Ambiente

```env
# Firebase
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=

# Stripe
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

## 📱 Scripts Disponíveis

### Desenvolvimento

- `npm start` - Expo development server
- `npm run android` - Rodar no Android (Expo)
- `npm run ios` - Rodar no iOS (Expo)
- `npm run web` - Rodar no navegador

### Capacitor

- `npm run build:capacitor` - Build completo para Capacitor
- `npm run cap:android` - Abrir Android Studio
- `npm run cap:ios` - Abrir Xcode
- `npm run cap:livereload:android` - Live reload Android
- `npm run cap:livereload:ios` - Live reload iOS

## 🛠️ Como Funciona

### 1. **Autenticação Real**

O app agora usa Firebase Auth real (removido sistema mock). Usuários fazem login/registro e mantêm sessão persistente.

### 2. **Dados do Firebase**

Todos os dados (media, reviews, milestones, settings) são salvos e carregados do Firestore. Cada usuário tem sua própria coleção.

### 3. **Estatísticas Dinâmicas**

As estatísticas no dashboard e perfil são calculadas em tempo real baseadas nos dados reais do usuário.

### 4. **Pagamentos com Stripe**

Sistema completo de assinatura premium com tela dedicada e integração Stripe (interface pronta, backend em desenvolvimento).

### 5. **UI Responsiva**

Hook `useResponsive` fornece valores adaptativos para diferentes tamanhos de tela, garantindo boa experi��ncia em todos os dispositivos.

## 📦 Deploy

Consulte o arquivo [DEPLOYMENT.md](./DEPLOYMENT.md) para instruções completas de como fazer deploy para:

- 🤖 Google Play Store (Android)
- 🍎 Apple App Store (iOS)

## 🚧 Próximos Passos

### Backend (Em Desenvolvimento)

- [ ] API REST para payment intents do Stripe
- [ ] Webhooks para confirmar pagamentos
- [ ] Sistema de assinaturas no backend

### Features Futuras

- [ ] Push notifications
- [ ] Modo offline
- [ ] Compartilhamento social
- [ ] Exportação de dados
- [ ] Temas customizados

## 📋 Requisitos de Sistema

### Desenvolvimento

- Node.js 16+
- npm ou yarn
- Expo CLI
- Android Studio (para Android)
- Xcode (para iOS, somente macOS)

### Runtime

- Android 7.0+ (API 24+)
- iOS 12.0+

## 🐛 Troubleshooting

### Problemas Comuns

1. **Build falha**: Limpe node_modules e reinstale
2. **Firebase não conecta**: Verifique as credenciais no .env
3. **Capacitor sync falha**: Execute `npx cap doctor` para diagnóstico

### Logs e Debug

- Expo: Use `npx expo start --dev-client`
- Android: `adb logcat`
- iOS: Console.app no macOS

## 📞 Suporte

Para problemas ou dúvidas:

- Abra uma issue no repositório
- Consulte a documentação do Expo/Capacitor
- Verifique o arquivo DEPLOYMENT.md

---

**GeekLog Mobile** - Sua jornada nerd, agora no seu bolso! 🚀📱
