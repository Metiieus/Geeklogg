import React, { useState } from "react";
import { LogIn, User, Lock, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { Register } from "./Register";

interface LoginProps {
  onCancel?: () => void;
  onRegister?: () => void;
}

export const Login: React.FC<LoginProps> = ({ onCancel, onRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showRegister, setShowRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const { login, resetPassword } = useAuth();
  const { showError, showSuccess } = useToast();

  const getErrorMessage = (error: any): string => {
    const code = error?.code || error?.message || "";

    switch (code) {
      case "auth/user-not-found":
        return "Usuário não encontrado. Verifique o email ou registre-se.";
      case "auth/wrong-password":
        return "Senha incorreta. Tente novamente.";
      case "auth/invalid-email":
        return "Email inválido. Verifique o formato do email.";
      case "auth/user-disabled":
        return "Esta conta foi desabilitada. Entre em contato com o suporte.";
      case "auth/too-many-requests":
        return "Muitas tentativas de login. Tente novamente mais tarde.";
      case "auth/network-request-failed":
        return "Erro de conexão. Verifique sua internet e tente novamente.";
      case "auth/invalid-credential":
        return "Credenciais inválidas. Verifique email e senha.";
      default:
        return "Erro no login. Tente novamente.";
    }
  };

  const handleForgotPassword = async (resetEmail: string) => {
    if (!resetEmail.trim()) {
      showError("Email obrigatório", "Por favor, insira seu email para resetar a senha");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(resetEmail)) {
      showError("Email inválido", "Por favor, insira um email válido");
      return;
    }

    setIsResettingPassword(true);

    try {
      await resetPassword(resetEmail);
      showSuccess(
        "Email enviado!",
        "Verifique sua caixa de entrada para resetar sua senha"
      );
      setShowForgotPassword(false);
    } catch (error: any) {
      console.error("Erro ao resetar senha:", error);
      const errorMessage = getErrorMessage(error);
      showError("Erro ao resetar senha", errorMessage);
    } finally {
      setIsResettingPassword(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validações
    if (!email.trim()) {
      showError("Email obrigatório", "Por favor, insira seu email");
      return;
    }

    if (!email.includes("@")) {
      showError("Email inválido", "Por favor, insira um email válido");
      return;
    }

    if (!password.trim()) {
      showError("Senha obrigatória", "Por favor, insira sua senha");
      return;
    }

    if (password.length < 6) {
      showError(
        "Senha muito curta",
        "A senha deve ter pelo menos 6 caracteres",
      );
      return;
    }

    setIsLoading(true);

    try {
      await login(email.trim(), password);
      showSuccess("Login realizado!", "Bem-vindo de volta!");
    } catch (error: any) {
      console.error("Falha no login:", error);
      const message = getErrorMessage(error);
      showError("Falha no login", message);
    } finally {
      setIsLoading(false);
    }
  };

  if (showRegister && !onRegister) {
    return <Register onCancel={() => setShowRegister(false)} />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center overflow-hidden px-4 py-4 sm:py-6 relative">
      {/* Background Elements - responsivos */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Mobile: elementos menores */}
        <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-24 sm:w-32 h-24 sm:h-32 bg-gradient-to-r from-cyan-500/20 to-transparent rounded-full blur-xl"></div>
        <div className="absolute top-20 sm:top-40 right-10 sm:right-20 w-32 sm:w-48 h-32 sm:h-48 bg-gradient-to-r from-pink-500/20 to-transparent rounded-full blur-xl"></div>
        <div className="absolute bottom-20 sm:bottom-40 left-1/4 w-40 sm:w-64 h-40 sm:h-64 bg-gradient-to-r from-purple-500/20 to-transparent rounded-full blur-xl"></div>

        {/* Polygonal Elements - apenas em desktop */}
        <div className="hidden sm:block absolute top-32 right-32 w-16 h-16 bg-gradient-to-r from-cyan-400 to-pink-500 opacity-30 transform rotate-45"></div>
        <div className="hidden sm:block absolute bottom-32 left-20 w-12 h-12 bg-gradient-to-r from-purple-400 to-cyan-500 opacity-40 transform rotate-12"></div>
        <div className="absolute top-1/2 right-5 sm:right-10 w-6 sm:w-8 h-6 sm:h-8 bg-gradient-to-r from-pink-400 to-purple-500 opacity-50 transform -rotate-45"></div>
      </div>

      {/* Login Card - responsivo */}
      <div className="relative z-10 w-full max-w-md mx-auto">
        <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl hover:border-cyan-400/50 transition-all duration-300">
          {/* Header com logo - responsivo */}
          <div className="text-center mb-4 sm:mb-6 md:mb-8">
            {onCancel && (
              <div className="flex justify-start mb-3 sm:mb-4">
                <button
                  onClick={onCancel}
                  className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors text-sm active:scale-95"
                >
                  ← Voltar
                </button>
              </div>
            )}
            <div className="flex items-center justify-center mb-4 sm:mb-6">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F7f1b9e9c1d27434ebacaa7f16ca51525%2Fa7818e35c5d54df9ba951473e49bd460?format=webp&width=200"
                alt="GeekLog"
                className="w-32 sm:w-40 md:w-48 h-32 sm:h-40 md:h-48 object-contain"
              />
            </div>
            <p className="text-gray-200 mt-2 sm:mt-3 text-sm sm:text-base">
              Entre na sua conta
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Email Input - responsivo */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-4 sm:h-5 w-4 sm:w-5 text-cyan-400" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-sm sm:text-base"
              />
            </div>

            {/* Password Input - responsivo */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-4 sm:h-5 w-4 sm:w-5 text-pink-400" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Senha"
                required
                className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all text-sm sm:text-base"
              />
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors duration-200"
              >
                Esqueci minha senha
              </button>
            </div>

            {/* Login Button - responsivo */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-300 flex items-center justify-center gap-2 group text-sm sm:text-base ${
                isLoading
                  ? "bg-slate-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-cyan-500 to-pink-500 hover:from-cyan-600 hover:to-pink-600"
              } text-white`}
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <LogIn className="w-4 sm:w-5 h-4 sm:h-5 group-hover:rotate-12 transition-transform" />
              )}
              {isLoading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          {/* Divider */}
          <div className="my-4 sm:my-6 flex items-center">
            <div className="flex-1 border-t border-gray-700"></div>
            <span className="px-3 sm:px-4 text-gray-200 text-sm">ou</span>
            <div className="flex-1 border-t border-gray-700"></div>
          </div>

          {/* Register Button - responsivo */}
          <button
            onClick={() => (onRegister ? onRegister() : setShowRegister(true))}
            className="w-full border border-cyan-400/50 rounded-lg text-cyan-400 py-3 px-4 font-semibold hover:border-cyan-400 hover:bg-cyan-400/10 transition-all duration-300 text-sm sm:text-base"
          >
            Criar nova conta
          </button>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-white/20 max-w-md w-full overflow-hidden animate-slide-up">
            <div className="flex items-center justify-between p-6 border-b border-white/20">
              <h2 className="text-xl font-bold text-white">Resetar Senha</h2>
              <button
                onClick={() => setShowForgotPassword(false)}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <span className="text-slate-400 text-xl">×</span>
              </button>
            </div>

            <div className="p-6">
              <p className="text-slate-300 mb-4 text-sm">
                Digite seu email e enviaremos um link para resetar sua senha.
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleForgotPassword(email);
                }}
                className="space-y-4"
              >
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-cyan-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Seu email"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(false)}
                    className="px-4 py-2 text-slate-300 hover:text-white transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isResettingPassword}
                    className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 ${
                      isResettingPassword
                        ? "bg-slate-600 cursor-not-allowed"
                        : "bg-gradient-to-r from-cyan-500 to-pink-500 hover:from-cyan-600 hover:to-pink-600"
                    } text-white`}
                  >
                    {isResettingPassword ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : null}
                    {isResettingPassword ? "Enviando..." : "Enviar"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
