import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Send,
  Sparkles,
  Brain,
  ChevronRight,
  Shuffle,
  Crown,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useAppContext } from "../context/AppContext";
import { useToast } from "../context/ToastContext";
import { ConditionalPremiumBadge } from "./PremiumBadge";
import { UpgradeToPremiumModal } from "./modals/UpgradeToPremiumModal";
import { openaiService } from "../services/openaiService";
import { archiviusService } from "../services/archiviusService";
import {
  canUseArchivius,
  ARCHIVIUS_CONFIG,
} from "../config/archivius";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface SmartSuggestion {
  id: string;
  text: string;
  emoji: string;
  category: "recommendation" | "analysis" | "discovery" | "motivation";
  prompt: string;
  requiresContext: boolean;
}

export const ArchiviusAgent: React.FC = () => {
  const { profile } = useAuth();
  const { mediaItems, reviews, settings, milestones } = useAppContext();
  const { showSuccess, showError } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [currentSuggestions, setCurrentSuggestions] = useState<
    SmartSuggestion[]
  >([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Archivius disponível apenas para usuários premium
  const isPremium = settings.subscriptionTier === 'premium';
  const userEmail = profile?.email || "";
  const canAccess = isPremium;
  const hasRealAPI = !!import.meta.env.VITE_OPENAI_API_KEY;

  // Gerar contexto enriquecido para IA
  const generateEnhancedUserContext = () => {
    return archiviusService.generateEnhancedContext(
      mediaItems,
      reviews,
      settings,
      milestones || [],
    );
  };

  // Carregar sugestões inteligentes
  useEffect(() => {
    if (canAccess && mediaItems.length > 0) {
      const userAnalysis = archiviusService.analyzeUserProfile(
        mediaItems,
        reviews,
        settings,
      );
      const suggestions = archiviusService.getSmartSuggestions(userAnalysis);
      setCurrentSuggestions(suggestions);
    }
  }, [canAccess, mediaItems, reviews, settings]);

  // Filtrar sugestões por categoria
  const getFilteredSuggestions = () => {
    if (selectedCategory === "all") return currentSuggestions;
    return currentSuggestions.filter((s) => s.category === selectedCategory);
  };

  // Embaralhar sugestões
  const shuffleSuggestions = () => {
    if (!canAccess) return;
    const userAnalysis = archiviusService.analyzeUserProfile(
      mediaItems,
      reviews,
      settings,
    );
    const newSuggestions = archiviusService.getSmartSuggestions(userAnalysis);
    setCurrentSuggestions([...newSuggestions].sort(() => Math.random() - 0.5));
  };

  // Inicializar com mensagem de boas-vindas inteligente
  useEffect(() => {
    if (isOpen && !hasInitialized && canAccess) {
      const userContext = generateEnhancedUserContext();
      const userAnalysis = userContext.userAnalysis;

      const welcomeMessage: Message = {
        id: "welcome",
        text: `E aí, ${settings.name || "mano"}! 👋

Sou o **Archivius**, seu assistente nerd pessoal! Analisei sua biblioteca e já tenho umas insights massa pra você.

## 📊 Seu Perfil
• **${userContext.totalMedia} mídias** na biblioteca
• **${userAnalysis.completionRate}%** de conclusão ${userAnalysis.completionRate > 70 ? "🔥" : "🚀"}
• Média de **${userAnalysis.averageRating}⭐** nas avaliações
• Você é um **${userAnalysis.personalityType}**

## 🎮 O Que Você Curte
${userAnalysis.dominantGenres.length > 0 ? userAnalysis.dominantGenres.join(", ") : "Ainda descobrindo seus gostos!"}

## 💡 O Que Posso Fazer
Quanto mais você usar sua biblioteca, melhores ficam minhas recomendações! Posso:

• Recomendar títulos baseados no que você já tem
• Analisar seus padrões de consumo
• Descobrir joias ocultas pro seu perfil
• Criar desafios personalizados

${hasRealAPI ? "🤖 *IA real ativada - recomendações ultra-precisas!*" : "💡 *Modo inteligente ativo!*"}

**Clica nas sugestões abaixo ou me pergunta qualquer coisa!** 🚀`,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages([welcomeMessage]);
      setHasInitialized(true);
    }
  }, [isOpen, hasInitialized, canAccess, settings.name, mediaItems.length]);

  // Reset quando fechar
  useEffect(() => {
    if (!isOpen) {
      setHasInitialized(false);
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (customPrompt?: string) => {
    const messageToSend = customPrompt || inputValue;
    if (!messageToSend.trim()) return;

    if (!canAccess) {
      const config = ARCHIVIUS_CONFIG.upgradeMessage;
      const upgradeMessage = `# 🔒 **${config.title}**

## ⚔️ **${config.subtitle}**

${config.description}

### 🏆 **Funcionalidades Épicas:**
${config.features.map((feature) => `• ${feature}`).join("\n")}

### 💎 **Como Obter Acesso:**
${config.callToAction}

**${config.footer}**

*Archivius, o Guardião do GeekLog* 🏆`;

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text: upgradeMessage,
          isUser: false,
          timestamp: new Date(),
        },
      ]);
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageToSend,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!customPrompt) setInputValue("");
    setIsLoading(true);

    try {
      // Gerar contexto completo e enriquecido
      const enhancedContext = generateEnhancedUserContext();

      // Usar OpenAI service aprimorado para gerar resposta
      const aiResponseText = await openaiService.sendMessage(
        messageToSend,
        enhancedContext,
      );

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponseText,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);

      showSuccess(
        "Archivius respondeu!",
        "Análise épica baseada em seu perfil único",
      );
    } catch (error) {
      console.error("Erro ao obter resposta da IA:", error);
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "🤖 Desculpe, ocorreu um erro em meus circuitos místicos. Tentai novamente em alguns instantes, valoroso guardião!",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorResponse]);
      showError("Erro no Archivius", "Não foi possível obter resposta épica");
    }

    setIsLoading(false);
  };

  const handleAnalyzeProfile = async () => {
    if (!canAccess) return;

    setIsAnalyzing(true);

    try {
      const enhancedContext = generateEnhancedUserContext();
      const analysisPrompt =
        "Desvende os segredos ocultos do meu perfil geek. Faça uma análise profunda e revele padrões, tendências e insights únicos sobre meus hábitos de entretenimento que eu talvez não tenha percebido. Inclua recomendações estratégicas baseadas nesta análise.";

      const analysis = await openaiService.sendMessage(
        analysisPrompt,
        enhancedContext,
      );

      const analysisMessage: Message = {
        id: Date.now().toString(),
        text: analysis,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, analysisMessage]);
      showSuccess(
        "Análise épica completa!",
        "Archivius revelou os segredos de vosso perfil",
      );
    } catch (error) {
      console.error("Erro na análise:", error);
      showError(
        "Erro na análise mística",
        "Não foi possível analisar vosso perfil",
      );
    }

    setIsAnalyzing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const categoryIcons: Record<string, string> = {
    recommendation: "��️",
    analysis: "🔍",
    discovery: "🗺️",
    motivation: "🏆",
  };

  const categoryNames: Record<string, string> = {
    recommendation: "Recomendações",
    analysis: "An��lises",
    discovery: "Descobertas",
    motivation: "Desafios",
  };

  return (
    <>
      {/* Botão Flutuante - responsivo com espaço para navegação mobile e Capacitor */}
      <motion.div
        className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200 }}
      >
        <motion.button
          onClick={() => setIsOpen(true)}
          className={`group relative flex items-center bg-gray-800/50 backdrop-blur-xl rounded-full shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${
            canAccess ? "border-cyan-500/30" : "border-gray-600/30"
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Avatar do Archivius - responsivo */}
          <div
            className={`w-12 sm:w-14 h-12 sm:h-14 rounded-full overflow-hidden border-2 ${
              canAccess ? "border-cyan-400/50" : "border-gray-600/50"
            }`}
          >
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2Feb1c9410e9d14d94bbc865b98577c45c%2F8c1388df34ab45c29d2be300fe11111f?format=webp&width=800"
              alt="Archivius - Assistente IA"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Texto e Status - oculto em mobile pequeno */}
          <div className="hidden sm:block px-4 py-3 pr-6">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-white text-lg">Archivius</h3>
              <ConditionalPremiumBadge
                isPremium={canAccess}
                variant="icon-only"
                size="sm"
                animated={false}
                className="text-cyan-400"
              />
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${canAccess ? "bg-cyan-400" : "bg-orange-400"}`}
              />
              <span className="text-gray-100 text-sm">
                {canAccess ? "Oráculo Ativo" : "Premium"}
              </span>
              {canAccess && mediaItems.length > 0 && (
                <span className="text-cyan-400 text-xs">
                  • {currentSuggestions.length} sugestões
                </span>
              )}
            </div>
          </div>

          {/* Indicador de IA */}
          {canAccess && (
            <motion.div
              className="absolute -top-0.5 -right-0.5 w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-cyan-400 to-pink-500 rounded-full flex items-center justify-center"
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
            </motion.div>
          )}
        </motion.button>
      </motion.div>

      {/* Modal de Chat */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            {/* Overlay */}
            <motion.div
              className="absolute inset-0 bg-black bg-opacity-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Chat Window - responsivo e otimizado para Capacitor */}
            <motion.div
              className="relative bg-gray-800/95 backdrop-blur-xl border border-cyan-500/20 rounded-t-2xl sm:rounded-2xl shadow-2xl w-full max-w-full sm:max-w-md h-[85vh] sm:h-[600px] max-h-[700px] overflow-hidden"
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              {/* Header */}
              <div
                className={`p-3 sm:p-4 border-b border-cyan-500/20 ${
                  canAccess
                    ? "bg-gradient-to-r from-cyan-500 to-pink-500"
                    : "bg-gradient-to-r from-gray-600 to-gray-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-white/20">
                      <img
                        src="https://cdn.builder.io/api/v1/image/assets%2Feb1c9410e9d14d94bbc865b98577c45c%2F8c1388df34ab45c29d2be300fe11111f?format=webp&width=800"
                        alt="Archivius"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-white text-sm">
                          Archivius
                        </h3>
                        {canAccess && (
                          <Crown className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-300" />
                        )}
                        {hasRealAPI && (
                          <span className="text-xs bg-green-500/20 text-green-300 px-1 sm:px-2 py-0.5 rounded-full border border-green-500/30">
                            API Real
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${canAccess ? (hasRealAPI ? "bg-green-400" : "bg-cyan-300") : "bg-orange-300"}`}
                        />
                        <span className="text-white text-xs sm:text-sm opacity-90">
                          {canAccess
                            ? hasRealAPI
                              ? "Oráculo Supremo"
                              : "Modo Inteligente"
                            : "Premium Only"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-9 h-9 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all touch-target"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              {/* Messages - responsivo */}
              <div
                className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 bg-gray-900/50"
                style={{
                  height: canAccess
                    ? "calc(100% - 200px)"
                    : "calc(100% - 130px)",
                }}
              >
                {messages.length === 0 && (
                  <div className="text-center text-gray-200 mt-4">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 rounded-full overflow-hidden border-2 border-cyan-400/50">
                      <img
                        src="https://cdn.builder.io/api/v1/image/assets%2Feb1c9410e9d14d94bbc865b98577c45c%2F8c1388df34ab45c29d2be300fe11111f?format=webp&width=800"
                        alt="Archivius"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-sm sm:text-base font-medium text-white">
                      🧙‍♂️ Archivius, o Oráculo
                    </p>
                    <p className="text-xs sm:text-sm mt-2 mb-3 sm:mb-4 px-2">
                      {canAccess
                        ? "⚔️ Companion IA épico com análise avançada de padrões!"
                        : "👑 Desperte os poderes premium para análises supremas!"}
                    </p>

                    {!canAccess && (
                      <div className="space-y-3 px-4">
                        <button
                          onClick={() => setShowUpgradeModal(true)}
                          className="w-full px-4 py-3 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-600 hover:via-yellow-600 hover:to-amber-700 text-black font-bold rounded-lg flex items-center justify-center gap-2 transition-all transform hover:scale-105 shadow-lg shadow-amber-500/50"
                        >
                          <Crown className="w-5 h-5 fill-current" />
                          Desbloquear Archivius
                          <Sparkles className="w-4 h-4" />
                        </button>
                        <p className="text-xs text-center text-gray-400">
                          Tenha acesso ao assistente IA mais épico do universo geek!
                        </p>
                      </div>
                    )}

                    {canAccess && (
                      <div className="space-y-3">
                        {/* Botão de Análise Épica */}
                        <button
                          onClick={handleAnalyzeProfile}
                          disabled={isAnalyzing}
                          className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-all"
                        >
                          {isAnalyzing ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Revelando segredos...
                            </>
                          ) : (
                            <>
                              <Brain className="w-4 h-4" />
                              Revelar Segredos do Perfil
                            </>
                          )}
                        </button>

                        {/* Filtros de Categoria */}
                        {currentSuggestions.length > 0 && (
                          <div className="border-t border-gray-600/30 pt-3">
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-xs text-cyan-400">
                                Missões Épicas Personalizadas:
                              </p>
                              <button
                                onClick={shuffleSuggestions}
                                className="text-cyan-400 hover:text-cyan-300 transition-colors"
                                title="Embaralhar sugestões"
                              >
                                <Shuffle className="w-3 h-3" />
                              </button>
                            </div>

                            {/* Seletor de categoria */}
                            <div className="flex gap-1 mb-3 overflow-x-auto">
                              <button
                                onClick={() => setSelectedCategory("all")}
                                className={`px-2 py-1 text-xs rounded-full transition-colors flex-shrink-0 ${
                                  selectedCategory === "all"
                                    ? "bg-cyan-500/30 text-cyan-300 border border-cyan-500/50"
                                    : "bg-gray-700/50 text-gray-400 border border-gray-600/30"
                                }`}
                              >
                                ✨ Todas
                              </button>
                              {Object.entries(categoryNames).map(
                                ([key, name]) => (
                                  <button
                                    key={key}
                                    onClick={() => setSelectedCategory(key)}
                                    className={`px-2 py-1 text-xs rounded-full transition-colors flex-shrink-0 ${
                                      selectedCategory === key
                                        ? "bg-cyan-500/30 text-cyan-300 border border-cyan-500/50"
                                        : "bg-gray-700/50 text-gray-400 border border-gray-600/30"
                                    }`}
                                  >
                                    {categoryIcons[key]} {name}
                                  </button>
                                ),
                              )}
                            </div>

                            {/* Sugestões Inteligentes */}
                            <div className="space-y-2 max-h-40 overflow-y-auto">
                              {getFilteredSuggestions()
                                .slice(0, 6)
                                .map((suggestion) => (
                                  <button
                                    key={suggestion.id}
                                    onClick={() =>
                                      handleSendMessage(suggestion.prompt)
                                    }
                                    className="block w-full text-left px-3 py-2 bg-gray-800/50 border border-cyan-500/20 rounded-lg text-gray-100 text-sm hover:bg-gray-700/50 hover:border-cyan-400/30 transition-colors group"
                                  >
                                    <div className="flex items-start gap-2">
                                      <span className="text-cyan-400 flex-shrink-0 mt-0.5">
                                        {suggestion.emoji}
                                      </span>
                                      <span className="flex-1">
                                        {suggestion.text}
                                      </span>
                                      <ChevronRight className="w-3 h-3 text-cyan-400/50 group-hover:text-cyan-400 transition-colors flex-shrink-0 mt-0.5" />
                                    </div>
                                  </button>
                                ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-2 ${message.isUser ? "justify-end" : "justify-start"}`}
                  >
                    {/* Avatar do Archivius para mensagens da IA */}
                    {!message.isUser && (
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-cyan-500/30 flex-shrink-0 mt-1">
                        <img
                          src="https://cdn.builder.io/api/v1/image/assets%2Feb1c9410e9d14d94bbc865b98577c45c%2F8c1388df34ab45c29d2be300fe11111f?format=webp&width=800"
                          alt="Archivius"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <div
                      className={`max-w-xs px-4 py-2 rounded-2xl ${
                        message.isUser
                          ? "bg-gradient-to-r from-cyan-500 to-pink-500 text-white"
                          : "bg-gray-700/50 border border-gray-600/30 text-gray-100"
                      }`}
                    >
                      <div className="text-sm whitespace-pre-wrap">
                        {message.text}
                      </div>
                    </div>
                  </motion.div>
                ))}

                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-2 justify-start"
                  >
                    {/* Avatar do Archivius no loading */}
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-cyan-500/30 flex-shrink-0 mt-1">
                      <img
                        src="https://cdn.builder.io/api/v1/image/assets%2Feb1c9410e9d14d94bbc865b98577c45c%2F8c1388df34ab45c29d2be300fe11111f?format=webp&width=800"
                        alt="Archivius"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="bg-gray-700/50 border border-gray-600/30 px-4 py-2 rounded-2xl">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" />
                        <div
                          className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        />
                        <div
                          className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input - responsivo com safe area para mobile/Capacitor */}
              <div className="p-3 sm:p-4 pb-safe border-t border-cyan-500/20 bg-gray-800/50">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={
                      canAccess
                        ? "Digite sua pergunta épica..."
                        : "Premium necessário..."
                    }
                    disabled={!canAccess}
                    className="flex-1 px-3 sm:px-4 py-2 bg-gray-900/50 border border-gray-600/30 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent disabled:bg-gray-800 disabled:cursor-not-allowed text-sm sm:text-base"
                  />
                  <button
                    onClick={() => handleSendMessage()}
                    disabled={!canAccess || !inputValue.trim()}
                    className="w-8 sm:w-10 h-8 sm:h-10 bg-gradient-to-r from-cyan-500 to-pink-500 text-white rounded-full flex items-center justify-center hover:from-cyan-600 hover:to-pink-600 transition-colors disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 sm:w-5 h-4 sm:h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Modal de Upgrade */}
      {showUpgradeModal && (
        <UpgradeToPremiumModal
          onClose={() => setShowUpgradeModal(false)}
          onUpgrade={() => {
            // TODO: Implementar integração com gateway de pagamento
            showSuccess("Em breve! Sistema de pagamento será implementado.");
            setShowUpgradeModal(false);
          }}
        />
      )}
    </>
  );
};
