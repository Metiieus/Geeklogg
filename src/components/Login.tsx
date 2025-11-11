import React, { useState } from "react";
import { devLog } from "../utils/logger";
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, User, Lock, Sparkles, X, Mail, ArrowLeft, Shield } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { Register } from "./Register";
import { auth, isFirebaseOffline } from "../firebase";

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
  const [resetEmail, setResetEmail] = useState("");
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
        return "Erro de conexão. Verifique sua internet.";
      case "auth/invalid-credential":
        return "Credenciais inválidas. Verifique email e senha.";
      default:
        return "Erro no sistema. Tente novamente.";
    }
  };

  const handleForgotPassword = async () => {
    if (!resetEmail.trim()) {
      showError("Email obrigatório", "Insira seu email para resetar a senha");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(resetEmail)) {
      showError("Email inválido", "Insira um email válido");
      return;
    }

    if (!auth || isFirebaseOffline()) {
      showError("Modo Offline", "Funcionalidade não disponível offline");
      return;
    }

    setIsResettingPassword(true);

    try {
      await resetPassword(resetEmail);
      showSuccess(
        "Email enviado!",
        "Verifique sua caixa de entrada para redefinir sua senha"
      );
      setShowForgotPassword(false);
      setResetEmail("");
    } catch (error: any) {
      devLog.error("Erro ao resetar senha:", error);
      const errorMessage = getErrorMessage(error);
      showError("Erro ao enviar email", errorMessage);
    } finally {
      setIsResettingPassword(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      showSuccess("Bem-vindo de volta!", "Login realizado com sucesso");
    } catch (error: any) {
      devLog.error("Erro no login:", error);
      const errorMessage = getErrorMessage(error);
      showError("Erro no login", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (showRegister && !onRegister) {
    return <Register onCancel={() => setShowRegister(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-slate-900/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            {onCancel && (
              <button
                onClick={onCancel}
                className="absolute top-6 left-6 flex items-center space-x-2 text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft size={20} />
                <span className="text-sm">Voltar</span>
              </button>
            )}

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-pink-500 mb-6 shadow-lg shadow-cyan-500/25"
            >
              <Sparkles className="w-10 h-10 text-white" />
            </motion.div>

            <h1 className="text-3xl font-bold mb-2">
              <span className="bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">
                Bem-vindo de Volta!
              </span>
            </h1>
            <p className="text-slate-400">
              Entre para continuar sua jornada nerd
            </p>
          </div>

          {/* Forgot Password Modal */}
          <AnimatePresence>
            {showForgotPassword && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm rounded-3xl flex items-center justify-center p-8 z-20"
              >
                <motion.div
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  className="w-full space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white">
                      Recuperar Senha
                    </h2>
                    <button
                      onClick={() => {
                        setShowForgotPassword(false);
                        setResetEmail("");
                      }}
                      className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <X size={20} className="text-slate-400" />
                    </button>
                  </div>

                  <p className="text-slate-400">
                    Digite seu email e enviaremos instruções para redefinir sua senha
                  </p>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="w-5 h-5 text-cyan-400" />
                    </div>
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="seu@email.com"
                      className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleForgotPassword();
                        }
                      }}
                    />
                  </div>

                  <button
                    onClick={handleForgotPassword}
                    disabled={isResettingPassword}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-pink-500 hover:from-cyan-600 hover:to-pink-600 disabled:from-slate-600 disabled:to-slate-600 transition-all duration-300 font-semibold shadow-lg shadow-cyan-500/25 disabled:shadow-none"
                  >
                    {isResettingPassword ? (
                      <span className="flex items-center justify-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Enviando...</span>
                      </span>
                    ) : (
                      "Enviar Email"
                    )}
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="w-5 h-5 text-cyan-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">
                Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-pink-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Esqueceu a senha?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-pink-500 hover:from-cyan-600 hover:to-pink-600 disabled:from-slate-600 disabled:to-slate-600 transition-all duration-300 font-semibold shadow-lg shadow-cyan-500/25 disabled:shadow-none flex items-center justify-center space-x-2 group"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Entrando...</span>
                </>
              ) : (
                <>
                  <span>Entrar</span>
                  <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-slate-900 text-slate-400">
                Novo por aqui?
              </span>
            </div>
          </div>

          {/* Register Button */}
          <button
            onClick={() => {
              if (onRegister) {
                onRegister();
              } else {
                setShowRegister(true);
              }
            }}
            className="w-full py-3 rounded-xl border-2 border-white/10 hover:border-cyan-500/50 hover:bg-white/5 transition-all duration-300 font-semibold flex items-center justify-center space-x-2 group"
          >
            <Shield className="w-5 h-5 text-cyan-400" />
            <span>Criar Conta Grátis</span>
          </button>

          {/* Security Badge */}
          <div className="mt-6 flex items-center justify-center space-x-2 text-xs text-slate-500">
            <Shield className="w-4 h-4" />
            <span>Seus dados estão protegidos e criptografados</span>
          </div>
        </div>

        {/* Bottom Text */}
        <p className="text-center text-slate-500 text-sm mt-6">
          Ao entrar, você concorda com nossos{" "}
          <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors">
            Termos de Uso
          </a>{" "}
          e{" "}
          <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors">
            Política de Privacidade
          </a>
        </p>
      </motion.div>
    </div>
  );
};
