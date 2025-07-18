# 📚 Guia Completo: Estrutura do Firestore para MyDiaryGeek

## 🏗️ Estrutura Geral do Banco de Dados

Seu projeto MyDiaryGeek usa uma estrutura hierárquica no Firestore com coleções principais e subcoleções organizadas por usuário.

## 📋 Coleções Necessárias

### 1. 👥 **users** (Coleção Principal)

```
/users/{userId}
```

**Documento do usuário:**

```javascript
{
  uid: "string",
  name: "string",
  email: "string",
  avatar: "string (URL)",
  bio: "string",
  isPublic: boolean,
  createdAt: "timestamp",
  updatedAt: "timestamp",
  isPremium: boolean,
  plano: {
    status: "string",
    tipo: "string",
    expiraEm: "timestamp",
    stripeId: "string"
  },
  // Configurações do usuário
  favorites: ["string"],
  defaultLibrarySort: "string"
}
```

### 2. 🎮 **users/{userId}/medias** (Subcoleção)

```
/users/{userId}/medias/{mediaId}
```

**Documento de mídia:**

```javascript
{
  id: "string",
  title: "string",
  cover: "string (URL)",
  platform: "string",
  status: "completed | in-progress | dropped | planned",
  rating: number, // 1-5
  hoursSpent: number,
  totalPages: number, // Para livros
  currentPage: number, // Para livros
  startDate: "string (ISO)",
  endDate: "string (ISO)",
  tags: ["string"],
  externalLink: "string (URL)",
  type: "games | anime | series | books | movies | dorama",
  description: "string",
  createdAt: "timestamp",
  updatedAt: "timestamp"
}
```

### 3. ⭐ **users/{userId}/reviews** (Subcoleção)

```
/users/{userId}/reviews/{reviewId}
```

**Documento de review:**

```javascript
{
  id: "string",
  mediaId: "string", // Referência ao media
  title: "string",
  content: "string",
  rating: number, // 1-5
  isFavorite: boolean,
  image: "string (URL)",
  createdAt: "timestamp",
  updatedAt: "timestamp"
}
```

### 4. 🎯 **users/{userId}/milestones** (Subcoleção)

```
/users/{userId}/milestones/{milestoneId}
```

**Documento de marco:**

```javascript
{
  id: "string",
  title: "string",
  description: "string",
  date: "string (ISO)",
  icon: "string (emoji)",
  mediaId: "string", // Opcional
  image: "string (URL)",
  createdAt: "timestamp"
}
```

### 5. 🏆 **users/{userId}/achievements** (Subcoleção)

```
/users/{userId}/achievements/{achievementId}
```

**Documento de conquista:**

```javascript
{
  id: "string",
  title: "string",
  description: "string",
  icon: "string (emoji)",
  unlockedAt: "timestamp",
  category: "string",
  points: number
}
```

### 6. 👥 **users/{userId}/following** (Subcoleção)

```
/users/{userId}/following/{targetUserId}
```

**Documento de seguindo:**

```javascript
{
  createdAt: "timestamp",
  userName: "string",
  userAvatar: "string (URL)"
}
```

### 7. 👥 **users/{userId}/followers** (Subcoleção)

```
/users/{userId}/followers/{followerUserId}
```

**Documento de seguidor:**

```javascript
{
  createdAt: "timestamp",
  userName: "string",
  userAvatar: "string (URL)"
}
```

### 8. 🔔 **users/{userId}/notifications** (Subcoleção)

```
/users/{userId}/notifications/{notificationId}
```

**Documento de notificação:**

```javascript
{
  id: "string",
  userId: "string",
  fromUserId: "string",
  fromUserName: "string",
  fromUserAvatar: "string (URL)",
  type: "new_follower | activity_update | follow_request",
  title: "string",
  message: "string",
  read: boolean,
  timestamp: "timestamp",
  activityId: "string" // Opcional
}
```

### 9. 🔔 **notifications** (Coleção Global)

```
/notifications/{notificationId}
```

**Documento de notificação global:**

```javascript
{
  id: "string",
  toUserId: "string",
  fromUserId: "string",
  fromUserName: "string",
  fromUserAvatar: "string (URL)",
  type: "new_follower | activity_update | follow_request",
  title: "string",
  message: "string",
  read: boolean,
  createdAt: "timestamp"
}
```

### 10. 🤝 **followRequests** (Coleção Global)

```
/followRequests/{requestId}
```

**Documento de solicitação de amizade:**

```javascript
{
  id: "string",
  fromUserId: "string",
  toUserId: "string",
  fromUserName: "string",
  fromUserAvatar: "string (URL)",
  status: "pending | accepted | rejected",
  timestamp: "timestamp"
}
```

### 11. 📱 **activities** (Coleção Global)

```
/activities/{activityId}
```

**Documento de atividade:**

```javascript
{
  id: "string",
  userId: "string",
  userName: "string",
  userAvatar: "string (URL)",
  type: "media_added | media_completed | review_added | milestone_added | achievement_unlocked",
  title: "string",
  description: "string",
  mediaTitle: "string", // Opcional
  mediaType: "string", // Opcional
  timestamp: "timestamp",
  data: {} // Dados extras opcionais
}
```

## 🛠️ Como Criar no Console do Firebase

### Passo 1: Acesso ao Console

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Selecione seu projeto "geeklog-26b2c"
3. Clique em "Firestore Database"

### Passo 2: Criar Coleção Principal

1. Clique em "Iniciar coleção"
2. Digite "users" como ID da coleção
3. Clique em "Próximo"

### Passo 3: Criar Documento de Usuário

1. Digite seu UID como ID do documento (ou deixe auto-gerar)
2. Adicione os campos:
   ```
   uid: string: "seu-uid-aqui"
   name: string: "Seu Nome"
   email: string: "seu@email.com"
   createdAt: timestamp: (data atual)
   updatedAt: timestamp: (data atual)
   ```

### Passo 4: Criar Subcoleções

1. Clique no documento do usuário
2. Clique em "Iniciar coleção"
3. Digite o nome da subcoleção (ex: "medias")
4. Crie um documento de exemplo

## 🔧 Script de Inicialização Automática

Você pode usar este script para criar dados de teste:

```javascript
// Execute no console do navegador (F12) na página do seu app
const initializeFirestore = async () => {
  // Certifique-se de estar logado
  const user = firebase.auth().currentUser;
  if (!user) {
    console.error("Usuário não está logado");
    return;
  }

  const db = firebase.firestore();
  const userId = user.uid;

  try {
    // Criar perfil do usuário
    await db.collection("users").doc(userId).set({
      uid: userId,
      name: "Matheus Nascimento",
      email: user.email,
      createdAt: new Date(),
      updatedAt: new Date(),
      isPremium: false,
      favorites: [],
      defaultLibrarySort: "updatedAt",
    });

    // Criar mídia de exemplo
    await db
      .collection("users")
      .doc(userId)
      .collection("medias")
      .add({
        title: "Exemplo de Jogo",
        type: "games",
        status: "completed",
        rating: 5,
        tags: ["RPG", "Aventura"],
        createdAt: new Date(),
        updatedAt: new Date(),
      });

    console.log("✅ Firestore inicializado com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao inicializar:", error);
  }
};

// Execute a função
initializeFirestore();
```

## 📊 Índices Necessários

No arquivo `firestore.indexes.json`, você já deve ter os índices necessários. Se não tiver, execute:

```bash
firebase deploy --only firestore:indexes
```

## 🔒 Regras de Segurança

As regras já estão configuradas no arquivo `firestore.rules` e foram deployadas. Elas garantem que:

- ✅ Usuários só acessem seus próprios dados
- ✅ Notificações globais sejam acessíveis a todos autenticados
- ✅ Seguidores e seguindo sejam visíveis publicamente
- ✅ Solicitações de amizade sejam privadas entre remetente e destinatário

## 🚀 Próximos Passos

1. **Crie seu primeiro usuário** no Console do Firebase
2. **Execute o script de inicialização** para dados de teste
3. **Teste as funcionalidades** do app
4. **Adicione mais dados** conforme necessário

## 💡 Dicas Importantes

- **Use IDs únicos** para todos os documentos
- **Mantenha consistência** nos tipos de dados
- **Timestamps** devem ser do tipo Firestore timestamp
- **URLs** devem ser strings válidas
- **Arrays** devem ser inicializados como arrays vazios se não tiverem dados

## 🆘 Resolução de Problemas

Se encontrar erros:

1. Verifique se as regras estão deployadas
2. Confirme se o usuário está autenticado
3. Verifique se os campos obrigatórios estão preenchidos
4. Use o console do navegador para ver erros detalhados

Agora você tem tudo que precisa para estruturar seu Firestore! 🎉
