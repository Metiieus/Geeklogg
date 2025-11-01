# 📝 Guia de Commit - Editor de Texto Rico e Upload de Imagens

## 🎯 Resumo das Mudanças

Implementação completa de editor de texto rico para Resenhas e Jornada, com suporte a formatação de texto (negrito, itálico, sublinhado, listas) e upload de até 2 imagens nos marcos da jornada.

## 📦 Arquivos para Commit

### Novos Arquivos
```bash
git add src/components/RichTextEditor.tsx
git add IMPLEMENTACAO_EDITOR_RICO.md
git add GUIA_COMMIT.md
```

### Arquivos Modificados
```bash
git add src/components/modals/AddReviewModal.tsx
git add src/components/modals/EditReviewModal.tsx
git add src/components/modals/AddMilestoneModal.tsx
git add src/components/modals/EditMilestoneModal.tsx
git add src/components/Timeline.tsx
git add src/components/Reviews.tsx
git add src/App.tsx
git add src/services/milestoneService.ts
git add src/services/storageClient.ts
```

## 🚀 Comandos de Commit

### Opção 1: Commit Único (Recomendado)
```bash
cd /home/ubuntu/Geeklogg

# Adicionar todos os arquivos
git add src/components/RichTextEditor.tsx \
        src/components/modals/AddReviewModal.tsx \
        src/components/modals/EditReviewModal.tsx \
        src/components/modals/AddMilestoneModal.tsx \
        src/components/modals/EditMilestoneModal.tsx \
        src/components/Timeline.tsx \
        src/components/Reviews.tsx \
        src/App.tsx \
        src/services/milestoneService.ts \
        src/services/storageClient.ts \
        IMPLEMENTACAO_EDITOR_RICO.md \
        GUIA_COMMIT.md

# Fazer commit
git commit -m "feat: adicionar editor de texto rico e upload de imagens

- Implementar RichTextEditor com formatação completa (negrito, itálico, sublinhado, listas)
- Integrar editor nos modais de Resenhas e Jornada
- Adicionar suporte a upload de até 2 imagens nos marcos da jornada
- Atualizar tipos TypeScript para incluir campo images em Milestone
- Criar função uploadImage no storageClient para upload com nomes únicos
- Adicionar renderização HTML nos componentes Timeline e Reviews
- Implementar validações de tamanho e tipo de arquivo
- Adicionar preview e remoção de imagens nos modais
- Incluir documentação completa da implementação

Closes #[número-da-issue]"
```

### Opção 2: Commits Separados (Mais Detalhado)
```bash
cd /home/ubuntu/Geeklogg

# 1. Commit do Editor de Texto Rico
git add src/components/RichTextEditor.tsx
git commit -m "feat: criar componente RichTextEditor reutilizável

- Implementar barra de ferramentas com formatação
- Adicionar suporte a negrito, itálico, sublinhado
- Implementar listas ordenadas e não ordenadas
- Adicionar desfazer/refazer
- Incluir contador de caracteres com limite configurável
- Adicionar estilos customizados e scrollbar personalizado"

# 2. Commit da integração em Resenhas
git add src/components/modals/AddReviewModal.tsx \
        src/components/modals/EditReviewModal.tsx \
        src/components/Reviews.tsx
git commit -m "feat: integrar editor rico nos modais de Resenhas

- Substituir textarea pelo RichTextEditor
- Configurar limite de 5000 caracteres
- Adicionar renderização HTML no componente Reviews
- Expandir modal para max-w-3xl
- Adicionar dica visual sobre formatação"

# 3. Commit da integração em Jornada com imagens
git add src/components/modals/AddMilestoneModal.tsx \
        src/components/modals/EditMilestoneModal.tsx \
        src/components/Timeline.tsx \
        src/App.tsx \
        src/services/milestoneService.ts \
        src/services/storageClient.ts
git commit -m "feat: adicionar editor rico e upload de imagens na Jornada

- Integrar RichTextEditor nos modais de Milestone
- Implementar upload de até 2 imagens por marco
- Adicionar validações de tamanho (5MB) e tipo de arquivo
- Criar função uploadImage com nomes únicos
- Adicionar preview e remoção de imagens
- Atualizar tipo Milestone para incluir campo images
- Implementar exibição de imagens no Timeline com grid responsivo
- Adicionar click para ampliar imagem em nova aba"

# 4. Commit da documentação
git add IMPLEMENTACAO_EDITOR_RICO.md GUIA_COMMIT.md
git commit -m "docs: adicionar documentação da implementação do editor rico

- Criar guia completo de implementação
- Documentar todas as funcionalidades
- Adicionar checklist de validação
- Incluir guia de testes
- Adicionar guia de commit"
```

## 🔍 Verificar Mudanças Antes do Commit

```bash
# Ver status dos arquivos
git status

# Ver diferenças detalhadas
git diff src/components/RichTextEditor.tsx
git diff src/components/modals/AddReviewModal.tsx
git diff src/App.tsx

# Ver resumo das mudanças
git diff --stat
```

## 📤 Push para o Repositório

```bash
# Push para branch principal
git push origin main

# OU criar branch feature
git checkout -b feature/rich-text-editor
git push origin feature/rich-text-editor
```

## 🏷️ Sugestões de Tags/Labels

Se você usar issues no GitHub, adicione estas labels:
- `enhancement` - Nova funcionalidade
- `ui/ux` - Melhoria de interface
- `editor` - Relacionado ao editor de texto
- `images` - Upload e gerenciamento de imagens

## 📋 Mensagem de Commit Detalhada (Alternativa)

```bash
git commit -m "feat: implementar editor de texto rico e upload de imagens

FUNCIONALIDADES ADICIONADAS:
✅ Editor de texto rico reutilizável (RichTextEditor)
✅ Formatação: negrito, itálico, sublinhado
✅ Listas: marcadores e numeradas
✅ Desfazer/Refazer (Ctrl+Z/Ctrl+Y)
✅ Contador de caracteres com limite
✅ Upload de até 2 imagens por marco da jornada
✅ Validação de tamanho (5MB) e tipo de arquivo
✅ Preview e remoção de imagens
✅ Renderização HTML em Timeline e Reviews

ARQUIVOS MODIFICADOS:
- src/components/RichTextEditor.tsx (NOVO)
- src/components/modals/AddReviewModal.tsx
- src/components/modals/EditReviewModal.tsx
- src/components/modals/AddMilestoneModal.tsx
- src/components/modals/EditMilestoneModal.tsx
- src/components/Timeline.tsx
- src/components/Reviews.tsx
- src/App.tsx (tipos)
- src/services/milestoneService.ts
- src/services/storageClient.ts

IMPACTO:
- ~800 linhas de código novo
- ~200 linhas modificadas
- Build bem-sucedido sem erros TypeScript
- Nenhuma dependência externa adicionada

TESTES REALIZADOS:
✅ Build compilado com sucesso
✅ Tipos TypeScript validados
✅ Componentes renderizam corretamente

Closes #[número-da-issue]"
```

## 🎯 Conventional Commits (Padrão)

Se você segue o padrão Conventional Commits:

```bash
git commit -m "feat(editor): add rich text editor with image upload

BREAKING CHANGE: Milestone interface now includes optional images field

Features:
- Rich text editor component with formatting toolbar
- Image upload support (max 2 images per milestone)
- HTML rendering in Timeline and Reviews
- File validation (size and type)

Technical:
- Add RichTextEditor.tsx component
- Update Milestone type with images field
- Create uploadImage utility function
- Integrate editor in review and milestone modals

Docs:
- Add complete implementation guide
- Include testing instructions
- Add commit guide"
```

## ✅ Checklist Pré-Commit

Antes de fazer o commit, verifique:

- [ ] Build compila sem erros (`pnpm run build`)
- [ ] Não há erros de TypeScript
- [ ] Código está formatado corretamente
- [ ] Comentários desnecessários foram removidos
- [ ] Console.logs de debug foram removidos
- [ ] Documentação foi criada/atualizada
- [ ] Todos os arquivos relevantes foram adicionados
- [ ] Mensagem de commit é clara e descritiva

## 🚨 Importante

Antes de fazer push para produção:

1. **Testar localmente**: `pnpm run dev` e testar todas as funcionalidades
2. **Verificar Firebase Rules**: Garantir que Storage permite upload de imagens
3. **Testar em diferentes navegadores**: Chrome, Firefox, Safari
4. **Testar em mobile**: Verificar responsividade
5. **Backup do banco**: Fazer backup antes de deploy

## 📞 Suporte

Se encontrar problemas:
1. Verificar console do navegador para erros
2. Verificar logs do Firebase
3. Revisar documentação em `IMPLEMENTACAO_EDITOR_RICO.md`
4. Criar issue no repositório com detalhes do erro

---

**Boa sorte com o deploy! 🚀**
