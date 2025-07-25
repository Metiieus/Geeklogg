 # NerdLog

NerdLog é um diário digital para registrar e acompanhar seu consumo de mídias geek.
O projeto utiliza React + TypeScript com Vite e TailwindCSS, além dos serviços do Firebase (Authentication, Firestore e Storage).

## Funcionalidades

### Autenticação
- Login e registro de usuários via Firebase Authentication.
- Cada usuário tem sua própria coleção de dados.

### Dashboard
- Saudação dinâmica conforme o horário do dia.
- Destaque para o item de mídia atualizado mais recentemente.
- Resumo rápido de horas investidas, itens concluídos e nota média.
- Painel com contagem de status (concluídos, em progresso, abandonados, planejados).
- Exibição dos últimos marcos adicionados.

### Biblioteca
- Cadastro, edição e remoção de jogos, anime, séries, livros e filmes.
- Filtros por tipo e status, busca por título ou tags e ordenação por título, avaliação, horas ou data de atualização.
- Upload de imagem de capa e campos para nota, horas, datas, plataforma, tags, link e descrição.

### Resenhas
- Criação e edição de resenhas ligadas a itens da biblioteca.
- Marcação de resenhas como favoritas.
- Busca por título, conteúdo ou nome da mídia associada.
- Upload opcional de imagem para ilustrar a resenha.

### Jornada (Timeline)
- Registro de marcos importantes com data, ícone e descrição.
- Possibilidade de relacionar o marco a uma mídia específica.
- Edição e exclusão dos marcos registrados.

### Estatísticas
- Visão geral de tempo total, número de itens concluídos e nota média.
- Indicadores por tipo de mídia (quantidade, horas, concluídos e nota).
- Listas de melhores avaliados e de maior tempo investido.

### Perfil
- Exibição e edição de avatar, nome e biografia.
- Gerenciamento de favoritos (personagens, jogos e filmes/séries) com upload de imagens.

### Configurações
- Escolha entre tema claro ou escuro e definição da ordenação padrão da biblioteca.
- Exportação de um backup JSON com todos os dados e importação de backups.
- Opção para apagar todos os dados armazenados.

## Execução

Antes de rodar o projeto, copie o arquivo `.env.example` para `.env` e
preencha com as credenciais do Firebase.

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
   A aplicação fica acessível por padrão em `http://localhost:5173`.
3. Para gerar a build de produção:
   ```bash
   npm run build
   ```
4. Para pré-visualizar a build:
   ```bash
   npm run preview
   ```

## Estrutura

- **src/App.tsx** organiza a navegação e repassa os dados via context.
- **src/components/** traz as telas e modais utilizados em cada funcionalidade.
- **src/context/** define os providers de autenticação e de estado global.
 - **src/services/** concentra a camada de acesso a dados e pode ser trocada por outro banco facilmente.
- **src/firebase.ts** inicializa os serviços do Firebase.

Sinta-se à vontade para abrir issues ou contribuir com melhorias.
