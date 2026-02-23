import React, { useState } from "react";
import { logger } from "../utils/logger";
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, User, Lock, Sparkles, X, Mail, ArrowLeft, Shield } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { Register } from "./Register";
import { auth, isFirebaseOffline } from "../firebase";
import { useI18n } from "../i18n";

interface LoginProps {
  onCancel?: () => void;
  onRegister?: () => void;
}

export const Login: React.FC<LoginProps> = ({ onCancel, onRegister }) => {
  const { t } = useI18n();
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
        return t("auth.error.user_not_found");
      case "auth/wrong-password":
        return t("auth.error.wrong_password");
      case "auth/invalid-email":
        return t("auth.error.invalid_email");
      case "auth/user-disabled":
        return t("auth.error.user_disabled");
      case "auth/too-many-requests":
        return t("auth.error.too_many_requests");
      case "auth/network-request-failed":
        return t("auth.error.network_failed");
      case "auth/invalid-credential":
        return t("auth.error.invalid_credential");
      default:
        return t("auth.error.default");
    }
  };

  const handleForgotPassword = async () => {
    if (!resetEmail.trim()) {
      showError(t("auth.error.invalid_email"), t("auth.forgot.desc"));
      return;
    }

    if (!/\S+@\S+\.\S+/.test(resetEmail)) {
      showError(t("auth.error.invalid_email"), t("auth.error.invalid_email"));
      return;
    }

    if (!auth || isFirebaseOffline()) {
      showError("Modo Offline", t("auth.error.offline"));
      return;
    }

    setIsResettingPassword(true);

    try {
      await resetPassword(resetEmail);
      showSuccess(
        t("auth.forgot.success_title"),
        t("auth.forgot.success_desc")
      );
      setShowForgotPassword(false);
      setResetEmail("");
    } catch (error: any) {
      logger.error("Erro ao resetar senha:", error);
      const errorMessage = getErrorMessage(error);
      showError(t("auth.forgot.error_title"), errorMessage);
    } finally {
      setIsResettingPassword(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      showSuccess(t("auth.login.success_title"), t("auth.login.success_msg"));
    } catch (error: any) {
      logger.error("Erro no login:", error);
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
                <span className="text-sm">{t("auth.back")}</span>
              </button>
            )}

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mb-6"
            >
              <img
                src="/assets/logo.png"
                alt="GeekLogg"
                className="w-24 h-24 mx-auto object-contain"
                onError={(e) => {
                  // Fallback para ícone se logo não carregar
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="hidden inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-pink-500 shadow-lg shadow-cyan-500/25 mx-auto">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
            </motion.div>

            <h1 className="text-3xl font-bold mb-2">
              <span className="bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">
                {t("auth.login.title")}
              </span>
            </h1>
            <p className="text-slate-400">
              {t("auth.login.subtitle")}
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
                      {t("auth.forgot.title")}
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
                    {t("auth.forgot.desc")}
                  </p>

                  <div className="relative">
                    <Input
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="seu@email.com"
                      leftIcon={<Mail size={20} className="text-cyan-400" />}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleForgotPassword();
                        }
                      }}
                    />
                  </div>

                  <Button
                    onClick={handleForgotPassword}
                    isLoading={isResettingPassword}
                    className="w-full mt-4"
                  >
                    {t("auth.forgot.send_btn")}
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label={t("auth.login.email")}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              leftIcon={<User size={20} />}
              containerClassName="text-left"
            />

            <Input
              label={t("auth.login.password")}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              leftIcon={<Lock size={20} />}
              containerClassName="text-left"
            />

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                {t("auth.login.forgot_password")}
              </button>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full"
              rightIcon={!isLoading && <LogIn size={20} className="group-hover:translate-x-1 transition-transform" />}
            >
              {t("auth.login.submit")}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-slate-900 text-slate-400">
                {t("auth.login.new_here")}
              </span>
            </div>
          </div>

          {/* Register Button */}
          <Button
            variant="outline"
            onClick={() => {
              if (onRegister) {
                onRegister();
              } else {
                setShowRegister(true);
              }
            }}
            className="w-full border-white/10 hover:border-cyan-500/50"
            leftIcon={<Shield size={20} className="text-cyan-400" />}
          >
            {t("auth.login.create_account")}
          </Button>

          {/* Security Badge */}
          <div className="mt-6 flex items-center justify-center space-x-2 text-xs text-slate-500">
            <Shield className="w-4 h-4" />
            <span>{t("auth.security_badge")}</span>
          </div>
        </div>

        {/* Bottom Text */}
        <p className="text-center text-slate-500 text-sm mt-6">
          {t("auth.login.terms_agreement")}{" "}
          <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors">
            {t("auth.terms")}
          </a>{" "}
          e{" "}
          <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors">
            {t("auth.privacy")}
          </a>
        </p>
      </motion.div>
    </div>
  );
};
