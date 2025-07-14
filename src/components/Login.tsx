import React, { useState } from "react";
import { LogIn, User, Lock, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { Register } from "./Register";

export const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showRegister, setShowRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
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

  if (showRegister) {
    return <Register onCancel={() => setShowRegister(false)} />;
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-cyan-900/20 to-pink-900/20 flex items-center justify-center overflow-hidden px-4 py-6">
      {/* Elementos geométricos decorativos - responsivos */}
      <div className="absolute inset-0">
        {/* Círculos com blur - ajustados para mobile */}
        <div className="absolute top-20 left-4 sm:left-20 w-32 sm:w-64 h-32 sm:h-64 bg-cyan-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-4 sm:right-20 w-48 sm:w-96 h-48 sm:h-96 bg-pink-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 sm:w-48 h-24 sm:h-48 bg-purple-500/20 rounded-full blur-xl"></div>

        {/* Quadrados rotacionados - responsivos */}
        <div className="absolute top-10 right-4 sm:right-10 w-8 sm:w-16 h-8 sm:h-16 bg-cyan-400/30 rotate-45"></div>
        <div className="absolute bottom-10 left-4 sm:left-10 w-6 sm:w-12 h-6 sm:h-12 bg-pink-400/25 rotate-12"></div>
        <div className="absolute top-1/3 left-4 sm:left-10 w-4 sm:w-8 h-4 sm:h-8 bg-purple-400/40 -rotate-45"></div>
        <div className="absolute bottom-1/3 right-4 sm:right-10 w-6 sm:w-12 h-6 sm:h-12 bg-indigo-400/25 -rotate-12"></div>
      </div>

      {/* Watermark */}
      <span className="absolute top-2 right-4 text-xs text-cyan-400/60 select-none pointer-events-none">
        By: Metieus
      </span>

      {/* Login Card - responsivo */}
      <div className="relative z-10 w-full max-w-md mx-auto">
        <div className="bg-gray-800/50 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-6 sm:p-8 shadow-2xl">
          {/* Header com logo - responsivo */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center justify-center w-12 sm:w-16 h-12 sm:h-16 bg-gradient-to-br from-cyan-500 to-pink-500 rounded-full mb-4">
              <Sparkles className="w-6 sm:w-8 h-6 sm:h-8 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">
              GeekLog
            </h1>
            <p className="text-gray-200 mt-2 text-sm sm:text-base">
              Entre na sua conta
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-center text-sm">
                {error}
              </div>
            )}

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
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-700"></div>
            <span className="px-4 text-gray-200 text-sm">ou</span>
            <div className="flex-1 border-t border-gray-700"></div>
          </div>

          {/* Register Button - responsivo */}
          <button
            onClick={() => setShowRegister(true)}
            className="w-full bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-500/30 text-purple-400 py-3 px-4 rounded-lg font-semibold hover:from-purple-500/30 hover:to-indigo-500/30 hover:border-purple-400/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-300 text-sm sm:text-base"
          >
            Criar nova conta
          </button>

          {/* Demo Info - responsivo */}
          <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gradient-to-r from-cyan-900/20 to-purple-900/20 border border-cyan-500/20 rounded-lg">
            <p className="text-xs text-cyan-400 text-center">
              💡 <strong>Modo Demo:</strong> Use qualquer email/senha para
              entrar
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
