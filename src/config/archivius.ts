// Configuração de acesso exclusivo do Archivius
// Adicione seu email aqui para ter acesso ao Archivius épico

export const ARCHIVIUS_CONFIG = {
  // Emails com acesso exclusivo ao Archivius épico (fase beta)
  authorizedEmails: ["matheusn148@gmail.com"],

  // Configurações adicionais
  betaPhase: true,
  requiresAuth: true,

  // Mensagem para usuários não autorizados
  upgradeMessage: {
    title: "🔒 Archivius Épico - Acesso Exclusivo",
    subtitle: "Em Fase de Testes Limitados",
    description:
      "O novo Archivius 2.0 está em fase beta exclusiva! Este Companion IA épico transforma sua jornada geek em missões personalizadas.",
    features: [
      "🧙‍♂️ Narrador sábio e carismático",
      "🎯 Missões personalizadas baseadas no seu perfil",
      "🔮 Análise mística completa da sua biblioteca",
      "⚔️ Linguagem adaptada ao seu tipo favorito",
    ],
    callToAction:
      "Entre em contato para participar do programa beta ou aguarde o lançamento oficial!",
    footer: "Em breve para todos os heróis! ✨",
  },
};

// Função para verificar se um email tem acesso
export const hasArchiviusAccess = (email?: string): boolean => {
  if (!email) return false;
  return ARCHIVIUS_CONFIG.authorizedEmails.includes(email.toLowerCase());
};

// Função para adicionar um email à lista de autorizados (use com cuidado)
export const addAuthorizedEmail = (email: string): void => {
  const normalizedEmail = email.toLowerCase();
  if (!ARCHIVIUS_CONFIG.authorizedEmails.includes(normalizedEmail)) {
    ARCHIVIUS_CONFIG.authorizedEmails.push(normalizedEmail);
    // Log seguro: não expor emails em produção
    console.log("✅ Novo email autorizado adicionado à lista de acesso");
  }
};
