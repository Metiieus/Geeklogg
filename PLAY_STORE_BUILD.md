# 📱 Guia de Build para Google Play Store

## 🎯 Objetivo
Este guia explica como gerar o APK/AAB do GeekLogg para publicação na Google Play Store.

---

## ✅ Pré-requisitos

### **No Seu Computador (Windows/Mac/Linux):**

1. **Android Studio** instalado
   - Download: https://developer.android.com/studio
   - Versão mínima: Arctic Fox ou superior

2. **Java JDK 11** ou superior
   - Download: https://adoptium.net/
   - Verificar: `java -version`

3. **Node.js e pnpm** (já tem no projeto)
   - Node: v18+ 
   - pnpm: `npm install -g pnpm`

---

## 📦 Configuração Atual do Projeto

### **Informações do App:**
- **Package Name:** `com.geeklog.mydiary`
- **App Name:** GeekLogg
- **Version Code:** 1
- **Version Name:** 1.0
- **Min SDK:** 23 (Android 6.0)
- **Target SDK:** 35 (Android 15)

### **Keystore Configurado:**
- **Arquivo:** `android/app/my-release-key.jks`
- **Alias:** my-key-alias
- **Password:** ZelandQueen#100@

⚠️ **IMPORTANTE:** O keystore JÁ ESTÁ CONFIGURADO no `build.gradle`!

---

## 🚀 Passo a Passo para Gerar o Build

### **1. Preparar o Ambiente**

```bash
# Clone o repositório (se ainda não tem)
git clone https://github.com/Metiieus/Geeklogg.git
cd Geeklogg

# Instale as dependências
pnpm install
```

---

### **2. Fazer Build de Produção**

```bash
# Build do projeto web
pnpm run build

# Sincronizar com Android
npx cap sync android
```

**Resultado esperado:**
```
✔ Copying web assets from dist to android/app/src/main/assets/public
✔ Creating capacitor.config.json in android/app/src/main/assets
✔ copy android
✔ Updating Android plugins
✔ update android
[info] Sync finished
```

---

### **3. Abrir no Android Studio**

```bash
# Abrir projeto Android
npx cap open android
```

Ou manualmente:
1. Abra o Android Studio
2. File → Open
3. Navegue até `Geeklogg/android`
4. Clique em OK

---

### **4. Gerar AAB (Android App Bundle) - RECOMENDADO**

#### **Via Android Studio (Mais Fácil):**

1. **Build → Generate Signed Bundle / APK**
2. Selecione **Android App Bundle**
3. Clique em **Next**

4. **Key store path:**
   - Clique em **Choose existing...**
   - Navegue até `android/app/my-release-key.jks`
   - **Key store password:** `ZelandQueen#100@`
   - **Key alias:** `my-key-alias`
   - **Key password:** `ZelandQueen#100@`
   - Marque **Remember passwords**

5. Clique em **Next**

6. **Build Variants:**
   - Selecione **release**
   - Marque **V1 (Jar Signature)** e **V2 (Full APK Signature)**

7. Clique em **Finish**

8. **Aguarde o build** (1-3 minutos)

9. **Localizar o AAB:**
   ```
   android/app/release/app-release.aab
   ```

#### **Via Linha de Comando (Alternativa):**

```bash
cd android

# Gerar AAB
./gradlew bundleRelease

# AAB estará em:
# android/app/build/outputs/bundle/release/app-release.aab
```

---

### **5. Gerar APK (Alternativa ao AAB)**

⚠️ **Nota:** Google Play Store prefere AAB, mas você pode gerar APK para testes.

#### **Via Android Studio:**

1. **Build → Generate Signed Bundle / APK**
2. Selecione **APK**
3. Siga os mesmos passos do AAB (keystore, passwords, etc)

4. **APK estará em:**
   ```
   android/app/release/app-release.apk
   ```

#### **Via Linha de Comando:**

```bash
cd android

# Gerar APK
./gradlew assembleRelease

# APK estará em:
# android/app/build/outputs/apk/release/app-release.apk
```

---

## 📤 Publicar na Google Play Store

### **1. Criar Conta de Desenvolvedor**

1. Acesse: https://play.google.com/console
2. Pague a taxa única de **$25 USD**
3. Preencha informações da conta

---

### **2. Criar Novo App**

1. No Play Console, clique em **Criar app**
2. Preencha:
   - **Nome do app:** GeekLogg
   - **Idioma padrão:** Português (Brasil)
   - **App ou jogo:** App
   - **Gratuito ou pago:** Gratuito

---

### **3. Preencher Informações Obrigatórias**

#### **Ficha da loja:**

**Descrição curta (80 caracteres):**
```
Organize jogos, livros, filmes, séries e animes em um só lugar com IA!
```

**Descrição completa (4000 caracteres):**
```
🎮 GeekLogg - Sua Vida Geek Organizada

Cansado de usar vários apps para organizar sua coleção de jogos, livros, filmes, séries e animes? O GeekLogg é a solução definitiva!

✨ FUNCIONALIDADES PRINCIPAIS:

📚 Biblioteca Unificada
• Adicione jogos, livros, filmes, séries, animes e mangás
• Busca inteligente em múltiplas bases de dados
• Upload de capas personalizadas
• Sistema de tags e categorias

🏆 Organização Poderosa
• Crie seu Top 3 (pódio) por categoria
• Marque favoritos
• Acompanhe progresso (em andamento, concluído, abandonado)
• Avalie com sistema de estrelas

📊 Estatísticas Detalhadas
• Total de itens por categoria
• Horas jogadas / páginas lidas
• Média de avaliações
• Gráficos e visualizações

🤖 Archivius - Seu Assistente IA
• Recomendações personalizadas baseadas no seu gosto
• Análise profunda do seu perfil
• Descubra joias ocultas
• Converse sobre suas mídias favoritas

🎨 Interface Moderna
• Dark mode elegante
• Design responsivo
• Animações suaves
• Experiência premium

🔒 Privacidade e Segurança
• Seus dados são seus
• Sem anúncios
• Sem rastreamento
• Open source

💎 DIFERENCIAIS:

• Tudo em um só lugar (não precisa de 5 apps diferentes!)
• IA que realmente entende seu gosto
• Interface mais bonita que a concorrência
• Gratuito e sem anúncios
• Comunidade ativa

🎯 PERFEITO PARA:

• Gamers que querem organizar sua biblioteca Steam/Epic/Xbox
• Leitores que acompanham dezenas de livros
• Cinéfilos que assistem tudo no streaming
• Otakus que acompanham vários animes
• Qualquer pessoa que ama cultura pop!

📱 FUNCIONA EM QUALQUER LUGAR:

• Android
• iOS (em breve)
• Web (geeklogg.com)
• Sincronização automática entre dispositivos

🚀 COMEÇE AGORA:

1. Baixe o app
2. Crie sua conta grátis
3. Adicione suas primeiras mídias
4. Deixe o Archivius te surpreender!

💬 SUPORTE:

• Email: support@geeklogg.com
• Site: https://geeklogg.com
• GitHub: https://github.com/Metiieus/Geeklogg

⭐ Junte-se a milhares de usuários que já organizaram suas vidas geek!

#GeekLogg #Organização #Games #Livros #Filmes #Séries #Anime #IA
```

#### **Capturas de tela (OBRIGATÓRIO):**

Você precisa de **pelo menos 2 capturas** de tela:

**Tamanhos aceitos:**
- **Telefone:** 16:9 (1920x1080) ou 9:16 (1080x1920)
- **Tablet 7":** 16:9 (1920x1080)
- **Tablet 10":** 16:9 (1920x1080)

**Dica:** Use o emulador do Android Studio para capturar telas do app!

#### **Ícone do app (OBRIGATÓRIO):**

- **Tamanho:** 512x512 px
- **Formato:** PNG de 32 bits
- **Sem transparência**
- Use o logo do GeekLogg!

#### **Imagem de destaque (OBRIGATÓRIO):**

- **Tamanho:** 1024x500 px
- **Formato:** JPG ou PNG de 24 bits
- Crie um banner atrativo com o logo e slogan

---

### **4. Classificação de Conteúdo**

1. Preencha o questionário
2. Para GeekLogg:
   - **Violência:** Nenhuma
   - **Conteúdo sexual:** Nenhum
   - **Linguagem obscena:** Nenhuma
   - **Drogas:** Nenhuma

---

### **5. Upload do AAB**

1. Vá em **Versões → Produção**
2. Clique em **Criar nova versão**
3. **Faça upload do AAB:**
   ```
   android/app/release/app-release.aab
   ```
4. Preencha **Notas da versão:**
   ```
   🎉 Primeira versão do GeekLogg!
   
   ✨ Funcionalidades:
   • Biblioteca unificada de mídias
   • Archivius IA para recomendações
   • Estatísticas detalhadas
   • Sistema de pódio e favoritos
   • Interface moderna e elegante
   ```

---

### **6. Revisão e Publicação**

1. Revise todas as informações
2. Clique em **Enviar para revisão**
3. **Aguarde aprovação** (1-7 dias)
4. Você receberá email quando for aprovado!

---

## 🔄 Atualizações Futuras

### **Aumentar Version Code e Version Name:**

1. Edite `android/app/build.gradle`:
   ```gradle
   defaultConfig {
       versionCode 2        // Sempre +1
       versionName "1.1"    // Versão semântica
   }
   ```

2. Repita o processo de build e upload

---

## 🐛 Troubleshooting

### **Erro: "Keystore not found"**

```bash
# Verifique se o keystore existe
ls android/app/my-release-key.jks

# Se não existir, você precisa gerar um novo
```

### **Erro: "Build failed"**

```bash
# Limpe o build
cd android
./gradlew clean

# Tente novamente
./gradlew bundleRelease
```

### **Erro: "Signing config not found"**

Verifique se o `build.gradle` tem:
```gradle
signingConfigs {
    release {
        storeFile file("my-release-key.jks")
        storePassword "ZelandQueen#100@"
        keyAlias "my-key-alias"
        keyPassword "ZelandQueen#100@"
    }
}
```

---

## 📋 Checklist Final

Antes de enviar para a Play Store:

- [ ] Build de produção funcionando
- [ ] AAB gerado com sucesso
- [ ] Testado em dispositivo físico
- [ ] Ícone de 512x512 pronto
- [ ] Pelo menos 2 capturas de tela
- [ ] Imagem de destaque 1024x500
- [ ] Descrição curta e completa
- [ ] Classificação de conteúdo preenchida
- [ ] Política de privacidade (se aplicável)
- [ ] Termos de serviço (se aplicável)

---

## 🎉 Pronto!

Agora você tem tudo para publicar o GeekLogg na Play Store!

**Boa sorte!** 🚀

---

## 📞 Suporte

Se tiver dúvidas:
- Email: matheusn148@gmail.com
- GitHub: https://github.com/Metiieus/Geeklogg/issues
