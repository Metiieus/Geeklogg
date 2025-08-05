# 🎮 GeekLog - Diário Nerd Pessoal

![GeekLog Banner](https://via.placeholder.com/800x300/6366f1/ffffff?text=GeekLog+-+Seu+Di%C3%A1rio+Nerd)

> **GeekLog** é a plataforma definitiva para entusiastas da cultura nerd organizarem sua biblioteca pessoal de jogos, filmes, séries, animes, livros e muito mais. Acompanhe seu progresso, escreva resenhas, registre marcos memoráveis e descubra novas experiências!

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com)
[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue.svg)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-11.9.1-orange.svg)](https://firebase.google.com/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## 📱 Plataformas Suportadas

- **Web**: Aplicação responsiva que funciona em qualquer navegador
- **PWA**: Instalável como Progressive Web App

## ✨ Funcionalidades Principais

### 📚 **Biblioteca Inteligente**
- ✅ Organize jogos, filmes, séries, animes, livros e doramas
- ✅ Status de progresso (Planejado, Em Progresso, Concluído, Abandonado)
- ✅ Sistema de avaliação (0-10)
- ✅ Controle de tempo gasto e páginas lidas
- ✅ Tags personalizáveis e categorização
- ✅ Busca e filtros avançados

### 🔍 **Busca Externa Integrada**
- 🎮 **Jogos**: Integração com RAWG API
- 📖 **Livros**: Integração com Google Books API
- 🎬 **Filmes/Séries**: Integração com TMDb API
- 📥 Auto-preenchimento de dados (capa, descrição, gêneros, etc.)

### ✍️ **Sistema de Resenhas**
- 📝 Escreva resenhas detalhadas
- ⭐ Sistema de favoritos
- 🔗 Vinculação automática com mídias da biblioteca
- 📅 Histórico organizado por data

### 🏆 **Sistema de Conquistas**
- 🎯 Conquistas automáticas baseadas no uso
- 🏅 Diferentes níveis de raridade (Comum, Raro, Épico, Lendário)
- 📊 Progresso por categoria (Gaming, Leitura, Cinema, etc.)
- 🎉 Notificações de desbloqueio

### �� **Estatísticas Avançadas**
- 📊 Gráficos de progresso
- ⏱️ Tempo total gasto por categoria
- 📈 Médias de avaliação
- 🎯 Metas e objetivos

### 🚀 **Jornada Nerd (Timeline)**
- 📅 Marcos memoráveis personalizados
- 🎮 Vinculação com mídias específicas
- 📝 Descrições detalhadas
- 🎨 Ícones e emojis personalizáveis

### 👥 **Recursos Sociais**
- 🔍 Busca e seguimento de outros usuários
- 👀 Visualização de perfis públicos
- 📊 Comparação de bibliotecas
- 🎯 Feed de atividades

### 💎 **GeekLog Premium**
- 🤖 Archivius AI - Assistente inteligente para recomendações
- 📊 Análises avançadas de hábitos
- 🎨 Temas exclusivos
- ☁️ Backup em nuvem
- 📱 Sincronização entre dispositivos

## 🛠️ Tecnologias Utilizadas

### **Frontend**
- **React 18.3.1** - Biblioteca principal
- **TypeScript 5.5.3** - Tipagem estática
- **Vite 7.0.0** - Build tool moderna
- **Tailwind CSS 3.4.1** - Framework de CSS
- **Framer Motion 12.23.3** - Animações
- **Lucide React 0.344.0** - Ícones

### **Backend & Infraestrutura**
- **Firebase 11.9.1** - Autenticação, Firestore, Storage
- **Express 5.1.0** - API servidor
- **Node.js** - Runtime do servidor

### **Integração de Pagamentos**
- **MercadoPago 2.8.0** - Gateway de pagamentos


### **APIs Externas**
- **RAWG API** - Dados de jogos
- **Google Books API** - Dados de livros
- **TMDb API** - Dados de filmes e séries

## 🚀 Instalação e Configuração

### **Pré-requisitos**
- Node.js 18+
- npm ou yarn

### **1. Clone o Repositório**
```bash
git clone https://github.com/seu-usuario/geeklog.git
cd geeklog
```

### **2. Instale as Dependências**
```bash
npm install
```

### **3. Configuração de Variáveis de Ambiente**

Crie um arquivo `.env` na raiz do projeto:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=sua_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu-projeto-id
VITE_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef

# External APIs
VITE_TMDB_API_KEY=sua_tmdb_api_key
VITE_RAWG_API_KEY=sua_rawg_api_key

# MercadoPago
MP_ACCESS_TOKEN=seu_mercadopago_access_token

# Server
PORT=8080
```

### **4. Configuração do Firebase**

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/)
2. Ative Authentication (Email/Senha)
3. Configure Firestore Database
4. Configure Storage para imagens
5. Copie as configurações para o `.env`

### **5. Execute o Projeto**

**Desenvolvimento Web:**
```bash
npm run dev
```

**Build para Produção:**
```bash
npm run build
```

**Servidor Backend:**
```bash
npm run server
```


## 📁 Estrutura do Projeto

```
geeklog/
├── 🔧 functions/                  # Firebase Functions
├── 📦 src/
│   ├── 🧩 components/            # Componentes React
│   │   ├── modals/              # Componentes de modal
│   │   └── ...
│   ├── 🎨 design-system/         # Sistema de design
│   ├── 🔄 context/               # Contextos React
│   ├── 🎣 hooks/                 # Custom hooks
│   ├── 🔌 services/              # Serviços e APIs
│   ├── 🛠️ utils/                 # Utilitários
│   ├── 📊 types/                 # Tipos TypeScript
│   ├── 🎨 styles/                # Estilos CSS
│   └── 🔥 firebase.ts            # Configuração Firebase
├── 📋 public/                     # Arquivos públicos
├── ⚙️ server.js                   # Servidor Express
├── 📦 package.json               # Dependências
├── 🔧 vite.config.ts             # Configuração Vite
└── 📄 README.md                  # Este arquivo
```

## 🎯 Scripts Disponíveis

```bash
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview do build
npm run lint         # Linting do código
npm run server       # Inicia servidor backend
```

## 🔧 Configuração de APIs Externas

### **RAWG API (Jogos)**
1. Registre-se em [RAWG.io](https://rawg.io/apidocs)
2. Obtenha sua API key
3. Adicione `VITE_RAWG_API_KEY` ao `.env`

### **TMDb API (Filmes/Séries)**
1. Registre-se em [TMDb](https://www.themoviedb.org/settings/api)
2. Obtenha sua API key
3. Adicione `VITE_TMDB_API_KEY` ao `.env`

### **Google Books API**
1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Ative a Books API
3. Crie credenciais de API key
4. Adicione `VITE_GOOGLE_BOOKS_API_KEY` ao `.env`

## 🔐 Recursos de Segurança

- ✅ Autenticação Firebase
- ✅ Regras de segurança Firestore
- ✅ Sanitização de dados
- ✅ Validação de uploads
- ✅ Rate limiting nas APIs
- ✅ CORS configurado

## 📈 Performance e Otimização

- ⚡ **Vite** para builds rápidos
- 🎯 **Lazy loading** de componentes
- 📦 **Code splitting** automático
- 🗜️ **Compressão de imagens**
- 🔄 **Cache inteligente**
- 📱 **PWA otimizada**

## 🎨 Design System

O GeekLog utiliza um design system customizado baseado em:

- 🎨 **Tailwind CSS** para utilitários
- 🌈 **Paleta neon/cyberpunk**
- ✨ **Animações Framer Motion**
- 📱 **Design responsivo first**
- ♿ **Acessibilidade WCAG**

## 🤝 Contribuindo

1. 🍴 Fork o projeto
2. 🌟 Crie uma branch para sua feature (`git checkout -b feature/NovaFeature`)
3. 💾 Commit suas mudanças (`git commit -m 'Adiciona NovaFeature'`)
4. 📤 Push para a branch (`git push origin feature/NovaFeature`)
5. 🔄 Abra um Pull Request

## 📋 Roadmap

### **V2.0 - Em Desenvolvimento**
- [ ] 🤖 Melhorias na IA Archivius
- [ ] 🎮 Integração com mais APIs de jogos
- [ ] 📊 Dashboard analytics avançado
- [ ] 🌐 Modo offline completo
- [ ] 🎯 Sistema de metas gamificado

### **V2.1 - Planejado**
- [ ] 📱 App iOS
- [ ] 🎨 Temas customizáveis
- [ ] 🔗 Integração redes sociais
- [ ] 📝 Editor rich text para resenhas
- [ ] 🎵 Suporte para música/podcasts

## 🐛 Reportar Bugs

Encontrou um bug? Abra uma [issue](https://github.com/seu-usuario/geeklog/issues) com:

- 📝 Descrição detalhada do problema
- 🔄 Passos para reproduzir
- 🖥️ Ambiente (navegador, OS, versão)
- 📸 Screenshots se aplicável

## 📞 Suporte

- 📧 **Email**: suporte@geeklog.com
- 💬 **Discord**: [GeekLog Community](https://discord.gg/geeklog)
- 🐦 **Twitter**: [@GeekLogApp](https://twitter.com/geeklogapp)

## 📄 Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🙏 Agradecimentos

- 🎮 **RAWG** pela API de jogos
- 📚 **Google Books** pela API de livros  
- 🎬 **TMDb** pela API de filmes
- 🔥 **Firebase** pela infraestrutura
- 💳 **MercadoPago** pelo gateway de pagamentos
- 🎨 **Lucide** pelos ícones
- ⚡ **Vite** pela ferramenta de build

---

<div align="center">

**Feito com ❤️ para a comunidade nerd**

[🌟 Star no GitHub](https://github.com/seu-usuario/geeklog) | [🐦 Siga no Twitter](https://twitter.com/geeklogapp) | [💬 Discord](https://discord.gg/geeklog)

</div>

---

## 📊 Status do Projeto

![GitHub last commit](https://img.shields.io/github/last-commit/seu-usuario/geeklog)
![GitHub issues](https://img.shields.io/github/issues/seu-usuario/geeklog)
![GitHub pull requests](https://img.shields.io/github/issues-pr/seu-usuario/geeklog)
![GitHub stars](https://img.shields.io/github/stars/seu-usuario/geeklog)
![GitHub forks](https://img.shields.io/github/forks/seu-usuario/geeklog)

**GeekLog v1.0** - Transformando a forma como nerds organizam suas paixões! 🚀
