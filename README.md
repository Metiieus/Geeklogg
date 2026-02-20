# Geeklogg — App Mobile (React Native + Expo)

App nativo Android/iOS do Geeklogg, construído com **Expo (React Native)**, **NativeWind** e **React Native Firebase**.

## Stack Tecnológica

| Camada | Tecnologia |
| :--- | :--- |
| Framework | Expo SDK 54 + React Native 0.81 |
| Linguagem | TypeScript |
| Navegação | Expo Router (file-based) |
| Estilização | NativeWind 4 (Tailwind CSS para RN) |
| Firebase | `@react-native-firebase` (SDK nativo) |
| Listas | `@shopify/flash-list` |
| Animações | `react-native-reanimated` |
| Gestos | `react-native-gesture-handler` |
| Build | EAS Build (Expo Application Services) |

## Estrutura do Projeto

```
GeekloggApp/
├── app/                    # Rotas (Expo Router)
│   ├── _layout.tsx         # Layout raiz com providers
│   ├── index.tsx           # Redirect baseado em auth
│   ├── (auth)/             # Telas de autenticação
│   │   ├── login.tsx
│   │   └── register.tsx
│   └── (tabs)/             # Navegação principal
│       ├── dashboard.tsx
│       ├── library.tsx
│       ├── add.tsx
│       ├── timeline.tsx
│       └── profile.tsx
├── src/
│   ├── types/              # Tipos TypeScript (migrados do web)
│   ├── services/           # Serviços Firebase e APIs
│   ├── hooks/              # React hooks customizados
│   ├── context/            # Contextos (Auth, Toast)
│   ├── components/         # Componentes reutilizáveis
│   └── constants/          # Constantes do app
├── app.json                # Configuração Expo
├── tailwind.config.js      # Configuração NativeWind
├── babel.config.js         # Babel com NativeWind
└── metro.config.js         # Metro com NativeWind
```

## Configuração do Firebase

1. Acesse o [Firebase Console](https://console.firebase.google.com)
2. Selecione o projeto **Geeklogg**
3. Vá em **Configurações do Projeto > Seus apps > Android**
4. Baixe o `google-services.json`
5. Coloque o arquivo na **raiz do projeto** (`/GeekloggApp/google-services.json`)

> ⚠️ O `google-services.json` está no `.gitignore` por segurança. Nunca faça commit deste arquivo.

## Como Rodar

### Pré-requisitos

- Node.js 18+
- Expo CLI: `npm install -g expo-cli`
- EAS CLI: `npm install -g eas-cli`
- Android Studio (para emulador) ou dispositivo físico com Expo Go

### Instalação

```bash
cd GeekloggApp
npm install
```

### Development Build (necessário para Firebase nativo)

```bash
# Configurar EAS
eas login
eas build:configure

# Build para Android (primeira vez)
eas build --platform android --profile development

# Após instalar o build no dispositivo:
npx expo start --dev-client
```

> ⚠️ **Expo Go não suporta `@react-native-firebase`**. É necessário usar um Development Build.

## Roadmap

- [x] Estrutura base do projeto
- [x] Configuração NativeWind + Expo Router
- [x] Contextos de Auth e Toast
- [x] Telas de Login e Registro
- [x] Navegação principal (5 abas)
- [x] Dashboard com stats
- [x] Biblioteca com filtros
- [x] Tela de adicionar mídia
- [x] Timeline mensal
- [x] Perfil com configurações
- [ ] Integração Firebase (aguarda google-services.json)
- [ ] Busca de mídias via TMDb/RAWG/Google Books
- [ ] Biblioteca funcional com Firestore
- [ ] Conquistas e gamificação
- [ ] Archivius IA
- [ ] Módulo Jetpack Compose para a Biblioteca
- [ ] Notificações push
- [ ] Biometria

## Módulo Jetpack Compose (Fase 3)

A tela de **Biblioteca** será reconstruída com Jetpack Compose para máxima performance nativa, usando `LazyVerticalGrid`, animações e filtros em Compose, exposta como componente React Native via **Expo Modules API**.

```
android/
└── modules/
    └── MediaLibraryModule/
        ├── MediaLibraryModule.kt    # Expo Module
        └── MediaLibraryView.kt     # Jetpack Compose UI
```
