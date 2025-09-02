import React, { useState } from "react";
import {
  ArrowLeft,
  Trash2,
  AlertTriangle,
  Shield,
  Download,
  Clock,
} from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const AccountDeletion: React.FC = () => {
  const { setActivePage } = useAppContext();
  const { user, deleteAccount } = useAuth();
  const { showSuccess, showError } = useToast();
  const [step, setStep] = useState<"warning" | "confirmation" | "final">(
    "warning",
  );
  const [confirmationText, setConfirmationText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [hasExportedData, setHasExportedData] = useState(false);

  const handleDeleteAccount = async () => {
    if (confirmationText !== "EXCLUIR CONTA") {
      showError('Digite "EXCLUIR CONTA" para confirmar');
      return;
    }

    setIsDeleting(true);
    try {
      await deleteAccount();
      showSuccess("Conta excluída com sucesso");
    } catch {
      showError("Erro ao excluir conta. Tente novamente.");
      setIsDeleting(false);
    }
  };

  const handleExportData = async () => {
    try {
      // Simulação de exportação de dados
      // Em uma implementação real, isso faria uma chamada para o backend
      const userData = {
        profile: user?.email,
        exportDate: new Date().toISOString(),
        note: "Esta é uma simulação. Em produção, todos os dados seriam incluídos.",
      };

      const dataStr = JSON.stringify(userData, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `geeklog-dados-${new Date().toISOString().split("T")[0]}.json`;
      link.click();

      URL.revokeObjectURL(url);
      setHasExportedData(true);
      showSuccess("Dados exportados com sucesso");
    } catch {
      showError("Erro ao exportar dados");
    }
  };

  const renderWarningStep = () => (
    <div className="space-y-6">
      <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
        <div className="flex items-center mb-4">
          <AlertTriangle className="w-6 h-6 text-red-400 mr-3" />
          <h3 className="text-lg font-semibold text-red-400">
            Atenção: Ação Irreversível
          </h3>
        </div>
        <p className="text-gray-300 leading-relaxed">
          A exclusão da sua conta é <strong>permanente e irreversível</strong>.
          Todos os seus dados serão removidos permanentemente, incluindo:
        </p>
        <ul className="list-disc list-inside mt-4 space-y-2 text-gray-300 ml-4">
          <li>Toda sua biblioteca de mídia (jogos, filmes, livros, etc.)</li>
          <li>Todas as suas resenhas e avaliações</li>
          <li>Marcos e conquistas alcançadas</li>
          <li>Estatísticas e histórico de atividades</li>
          <li>Configurações e preferências do perfil</li>
          <li>Dados de assinatura Premium (se aplicável)</li>
        </ul>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
        <div className="flex items-center mb-4">
          <Download className="w-6 h-6 text-blue-400 mr-3" />
          <h3 className="text-lg font-semibold text-blue-400">
            Exportar Dados (Recomendado)
          </h3>
        </div>
        <p className="text-gray-300 leading-relaxed mb-4">
          Antes de excluir sua conta, recomendamos que você exporte seus dados.
          Isso criará um arquivo com todas as suas informações que você poderá
          manter.
        </p>
        <button
          onClick={handleExportData}
          disabled={hasExportedData}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            hasExportedData
              ? "bg-green-500/20 text-green-400 border border-green-500/30"
              : "bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30"
          }`}
        >
          {hasExportedData ? "✓ Dados Exportados" : "Exportar Meus Dados"}
        </button>
      </div>

      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
        <div className="flex items-center mb-4">
          <Clock className="w-6 h-6 text-yellow-400 mr-3" />
          <h3 className="text-lg font-semibold text-yellow-400">
            Período de Reflexão
          </h3>
        </div>
        <p className="text-gray-300 leading-relaxed">
          Considerou todas as alternativas? Você pode:
        </p>
        <ul className="list-disc list-inside mt-2 space-y-1 text-gray-300 ml-4">
          <li>Simplesmente parar de usar o aplicativo (sem excluir)</li>
          <li>Limpar manualmente seus dados mas manter a conta</li>
          <li>Entrar em contato conosco para resolver problemas</li>
        </ul>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => setActivePage("settings")}
          className="flex-1 px-6 py-3 bg-gray-600/20 text-gray-300 rounded-lg font-medium hover:bg-gray-600/30 transition-colors border border-gray-600/30"
        >
          Cancelar
        </button>
        <button
          onClick={() => setStep("confirmation")}
          className="flex-1 px-6 py-3 bg-red-500/20 text-red-400 rounded-lg font-medium hover:bg-red-500/30 transition-colors border border-red-500/30"
        >
          Continuar com Exclusão
        </button>
      </div>
    </div>
  );

  const renderConfirmationStep = () => (
    <div className="space-y-6">
      <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
        <div className="flex items-center mb-4">
          <Trash2 className="w-6 h-6 text-red-400 mr-3" />
          <h3 className="text-lg font-semibold text-red-400">
            Confirmação Final
          </h3>
        </div>
        <p className="text-gray-300 leading-relaxed mb-4">
          Esta é sua última chance de reconsiderar. Uma vez confirmada, a
          exclusão não pode ser desfeita.
        </p>

        <div className="bg-gray-900/50 rounded-lg p-4 mb-4">
          <p className="text-sm text-gray-400 mb-2">
            Para confirmar, digite exatamente:{" "}
            <span className="text-red-400 font-mono">EXCLUIR CONTA</span>
          </p>
          <input
            type="text"
            value={confirmationText}
            onChange={(e) => setConfirmationText(e.target.value)}
            placeholder="Digite aqui..."
            className="w-full px-3 py-2 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500/50"
          />
        </div>

        <div className="text-sm text-gray-400 space-y-1">
          <p>• Conta: {user?.email}</p>
          <p>• Data de exclusão: {new Date().toLocaleDateString("pt-BR")}</p>
          <p>• Prazo para remoção completa: 30 dias</p>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => setStep("warning")}
          className="flex-1 px-6 py-3 bg-gray-600/20 text-gray-300 rounded-lg font-medium hover:bg-gray-600/30 transition-colors border border-gray-600/30"
        >
          Voltar
        </button>
        <button
          onClick={handleDeleteAccount}
          disabled={isDeleting || confirmationText !== "EXCLUIR CONTA"}
          className="flex-1 px-6 py-3 bg-red-500/20 text-red-400 rounded-lg font-medium hover:bg-red-500/30 transition-colors border border-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDeleting ? "Excluindo..." : "Excluir Conta Permanentemente"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900/20 to-slate-900">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-64 h-64 bg-red-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-3xl">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => setActivePage("settings")}
            className="mr-4 p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors border border-gray-700/50"
          >
            <ArrowLeft size={20} className="text-gray-300" />
          </button>
          <div className="flex items-center">
            <Trash2 className="w-8 h-8 text-red-400 mr-3" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent">
              Exclusão de Conta
            </h1>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span
              className={`text-sm ${step === "warning" ? "text-white" : "text-gray-400"}`}
            >
              Aviso
            </span>
            <span
              className={`text-sm ${step === "confirmation" ? "text-white" : "text-gray-400"}`}
            >
              Confirmação
            </span>
          </div>
          <div className="w-full bg-gray-700/50 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-red-400 to-orange-500 h-2 rounded-full transition-all duration-300"
              style={{ width: step === "warning" ? "50%" : "100%" }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
          {step === "warning" && renderWarningStep()}
          {step === "confirmation" && renderConfirmationStep()}
        </div>

        {/* Additional Info */}
        <div className="mt-6 bg-gray-800/30 rounded-xl p-6 border border-gray-700/50">
          <div className="flex items-start">
            <Shield className="w-5 h-5 text-blue-400 mr-3 mt-0.5" />
            <div className="text-sm text-gray-300">
              <p className="font-medium text-white mb-1">Proteção de Dados</p>
              <p>
                Seguimos rigorosamente a LGPD e outras regulamentações de
                proteção de dados. Seus dados serão excluídos de forma segura e
                definitiva dentro de 30 dias.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountDeletion;
