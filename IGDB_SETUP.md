# 🎮 Configuração da IGDB API - Internet Game Database

## 📋 Resumo

A IGDB API é utilizada para buscar informações detalhadas sobre jogos. Ela requer autenticação via Twitch OAuth e um proxy no backend devido a restrições de CORS.

## 🔧 Configuração

### 1. Obter Credenciais Twitch/IGDB

1. **Acesse [Twitch Developers](https://dev.twitch.tv/console)**
2. **Faça login** com sua conta Twitch
3. **Crie uma nova aplicação:**
   - Name: `GeekLog IGDB Integration`
   - OAuth Redirect URLs: `http://localhost:3000`
   - Category: `Application Integration`
4. **Anote o Client ID** gerado
5. **Gere um Access Token:**
   ```bash
   curl -X POST 'https://id.twitch.tv/oauth2/token' \
   -H 'Content-Type: application/x-www-form-urlencoded' \
   -d 'client_id=YOUR_CLIENT_ID&client_secret=YOUR_CLIENT_SECRET&grant_type=client_credentials'
   ```

### 2. Configurar Variáveis de Ambiente

Adicione no seu arquivo `.env`:

```env
# IGDB API (Backend)
IGDB_CLIENT_ID=your_twitch_client_id_here
IGDB_ACCESS_TOKEN=your_twitch_access_token_here
```

### 3. Reiniciar o Servidor

```bash
npm run server
# ou
node server.js
```

## 🚀 Testando a Configuração

### 1. Health Check
```bash
curl http://localhost:4242/api/igdb/status
```

**Resposta esperada:**
```json
{
  "status": "ok",
  "message": "IGDB API disponível"
}
```

### 2. Busca de Jogos
```bash
curl -X POST http://localhost:4242/api/igdb/games \
  -H "Content-Type: application/json" \
  -d '{"query": "fields id,name; search \"zelda\"; limit 5;"}'
```

## 🔍 Endpoints Disponíveis

### `POST /api/igdb/games`
Proxy para buscar jogos via IGDB API

**Body:**
```json
{
  "query": "fields id,name,summary; search \"game_name\"; limit 10;"
}
```

### `GET /api/igdb/status`
Verifica se a IGDB API está funcionando

## ⚠️ Problemas Comuns

### 1. **"IGDB API not configured"**
- **Causa:** Variáveis `IGDB_CLIENT_ID` ou `IGDB_ACCESS_TOKEN` não definidas
- **Solução:** Configure as variáveis no `.env` e reinicie o servidor

### 2. **"IGDB API error: 401"**
- **Causa:** Access token inválido ou expirado
- **Solução:** Gere um novo access token via Twitch OAuth

### 3. **"IGDB API error: 429"**
- **Causa:** Rate limit excedido (4 requests/second)
- **Solução:** Implemente throttling nas requisições

### 4. **"Network request failed"**
- **Causa:** Servidor backend não está rodando
- **Solução:** Execute `npm run server` ou `node server.js`

## 📚 Documentação

- [IGDB API Documentation](https://api-docs.igdb.com/)
- [Twitch OAuth Guide](https://dev.twitch.tv/docs/authentication/)
- [IGDB Query Language](https://api-docs.igdb.com/#examples)

## 🎯 Funcionalidades Disponíveis

Com a IGDB API configurada, os usuários podem:

- ✅ Buscar jogos por nome
- ✅ Ver detalhes completos (desenvolvedora, gêneros, plataformas)
- ✅ Visualizar capturas de tela e covers
- ✅ Filtrar por gênero, plataforma, ano
- ✅ Ver jogos populares e recomendados
- ✅ Ratings e reviews

## 🔒 Segurança

- Credenciais armazenadas apenas no backend
- Proxy protege as chaves da API
- Rate limiting implementado
- CORS configurado adequadamente

---

**Status:** ✅ Configurado e funcionando  
**Última atualização:** Janeiro 2025
