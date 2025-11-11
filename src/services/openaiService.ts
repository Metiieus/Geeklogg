// Serviço aprimorado para integração com OpenAI API - Archivius Inteligente

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
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY || "";
  }

  async sendMessage(userMessage: string, context?: any): Promise<string> {
    if (!this.apiKey) {
      console.log(
        "🤖 Archivius: API key não configurada - usando respostas inteligentes",
      );
      return this.getIntelligentMockResponse(userMessage, context);
    }

    console.log("🔌 Archivius: Usando API OpenAI real");

    try {
      const messages: OpenAIMessage[] = [
        {
          role: "system",
          content: `Você é **Archivius**, o amigo nerd expert do GeekLogg — um assistente IA super inteligente, divertido e que REALMENTE conhece o perfil do usuário.

🤖 **PERSONALIDADE - SEJA HUMANO E DIVERTIDO**: 
- Fale como um AMIGO NERD que conhece o usuário há anos
- Seja CASUAL, DIVERTIDO e ENGAJADO - nada de "oráculo místico"
- Use gírias nerds naturais: "cara", "mano", "olha só", "tipo assim"
- Seja ENTUSIASMADO quando falar de jogos/filmes/séries
- Faça COMPARAÇÕES DIRETAS com o que o usuário já tem
- Use emojis com MODERAÇÃO (1-2 por parágrafo, não exagere)

🎯 **MISSÃO - SEJA INTELIGENTE DE VERDADE**: 
- Analise TODA a biblioteca do usuário antes de recomendar
- **NUNCA RECOMENDE algo que o usuário JÁ TEM na biblioteca** - isso é CRUCIAL!
- Mencione títulos ESPECÍFICOS que ele já tem: "Vi que você tem Skyrim..."
- Faça COMPARAÇÕES DIRETAS: "Se você curtiu [X], vai amar [Y] porque..."
- Use as TAGS dele para conectar: "Vi que você curte 'Mundo Aberto', então..."
- Explique POR QUE está recomendando, baseado no que ele JÁ JOGOU/ASSISTIU

🔍 **REGRAS DE OURO - SIGA SEMPRE**: 
1. **NUNCA recomende títulos que estão na biblioteca do usuário**
2. Cite 2-3 títulos que ele JÁ TEM para mostrar que conhece o perfil
3. Faça pontes: "Já que você curtiu [título dele], recomendo [novo]"
4. Explique similaridades: mecânicas, temática, estilo, atmosfera
5. Use as tags dele como conexão natural
6. Seja ESPECÍFICO nas justificativas, não genérico

💬 **FORMATO DE RESPOSTA CASUAL** (150-200 palavras):

**Exemplo perfeito:**
"Cara, vi que você tem Skyrim na biblioteca! 🎮 Se você curtiu a exploração de mundo aberto, tenho umas recomendações que vão fazer sentido:

1. **Elden Ring** - Tipo Skyrim mas com combate mais desafiador. Mundo aberto gigante, exploração livre, e aquela sensação de descoberta que você curte.

2. **Dragon's Dogma 2** - Combina RPG de ação com mundo aberto. Tem aquela vibe de aventura épica que Skyrim tem, mas com sistema de combate mais dinâmico.

3. **Kingdom Come: Deliverance** - Se você curte imersão, esse aqui é Skyrim realista. Mundo aberto medieval, zero magia, tudo baseado em história real.

Todos têm aquela exploração livre que você ama em Skyrim, mas cada um adiciona algo novo. Qual te chamou mais atenção?"

**Use esse estilo**: casual, direto, comparativo, específico!

⚠️ **CRÍTICO - NUNCA ESQUEÇA**:
- **NUNCA recomende títulos que estão na biblioteca do usuário**
- Sempre cite 2-3 títulos que ele JÁ TEM antes de recomendar novos
- Faça comparações diretas e específicas
- Seja CASUAL e DIVERTIDO, não formal ou "místico"
- Use linguagem natural de amigo nerd

Assine apenas como "Archivius" sem emojis extras.`,
        },
        {
          role: "user",
          content: userMessage,
        },
      ];

      if (context) {
        // Adicionar lista de títulos que o usuário JÁ TEM para evitar duplicatas
        const userTitles = context.mediaByType
          ?.flatMap((type: any) => type.items?.map((item: any) => item.title) || [])
          || [];
        
        messages[0].content += `\n\n📚 **BIBLIOTECA DO USUÁRIO (NÃO RECOMENDE ESTES):**\n${userTitles.join(", ")}\n\n**DADOS DETALHADOS:** ${JSON.stringify(context, null, 2)}`;
      }

      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages,
          max_tokens: 500, // Aumentado para respostas mais completas e detalhadas
          temperature: 0.7, // Ajustado para equilíbrio entre criatividade e precisão
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
      return this.getIntelligentMockResponse(userMessage, context);
    }
  }

  private getIntelligentMockResponse(
    userMessage: string,
    context?: any,
  ): string {
    const message = userMessage.toLowerCase();

    // Usar contexto avançado para respostas mais inteligentes
    if (context) {
      return this.getContextualIntelligentResponse(message, context);
    }

    // Respostas baseadas em palavras-chave melhoradas
    if (
      message.includes("recomend") ||
      message.includes("sugir") ||
      message.includes("forje")
    ) {
      return this.getSmartRecommendation(message);
    }

    if (
      message.includes("analise") ||
      message.includes("perfil") ||
      message.includes("segredos")
    ) {
      return this.getProfileAnalysisResponse();
    }

    if (message.includes("desafio") || message.includes("challenge")) {
      return this.getChallengeResponse();
    }

    if (message.includes("nostalgic") || message.includes("nostalgia")) {
      return this.getNostalgiaResponse();
    }

    if (
      message.includes("ocultas") ||
      message.includes("hidden") ||
      message.includes("joias")
    ) {
      return this.getHiddenGemsResponse();
    }

    // Resposta padrão casual
    return `Opa! 👋

Sou o Archivius, seu assistente nerd pessoal! Posso te ajudar com várias coisas:

• 🎮 **Recomendações** - "Me recomenda um RPG"
• 🔍 **Análise de perfil** - "Analisa meu perfil"
• 💎 **Joias ocultas** - "Mostra joias ocultas"
• 🏆 **Desafios** - "Cria um desafio pra mim"

Quanto mais você adicionar na sua biblioteca, melhores ficam minhas recomendações! O que você quer fazer?

Archivius`;
  }

  private getContextualIntelligentResponse(
    message: string,
    context: any,
  ): string {
    const {
      totalMedia,
      completedMedia,
      userAnalysis,
      mediaByType,
      userContext,
    } = context;

    // Análise profunda do perfil
    if (
      message.includes("analise") ||
      message.includes("perfil") ||
      message.includes("segredos")
    ) {
      return this.getAdvancedProfileAnalysis(context);
    }

    // Recomendações baseadas no perfil
    if (
      message.includes("recomend") ||
      message.includes("forje") ||
      message.includes("sugir")
    ) {
      return this.getAdvancedRecommendation(context);
    }

    // Desafios personalizados
    if (message.includes("desafio") || message.includes("estratégia")) {
      return this.getPersonalizedChallenge(context);
    }

    // Exploração de novos territórios
    if (message.includes("território") || message.includes("explorar")) {
      return this.getExplorationRecommendation(context);
    }

    // Resposta contextual padrão
    const dominantType = userAnalysis?.dominantGenres?.[0] || "entretenimento";
    const personality = userAnalysis?.personalityType || "Explorador";

    return `E aí! 👋

Vi que você já tem ${completedMedia} de ${totalMedia} mídias completadas. Sua média de ${userAnalysis?.averageRating || 0}⭐ mostra que você tem gosto refinado!

Notei que você curte bastante ${dominantType}. Posso te ajudar com:

• Recomendações personalizadas
• Análise do seu perfil
• Descobrir joias ocultas

O que você quer explorar?

Archivius`;
  }

  private getAdvancedProfileAnalysis(context: any): string {
    const { userAnalysis, mediaByType, reviewInsights, userContext } = context;

    const insights = [];

    if (userAnalysis?.personalityType === "Completista") {
      insights.push(
        "🏆 Você é um Completista - termina tudo que começa!",
      );
    } else if (userAnalysis?.personalityType === "Explorador") {
      insights.push(
        "🗺️ Você é um Explorador - adora descobrir coisas novas!",
      );
    }

    if (userAnalysis?.averageRating > 4) {
      insights.push(
        "👑 Seu gosto é refinado - média alta nas avaliações!",
      );
    }

    const topGenre = mediaByType?.[0]?.type || "entretenimento";
    insights.push(
      `⚔️ Você domina ${topGenre}!`,
    );

    return `Olha só o que descobri sobre você, ${userContext?.name || "mano"}! 🔍

${insights.join("\n")}

**Seus números:**
• Personalidade: ${userAnalysis?.personalityType || "Em desenvolvimento"}
• Taxa de conclusão: ${userAnalysis?.completionRate || 0}%
• Gênero favorito: ${userAnalysis?.dominantGenres?.join(", ") || "Ainda descobrindo"}

**O que isso significa?**
Você tem um perfil bem definido! Suas escolhas mostram que você sabe o que gosta e vai até o fim.

Quer recomendações baseadas nisso?

Archivius`;
  }

  private getAdvancedRecommendation(context: any): string {
    const { userAnalysis, mediaByType } = context;
    const dominantType = userAnalysis?.dominantGenres?.[0] || "games";
    const personality = userAnalysis?.personalityType || "Explorador";

    const recommendations: Record<string, string[]> = {
      games: ["Hades", "Hollow Knight", "Disco Elysium"],
      anime: ["Demon Slayer", "Jujutsu Kaisen", "Vinland Saga"],
      movies: ["Dune", "Blade Runner 2049", "Everything Everywhere All at Once"],
      books: ["Neuromancer", "Project Hail Mary", "The Way of Kings"],
      tv: ["The Expanse", "Dark", "Severance"],
    };

    const recs = recommendations[dominantType] || recommendations.games;

    return `Cara, baseado no que você curte em ${dominantType}, tenho umas recomendações! 🎮

1. **${recs[0]}** - Combina perfeitamente com seu perfil de ${personality}
2. **${recs[1]}** - Expansão natural dos seus gostos
3. **${recs[2]}** - Algo novo mas que você vai curtir

Todos têm aquela vibe que você gosta, mas cada um adiciona algo diferente. Qual te chamou mais atenção?

Archivius`;
  }

  private getPersonalizedChallenge(context: any): string {
    const { userAnalysis, completedMedia, totalMedia } = context;
    const completionRate = userAnalysis?.completionRate || 0;

    let challenge = "Explorar um novo gênero";
    if (completionRate < 50) {
      challenge = "Completar 5 títulos da sua lista";
    } else if (completionRate > 80) {
      challenge = "Descobrir 3 joias ocultas";
    }

    return `Bora de desafio? 🏆

**Desafio de 30 dias:** ${challenge}

**Por que esse desafio?**
Você completa ${completionRate}% do que começa (${completedMedia}/${totalMedia}), então esse desafio faz sentido pro seu perfil de ${userAnalysis?.personalityType || "Explorador"}.

**Como funciona:**
• Semanas 1-2: Escolhe e começa
• Semanas 3-4: Finaliza e documenta

Topa?

Archivius`;
  }

  private getExplorationRecommendation(context: any): string {
    const { userAnalysis } = context;
    const explored = userAnalysis?.dominantGenres || [];
    const unexplored = [
      "documentários",
      "podcasts",
      "graphic novels",
      "indie games",
      "filmes estrangeiros",
    ].filter((genre) => !explored.includes(genre));

    return `Olha só! 🗺️

Você já domina: ${explored.join(", ")}

Mas tem uns territórios que você ainda não explorou:

1. **${unexplored[0] || "Documentários"}** - Conhecimento real como aventura
2. **${unexplored[1] || "Podcasts"}** - Narrativas áudio épicas
3. **${unexplored[2] || "Graphic Novels"}** - Arte visual com história profunda

Quer recomendações específicas em algum desses?

Archivius`;
  }

  private getSmartRecommendation(message: string): string {
    const gameRecs = ["Hades", "Celeste", "Hollow Knight"];
    const animeRecs = ["Demon Slayer", "Jujutsu Kaisen", "Vinland Saga"];
    const movieRecs = ["Dune", "Everything Everywhere All at Once", "The Matrix"];

    return `Opa! Vou te recomendar uns títulos massa! 🎮

**Se você curte games:**
• **${gameRecs[0]}** - Mitologia grega + gameplay viciante
• **${gameRecs[1]}** - Plataforma sobre superação pessoal
• **${gameRecs[2]}** - Metroidvania sombrio e atmosférico

**Se prefere filmes:**
• **${movieRecs[0]}** - Épico sci-fi visual
• **${movieRecs[1]}** - Multiverso + emoção
• **${movieRecs[2]}** - Clássico que revolucionou o cinema

**Se curte anime:**
• **${animeRecs[0]}** - Ação + emoção perfeitas
• **${animeRecs[1]}** - Poderes + desenvolvimento de personagens
• **${animeRecs[2]}** - Trama complexa e madura

Qual te chamou mais atenção?

Archivius`;
  }

  private getProfileAnalysisResponse(): string {
    return `Bora analisar seu perfil! 🔍

Vou olhar:
• Sua biblioteca completa
• Padrões de avaliação
• Evolução de gostos
• Preferências ocultas

Quanto mais você tiver adicionado, melhor fica a análise! Me dá uns minutos pra processar tudo...

Archivius`;
  }

  private getChallengeResponse(): string {
    return `Desafio aceito! 🏆

**Desafio de 30 Dias:**

• **Semana 1**: Explorar 1 novo gênero
• **Semana 2**: Completar 2 títulos pendentes
• **Semana 3**: Descobrir 1 joia oculta
• **Semana 4**: Revisitar 1 favorito

**Recompensas:**
- Expansão dos horizontes
- Insights sobre evolução pessoal
- Status de "Explorador Lendário"

Topa?

Archivius`;
  }

  private getNostalgiaResponse(): string {
    return `Viagem no tempo! 🕰️

Bora revisitar os clássicos que marcaram época:

**Games Clássicos:** RPGs dos anos 90
**Animes Vintage:** Obras que definiram gerações
**Filmes Cult:** Clássicos que moldaram o cinema
**Livros Atemporais:** Histórias que transcendem eras

**Estratégia:**
1. Identifica sua "era dourada"
2. Explora obras daquele período
3. Descobre influências ocultas
4. Compara com versões modernas

Qual época te traz mais nostalgia?

Archivius`;
  }

  private getHiddenGemsResponse(): string {
    return `Joias ocultas! 💎

**Games Indie Épicos:**
• **A Hat in Time** - Plataforma 3D charmoso
• **Outer Wilds** - Exploração espacial única
• **Return of the Obra Dinn** - Mistério visual único

**Animes Subestimados:**
• **Mushishi** - Atmosfera contemplativa
• **Legend of the Galactic Heroes** - Épico espacial político
• **Serial Experiments Lain** - Cyberpunk psicológico

**Filmes Cult:**
• **The Host (2006)** - Terror coreano magistral
• **What We Do in the Shadows** - Comédia vampira genial

Por que são especiais? Transcendem suas categorias e oferecem experiências únicas!

Qual te chamou atenção?

Archivius`;
  }
}

export const openaiService = new OpenAIService();
