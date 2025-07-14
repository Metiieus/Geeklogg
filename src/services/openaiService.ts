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
      // Fallback para demo - simulação de resposta da IA
      return this.getMockResponse(userMessage);
    }

    try {
      const messages: OpenAIMessage[] = [
        {
          role: "system",
          content: `Você é Archivius, um assistente pessoal especializado em entretenimento (games, filmes, séries, animes). 
          Sua função é dar sugestões personalizadas baseadas no histórico e preferências do usuário.
          Seja amigável, entusiasmado e forneça recomendações detalhadas.
          Mantenha suas respostas concisas mas informativas.`,
        },
        {
          role: "user",
          content: userMessage,
        },
      ];

      if (context) {
        messages[0].content += `\nContexto do usuário: ${JSON.stringify(context)}`;
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
          max_tokens: 300,
          temperature: 0.7,
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
      return this.getMockResponse(userMessage);
    }
  }

  private getMockResponse(userMessage: string): string {
    const message = userMessage.toLowerCase();

    // Respostas baseadas em palavras-chave
    if (message.includes("jogo") || message.includes("game")) {
      const gameResponses = [
        'Baseado no seu perfil, recomendo "The Witcher 3: Wild Hunt" - um RPG épico com uma história incrível! 🎮',
        'Que tal experimentar "Hades"? É um roguelike indie fantástico com combate dinâmico! ⚔️',
        'Sugiro "Cyberpunk 2077" se você gosta de RPGs futurísticos com mundo aberto! 🌆',
        'Para algo relaxante, "Stardew Valley" é perfeito - farming e relacionamentos! 🌱',
      ];
      return gameResponses[Math.floor(Math.random() * gameResponses.length)];
    }

    if (message.includes("filme") || message.includes("movie")) {
      const movieResponses = [
        'Recomendo "Inception" se você gosta de filmes que fazem pensar! 🎬',
        'Que tal "Interstellar"? Ficção científica emocionante com ótimos efeitos! 🚀',
        '"The Matrix" é um clássico que todo geek deveria assistir! 💊',
        'Para algo mais recente, "Dune" (2021) é visualmente deslumbrante! 🏜️',
      ];
      return movieResponses[Math.floor(Math.random() * movieResponses.length)];
    }

    if (message.includes("anime") || message.includes("série")) {
      const animeResponses = [
        'Sugiro "Attack on Titan" - uma obra-prima com plot twists incríveis! ⚔️',
        '"Death Note" é perfeito para quem gosta de suspense psicológico! 📓',
        'Que tal "Demon Slayer"? Animação linda e lutas épicas! 👹',
        '"Fullmetal Alchemist: Brotherhood" é considerado um dos melhores animes! ⚗️',
      ];
      return animeResponses[Math.floor(Math.random() * animeResponses.length)];
    }

    // Resposta padrão
    const defaultResponses = [
      "Como seu assistente Archivius, posso te ajudar com sugestões de games, filmes, animes e séries! O que você tem interesse? 🎯",
      "Estou aqui para dar as melhores recomendações baseadas no seu perfil! Me conte o que você está procurando! ✨",
      "Precisa de sugestões de entretenimento? Posso te ajudar a descobrir seu próximo game ou filme favorito! 🌟",
      "Vamos encontrar algo incrível para você! Me fale sobre seus gostos e preferências! 🎮🎬",
    ];

    return defaultResponses[
      Math.floor(Math.random() * defaultResponses.length)
    ];
  }

  // Método para gerar sugestões baseadas no perfil do usuário
  async getPersonalizedSuggestions(userProfile: any): Promise<string> {
    const context = {
      favorites: userProfile.favorites,
      recentActivity: "Jogou RPGs recentemente",
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
