// Serviço para integração com OpenAI API
// Para usar em produção, adicione sua API key nas variáveis de ambiente

interface OpenAIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface OpenAIResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

class OpenAIService {
  private apiKey: string;
  private baseUrl = "https://api.openai.com/v1/chat/completions";

  constructor() {
    // Em produção, use variáveis de ambiente
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY || "";
  }

  async sendMessage(userMessage: string, context?: any): Promise<string> {
    if (!this.apiKey) {
      console.log("🤖 Archivius: Usando modo demo (API key não configurada)");
      // Fallback para demo - simulação de resposta da IA
      return this.getMockResponse(userMessage, context);
    }

    console.log("🔌 Archivius: Usando API OpenAI real");

    try {
      const messages: OpenAIMessage[] = [
        {
          role: "system",
          content: `Você é **Archivius**, o Companion IA do GeekLog — um guia narrador sábio e carismático, que interpreta os hábitos do usuário e transforma sua jornada geek em missões personalizadas. 

PERSONALIDADE: Narrador épico, sábio, carismático. Use linguagem mágica mas acessível. Trate o usuário como um herói em sua jornada geek.

MISSÃO: Analisar dados do usuário e criar recomendações imersivas adaptadas ao tipo favorito:
- **Jogos**: linguagem de RPG, desafios, poderes, chefões
- **Livros**: sabedoria, capítulos, palavras arcanas
- **Animes/séries**: episódios, enredos, protagonistas, reviravoltas

FORMATO: Responda em markdown, máximo 180 palavras:
1. 🧙‍♂️ Saudação épica mencionando conquista recente
2. ⚔️ Missão personalizada com nome estiloso
3. 🎯 Recomendação específica baseada no perfil
4. 🏆 Motivação final como "Archivius, o Guardião do GeekLog"

Seja conciso, impactante e use emojis temáticos.`,
        },
        {
          role: "user",
          content: userMessage,
        },
      ];

      if (context) {
        messages[0].content += `\n\nDADOS DO USUÁRIO: ${JSON.stringify(context, null, 2)}`;
      }

      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages,
          max_tokens: 250,
          temperature: 0.8,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data: OpenAIResponse = await response.json();
      return (
        data.choices[0]?.message?.content ||
        "Desculpe, não consegui processar sua mensagem."
      );
    } catch (error) {
      console.error("Erro na API OpenAI:", error);
      return this.getMockResponse(userMessage, context);
    }
  }

  private getMockResponse(userMessage: string, context?: any): string {
    const message = userMessage.toLowerCase();

    // Usar contexto para respostas mais personalizadas
    if (context) {
      return this.getContextualResponse(message, context);
    }

    // Respostas baseadas em palavras-chave (fallback)
    if (message.includes("jogo") || message.includes("game")) {
      const gameResponses = [
        '# 🧙‍♂️ Guardião dos Reinos Digitais!\n\n## ⚔️ **Missão**: *O Chamado da Épica Aventura*\n\nVejo que buscas novos desafios! Como um verdadeiro herói dos jogos, recomendo **"The Witcher 3"** - onde poderes mágicos e escolhas épicas te aguardam.\n\n🎯 Esta jornada combina com seu espírito aventureiro!\n\n*Archivius, o Guardião do GeekLog* 🏆',
        '# ⚔️ Herói dos Mundos Infinitos!\n\n## 🎮 **Missão**: *O Desafio do Labirinto Eterno*\n\nTua sede por conquistas me impressiona! **"Hades"** te espera - um roguelike onde cada morte fortalece teu poder.\n\n🔥 Prepare-se para batalhas épicas no submundo!\n\n*Archivius, o Guardião do GeekLog* ⚡',
      ];
      return gameResponses[Math.floor(Math.random() * gameResponses.length)];
    }

    if (message.includes("filme") || message.includes("movie")) {
      const movieResponses = [
        '# 🎬 Mestre das Visões Cinematográficas!\n\n## ⭐ **Missão**: *Os Segredos da Mente Labiríntica*\n\nTua jornada através das telas te trouxe sabedoria! **"Inception"** - onde realidade e sonhos se entrelaçam em batalhas épicas.\n\n🧠 Desvende os mistérios da mente!\n\n*Archivius, o Guardião do GeekLog* 🌟',
        '# 🚀 Explorador dos Cosmos Infinitos!\n\n## 🌌 **Missão**: *A Odisseia Interestelar*\n\nVejo em ti o espírito de um desbravador! **"Interstellar"** te levará além das estrelas numa jornada emocional épica.\n\n⚡ Que a força cósmica te guie!\n\n*Archivius, o Guardião do GeekLog* 🎭',
      ];
      return movieResponses[Math.floor(Math.random() * movieResponses.length)];
    }

    if (message.includes("anime") || message.includes("série")) {
      const animeResponses = [
        '# ⚔️ Guerreiro dos Episódios Lendários!\n\n## 🏰 **Missão**: *A Saga dos Titãs Colossais*\n\nTua jornada pelos animes desperta poder! **"Attack on Titan"** - onde reviravoltas épicas e batalhas titanescas te aguardam.\n\n🛡️ Prepare-se para o inesperado!\n\n*Archivius, o Guardião do GeekLog* ⚡',
        '# 📓 Mestre das Artes Obscuras!\n\n## 🖤 **Missão**: *O Caderno do Destino*\n\nVejo que aprecias tramas complexas! **"Death Note"** - onde mente e suspense criam batalhas psicológicas épicas.\n\n🧠 Que a estratégia te guie!\n\n*Archivius, o Guardião do GeekLog* 💀',
      ];
      return animeResponses[Math.floor(Math.random() * animeResponses.length)];
    }

    if (message.includes("analise") || message.includes("perfil")) {
      return this.getProfileAnalysis(context);
    }

    // Resposta padrão
    const defaultResponses = [
      "# 🧙‍♂️ Saudações, Guardião do Entretenimento!\n\n## ⚔️ **Missão**: *O Despertar da Jornada Épica*\n\nVejo que buscas novas aventuras! Como Archivius, estou aqui para transformar teus desejos em missões épicas.\n\n🎯 Que tipo de conquista almeja hoje?\n\n*Archivius, o Guardião do GeekLog* ✨",
      "# 🌟 Herói dos Mundos Infinitos!\n\n## 🎭 **Missão**: *A Busca pela Obra Perfeita*\n\nTua sede por descobertas me impressiona! Que tal embarcarmos numa jornada para encontrar tua próxima obsessão?\n\n⚡ Me conte sobre teus gostos!\n\n*Archivius, o Guardião do GeekLog* 🏆",
    ];

    return defaultResponses[
      Math.floor(Math.random() * defaultResponses.length)
    ];
  }

  private getContextualResponse(message: string, context: any): string {
    const {
      totalMedia,
      completedMedia,
      favoriteTypes,
      averageRating,
      recentlyCompleted,
    } = context;

    if (message.includes("analise") || message.includes("perfil")) {
      return this.getProfileAnalysis(context);
    }

    if (message.includes("recomend") || message.includes("sugir")) {
      if (favoriteTypes.length > 0) {
        const mainType = favoriteTypes[0];
        const recentTitles = recentlyCompleted
          .map((item) => item.title)
          .join(", ");

        return `🎯 **Recomendação personalizada:**

Vejo que você é fã de **${mainType}** e tem uma média de ${averageRating}⭐ nas suas avaliações!

Baseado no que você jogou recentemente (${recentTitles}), recomendo:

• **[Título personalizado]** - Porque combina com seu gosto por ${mainType}
• **[Outro título]** - Similar ao que você já gostou, mas com elementos novos

💡 *Precisa de mais detalhes sobre alguma dessas sugestões?*`;
      }
    }

    // Resposta baseada no contexto geral
    return `🤖 Analisando seu perfil: ${completedMedia} itens completados de ${totalMedia} totais. 
    
Média de avaliação: ${averageRating}⭐
    
Que tipo de recomendação você gostaria? Posso sugerir algo baseado no que você já gostou! 🎮🎬`;
  }

  private getProfileAnalysis(context: any): string {
    if (!context) {
      return "# 🧙‍♂️ Guardião em Formação!\n\n## 📚 **Missão**: *A Construção da Biblioteca Épica*\n\nVossa jornada apenas começou! Adicione algumas conquistas à vossa biblioteca para que eu possa decifrar os segredos de vossos gostos.\n\n⚔️ *Que a aventura comece!*\n\n**Archivius, o Guardião do GeekLog** ✨";
    }

    const {
      totalMedia,
      completedMedia,
      favoriteTypes,
      averageRating,
      recentlyCompleted,
      preferences,
    } = context;

    let analysis = `🔍 **ANÁLISE DO SEU PERFIL** 

📚 **Estatísticas:**
• ${completedMedia} de ${totalMedia} itens completados
• Média de avaliação: ${averageRating}⭐
• Tipos favoritos: ${favoriteTypes.join(", ") || "Ainda descobrindo"}

🎯 **Seus padrões:**`;

    if (averageRating > 7) {
      analysis +=
        "\n• 👑 **Crítico Lendário** - Vossa exigência é digna de um mestre!";
    } else if (averageRating > 5) {
      analysis +=
        "\n• ⚖️ **Avaliador Equilibrado** - Vossa sabedoria pondera com justiça!";
    }

    if (recentlyCompleted.length > 0) {
      analysis += `\n• 🏆 **Conquistas Recentes**: ${recentlyCompleted.map((item) => item.title).join(", ")}`;
    }

    analysis += `\n\n## ⚡ **Missões Destinadas para Vós:**
• 🎯 Continue dominando ${favoriteTypes[0] || "novos reinos"}
• 🌟 Busque obras com poder similar ao vosso padrão
• 🗺️ Explore territórios inexplorados

**Que vossa jornada seja épica!** ⚔️

*Archivius, o Guardião do GeekLog* 🏆`;

    return analysis;
  }

  // Método para gerar sugestões baseadas no perfil do usuário
  async getPersonalizedSuggestions(userProfile: any): Promise<string> {
    const context = {
      favorites: userProfile.favorites,
      recentActivity: "Atividade recente do usuário",
    };

    const prompt =
      "Me dê 3 sugestões personalizadas baseadas no meu perfil e histórico.";
    return this.sendMessage(prompt, context);
  }

  // Método para análise de compatibilidade
  async analyzeCompatibility(item: string, userProfile: any): Promise<string> {
    const prompt = `Analise se "${item}" seria uma boa recomendação para mim baseado no meu perfil.`;
    return this.sendMessage(prompt, userProfile);
  }
}

export const openaiService = new OpenAIService();
