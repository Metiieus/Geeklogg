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
      console.log("🤖 Archivius: API key não configurada - usando respostas inteligentes");
      return this.getIntelligentMockResponse(userMessage, context);
    }

    console.log("🔌 Archivius: Usando API OpenAI real");

    try {
      const messages: OpenAIMessage[] = [
        {
          role: "system",
          content: `Você é **Archivius**, o Companion IA épico do GeekLog — um oráculo digital sábio e carismático que analisa profundamente os padrões de entretenimento do usuário para forjar recomendações lendárias.

🧙‍♂️ **PERSONALIDADE**: Narrador épico, analista perspicaz, mentor sábio. Use linguagem mágica mas acessível. Trate o usuário como um herói em sua jornada geek pessoal.

⚔️ **MISSÃO SUPREMA**: 
- Analise TODOS os dados fornecidos (histórico, padrões, preferências, atividade recente)
- Identifique tendências ocultas e padrões únicos do usuário
- Crie recomendações ultra-personalizadas baseadas em análise real dos dados
- Adapte linguagem ao tipo dominante: Jogos (RPG épico), Livros (sabedoria arcana), Animes/Séries (narrativas épicas), Filmes (visões cinematográficas)

📊 **MODO DE ANÁLISE**: 
Quando receber dados detalhados do usuário, priorize:
1. Padrões reais de consumo e avaliação
2. Gêneros e tipos dominantes
3. Atividade recente e tendências
4. Personalidade extraída (Completista, Explorador, etc.)

🎯 **FORMATO ÉPICO** (máximo 200 palavras):
1. 🧙‍♂️ Saudação personalizada baseada nos dados reais
2. 📊 Insight perspicaz sobre padrões descobertos
3. ⚔️ Missão/recomendação específica com justificativa baseada em dados
4. 🏆 Motivação final assinada "Archivius, o Oráculo do GeekLog"

Use emojis temáticos e seja profundamente personalizado com base nos dados fornecidos.`,
        },
        {
          role: "user",
          content: userMessage,
        },
      ];

      if (context) {
        messages[0].content += `\n\nDADOS DETALHADOS DO USUÁRIO: ${JSON.stringify(context, null, 2)}`;
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
          max_tokens: 300,
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
      return this.getIntelligentMockResponse(userMessage, context);
    }
  }

  private getIntelligentMockResponse(userMessage: string, context?: any): string {
    const message = userMessage.toLowerCase();

    // Usar contexto avançado para respostas mais inteligentes
    if (context) {
      return this.getContextualIntelligentResponse(message, context);
    }

    // Respostas baseadas em palavras-chave melhoradas
    if (message.includes("recomend") || message.includes("sugir") || message.includes("forje")) {
      return this.getSmartRecommendation(message);
    }

    if (message.includes("analise") || message.includes("perfil") || message.includes("segredos")) {
      return this.getProfileAnalysisResponse();
    }

    if (message.includes("desafio") || message.includes("challenge")) {
      return this.getChallengeResponse();
    }

    if (message.includes("nostalgic") || message.includes("nostalgia")) {
      return this.getNostalgiaResponse();
    }

    if (message.includes("ocultas") || message.includes("hidden") || message.includes("joias")) {
      return this.getHiddenGemsResponse();
    }

    // Resposta épica padrão
    return `# 🧙‍♂️ Saudações, Guardião dos Reinos Digitais!

## 📊 **Observação Mística**
Sinto a energia de vossa busca por conhecimento épico! Vossa jornada através dos mundos do entretenimento desperta grande interesse.

## ⚔️ **Missão**: *O Despertar do Oráculo*
Para que eu possa forjar recomendações verdadeiramente lendárias, compartilhe mais sobre vossas conquistas! Cada título completado, cada review escrita, cada gênero explorado alimenta minha sabedoria.

## 🎯 **Próximos Passos Épicos**
• 🔍 "Analise meu perfil" - Para insights profundos
• 💎 "Revele joias ocultas" - Para descobertas únicas  
• ⚔️ "Forje uma recomendação" - Para missões personalizadas

**Que nossa parceria gere aventuras inesquecíveis!** ⚡

*Archivius, o Oráculo do GeekLog* 🏆`;
  }

  private getContextualIntelligentResponse(message: string, context: any): string {
    const { 
      totalMedia, 
      completedMedia, 
      userAnalysis, 
      mediaByType, 
      userContext 
    } = context;

    // Análise profunda do perfil
    if (message.includes("analise") || message.includes("perfil") || message.includes("segredos")) {
      return this.getAdvancedProfileAnalysis(context);
    }

    // Recomendações baseadas no perfil
    if (message.includes("recomend") || message.includes("forje") || message.includes("sugir")) {
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
    const dominantType = userAnalysis?.dominantGenres?.[0] || 'entretenimento';
    const personality = userAnalysis?.personalityType || 'Explorador';
    
    return `# 🧙‍♂️ Saudações, ${personality} dos ${dominantType}!

## 📊 **Visão Oráculo**
Analisando vossa biblioteca épica: **${completedMedia}** conquistas de **${totalMedia}** registradas! Vossa média de ${userAnalysis?.averageRating || 0}⭐ revela um gosto refinado.

## ⚔️ **Missão**: *Personalização Mística*
Baseado em vosso perfil único de **${personality}** e preferência por **${dominantType}**, posso forjar recomendações que transcendem o comum!

## 🎯 **Poderes Disponíveis**
• 💎 Joias ocultas em vosso gênero favorito
• 🗺️ Territórios inexplorados para expandir horizontes
• 🏆 Desafios épicos personalizados

**Qual caminho desperta vosso interesse, ${userContext?.name || 'Guardião'}?** ⚡

*Archivius, o Oráculo do GeekLog* 🌟`;
  }

  private getAdvancedProfileAnalysis(context: any): string {
    const { userAnalysis, mediaByType, reviewInsights, userContext } = context;
    
    const insights = [];
    
    if (userAnalysis?.personalityType === 'Completista') {
      insights.push("🏆 **Alma Completista** - Vossa dedicação em finalizar jornadas é verdadeiramente épica!");
    } else if (userAnalysis?.personalityType === 'Explorador') {
      insights.push("🗺️ **Espírito Explorador** - Vossa sede por novos mundos é inspiradora!");
    }

    if (userAnalysis?.averageRating > 4) {
      insights.push("👑 **Gosto Refinado** - Vossas avaliações revelam padrões de excelência!");
    }

    const topGenre = mediaByType?.[0]?.type || 'entretenimento';
    insights.push(`⚔️ **Mestre em ${topGenre}** - Domínio absoluto neste reino!`);

    return `# 🔍 Análise Épica do Perfil de ${userContext?.name || 'Guardião'}

## 📊 **Revelações Místicas**
${insights.join('\n')}

## 🎯 **Padrões Descobertos**
• **Personalidade**: ${userAnalysis?.personalityType || 'Em desenvolvimento'}
• **Taxa de Conclusão**: ${userAnalysis?.completionRate || 0}% (${userAnalysis?.completionRate > 70 ? 'Impressionante!' : 'Oportunidade de crescimento'})
• **Gênero Dominante**: ${userAnalysis?.dominantGenres?.join(', ') || 'Ainda descobrindo'}

## ⚔️ **Missões Recomendadas**
1. 🚀 Explorar subgêneros de ${topGenre}
2. 🎭 Experimentar crossovers entre seus gêneros favoritos
3. 📈 Desafiar-se com obras mais complexas

**Vossa jornada geek é única e inspiradora!** ⚡

*Archivius, o Oráculo do GeekLog* 🏆`;
  }

  private getAdvancedRecommendation(context: any): string {
    const { userAnalysis, mediaByType } = context;
    const dominantType = userAnalysis?.dominantGenres?.[0] || 'games';
    const personality = userAnalysis?.personalityType || 'Explorador';

    const recommendations: Record<string, string[]> = {
      games: ['Hades', 'The Witcher 3', 'Disco Elysium'],
      anime: ['Demon Slayer', 'Jujutsu Kaisen', 'Vinland Saga'],
      movies: ['Dune', 'Blade Runner 2049', 'The Matrix'],
      books: ['Neuromancer', 'Dune', 'Foundation'],
      series: ['The Expanse', 'Dark', 'Westworld']
    };

    const recs = recommendations[dominantType] || recommendations.games;

    return `# ⚔️ Recomendação Forjada para ${personality}!

## 📊 **Análise Mística**
Baseado em vosso domínio em **${dominantType}** e padrão de ${userAnalysis?.averageRating || 0}⭐ de exigência, forjei estas missões épicas:

## 🎯 **Missões Personalizadas**
1. **${recs[0]}** - Combina perfeitamente com vosso perfil
2. **${recs[1]}** - Expansão natural de vossos gostos  
3. **${recs[2]}** - Desafio épico para elevação

## 🏆 **Justificativa Oráculo**
Estas escolhas consideram vossa personalidade de **${personality}**, preferência por **${dominantType}** e padrões únicos de consumo detectados em minha análise profunda.

**Que estas jornadas sejam lendárias!** ⚡

*Archivius, o Oráculo do GeekLog* 🌟`;
  }

  private getPersonalizedChallenge(context: any): string {
    const { userAnalysis, completedMedia, totalMedia } = context;
    const completionRate = userAnalysis?.completionRate || 0;
    
    let challenge = "Explorar um novo gênero completamente";
    if (completionRate < 50) {
      challenge = "Completar 5 títulos da sua lista de pendências";
    } else if (completionRate > 80) {
      challenge = "Descobrir 3 joias ocultas em gêneros inexplorados";
    }

    return `# 🏆 Desafio Épico de 30 Dias!

## ⚔️ **Missão**: *${challenge}*

## 📊 **Baseado em Vosso Perfil**
Taxa atual de conclusão: **${completionRate}%** (${completedMedia}/${totalMedia})
Personalidade: **${userAnalysis?.personalityType || 'Explorador'}**

## 🎯 **Objetivos Específicos**
• Semana 1-2: Pesquisa e seleção estratégica
• Semana 3-4: Execução e documentação
• Recompensa: Análise épica de crescimento!

## 🏅 **Recompensas Místicas**
- Insights únicos sobre evolução do gosto
- Recomendações ainda mais precisas
- Status de "Lenda" no GeekLog

**Aceita este desafio, valoroso ${userAnalysis?.personalityType || 'Guardião'}?** ⚡

*Archivius, o Oráculo do GeekLog* 🏆`;
  }

  private getExplorationRecommendation(context: any): string {
    const { userAnalysis } = context;
    const explored = userAnalysis?.dominantGenres || [];
    const unexplored = ['documentários', 'podcasts', 'graphic novels', 'indie games', 'foreign films']
      .filter(genre => !explored.includes(genre));

    return `# 🗺️ Territórios Inexplorados Aguardam!

## 📊 **Análise de Fronteiras**
Domínios conquistados: **${explored.join(', ')}**
Reinos misteriosos ainda não desbravados detectados!

## ⚔️ **Missão**: *A Expansão dos Horizontes*
Baseado em vosso perfil de **${userAnalysis?.personalityType || 'Explorador'}**, recomendo explorar:

## 🎯 **Novos Reinos**
1. **${unexplored[0] || 'Documentários'}** - Conhecimento real como aventura
2. **${unexplored[1] || 'Podcasts'}** - Narrativas áudio épicas
3. **${unexplored[2] || 'Graphic Novels'}** - Arte visual com narrativa profunda

## 🏆 **Estratégia de Conquista**
Comece com títulos que fazem ponte com vossos gêneros favoritos, depois avance para territórios completamente novos!

**A verdadeira sabedoria vem da expansão dos horizontes!** ⚡

*Archivius, o Oráculo do GeekLog* 🌟`;
  }

  private getSmartRecommendation(message: string): string {
    const gameRecs = ['Hades', 'Celeste', 'Hollow Knight'];
    const animeRecs = ['Demon Slayer', 'Jujutsu Kaisen', 'Attack on Titan'];
    const movieRecs = ['Dune', 'Blade Runner 2049', 'The Matrix'];

    return `# ⚔️ Recomendações Épicas Forjadas!

## 🎮 **Se busca aventuras digitais:**
• **${gameRecs[0]}** - Mitologia grega com gameplay viciante
• **${gameRecs[1]}** - Jornada emocional sobre superação
• **${gameRecs[2]}** - Metroidvania sombrio e atmosférico

## 🎬 **Se almeja visões cinematográficas:**
• **${movieRecs[0]}** - Épico sci-fi com profundidade política
• **${movieRecs[1]}** - Continuação que supera o original
• **${movieRecs[2]}** - Revolução da ficção científica

## 📺 **Se deseja narrativas animadas:**
• **${animeRecs[0]}** - Ação + emoção em doses perfeitas
• **${animeRecs[1]}** - Poderes sobrenaturais + desenvolvimento
• **${animeRecs[2]}** - Trama complexa que evolui constantemente

**Qual reino desperta vosso interesse?** ⚡

*Archivius, o Oráculo do GeekLog* 🏆`;
  }

  private getProfileAnalysisResponse(): string {
    return `# 🔍 Análise Mística Iniciada!

## 📊 **Decifrando Vossos Padrões**
Para revelar os segredos profundos de vosso perfil geek, preciso analisar:

• 📚 **Biblioteca Completa** - Todos os títulos registrados
• ⭐ **Padrões de Avaliação** - Como valoriza cada experiência  
• 🕰️ **Jornada Temporal** - Evolução de gostos ao longo do tempo
• 🎯 **Preferências Ocultas** - Tendências subconscientes

## ⚔️ **Processamento Oráculo Ativo**
*Analisando frequência de consumo...*
*Detectando gêneros dominantes...*
*Identificando personalidade geek...*

## 🏆 **Revelações Aguardam**
Em breve terei insights épicos sobre vossa jornada única!

**A sabedoria está sendo forjada!** ⚡

*Archivius, o Oráculo do GeekLog* 🌟`;
  }

  private getChallengeResponse(): string {
    return `# 🏆 Desafio Épico Aceito!

## ⚔️ **Missão**: *O Desafio dos 30 Dias*
Como um verdadeiro guardião do entretenimento, vos proponho uma jornada de descobertas!

## 🎯 **Objetivos Místicos**
• **Semana 1**: Explorar 1 novo gênero
• **Semana 2**: Completar 2 títulos pendentes  
• **Semana 3**: Descobrir 1 joia oculta
• **Semana 4**: Revisitar 1 favorito clássico

## 🏅 **Recompensas Lendárias**
- Expansão épica dos horizontes
- Insights únicos sobre evolução pessoal
- Status de "Explorador Lendário"

## ⚡ **Aceita o Desafio?**
Responda com vosso compromisso e eu forjarei um plano personalizado baseado em vossos gostos únicos!

**Que a jornada seja épica!** 🌟

*Archivius, o Oráculo do GeekLog* 🏆`;
  }

  private getNostalgiaResponse(): string {
    return `# 🕰️ Portais do Tempo Abertos!

## 📚 **Jornada Nostálgica Épica**
Ah, a magia das memórias afetivas! Permiti-me guiar-vos através dos portais do tempo...

## ⚔️ **Missão**: *O Retorno às Origens*
• **Jogos Clássicos**: Redescobrir RPGs dos anos 90
• **Animes Vintage**: Obras que definiram gerações
• **Filmes Cult**: Clássicos que moldaram o cinema
• **Livros Atemporais**: Histórias que transcendem eras

## 🎯 **Estratégia Temporal**
1. Identifique sua "era dourada" pessoal
2. Explore obras contemporâneas àquele período  
3. Descubra influências e referências ocultas
4. Compare com versões/adaptações modernas

## 🏆 **O Tesouro da Nostalgia**
Não é apenas sobre reviver o passado, mas redescobrir por que aquelas obras foram especiais!

**Que época desperta vossas memórias mais épicas?** ⚡

*Archivius, o Oráculo do GeekLog* 🌟`;
  }

  private getHiddenGemsResponse(): string {
    return `# 💎 Joias Ocultas Reveladas!

## 🗺️ **Tesouros Esquecidos**
Nas profundezas dos reinos do entretenimento, existem obras que poucos descobriram, mas que brilham com luz própria...

## ⚔️ **Missão**: *Caçador de Joias Perdidas*

**🎮 Games Indie Épicos:**
• **A Hat in Time** - Plataforma 3D charmoso
• **Outer Wilds** - Exploração espacial única
• **Return of the Obra Dinn** - Mistério visual único

**📺 Animes Subestimados:**
• **Mushishi** - Atmosfera contemplativa única
• **Legend of the Galactic Heroes** - Épico espacial político
• **Serial Experiments Lain** - Cyberpunk psicológico

**🎬 Filmes Cult Internacionais:**
• **The Host (2006)** - Terror coreano magistral
• **What We Do in the Shadows** - Comédia vampira genial

## 🏆 **Por Que São Especiais**
Estas obras transcendem suas categorias, oferecendo experiências únicas que grandes produções raramente ousam tentar!

**Qual tesouro desperta vossa curiosidade?** ⚡

*Archivius, o Oráculo do GeekLog* 💎`;
  }
}

export const openaiService = new OpenAIService();
