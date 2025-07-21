# 🚀 Guia Completo do Checkout MercadoPago

## ✅ O que foi implementado

### 🔧 Backend (server.js)
```javascript
// Rota POST /api/create-preference 
// ✅ Cria preferência e retorna init_point
// ✅ Configuração automática de back_urls
// ✅ Integração com Firebase para atualizar premium

// Rota POST /api/update-premium
// ✅ Atualiza status premium no Firestore
```

### 🎨 Frontend (React)
```typescript
// CheckoutButton.tsx - Botão principal
// ✅ Detecção automática dev/prod
// ✅ Estados de loading
// ✅ Validação de usuário logado

// checkoutService.ts - Lógica de checkout
// ✅ Função handleCheckout()
// ✅ Criação de preferência
// ✅ Redirecionamento automático

// PremiumSuccessPage.tsx - Página de sucesso
// ✅ Processamento de parâmetros de retorno
// ✅ Atualização automática do Firestore
// ✅ UX melhorada com estados de loading
```

## 🎯 Como usar

### 1. Botão Simples
```tsx
import CheckoutButton from './components/CheckoutButton';

function MyComponent() {
  return <CheckoutButton />;
}
```

### 2. Botão Customizado
```tsx
<CheckoutButton 
  variant="gradient" 
  size="lg"
  className="w-full"
>
  🚀 Desbloquear Premium - R$ 19,99
</CheckoutButton>
```

### 3. Função Manual
```tsx
import { handleCheckout } from './services/checkoutService';

function CustomButton() {
  return (
    <button onClick={handleCheckout}>
      Assinar Premium
    </button>
  );
}
```

## 🔄 Fluxo Completo

```mermaid
graph TD
    A[Usuário clica no botão] --> B[CheckoutButton.tsx]
    B --> C[handleCheckout()]
    C --> D[POST /api/create-preference]
    D --> E[MercadoPago retorna init_point]
    E --> F[Redirecionamento automático]
    F --> G[Usuário paga no MercadoPago]
    G --> H[Retorno para /premium/success]
    H --> I[PremiumSuccessPage.tsx]
    I --> J[POST /api/update-premium]
    J --> K[Firestore atualizado]
    K --> L[Premium ativado! 🎉]
```

## 🌍 Configuração Automática de Ambientes

O sistema detecta automaticamente o ambiente:

```typescript
const getApiUrl = () => {
  const isDev = window.location.hostname === 'localhost';
  return isDev 
    ? 'http://localhost:4242'           // DEV
    : 'https://your-backend.com';       // PROD
};
```

### URLs de Retorno Configuradas:
- **DEV**: `http://localhost:5173/premium/success`
- **PROD**: `https://geeklog-26b2c.web.app/premium/success`

## 📝 Parâmetros de Retorno

Quando o usuário retorna do MercadoPago:

```
/premium/success?payment_id=123&status=approved&preference_id=456
```

A página de sucesso processa:
- ✅ `payment_id`: ID do pagamento no MercadoPago
- ✅ `status`: Status do pagamento (approved/pending/rejected)
- ✅ `preference_id`: ID da preferência criada

## 🔥 Exemplo de Uso no Seu Componente

```tsx
import React from 'react';
import CheckoutButton from './components/CheckoutButton';
import { useAuth } from './context/AuthContext';

function PremiumSection() {
  const { user, profile } = useAuth();

  if (profile?.isPremium) {
    return <div>Você já é Premium! 🎉</div>;
  }

  return (
    <div className="premium-section">
      <h2>Upgrade para Premium</h2>
      <div className="features">
        <p>✓ Backup na nuvem</p>
        <p>✓ Recursos exclusivos</p>
        <p>✓ Suporte prioritário</p>
      </div>
      
      {/* Botão de checkout */}
      <CheckoutButton 
        variant="gradient" 
        size="lg"
        className="mt-4"
      >
        🔓 Desbloquear Premium - R$ 19,99
      </CheckoutButton>
    </div>
  );
}
```

## 🚨 Estrutura do Firestore

Quando o pagamento é aprovado:

```json
{
  "users": {
    "userId": {
      "plano": {
        "status": "ativo",
        "tipo": "premium", 
        "mercadoPagoPaymentId": "payment_123",
        "activatedAt": "2024-01-01T00:00:00.000Z"
      }
    }
  }
}
```

## 🧪 Como Testar

### 1. Ambiente de Desenvolvimento
```bash
# Terminal 1: Backend
npm run start:server

# Terminal 2: Frontend  
npm run dev

# Acesse: http://localhost:5173
```

### 2. Teste do Checkout
1. Faça login no app
2. Clique em qualquer `CheckoutButton`
3. Será redirecionado para sandbox do MercadoPago
4. Use cartões de teste para simular pagamento
5. Retornará para `/premium/success`
6. Premium será ativado automaticamente

### 3. Cartões de Teste MercadoPago
```
✅ Aprovado: 4003 0319 9890 7891
❌ Rejeitado: 4014 1418 5802 1119
⏳ Pendente: 4009 1234 5678 9010
```

## 🔧 Configuração de Produção

Para produção, configure:

```env
# Backend
MERCADO_PAGO_ACCESS_TOKEN=APP_USR-xxx-PROD
CLIENT_URL=https://geeklog-26b2c.web.app
SERVER_URL=https://your-backend.com

# Frontend (build automaticamente detecta)
# Nenhuma configuração adicional necessária
```

## 💡 Recursos Avançados

### Personalização do Botão
```tsx
<CheckoutButton 
  variant="primary"      // primary | secondary | gradient
  size="sm"             // sm | md | lg  
  className="my-class"  // Classes CSS customizadas
>
  Texto customizado
</CheckoutButton>
```

### Tratamento de Erros
```tsx
import { createPreference } from './services/checkoutService';

async function handleCustomCheckout() {
  const result = await createPreference();
  
  if (result.success) {
    window.location.href = result.init_point;
  } else {
    alert(`Erro: ${result.error}`);
  }
}
```

### Status Premium em Tempo Real
```tsx
import { useAuth } from './context/AuthContext';

function PremiumBadge() {
  const { profile } = useAuth();
  
  return profile?.isPremium ? (
    <span className="premium-badge">👑 Premium</span>
  ) : null;
}
```

## 🎉 Resultado Final

- ✅ **1 clique** para iniciar checkout
- ✅ **Redirecionamento automático** para MercadoPago  
- ✅ **Processamento automático** do retorno
- ✅ **Ativação automática** do premium
- ✅ **UX perfeita** com loading states
- ✅ **Detecção automática** dev/prod

**Pronto para usar em produção! 🚀**
