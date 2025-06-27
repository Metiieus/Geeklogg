# NerdLog

NerdLog é um diário digital para acompanhar tudo que você consome no mundo geek – jogos, animes, séries, livros e filmes. O projeto foi desenvolvido em React + TypeScript com Vite e TailwindCSS. Os dados são sincronizados com o Firebase (Authentication e Firestore) e também são mantidos no **localStorage** para funcionar offline.

## Funcionalidades Principais

- **Autenticação e Cadastro**
  - Login e registro de usuário utilizando Firebase Authentication.
  - Cada usuário possui sua própria coleção de dados no Firestore.

- **Dashboard**
  - Saudação dinâmica de acordo com o horário do dia.
  - Destaque para o item de mídia atualizado recentemente.
  - Estatísticas rápidas: total de horas, quantidade concluída e nota média.
  - Visão geral de status (concluídos, em progresso, abandonados e planejados).
  - Lista dos marcos mais recentes.

- **Biblioteca de Mídias**
  - Adição, edição e remoção de itens de mídia (jogos, anime, séries, livros e filmes).
  - Filtros por tipo e status, busca por título ou tags e ordenação por título, avaliação, horas ou última atualização.
  - Cada item pode receber imagem de capa, nota, horas gastas, datas de início/conclusão, plataforma, tags, link externo e descrição.

- **Resenhas**
  - Criação, edição e exclusão de resenhas associadas a itens da biblioteca.
  - Marcar resenhas como favoritas e buscar por título, conteúdo ou nome da mídia.

- **Jornada (Timeline)**
  - Registro de marcos importantes com data, ícone personalizado e descrição.
  - Opcionalmente relacionar o marco a uma mídia da biblioteca.
  - Possibilidade de editar ou excluir marcos existentes.

- **Estatísticas**
  - Visão geral do tempo investido, itens concluídos e nota média geral.
  - Indicadores por tipo de mídia (quantidade, horas, concluídos e nota média).
  - Listas de melhores avaliados e itens com mais horas gastas.

- **Perfil**
  - Exibição do avatar, nome e biografia do usuário.

- **Configurações**
  - Personalização do perfil (nome, avatar, bio) e escolha de tema (claro ou escuro).
  - Definição da ordenação padrão da biblioteca.
  - Exportação de backup de todos os dados em formato JSON e importação de backups.
  - Opção para excluir todos os dados salvos.

## Execução do Projeto

1. Instale as dependências (será necessário acesso à internet):
   ```bash
   npm install
   ```
2. Rode o ambiente de desenvolvimento:
   ```bash
   npm run dev
   ```
   O Vite iniciará o servidor em `http://localhost:5173` por padrão.
3. Para gerar uma build de produção:
   ```bash
   npm run build
   ```
4. (Opcional) Verifique a build localmente:
   ```bash
   npm run preview
   ```

## Estrutura do Código

- **src/App.tsx** define a lógica principal e as páginas visíveis de acordo com a navegação.
- **src/components/** contém os componentes de interface (Dashboard, Library, Reviews, Timeline, Statistics, Profile, Settings e modais de adição/edição).
- **src/context/** possui os providers para autenticação e para o estado global da aplicação.
- **src/hooks/** reúne hooks utilitários, como armazenamento local e sincronização com Firestore.
- **src/firebase.ts** inicializa o Firebase.

Sinta-se à vontade para abrir issues ou contribuir com melhorias.
