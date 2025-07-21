# MercadoPago Integration Guide

## ✅ What's Been Implemented

### Backend (server.js)
- ✅ Mercado Pago SDK installed and configured
- ✅ `/api/create-preference` endpoint that creates payment preferences
- ✅ `/api/webhook` endpoint for payment notifications
- ✅ `/api/update-premium` endpoint to manually activate premium
- ✅ CORS configured for both localhost and production
- ✅ Firebase Firestore integration for user premium status

### Frontend (React)
- ✅ `MercadoPagoButton` component for initiating payments
- ✅ Payment result pages:
  - `/premium/success` - Payment successful
  - `/premium/failure` - Payment failed  
  - `/premium/pending` - Payment pending
- ✅ React Router integration
- ✅ Premium section added to Settings page
- ✅ Automatic user premium status update on success

## 🚀 How to Set Up

### 1. Get MercadoPago Credentials
1. Go to [MercadoPago Developers](https://www.mercadopago.com.br/developers/)
2. Create an application
3. Get your Access Token from the credentials section

### 2. Configure Environment Variables
Create a `.env` file in the root directory:

```env
MERCADO_PAGO_ACCESS_TOKEN=your_access_token_here
CLIENT_URL=http://localhost:5173
SERVER_URL=http://localhost:4242
PORT=4242
```

### 3. Start the Services
```bash
# Start backend server
npm run start:server

# Start frontend (in another terminal)
npm run dev
```

## 🧪 How to Test

### Frontend Testing
1. Go to Settings page in your app
2. Find the "GeekLog Premium" section
3. Click "Assinar Premium - R$ 19,99"
4. You'll be redirected to MercadoPago checkout
5. Use MercadoPago's test cards for testing

### Backend Testing
```bash
# Test preference creation
curl -X POST http://localhost:4242/api/create-preference \
  -H "Content-Type: application/json" \
  -d '{"uid":"test-user","email":"test@example.com"}'

# Test premium activation
curl -X POST http://localhost:4242/api/update-premium \
  -H "Content-Type: application/json" \
  -d '{"uid":"test-user","paymentId":"123456"}'
```

## 🔄 Payment Flow

1. **User clicks payment button** → `MercadoPagoButton.tsx`
2. **Frontend calls `/api/create-preference`** → `server.js`
3. **Backend creates preference** → MercadoPago API
4. **User redirected to MercadoPago** → Payment form
5. **Payment completed** → Redirect to `/premium/success`
6. **Success page calls `/api/update-premium`** → Updates Firestore
7. **User premium status activated** ✅

## 📱 MercadoPago Test Cards

For testing, use these test cards:

### Credit Cards (Approved)
- **Visa**: 4003 0319 9890 7891
- **Mastercard**: 5555 5555 5555 4444
- **American Express**: 3704 0000 0000 0000

### Credit Cards (Rejected)
- **Rejected**: 4014 1418 5802 1119

### Test User Data
- **CPF**: 12345678901
- **Email**: test_user_123456@testuser.com

## 🔧 Configuration Details

### Firestore Structure
When payment is successful, the user document is updated:
```json
{
  "plano": {
    "status": "ativo",
    "tipo": "premium", 
    "mercadoPagoPaymentId": "payment_id",
    "activatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Environment Variables Required
- `MERCADO_PAGO_ACCESS_TOKEN`: Your MercadoPago access token
- `CLIENT_URL`: Frontend URL (for redirects)
- `SERVER_URL`: Backend URL (for webhooks)

## 🚨 Security Notes

- Store access tokens in environment variables, never in code
- Use HTTPS in production
- Validate webhook signatures in production
- Implement proper error handling and logging

## 🔗 Useful Links

- [MercadoPago Documentation](https://www.mercadopago.com.br/developers/pt/docs)
- [Test Cards](https://www.mercadopago.com.br/developers/pt/docs/checkout-pro/additional-content/test-cards)
- [Webhooks Guide](https://www.mercadopago.com.br/developers/pt/docs/checkout-pro/additional-content/webhooks)
