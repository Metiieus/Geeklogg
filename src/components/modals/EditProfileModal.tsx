import React, { useState } from "react";
import { Save, X, Upload, AlertCircle } from "lucide-react";
import { UserSettings } from "../../App";
import { useToast } from "../../context/ToastContext";
import { validateFile, compressImage } from "../../utils/fileValidation";

interface EditProfileModalProps {
  profile: UserSettings;
  onSave: (settings: UserSettings) => void;
  onClose: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  profile,
  onSave,
  onClose,
}) => {
  const { showError, showSuccess, showWarning } = useToast();
  const [local, setLocal] = useState({
    name: profile?.name || "",
    avatar: profile?.avatar || "",
    bio: profile?.bio || "",
  });
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validar campos obrigatórios
    if (!local.name.trim()) {
      showError("Nome obrigatório", "Por favor, insira seu nome");
      return;
    }

    if (local.name.trim().length < 2) {
      showError("Nome muito curto", "O nome deve ter pelo menos 2 caracteres");
      return;
    }

    if (local.bio && local.bio.length > 1000) {
      showError(
        "Biografia muito longa",
        "A biografia deve ter no máximo 1000 caracteres",
      );
      return;
    }

    try {
      console.log("💾 Salvando perfil no modal:", local);
      onSave({
        ...profile,
        name: local.name.trim(),
        avatar: local.avatar || undefined,
        bio: local.bio.trim(),
      });
      showSuccess("Perfil salvo!", "Suas informações foram atualizadas");
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
      showError("Erro ao salvar", "Não foi possível salvar as alterações");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 max-w-lg w-full overflow-hidden animate-slide-up">
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-2xl font-bold text-white">Editar Perfil</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="text-slate-400" size={20} />
          </button>
        </div>
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-4 max-h-[70vh] overflow-y-auto"
        >
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Nome
            </label>
            <input
              type="text"
              value={local.name}
              onChange={(e) =>
                setLocal((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Seu nome"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Avatar
            </label>
            <div className="space-y-3">
              <label
                className={`flex items-center gap-2 px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white transition-colors ${
                  isUploading
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer hover:bg-slate-700"
                }`}
              >
                {isUploading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Upload size={18} />
                )}
                {isUploading ? "Processando..." : "Fazer Upload da Imagem"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    setIsUploading(true);

                    try {
                      // Validar arquivo
                      const validation = await validateFile(file, {
                        maxSizeInMB: 2,
                        allowedTypes: [
                          "image/jpeg",
                          "image/png",
                          "image/gif",
                          "image/webp",
                        ],
                        maxWidth: 1024,
                        maxHeight: 1024,
                      });

                      if (!validation.isValid) {
                        showError("Erro no upload da imagem", validation.error);
                        setIsUploading(false);
                        return;
                      }

                      // Se a imagem for muito grande, comprimir
                      let processedFile = file;
                      if (file.size > 1024 * 1024) {
                        // > 1MB
                        showWarning(
                          "Comprimindo imagem",
                          "A imagem está sendo otimizada para melhor performance",
                        );
                        processedFile = await compressImage(
                          file,
                          512,
                          512,
                          0.8,
                        );
                      }

                      // Converter para base64 para preview
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        const result = ev.target?.result as string;
                        setLocal((prev) => ({ ...prev, avatar: result }));
                        showSuccess(
                          "Imagem carregada!",
                          "Sua foto de perfil foi atualizada",
                        );
                        setIsUploading(false);
                      };

                      reader.onerror = () => {
                        showError(
                          "Erro ao processar imagem",
                          "Não foi possível carregar a imagem selecionada",
                        );
                        setIsUploading(false);
                      };

                      reader.readAsDataURL(processedFile);
                    } catch (error) {
                      console.error("Erro no upload:", error);
                      showError(
                        "Erro inesperado",
                        "Ocorreu um erro ao processar a imagem. Tente novamente.",
                      );
                      setIsUploading(false);
                    }
                  }}
                  className="hidden"
                  disabled={isUploading}
                />
              </label>
              {local.avatar && (
                <div className="mt-2">
                  <img
                    src={local.avatar}
                    alt="Preview"
                    className="w-24 h-24 object-cover rounded-full mx-auto"
                  />
                </div>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Biografia
              <span
                className={`ml-2 text-xs ${local.bio.length > 900 ? "text-red-400" : local.bio.length > 800 ? "text-yellow-400" : "text-slate-500"}`}
              >
                {local.bio.length}/1000
              </span>
            </label>
            <textarea
              value={local.bio}
              onChange={(e) =>
                setLocal((prev) => ({ ...prev, bio: e.target.value }))
              }
              rows={4}
              maxLength={1000}
              className={`w-full px-4 py-3 bg-slate-700/50 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none ${
                local.bio.length > 900
                  ? "border-red-500"
                  : local.bio.length > 800
                    ? "border-yellow-500"
                    : "border-slate-600"
              }`}
              placeholder="Fale algo sobre você"
            />
            {local.bio.length > 900 && (
              <div className="mt-1 flex items-center gap-1 text-red-400 text-xs">
                <AlertCircle size={12} />
                Limite de caracteres quase atingido
              </div>
            )}
          </div>
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-slate-300 hover:text-white transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-200 flex items-center gap-2"
            >
              <Save size={18} />
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
