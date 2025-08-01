import React, { useState } from "react";
import { Save, X, Upload, AlertCircle, User } from "lucide-react";
import { UserSettings } from "../../App";
import { useToast } from "../../context/ToastContext";
import { validateFile, compressImage } from "../../utils/fileValidation";
import { sanitizeText, sanitizeBioText } from "../../utils/sanitizer";
import { ModalWrapper } from "../ModalWrapper";

interface EditProfileData {
  name: string;
  bio: string;
  avatarFile?: File;
  coverFile?: File;
}

interface EditProfileModalProps {
  profile: UserSettings;
  onSave: (data: EditProfileData) => void;
  onClose: () => void;
}

// Avatares predefinidos estilo Netflix
const PREDEFINED_AVATARS = [
  "https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=200",
  "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200",
  "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200",
  "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=200",
  "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=200",
  "https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=200",
  "https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=200",
  "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=200",
  "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=200",
  "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=200",
  "https://images.pexels.com/photos/1040883/pexels-photo-1040883.jpeg?auto=compress&cs=tinysrgb&w=200",
  "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=200",
];

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  profile,
  onSave,
  onClose,
}) => {
  const { showError, showSuccess, showWarning } = useToast();
  const [local, setLocal] = useState({
    name: profile?.name || "",
    avatar: profile?.avatar || "",
    cover: profile?.cover || "",
    bio: profile?.bio || "",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);

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
        name: local.name.trim(),
        bio: local.bio.trim(),
        avatarFile: avatarFile || undefined,
        coverFile: coverFile || undefined,
      });
      showSuccess("Perfil salvo!", "Suas informações foram atualizadas");
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
      showError("Erro ao salvar", "Não foi possível salvar as alterações");
    }
  };

  const handlePredefinedAvatarSelect = (avatarUrl: string) => {
    setLocal((prev) => ({ ...prev, avatar: avatarUrl }));
    setAvatarFile(null); // Remove arquivo personalizado se houver
    setShowAvatarSelector(false);
    showSuccess("Avatar selecionado!", "Avatar predefinido foi escolhido");
  };

  return (
    <ModalWrapper
      isOpen={true}
      onClose={onClose}
      maxWidth="max-w-lg"
      className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-white/20 overflow-hidden"
    >
        <div className="flex items-center justify-between p-6 border-b border-white/20">
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
          className="p-6 space-y-4 max-h-[80vh] overflow-y-auto"
        >
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Nome
            </label>
            <input
              type="text"
              value={local.name}
              onChange={(e) => {
                const sanitizedName = sanitizeText(e.target.value, 100);
                setLocal((prev) => ({ ...prev, name: sanitizedName }));
              }}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Seu nome"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Avatar
            </label>
            <div className="space-y-3">
              {/* Avatar atual */}
              {local.avatar && (
                <div className="flex items-center gap-4 p-3 bg-slate-800/50 rounded-lg">
                  <img
                    src={local.avatar}
                    alt="Avatar atual"
                    className="w-16 h-16 object-cover rounded-full"
                  />
                  <div className="flex-1">
                    <p className="text-white text-sm">Avatar atual</p>
                    <button
                      type="button"
                      onClick={() => setLocal((prev) => ({ ...prev, avatar: "" }))}
                      className="text-red-400 hover:text-red-300 text-xs mt-1"
                    >
                      Remover avatar
                    </button>
                  </div>
                </div>
              )}

              {/* Botões de seleção */}
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setShowAvatarSelector(!showAvatarSelector)}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  <User size={18} />
                  Avatares Predefinidos
                </button>

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
                        setAvatarFile(processedFile);
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
              </div>

              {/* Seletor de avatares predefinidos */}
              {showAvatarSelector && (
                <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-600/50">
                  <h4 className="text-white font-medium mb-3">Escolha um avatar:</h4>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 max-h-60 overflow-y-auto">
                    {PREDEFINED_AVATARS.map((avatarUrl, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handlePredefinedAvatarSelect(avatarUrl)}
                        className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 transition-all hover:scale-110 ${
                          local.avatar === avatarUrl 
                            ? 'border-purple-500 ring-2 ring-purple-400/50' 
                            : 'border-slate-600 hover:border-slate-400'
                        }`}
                      >
                        <img
                          src={avatarUrl}
                          alt={`Avatar ${index + 1}`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAvatarSelector(false)}
                    className="mt-3 text-slate-400 hover:text-white text-sm"
                  >
                    Fechar seletor
                  </button>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Capa do Perfil
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
                {isUploading ? "Processando..." : "Fazer Upload da Capa"}
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
                        maxSizeInMB: 3,
                        allowedTypes: [
                          "image/jpeg",
                          "image/png",
                          "image/gif",
                          "image/webp",
                        ],
                        maxWidth: 1920,
                        maxHeight: 1080,
                      });

                      if (!validation.isValid) {
                        showError("Erro no upload da capa", validation.error);
                        setIsUploading(false);
                        return;
                      }

                      // Se a imagem for muito grande, comprimir
                      let processedFile = file;
                      if (file.size > 2 * 1024 * 1024) {
                        // > 2MB
                        showWarning(
                          "Comprimindo capa",
                          "A imagem está sendo otimizada para melhor performance",
                        );
                        processedFile = await compressImage(
                          file,
                          1200,
                          600,
                          0.8,
                        );
                      }

                      // Converter para base64 para preview
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        const result = ev.target?.result as string;
                        setLocal((prev) => ({ ...prev, cover: result }));
                        setCoverFile(processedFile);
                        showSuccess(
                          "Capa carregada!",
                          "Sua capa de perfil foi atualizada",
                        );
                        setIsUploading(false);
                      };

                      reader.onerror = () => {
                        showError(
                          "Erro ao processar capa",
                          "Não foi possível carregar a imagem selecionada",
                        );
                        setIsUploading(false);
                      };

                      reader.readAsDataURL(processedFile);
                    } catch (error) {
                      console.error("Erro no upload da capa:", error);
                      showError(
                        "Erro inesperado",
                        "Ocorreu um erro ao processar a capa. Tente novamente.",
                      );
                      setIsUploading(false);
                    }
                  }}
                  className="hidden"
                  disabled={isUploading}
                />
              </label>
              {local.cover && (
                <div className="mt-2">
                  <img
                    src={local.cover}
                    alt="Preview da Capa"
                    className="w-full h-32 object-cover rounded-lg mx-auto"
                  />
                  <button
                    type="button"
                    onClick={() => setLocal((prev) => ({ ...prev, cover: "" }))}
                    className="mt-2 text-red-400 hover:text-red-300 text-sm"
                  >
                    Remover Capa
                  </button>
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
              onChange={(e) => {
                const sanitizedBio = sanitizeBioText(e.target.value, 1000);
                setLocal((prev) => ({ ...prev, bio: sanitizedBio }));
              }}
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
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/20">
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
    </ModalWrapper>
  );
};
