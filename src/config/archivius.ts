// Configuração de acesso exclusivo do Archivius
// Adicione seu email aqui para ter acesso ao Archivius épico

// Lista de emails com acesso liberado (criador e beta testers)
const ALLOWED_EMAILS = [
  "matheusn148@gmail.com", // Criador do GeekLogg - acesso vitalício
];

export const ARCHIVIUS_CONFIG = {
  // Configurações do Archivius para produção
  betaPhase: false, // Agora está em produção
  requiresAuth: true,
  premiumFeature: true, // Agora é um recurso premium
  allowedEmails: ALLOWED_EMAILS, // Emails com acesso liberado

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

// Função para verificar se um usuário tem acesso ao Archivius (premium ou email liberado)
export const hasArchiviusAccess = (isPremium?: boolean, userEmail?: string): boolean => {
  // Criador e emails liberados têm acesso vitalício
  if (userEmail && ALLOWED_EMAILS.includes(userEmail.toLowerCase())) {
    return true;
  }
  // Usuários premium também têm acesso
  return isPremium === true;
};

// Função para verificar se o usuário pode usar o Archivius
export const canUseArchivius = (
  isPremium?: boolean,
  isLoggedIn?: boolean,
  userEmail?: string,
): boolean => {
  if (!isLoggedIn) return false;
  return hasArchiviusAccess(isPremium, userEmail);
};
