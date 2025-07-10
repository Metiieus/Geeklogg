import { AchievementNode } from '../types/achievements';

export const ACHIEVEMENTS_DATA: AchievementNode[] = [
  // Galho Gamer 🎮
  {
    id: 'primeiro_game',
    title: 'Primeiro Passo',
    description: 'Cadastre seu primeiro jogo na biblioteca',
    image: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=400',
    unlocked: false,
    category: 'gamer',
    position: { x: 20, y: 10 },
    rarity: 'common'
  },
  {
    id: 'completou_primeiro_game',
    title: 'Finalizador',
    description: 'Marque seu primeiro jogo como concluído',
    image: 'https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?auto=compress&cs=tinysrgb&w=400',
    unlocked: false,
    dependsOn: ['primeiro_game'],
    category: 'gamer',
    position: { x: 20, y: 25 },
    rarity: 'common'
  },
  {
    id: 'viciado_em_horas',
    title: 'Viciado',
    description: 'Registre mais de 100 horas em um único jogo',
    image: 'https://images.pexels.com/photos/1174746/pexels-photo-1174746.jpeg?auto=compress&cs=tinysrgb&w=400',
    unlocked: false,
    dependsOn: ['completou_primeiro_game'],
    category: 'gamer',
    position: { x: 20, y: 40 },
    rarity: 'rare'
  },

  // Galho Leitor 📚
  {
    id: 'primeiro_livro',
    title: 'Bookworm Iniciante',
    description: 'Adicione seu primeiro livro à biblioteca',
    image: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400',
    unlocked: false,
    category: 'leitor',
    position: { x: 40, y: 10 },
    rarity: 'common'
  },
  {
    id: 'devorador_de_livros',
    title: 'Devorador de Livros',
    description: 'Complete 10 livros',
    image: 'https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg?auto=compress&cs=tinysrgb&w=400',
    unlocked: false,
    dependsOn: ['primeiro_livro'],
    category: 'leitor',
    position: { x: 40, y: 25 },
    rarity: 'epic'
  },

  // Galho Cinéfilo 🎬
  {
    id: 'primeiro_filme',
    title: 'Cinéfilo Nato',
    description: 'Adicione seu primeiro filme ou série',
    image: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=400',
    unlocked: false,
    category: 'cinefilo',
    position: { x: 60, y: 10 },
    rarity: 'common'
  },
  {
    id: 'maratonista',
    title: 'Maratonista',
    description: 'Assista mais de 50 horas de conteúdo audiovisual',
    image: 'https://images.pexels.com/photos/1040160/pexels-photo-1040160.jpeg?auto=compress&cs=tinysrgb&w=400',
    unlocked: false,
    dependsOn: ['primeiro_filme'],
    category: 'cinefilo',
    position: { x: 60, y: 25 },
    rarity: 'rare'
  },

  // Galho Narrador 🧠
  {
    id: 'mini_review',
    title: 'Crítico Iniciante',
    description: 'Escreva sua primeira resenha com mais de 100 caracteres',
    image: 'https://images.pexels.com/photos/261763/pexels-photo-261763.jpeg?auto=compress&cs=tinysrgb&w=400',
    unlocked: false,
    category: 'narrador',
    position: { x: 80, y: 10 },
    rarity: 'common'
  },
  {
    id: 'critico_experiente',
    title: 'Crítico Experiente',
    description: 'Escreva 5 resenhas detalhadas',
    image: 'https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=400',
    unlocked: false,
    dependsOn: ['mini_review'],
    category: 'narrador',
    position: { x: 80, y: 25 },
    rarity: 'epic'
  },

  // Galho Geral 🌀
  {
    id: 'personalizou_perfil',
    title: 'Identidade Própria',
    description: 'Personalize seu perfil com avatar, nome e bio',
    image: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=400',
    unlocked: false,
    category: 'geral',
    position: { x: 50, y: 55 },
    rarity: 'common'
  },
  {
    id: 'mestre_multimidia',
    title: 'Mestre Multimídia',
    description: 'Complete pelo menos uma mídia de cada categoria',
    image: 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=400',
    unlocked: false,
    dependsOn: ['completou_primeiro_game', 'primeiro_livro', 'primeiro_filme'],
    category: 'geral',
    position: { x: 50, y: 70 },
    rarity: 'legendary'
  }
];