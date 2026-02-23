# 🎨 Plano de Melhorias - GeekLogg

## 📋 Objetivo
Reorganizar o layout para melhor experiência visual/interativa E implementar funcionalidades sociais completas.

---

## 🎨 PARTE 1: Melhorias de Layout e UX/UI

### 1.1 Dashboard
**Problemas Atuais:**
- Muita informação concentrada
- Cards muito grandes
- Espaçamentos inconsistentes
- Falta hierarquia visual clara

**Melhorias:**
- [ ] Grid responsivo otimizado (3 colunas desktop, 2 tablet, 1 mobile)
- [ ] Cards mais compactos com informação essencial
- [ ] Hierarquia visual clara (destaque para "Atualizado Recentemente")
- [ ] Microinterações e hover states suaves
- [ ] Loading skeletons para melhor perceived performance

### 1.2 Navegação
**Melhorias:**
- [ ] Sidebar mais compacta e elegante
- [ ] Ícones mais intuitivos
- [ ] Indicador visual de página ativa mais evidente
- [ ] Transições suaves entre páginas
- [ ] Breadcrumbs para navegação contextual

### 1.3 Library
**Melhorias:**
- [ ] Grid de cards otimizado
- [ ] Filtros mais visíveis e intuitivos
- [ ] Busca com autocomplete
- [ ] Ordenação visual (drag and drop futuro)
- [ ] Visualização em lista/grid toggle

### 1.4 Profile
**Melhorias:**
- [ ] Header de perfil mais impactante
- [ ] Stats cards reorganizados
- [ ] Tabs para organizar informações
- [ ] Seção de conquistas em destaque
- [ ] Timeline de atividades

### 1.5 Reviews
**Melhorias:**
- [ ] Cards de review mais elegantes
- [ ] Editor de texto rico mais intuitivo
- [ ] Preview antes de publicar
- [ ] Tags visuais para categorias
- [ ] Galeria de imagens inline

---

## 🤝 PARTE 2: Funcionalidades Sociais

### 2.1 Sistema de Seguir/Seguidores
**Firestore Collections:**
```
users/{uid}/
  - followers: number
  - following: number
  
follows/{followId}
  - followerId: string (quem segue)
  - followingId: string (quem é seguido)
  - createdAt: timestamp
```

**Funcionalidades:**
- [ ] Botão "Seguir/Deixar de Seguir"
- [ ] Lista de seguidores
- [ ] Lista de quem você segue
- [ ] Notificação quando alguém te segue

### 2.2 Feed Social
**Firestore Collection:**
```
activities/{activityId}
  - userId: string
  - type: 'review' | 'milestone' | 'achievement'
  - mediaId: string
  - mediaTitle: string
  - mediaType: 'game' | 'movie' | 'book'
  - content: string (para reviews)
  - rating: number
  - createdAt: timestamp
  - visibility: 'public' | 'followers' | 'private'
```

**Funcionalidades:**
- [ ] Feed com atividades dos amigos
- [ ] Filtro por tipo de atividade
- [ ] Infinite scroll
- [ ] Pull to refresh

### 2.3 Comentários
**Firestore Collection:**
```
reviews/{reviewId}/comments/{commentId}
  - userId: string
  - userName: string
  - userAvatar: string
  - content: string
  - createdAt: timestamp
```

**Funcionalidades:**
- [ ] Adicionar comentário em reviews
- [ ] Listar comentários
- [ ] Deletar próprio comentário
- [ ] Notificação de novo comentário

### 2.4 Curtidas
**Firestore Collection:**
```
reviews/{reviewId}/likes/{userId}
  - createdAt: timestamp

reviews/{reviewId}
  - likesCount: number
```

**Funcionalidades:**
- [ ] Botão de curtir/descurtir
- [ ] Contador de curtidas
- [ ] Lista de quem curtiu
- [ ] Notificação de nova curtida

### 2.5 Perfil Público
**Funcionalidades:**
- [ ] URL pública: /user/{username}
- [ ] Visualização de reviews públicas
- [ ] Stats públicas (jogos concluídos, nota média, etc)
- [ ] Botão de seguir
- [ ] Lista de seguidores/seguindo

### 2.6 Notificações Sociais
**Firestore Collection:**
```
notifications/{notificationId}
  - userId: string (quem recebe)
  - type: 'follow' | 'like' | 'comment' | 'mention'
  - fromUserId: string
  - fromUserName: string
  - fromUserAvatar: string
  - relatedId: string (reviewId, commentId, etc)
  - content: string
  - read: boolean
  - createdAt: timestamp
```

**Tipos:**
- [ ] Novo seguidor
- [ ] Curtida em review
- [ ] Comentário em review
- [ ] Menção em comentário

---

## 🎯 Prioridades de Implementação

### Sprint 1: Layout Base
1. Dashboard redesign
2. Navegação melhorada
3. Library grid otimizado

### Sprint 2: Social Core
4. Sistema de seguir/seguidores
5. Feed social básico
6. Perfil público

### Sprint 3: Interações
7. Curtidas em reviews
8. Comentários em reviews
9. Notificações sociais

---

## 🎨 Design System

### Cores
- **Primary:** Purple gradient (mantido)
- **Secondary:** Pink gradient (mantido)
- **Background:** Dark slate (mantido)
- **Cards:** slate-800/50 com border white/10
- **Text:** white, slate-300, slate-400

### Espaçamentos
- **Container:** max-w-7xl
- **Gap:** gap-4 (mobile), gap-6 (desktop)
- **Padding:** p-4 (mobile), p-6 (desktop)

### Componentes Reutilizáveis
- [ ] Button (variants: primary, secondary, ghost, danger)
- [ ] Card (variants: default, hover, active)
- [ ] Avatar (sizes: xs, sm, md, lg, xl)
- [ ] Badge (variants: success, warning, info, premium)
- [ ] Input (variants: text, textarea, select)
- [ ] Modal (variants: small, medium, large, fullscreen)

---

## 📊 Métricas de Sucesso

### UX/UI
- Tempo de carregamento < 2s
- First Contentful Paint < 1s
- Cumulative Layout Shift < 0.1
- Lighthouse Score > 90

### Engajamento Social
- Taxa de seguir > 20%
- Comentários por review > 2
- Curtidas por review > 5
- Tempo médio na plataforma +30%

---

**Início:** 23/02/2026  
**Estimativa:** 3-4 dias de desenvolvimento
