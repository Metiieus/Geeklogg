# GeekLog - Arquitetura do Sistema

## Visão Geral

O GeekLog foi refatorado seguindo os princípios de **Clean Architecture** e **SOLID**, resultando em um sistema modular, escalável e de fácil manutenção.

## Estrutura de Arquitetura

### 1. Domain Layer (Camada de Domínio)
```
src/domain/
├── entities/         # Entidades de negócio
│   └── Media.ts     # Entidade principal de mídia
├── repositories/     # Interfaces dos repositórios
│   └── MediaRepository.ts
└── usecases/        # Casos de uso / Interactors
    └── MediaUseCases.ts
```

**Responsabilidades:**
- Define as regras de negócio centrais
- Entidades independentes de frameworks
- Casos de uso orquestram as operações
- Interfaces para acesso a dados

### 2. Infrastructure Layer (Camada de Infraestrutura)
```
src/infrastructure/
├── repositories/     # Implementações dos repositórios
│   └── FirebaseMediaRepository.ts
└── services/        # Serviços externos
    ├── IGDBService.ts
    └── EnhancedExternalMediaService.ts
```

**Responsabilidades:**
- Implementação concreta dos repositórios
- Integração com APIs externas (IGDB, TMDB, Google Books)
- Persistência de dados (Firebase)
- Serviços de infraestrutura

### 3. Presentation Layer (Camada de Apresentação)
```
src/components/
├── modern/          # Componentes modernos redesenhados
│   ├── ModernCard.tsx
│   ├── ModernButton.tsx
│   ├── EnhancedLibrary.tsx
│   ├── SmartSearchModal.tsx
│   └── IntelligentFilters.tsx
└── legacy/          # Componentes originais (sendo migrados)
```

**Responsabilidades:**
- Interface do usuário
- Componentes React modernos
- Gerenciamento de estado local
- Interação com casos de uso

## Principais Melhorias Implementadas

### 1. Clean Architecture
- **Separação de responsabilidades**: Cada camada tem responsabilidades bem definidas
- **Inversão de dependências**: Dependências apontam para dentro (domínio)
- **Independência de frameworks**: Lógica de negócio isolada
- **Testabilidade**: Estrutura facilita testes unitários e de integração

### 2. Design Patterns
- **Repository Pattern**: Abstração do acesso a dados
- **Use Case Pattern**: Encapsulamento da lógica de negócio
- **Factory Pattern**: Criação de objetos complexos
- **Observer Pattern**: Gerenciamento de estado reativo

### 3. Integração com IGDB
- **Busca avançada de jogos**: API oficial do IGDB
- **Filtros inteligentes**: Por plataforma, gênero, ano, avaliação
- **Detalhes completos**: Screenshots, empresas, sites oficiais
- **Fallback gracioso**: Sistema degrada elegantemente se API falhar

### 4. UI/UX Moderna
- **Glassmorphism**: Efeitos de vidro com blur e transparência
- **Microinterações**: Animações suaves e responsivas
- **Design System**: Componentes reutilizáveis e consistentes
- **Responsividade**: Layout adaptativo para mobile e desktop

### 5. Sistema de Busca Inteligente
- **IA integrada**: Sugestões baseadas em preferências do usuário
- **Busca multi-plataforma**: IGDB, TMDB, Google Books em uma interface
- **Filtros avançados**: Sistema de filtros presets e customizáveis
- **Cache inteligente**: Otimização de performance

## Tecnologias Utilizadas

### Frontend
- **React 18** com TypeScript
- **Framer Motion** para animações
- **Tailwind CSS** para estilização
- **Vite** como build tool

### Backend/APIs
- **Firebase Firestore** para persistência
- **IGDB API** para dados de jogos
- **TMDB API** para filmes e séries
- **Google Books API** para livros

### Arquitetura
- **Clean Architecture** principles
- **SOLID** principles
- **Domain-Driven Design** concepts

## Fluxo de Dados

1. **UI Component** → Chama caso de uso
2. **Use Case** → Aplica regras de negócio
3. **Repository Interface** → Define contrato
4. **Repository Implementation** → Acessa dados externos
5. **External Services** → APIs e Firebase

## Benefícios da Nova Arquitetura

### Para Desenvolvedores
- **Código limpo e organizado**
- **Fácil adição de novas funcionalidades**
- **Testes mais simples e isolados**
- **Manutenção simplificada**

### Para Usuários
- **Interface moderna e responsiva**
- **Busca mais inteligente e precisa**
- **Performance otimizada**
- **Experiência consistente**

## Próximos Passos

1. **Migração gradual**: Componentes legados para arquitetura moderna
2. **Testes automatizados**: Cobertura completa de testes
3. **PWA**: Transformar em Progressive Web App
4. **Offline-first**: Suporte offline com sincronização
5. **Analytics**: Métricas de uso e performance

## Configuração do Ambiente

### Variáveis de Ambiente Necessárias
```bash
# Firebase
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

# APIs Externas
VITE_TMDB_API_KEY=
VITE_IGDB_CLIENT_ID=
VITE_IGDB_ACCESS_TOKEN=
```

### Como Obter as Chaves

#### IGDB API
1. Acesse [Twitch Developers](https://dev.twitch.tv/)
2. Crie uma aplicação
3. Obtenha Client ID e gere Access Token
4. Configure as variáveis de ambiente

#### TMDB API
1. Acesse [TMDB](https://www.themoviedb.org/settings/api)
2. Solicite uma chave de API
3. Configure VITE_TMDB_API_KEY

### Instalação e Execução
```bash
# Instalar dependências
npm install

# Copiar arquivo de ambiente
cp .env.example .env

# Configurar variáveis de ambiente
# Editar .env com suas chaves

# Executar desenvolvimento
npm run dev

# Executar backend (opcional)
npm run start:server
```

Esta arquitetura garante que o GeekLog seja escalável, manutenível e ofereça uma experiência de usuário excepcional.
