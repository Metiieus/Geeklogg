import React from 'react';
import { X, Crown, Sparkles, Check, Zap, Star, Brain } from 'lucide-react';

interface UpgradeToPremiumModalProps {
  onClose: () => void;
  onUpgrade: () => void;
}

export const UpgradeToPremiumModal: React.FC<UpgradeToPremiumModalProps> = ({
  onClose,
  onUpgrade,
}) => {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-amber-500/30 shadow-2xl shadow-amber-500/20">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Crown className="w-7 h-7 text-white fill-current" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                GeekLogg Premium
                <Sparkles className="w-5 h-5 animate-pulse" />
              </h2>
              <p className="text-amber-100 text-sm">
                Desbloqueie todo o potencial da plataforma
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Pricing */}
          <div className="bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border-2 border-amber-500/30 rounded-xl p-6 text-center">
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-5xl font-bold text-white">R$ 9,90</span>
              <span className="text-xl text-gray-300">/mês</span>
            </div>
            <p className="text-gray-400 mt-2">
              Cancele quando quiser • Sem compromisso
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500" />
              O que você ganha:
            </h3>

            <div className="grid gap-3">
              {/* Archivius */}
              <div className="bg-gray-800/50 border border-cyan-500/30 rounded-lg p-4 hover:border-cyan-500/50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white flex items-center gap-2">
                      Archivius IA
                      <span className="text-xs bg-amber-500 text-black px-2 py-0.5 rounded-full font-bold">
                        EXCLUSIVO
                      </span>
                    </h4>
                    <p className="text-sm text-gray-400 mt-1">
                      Assistente inteligente que analisa sua biblioteca e recomenda
                      conteúdos personalizados baseados no seu gosto
                    </p>
                  </div>
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                </div>
              </div>

              {/* Recomendações */}
              <div className="bg-gray-800/50 border border-pink-500/30 rounded-lg p-4 hover:border-pink-500/50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">
                      Recomendações Inteligentes
                    </h4>
                    <p className="text-sm text-gray-400 mt-1">
                      Sugestões personalizadas que realmente fazem sentido com o que
                      você já gostou
                    </p>
                  </div>
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                </div>
              </div>

              {/* Análise de Perfil */}
              <div className="bg-gray-800/50 border border-purple-500/30 rounded-lg p-4 hover:border-purple-500/50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">
                      Análise de Perfil Avançada
                    </h4>
                    <p className="text-sm text-gray-400 mt-1">
                      Descubra padrões no seu consumo e receba insights sobre seus
                      gostos
                    </p>
                  </div>
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                </div>
              </div>

              {/* Badge Premium */}
              <div className="bg-gray-800/50 border border-amber-500/30 rounded-lg p-4 hover:border-amber-500/50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Crown className="w-5 h-5 text-white fill-current" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">Badge Premium</h4>
                    <p className="text-sm text-gray-400 mt-1">
                      Destaque-se com uma badge exclusiva no seu perfil
                    </p>
                  </div>
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                </div>
              </div>

              {/* Suporte Prioritário */}
              <div className="bg-gray-800/50 border border-blue-500/30 rounded-lg p-4 hover:border-blue-500/50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">Suporte Prioritário</h4>
                    <p className="text-sm text-gray-400 mt-1">
                      Atendimento preferencial e acesso antecipado a novos recursos
                    </p>
                  </div>
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="space-y-3">
            <button
              onClick={onUpgrade}
              className="w-full py-4 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-600 hover:via-yellow-600 hover:to-amber-700 text-black font-bold text-lg rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-amber-500/50 flex items-center justify-center gap-2"
            >
              <Crown className="w-5 h-5 fill-current" />
              Assinar Premium Agora
              <Sparkles className="w-5 h-5" />
            </button>

            <button
              onClick={onClose}
              className="w-full py-3 bg-gray-700/50 hover:bg-gray-700 text-gray-300 font-medium rounded-xl transition-colors"
            >
              Talvez mais tarde
            </button>
          </div>

          {/* Garantia */}
          <div className="text-center text-sm text-gray-400 pt-4 border-t border-gray-700">
            <p>
              🔒 Pagamento seguro • ✨ Cancele quando quiser • 💯 Satisfação
              garantida
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
