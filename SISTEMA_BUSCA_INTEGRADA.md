# Sistema de Busca Integrada - GeekLog

## 📚 Visão Geral

Implementei um sistema completo de busca integrada com APIs públicas que permite aos usuários encontrar e adicionar mídias (livros, filmes, séries) de forma semelhante ao Trakt.tv e Goodreads.

## 🚀 Funcionalidades Implementadas

### 1. **Busca Externa Integrada**

- **Google Books API**: Para buscar livros
- **TMDb API**: Para buscar filmes e séries
- Busca em tempo real com debounce (500ms)
- Suporte a diferentes tipos de mídia (livros, filmes, séries, anime, doramas)

### 2. **Interface de Busca Moderna**

- Seletor de tipos de mídia com ícones
- Barra de busca responsiva
- Dropdown de resultados com preview das capas
- Indicadores da fonte (Google Books/TMDb)
- Verificação de disponibilidade das APIs

### 3. **Adição Inteligente de Mídias**

- **Modal de opções**: Escolha entre busca online ou adição manual
- **Preview completo**: Visualização da mídia encontrada com todos os detalhes
- **Prioridade de imagens**: Upload manual > URL da API
- **Campos automáticos**: Preenchimento automático de informações como gêneros, ano, páginas, etc.

### 4. **Gerenciamento de Imagens**

- URLs externas das APIs são salvas diretamente
- Upload manual tem prioridade sobre imagens externas
- Fallback automático se o upload falhar
- Sistema de backup entre imagem personalizada e original

## 📁 Arquivos Criados/Modificados

### Novos Arquivos:

- `src/services/externalMediaService.ts` - Serviço para APIs externas
- `src/components/MediaSearchBar.tsx` - Componente de busca
- `src/components/AddMediaOptions.tsx` - Modal de opções de adição
- `src/components/modals/AddMediaFromSearchModal.tsx` - Modal para adicionar da busca
- `.env.example` - Variáveis de ambiente necessárias

### Arquivos Modificados:

- `src/services/mediaService.ts` - Suporte a URLs externas
- `src/components/Library.tsx` - Integração do sistema de busca

## 🔧 Configuração

### Variáveis de Ambiente Necessárias:

```env
# TMDb API (obrigatória para filmes/séries)
VITE_TMDB_API_KEY=your_api_key_here

# Google Books API (opcional - funciona sem chave)
VITE_GOOGLE_BOOKS_API_KEY=your_api_key_here
```

### Obter Chave do TMDb:

1. Acesse: https://www.themoviedb.org/settings/api
2. Crie uma conta e solicite uma API key
3. Adicione a chave no arquivo `.env`

## 🎯 Fluxo de Uso

### 1. **Busca e Adição**

```
Usuário clica "Adicionar Mídia"
→ Modal com opções (Buscar Online / Adicionar Manual)
→ Escolhe "Buscar Online"
→ Seleciona tipo de mídia
→ Digita nome da mídia
→ Vê resultados com capas e informações
→ Clica em um resultado
→ Modal de confirmação com dados preenchidos
→ Pode editar campos ou fazer upload de imagem personalizada
→ Salva na biblioteca
```

### 2. **Prioridade de Imagens**

```
1. Imagem enviada manualmente (maior prioridade)
2. Imagem automática da API
3. Sem imagem (placeholder)
```

## 🛠️ Detalhes Técnicos

### APIs Utilizadas:

#### Google Books API

- **Endpoint**: `https://www.googleapis.com/books/v1/volumes`
- **Dados extraídos**: Título, autores, descrição, capa, páginas, ISBN, editora, gêneros
- **Limitações**: Rate limit básico sem chave

#### TMDb API

- **Endpoints**:
  - `/search/movie` - Buscar filmes
  - `/search/tv` - Buscar séries
  - `/movie/{id}` - Detalhes do filme
  - `/tv/{id}` - Detalhes da série
- **Dados extraídos**: Título, descrição, capa, ano, gêneros, diretor, atores, duração

### Estrutura de Dados:

```typescript
interface ExternalMediaResult {
  id: string;
  title: string;
  description?: string;
  image?: string;
  year?: number;
  genres?: string[];
  // Campos específicos para livros
  authors?: string[];
  publisher?: string;
  pageCount?: number;
  // Campos específicos para filmes/séries
  director?: string;
  actors?: string[];
  runtime?: number;
  // Metadados
  source: "google-books" | "tmdb";
  originalType?: string;
}
```

## 🎨 Experiência do Usuário

### Características Similares ao Trakt.tv/Goodreads:

- ✅ Busca integrada com APIs oficiais
- ✅ Preview das capas nos resultados
- ✅ Preenchimento automático de campos
- ✅ Possibilidade de edição após importação
- ✅ Upload de imagem personalizada
- ✅ Informações detalhadas (gêneros, ano, etc.)

### Melhorias Implementadas:

- 🚀 Interface moderna e responsiva
- 🎯 Seleção visual do tipo de mídia
- 🔄 Verificação de status das APIs
- ⚡ Busca com debounce para performance
- 🖼️ Sistema inteligente de prioridade de imagens
- 📱 Design mobile-first

## 🚦 Status e Próximos Passos

### ✅ Implementado:

- Busca integrada com Google Books e TMDb
- Interface completa de busca e adição
- Gerenciamento inteligente de imagens
- Integração com o sistema existente

### 🔮 Possíveis Melhorias Futuras:

- Cache de resultados de busca
- Busca offline com indexação
- Mais APIs (IGDB para jogos, AniList para anime)
- Importação em lote
- Sugestões baseadas no histórico

## 📝 Notas de Desenvolvimento

- O sistema foi implementado de forma modular e reutilizável
- Todas as APIs têm fallbacks para quando estão indisponíveis
- A interface se adapta automaticamente aos tipos de mídia disponíveis
- O código segue as convenções existentes do projeto
- Sistema de tipos TypeScript completo para todas as interfaces

---

**Resultado**: Sistema completo de busca integrada funcionando de forma similar ao Trakt.tv e Goodreads, permitindo busca, preview e adição rápida de mídias com informações automáticas e possibilidade de personalização.
