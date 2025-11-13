# Integração Stripe - GeekLogg Premium

## 📋 Visão Geral

Integração completa com Stripe para processar pagamentos de assinatura Premium no GeekLogg. Sistema totalmente funcional com checkout, webhooks, portal de gerenciamento e páginas de retorno.

## 🏗️ Arquitetura

### Backend (Firebase Functions)

**Localização:** `/functions/`

#### Arquivos Criados/Modificados:
- `functions/stripe.cjs` - Lógica de integração com Stripe
- `functions/server.cjs` - Endpoints e rotas
- `functions/package.json` - Dependências (Stripe SDK adicionado)

#### Endpoints Disponíveis:

1. **POST `/stripe-create-checkout`**
   - Cria sessão de checkout do Stripe
   - Parâmetros: `{ userId, email, priceId? }`
   - Retorna: `{ sessionId, url }`

2. **POST `/stripe-customer-portal`**
   - Cria sessão do portal de gerenciamento
   - Parâmetros: `{ userId }`
   - Retorna: `{ url }`

3. **POST `/stripe-webhook`**
   - Recebe eventos do Stripe
   - Processa: checkout, assinaturas, pagamentos
   - Atualiza Firestore automaticamente

### Frontend (React)

**Localização:** `/src/`

#### Arquivos Criados/Modificados:
- `src/services/stripeService.ts` - Serviço de comunicação com backend
- `src/components/modals/UpgradeToPremiumModal.tsx` - Modal com checkout integrado
- `src/components/StripeReturnHandler.tsx` - Handler de retorno do checkout
- `src/components/Profile.tsx` - Botão de gerenciamento integrado
- `src/components/ArchiviusAgent.tsx` - Modal de upgrade integrado
- `src/App.tsx` - StripeReturnHandler adicionado

## 🔧 Configuração

### 1. Criar Conta no Stripe

1. Acesse [stripe.com](https://stripe.com) e crie uma conta
2. Ative o modo de produção (após testes)
3. Obtenha as chaves da API

### 2. Criar Produto e Preço

1. Acesse o Dashboard do Stripe
2. Vá em **Products** → **Add Product**
3. Configure:
   - **Nome:** GeekLogg Premium
   - **Descrição:** Assinatura mensal com acesso a recursos exclusivos
   - **Preço:** R$ 9,90 / mês
   - **Tipo:** Recurring (Recorrente)
   - **Intervalo:** Monthly (Mensal)
4. Copie o **Price ID** (começa com `price_...`)

### 3. Configurar Variáveis de Ambiente

#### Firebase Functions (`.env` ou Firebase Config)

```bash
# Chaves do Stripe
STRIPE_SECRET_KEY=sk_test_... # ou sk_live_... em produção
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID=price_...

# URL do cliente (para redirecionamento)
CLIENT_URL=https://geeklogg.com
```

#### Frontend (`.env` ou `.env.production`)

```bash
# URL das Firebase Functions
VITE_FUNCTIONS_URL=https://us-central1-geeklog-diary.cloudfunctions.net/api
```

### 4. Configurar Webhook no Stripe

1. Acesse **Developers** → **Webhooks** no Dashboard
2. Clique em **Add endpoint**
3. URL do endpoint:
   ```
   https://us-central1-geeklog-diary.cloudfunctions.net/api/stripe-webhook
   ```
4. Selecione os eventos:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copie o **Signing secret** (`whsec_...`)
6. Adicione às variáveis de ambiente

### 5. Deploy das Functions

```bash
cd functions
npm install
cd ..
firebase deploy --only functions
```

## 🎯 Fluxo de Pagamento

### 1. Usuário Clica em "Assinar Premium"

**Componentes envolvidos:**
- `UpgradeToPremiumModal.tsx`
- `Profile.tsx`
- `ArchiviusAgent.tsx`

**Ação:**
```typescript
await redirectToCheckout(userId, email);
```

### 2. Backend Cria Sessão de Checkout

**Endpoint:** `/stripe-create-checkout`

**Processo:**
1. Verifica se usuário já tem Customer ID no Stripe
2. Cria Customer se necessário
3. Salva Customer ID no Firestore
4. Cria sessão de checkout
5. Retorna URL do checkout

### 3. Usuário é Redirecionado para Stripe

**Checkout Stripe:**
- Formulário de pagamento seguro
- Suporte a cartões de crédito
- 3D Secure automático
- Múltiplas moedas

### 4. Após Pagamento

#### Sucesso:
- Redireciona para: `https://geeklogg.com/?payment=success`
- `StripeReturnHandler` detecta e mostra mensagem
- Webhook atualiza Firestore
- Usuário vê badge Premium

#### Cancelamento:
- Redireciona para: `https://geeklogg.com/?payment=cancel`
- `StripeReturnHandler` mostra opção de tentar novamente

### 5. Webhook Processa Evento

**Evento:** `checkout.session.completed`

**Ação:**
```typescript
await db.collection("users").doc(userId).set({
  stripeCustomerId: customerId,
  stripeSubscriptionId: subscriptionId,
  subscriptionTier: "premium",
  subscriptionStatus: "active",
}, { merge: true });
```

## 🔄 Gerenciamento de Assinatura

### Portal do Cliente

**Componente:** `Profile.tsx` (botão "Gerenciar")

**Funcionalidades do Portal:**
- ✅ Cancelar assinatura
- ✅ Atualizar método de pagamento
- ✅ Ver histórico de faturas
- ✅ Baixar recibos
- ✅ Atualizar informações de cobrança

**Código:**
```typescript
await redirectToCustomerPortal(userId);
```

### Renovação Automática

- Stripe cobra automaticamente todo mês
- Webhook `invoice.payment_succeeded` confirma pagamento
- Webhook `invoice.payment_failed` notifica falha
- Após 3 falhas, assinatura é cancelada automaticamente

## 📊 Eventos do Webhook

### `checkout.session.completed`
- Usuário completou checkout
- Atualiza tier para "premium"
- Salva IDs do Stripe

### `customer.subscription.updated`
- Assinatura foi modificada
- Atualiza status e dados
- Verifica se ainda está ativa

### `customer.subscription.deleted`
- Assinatura foi cancelada
- Volta tier para "free"
- Mantém histórico

### `invoice.payment_succeeded`
- Pagamento mensal bem-sucedido
- Confirma status "active"
- Registra data do pagamento

### `invoice.payment_failed`
- Falha no pagamento
- Atualiza status para "past_due"
- Stripe envia email automático

## 🗄️ Estrutura de Dados (Firestore)

### Coleção `users/{userId}`

```typescript
{
  // Dados existentes...
  
  // Campos do Stripe
  stripeCustomerId: "cus_...",           // ID do cliente no Stripe
  stripeSubscriptionId: "sub_...",       // ID da assinatura
  subscriptionTier: "premium" | "free",  // Tier atual
  subscriptionStatus: "active" | "past_due" | "canceled" | "trialing",
  currentPeriodEnd: Timestamp,           // Fim do período atual
  lastPaymentDate: Timestamp,            // Último pagamento
  updatedAt: Timestamp,                  // Última atualização
}
```

## 🧪 Testes

### Modo de Teste (Test Mode)

Use cartões de teste do Stripe:

**Sucesso:**
```
Número: 4242 4242 4242 4242
Data: Qualquer data futura
CVC: Qualquer 3 dígitos
CEP: Qualquer CEP
```

**Falha:**
```
Número: 4000 0000 0000 0002
```

**3D Secure:**
```
Número: 4000 0027 6000 3184
```

### Testar Webhooks Localmente

```bash
# Instalar Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Encaminhar webhooks para local
stripe listen --forward-to http://localhost:5001/geeklog-diary/us-central1/api/stripe-webhook

# Disparar evento de teste
stripe trigger checkout.session.completed
```

## 🚀 Deploy em Produção

### Checklist:

- [ ] Criar produto no Stripe (modo produção)
- [ ] Copiar Price ID de produção
- [ ] Configurar variáveis de ambiente de produção
- [ ] Configurar webhook de produção
- [ ] Testar com cartão real (pequeno valor)
- [ ] Verificar se webhook está recebendo eventos
- [ ] Testar cancelamento e renovação
- [ ] Configurar emails do Stripe (opcional)

### Variáveis de Produção:

```bash
# Firebase Functions
firebase functions:config:set \
  stripe.secret_key="sk_live_..." \
  stripe.webhook_secret="whsec_..." \
  stripe.price_id="price_..." \
  client.url="https://geeklogg.com"

# Deploy
firebase deploy --only functions
```

## 🔒 Segurança

### Implementado:

- ✅ Verificação de assinatura do webhook
- ✅ HTTPS obrigatório
- ✅ Customer ID vinculado ao Firebase UID
- ✅ Validação de parâmetros
- ✅ Logs de erro detalhados

### Recomendações Adicionais:

- 🔲 Rate limiting nos endpoints
- 🔲 Firebase Security Rules para validar tier
- 🔲 Logs de auditoria de mudanças de tier
- 🔲 Notificações de segurança

## 📈 Métricas e Analytics

### KPIs Sugeridos:

- Taxa de conversão (Free → Premium)
- MRR (Monthly Recurring Revenue)
- Churn rate (cancelamentos)
- LTV (Lifetime Value)
- Tempo médio até conversão
- Taxa de falha de pagamento

### Integração com Analytics:

```typescript
// Exemplo: Google Analytics
gtag('event', 'purchase', {
  transaction_id: subscriptionId,
  value: 9.90,
  currency: 'BRL',
  items: [{
    item_name: 'GeekLogg Premium',
    item_category: 'Subscription',
  }]
});
```

## 🐛 Troubleshooting

### Webhook não está funcionando

1. Verificar URL do webhook no Stripe
2. Verificar se functions estão deployadas
3. Testar endpoint manualmente
4. Verificar logs: `firebase functions:log`

### Pagamento não atualiza tier

1. Verificar logs do webhook
2. Verificar se evento foi recebido
3. Verificar se userId está nos metadados
4. Verificar permissões do Firestore

### Customer Portal não abre

1. Verificar se Customer ID existe no Firestore
2. Verificar se usuário tem assinatura ativa
3. Verificar logs do backend

## 📞 Suporte

### Recursos:

- [Documentação Stripe](https://stripe.com/docs)
- [Stripe Dashboard](https://dashboard.stripe.com)
- [Firebase Functions](https://firebase.google.com/docs/functions)
- [Suporte Stripe](https://support.stripe.com)

## ✅ Status da Implementação

- ✅ Backend configurado (Firebase Functions)
- ✅ Stripe SDK instalado
- ✅ Endpoints criados (checkout, portal, webhook)
- ✅ Frontend integrado (modal, serviço)
- ✅ Portal de gerenciamento funcional
- ✅ Páginas de retorno (sucesso/cancelamento)
- ✅ Webhook processando eventos
- ✅ Atualização automática do Firestore
- ✅ Documentação completa
- ⏳ Configuração de produção (pendente)
- ⏳ Testes em produção (pendente)

---

**🎉 Integração Stripe completa e pronta para uso!**
