// Configuração de acesso exclusivo do Archivius
// Adicione seu email aqui para ter acesso ao Archivius épico

export const ARCHIVIUS_CONFIG = {
  // Configurações do Archivius para produção
  betaPhase: false, // Agora está em produção
  requiresAuth: true,
  premiumFeature: true, // Agora é um recurso premium

  // Mensagem para usuários não premium
  upgradeMessage: {
    title: "🔒 Archivius Épico - Recurso Premium",
    subtitle: "Desbloqueie seu Companion IA",
    description:
      "O Archivius é seu Companion IA épico que transforma sua jornada geek em missões personalizadas e oferece análises inteligentes da sua biblioteca.",
    features: [
      "🧙‍♂️ Narrador sábio e carismático",
      "🎯 Missões personalizadas baseadas no seu perfil",
      "🔮 Análise mística completa da sua biblioteca",
      "⚔️ Linguagem adaptada ao seu tipo favorito",
      "🚀 Sugestões inteligentes de próximos jogos/filmes",
    ],
    callToAction:
      "Assine o GeekLog Premium por apenas R$ 19,99 e desbloqueie o Archivius!",
    footer: "Transforme sua experiência geek! ✨",
  },
};

// Função para verificar se um usuário tem acesso ao Archivius (apenas usuários premium)
export const hasArchiviusAccess = (isPremium?: boolean): boolean => {
  return isPremium === true;
};

// Função para verificar se o usuário pode usar o Archivius
export const canUseArchivius = (
  isPremium?: boolean,
  isLoggedIn?: boolean,
): boolean => {
  if (!isLoggedIn) return false;
  return hasArchiviusAccess(isPremium);
};
