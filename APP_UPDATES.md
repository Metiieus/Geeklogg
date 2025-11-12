# 🔄 Guia de Atualizações do App

## 🎯 Como Atualizar o GeekLogg na Play Store

Este guia explica o processo completo para publicar atualizações do app.

---

## 📋 Checklist Antes de Atualizar

Antes de começar, certifique-se de que:

- [ ] Todas as mudanças estão commitadas no Git
- [ ] Código foi testado localmente
- [ ] Bugs críticos foram corrigidos
- [ ] Novas funcionalidades foram testadas
- [ ] README e documentação estão atualizados

---

## 🔢 Passo 1: Aumentar Version Code e Version Name

### **O Que São?**

- **versionCode**: Número inteiro que aumenta a cada versão (1, 2, 3...)
- **versionName**: String legível para humanos (1.0, 1.1, 2.0...)

### **Regras:**

| Tipo de Update | versionCode | versionName | Exemplo |
|----------------|-------------|-------------|---------|
| **Bug fix** | +1 | +0.0.1 | 1.0.0 → 1.0.1 |
| **Feature menor** | +1 | +0.1.0 | 1.0.1 → 1.1.0 |
| **Feature maior** | +1 | +1.0.0 | 1.1.0 → 2.0.0 |

### **Como Fazer:**

1. **Abra o arquivo:**
   ```
   android/app/build.gradle
   ```

2. **Encontre a seção `defaultConfig`:**
   ```gradle
   defaultConfig {
       applicationId "com.geeklog.mydiary"
       minSdk 23
       targetSdk 35
       versionCode 1        // ← Mudar aqui
       versionName "1.0"    // ← Mudar aqui
       // ...
   }
   ```

3. **Aumente os valores:**
   ```gradle
   defaultConfig {
       applicationId "com.geeklog.mydiary"
       minSdk 23
       targetSdk 35
       versionCode 2        // ✅ Era 1, agora 2
       versionName "1.1"    // ✅ Era 1.0, agora 1.1
       // ...
   }
   ```

4. **Salve o arquivo**

---

## 🛠️ Passo 2: Fazer Build de Produção

### **No Terminal:**

```bash
# 1. Entre na pasta do projeto
cd Geeklogg

# 2. Instale dependências (se houver novas)
pnpm install

# 3. Build do projeto web
pnpm run build

# 4. Sincronize com Android
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

## 📦 Passo 3: Gerar Novo AAB

### **Opção A: Via Android Studio (Recomendado)**

1. **Abra o projeto:**
   ```bash
   npx cap open android
   ```

2. **Aguarde sincronização do Gradle**

3. **Gerar AAB:**
   - **Build** → **Generate Signed Bundle / APK**
   - Selecione: **Android App Bundle**
   - Clique: **Next**

4. **Configurar Keystore:**
   - **Key store path:** `android/app/my-release-key.jks`
   - **Key store password:** `ZelandQueen#100@`
   - **Key alias:** `my-key-alias`
   - **Key password:** `ZelandQueen#100@`
   - Marque: **"Remember passwords"**

5. **Build Variants:**
   - Selecione: **release**
   - Marque: **V1** e **V2**

6. **Clique em Finish**

7. **AAB estará em:**
   ```
   android/app/release/app-release.aab
   ```

### **Opção B: Via Linha de Comando**

```bash
cd android
./gradlew bundleRelease

# AAB estará em:
# android/app/build/outputs/bundle/release/app-release.aab
```

---

## 🚀 Passo 4: Upload na Play Console

### **1. Acesse a Play Console:**
- URL: https://play.google.com/console
- Faça login
- Selecione o app **GeekLogg**

### **2. Criar Nova Versão:**

1. No menu lateral: **Versões** → **Produção**
2. Clique em: **Criar nova versão**

### **3. Upload do AAB:**

1. **Faça upload do novo AAB:**
   - Arraste o arquivo `app-release.aab`
   - Ou clique em **"Fazer upload"**

2. **Aguarde processamento** (1-2 minutos)

3. **Verifique informações:**
   - Version code: deve ser maior que o anterior
   - Version name: deve ser a nova versão

### **4. Preencher Notas da Versão:**

**Formato recomendado:**

```
🎉 Versão 1.1 - O que há de novo:

✨ Novos Recursos:
• [Descreva novos recursos]

🐛 Correções:
• Corrigido erro ao adicionar mídias
• Melhorias de performance

🎨 Melhorias:
• Interface mais fluida
• Animações otimizadas
```

**Exemplo real:**

```
🎉 Versão 1.1 - Correções e Melhorias

🐛 Correções:
• Corrigido erro "result is not defined" ao adicionar mídias
• Resolvido problema de salvamento do pódio
• Corrigido botão X que não fechava modal

🎨 Melhorias:
• Landing page redesenhada
• Login e cadastro mais profissionais
• Depoimentos com fotos reais
• Logs de segurança removidos

✨ Novos Recursos:
• Archivius mais inteligente e humano
• Recomendações baseadas na sua biblioteca
• Estatísticas mostram "Páginas" para livros
```

### **5. Revisar e Enviar:**

1. **Revise todas as informações**
2. Clique em: **Revisar versão**
3. Clique em: **Iniciar lançamento para produção**

### **6. Aguardar Aprovação:**

- **Tempo de revisão:** 1-7 dias (geralmente 1-2 dias)
- **Você receberá email** quando for aprovado
- **Atualizações geralmente são mais rápidas** que a primeira versão

---

## 📊 Tipos de Lançamento

### **1. Produção (Recomendado)**
- Disponível para **todos os usuários**
- Revisão completa do Google
- Tempo: 1-7 dias

### **2. Teste Aberto**
- Disponível para **qualquer pessoa com o link**
- Revisão mais rápida
- Bom para testar antes de lançar para todos

### **3. Teste Fechado**
- Disponível para **lista específica de testadores**
- Sem revisão (ou muito rápida)
- Ideal para testes internos

---

## 🔄 Fluxo Completo de Atualização

```
1. Fazer mudanças no código
   ↓
2. Testar localmente
   ↓
3. Commit e push para GitHub
   ↓
4. Aumentar versionCode e versionName
   ↓
5. pnpm run build
   ↓
6. npx cap sync android
   ↓
7. Gerar novo AAB
   ↓
8. Upload na Play Console
   ↓
9. Preencher notas da versão
   ↓
10. Enviar para revisão
    ↓
11. Aguardar aprovação (1-7 dias)
    ↓
12. Update publicado! 🎉
```

---

## 📝 Versionamento Semântico

### **Formato: MAJOR.MINOR.PATCH**

**Exemplos:**

| Versão | versionCode | Tipo de Mudança |
|--------|-------------|-----------------|
| 1.0.0 | 1 | Lançamento inicial |
| 1.0.1 | 2 | Bug fix (erro ao adicionar mídia) |
| 1.0.2 | 3 | Bug fix (modal não fecha) |
| 1.1.0 | 4 | Feature menor (Archivius melhorado) |
| 1.2.0 | 5 | Feature menor (estatísticas novas) |
| 2.0.0 | 6 | Feature maior (modo offline) |

### **Quando aumentar cada parte:**

**PATCH (1.0.X):**
- Correções de bugs
- Melhorias de performance
- Ajustes de UI menores

**MINOR (1.X.0):**
- Novas funcionalidades pequenas
- Melhorias significativas
- Mudanças na UI

**MAJOR (X.0.0):**
- Mudanças grandes de arquitetura
- Novas funcionalidades principais
- Breaking changes

---

## 🚨 Troubleshooting

### **Erro: "Version code must be greater than X"**

**Solução:**
- Você esqueceu de aumentar o `versionCode`
- Abra `android/app/build.gradle`
- Aumente o `versionCode` para um número maior que o último

### **Erro: "Upload failed"**

**Solução:**
- Verifique conexão com internet
- Tente fazer upload novamente
- Se persistir, gere o AAB novamente

### **Erro: "Signing config not found"**

**Solução:**
- Verifique se o keystore existe em `android/app/my-release-key.jks`
- Verifique as senhas no `build.gradle`

### **Update não aparece para usuários:**

**Causas comuns:**
- Update ainda em revisão
- Usuários com updates automáticos desligados
- Cache da Play Store

**Solução:**
- Aguarde 24-48h após aprovação
- Usuários podem forçar update manualmente

---

## 📱 Como Usuários Recebem Updates

### **Automático:**
- Play Store baixa e instala automaticamente
- Geralmente quando o dispositivo está:
  - Conectado ao Wi-Fi
  - Carregando
  - Ocioso

### **Manual:**
1. Abrir Play Store
2. Ir em "Meus apps e jogos"
3. Procurar GeekLogg
4. Clicar em "Atualizar"

---

## 📊 Monitoramento Pós-Update

### **Na Play Console:**

1. **Estatísticas:**
   - Quantos usuários atualizaram
   - Taxa de adoção da nova versão

2. **Relatórios de Crash:**
   - Novos crashes após update
   - Erros reportados

3. **Avaliações:**
   - Feedback dos usuários
   - Problemas reportados

### **Ações Recomendadas:**

- ✅ Monitore crashes nas primeiras 24h
- ✅ Responda avaliações negativas
- ✅ Prepare hotfix se necessário

---

## 🎯 Checklist Pós-Update

Após publicar update:

- [ ] Verificar que update foi aprovado
- [ ] Testar download da Play Store
- [ ] Verificar que versão correta está disponível
- [ ] Monitorar relatórios de crash
- [ ] Responder feedback dos usuários
- [ ] Atualizar changelog no GitHub

---

## 📋 Template de Notas de Versão

**Para Bug Fixes:**
```
🐛 Versão X.X.X - Correções

• Corrigido [problema específico]
• Resolvido [outro problema]
• Melhorias de estabilidade
```

**Para Novos Recursos:**
```
✨ Versão X.X.0 - Novos Recursos

🎉 Novidades:
• [Novo recurso 1]
• [Novo recurso 2]

🐛 Correções:
• [Bug corrigido]

🎨 Melhorias:
• [Melhoria 1]
```

**Para Versão Maior:**
```
🚀 Versão X.0.0 - Grande Atualização!

🎉 Principais Novidades:
• [Feature principal 1]
• [Feature principal 2]
• [Feature principal 3]

✨ Outros Recursos:
• [Recurso menor 1]
• [Recurso menor 2]

🐛 Correções:
• Diversos bugs corrigidos

🎨 Melhorias:
• Performance otimizada
• Interface renovada
```

---

## 🔥 Dicas Pro

### **1. Teste Antes de Publicar:**
- Use **Teste Fechado** para testar com amigos
- Teste em diferentes dispositivos
- Teste diferentes versões do Android

### **2. Lançamento Gradual:**
- Na Play Console, você pode fazer "Staged Rollout"
- Libera para 10% → 25% → 50% → 100% dos usuários
- Permite detectar problemas antes de afetar todos

### **3. Hotfix Rápido:**
- Se descobrir bug crítico após lançar:
  1. Corrija imediatamente
  2. Aumente apenas PATCH (1.0.1 → 1.0.2)
  3. Gere novo AAB
  4. Upload urgente na Play Console
  5. Marque como "Correção urgente" nas notas

### **4. Mantenha Histórico:**
- Salve todos os AABs gerados
- Mantenha changelog atualizado
- Documente mudanças importantes

---

## 📞 Suporte

Se tiver dúvidas durante updates:

1. **Consulte este guia primeiro**
2. **Documentação oficial:**
   - Play Console: https://support.google.com/googleplay/android-developer
   - Capacitor: https://capacitorjs.com/docs/android

3. **Entre em contato:**
   - Email: matheusn148@gmail.com
   - GitHub: https://github.com/Metiieus/Geeklogg/issues

---

## 🎉 Pronto!

Agora você sabe como fazer updates do GeekLogg!

**Resumo rápido:**
1. ✅ Aumentar versionCode e versionName
2. ✅ Build + Sync
3. ✅ Gerar AAB
4. ✅ Upload na Play Console
5. ✅ Preencher notas
6. ✅ Enviar para revisão
7. ✅ Aguardar aprovação

**Boa sorte com os updates!** 🚀
