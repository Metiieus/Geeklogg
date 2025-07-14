# 🤖 Configuração da API OpenAI para o Archivius

## 🔑 Como Obter Sua API Key

1. **Acesse a OpenAI**: Vá para [platform.openai.com](https://platform.openai.com)
2. **Faça Login**: Entre com sua conta ou crie uma nova
3. **Acesse API Keys**: Vá em "API Keys" no menu lateral
4. **Crie Nova Key**: Clique em "Create new secret key"
5. **Copie a Key**: Copie a chave que começa com `sk-proj-...`

## ⚙️ Configuração no Projeto

1. **Abra o arquivo `.env`** na raiz do projeto
2. **Substitua `YOUR_API_KEY_HERE`** pela sua chave real:
   ```env
   VITE_OPENAI_API_KEY=sk-proj-sua-chave-aqui-1234567890abcdef
   ```
3. **Salve o arquivo**

## 🚀 Como Testar

1. **Reinicie o servidor de desenvolvimento**:

   ```bash
   npm run dev
   ```

2. **Acesse o Archivius**: Clique no botão flutuante do agente

3. **Teste a integração**:
   - Use o botão "Analisar meu perfil"
   - Faça perguntas como: "Recomende algo baseado no meu histórico"
   - Observe que as respostas agora vêm da API real da OpenAI

## 🔍 Como Saber se Está Funcionando

### ✅ **Com API Configurada:**

- Respostas mais naturais e contextuais
- Análises mais detalhadas do seu perfil
- Recomendações mais sofisticadas
- Tempo de resposta pode ser um pouco maior

### 🤖 **Modo Demo (sem API):**

- Respostas pré-programadas
- Análises baseadas em templates
- Respostas instantâneas
- Ainda funcional, mas menos inteligente

## 💰 Custos

- **Modelo usado**: GPT-3.5 Turbo (mais barato)
- **Custo aproximado**: $0.002 por 1K tokens
- **Uso típico**: Cada conversa custa centavos
- **Tokens limitados**: 350 tokens por resposta (economia)

## 🛡️ Segurança

- ✅ Arquivo `.env` está no `.gitignore`
- ✅ API key não será commitada no git
- ✅ Variável de ambiente com prefixo `VITE_`
- ⚠️ **NUNCA** compartilhe sua API key
- ⚠️ **NUNCA** commite a key no código

## 🔧 Fallback Automático

Se a API falhar ou dar erro:

- ✅ Archivius volta automaticamente para modo demo
- ✅ Usuário continua tendo experiência funcional
- ✅ Logs de erro aparecem no console para debug

## 🎯 Exemplo de Configuração

```env
# Arquivo .env (na raiz do projeto)
VITE_OPENAI_API_KEY=sk-proj-abcd1234567890efghijklmnopqrstuvwxyz

# Outros exemplos de formato:
# VITE_OPENAI_API_KEY=sk-1234567890abcdef...
# VITE_OPENAI_API_KEY=sk-proj-1234567890abcdef...
```

---

**🎉 Depois de configurar, teste fazendo perguntas específicas sobre seus dados para ver a diferença na qualidade das respostas!**
