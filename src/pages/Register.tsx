import React, { useState } from "react";
import { motion } from "framer-motion";
import { devLog } from "../utils/logger";
import { auth, db, isFirebaseOffline } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { User, Mail, Lock, Calendar, UserPlus, ArrowLeft, Sparkles, Shield } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { useI18n } from "../i18n";

interface RegisterProps {
  onCancel: () => void;
  onLogin?: () => void;
}

export const Register: React.FC<RegisterProps> = ({ onCancel, onLogin }) => {
  const { t } = useI18n();
  const [formData, setFormData] = useState({
    nome: "",
    apelido: "",
    dataNascimento: "",
    email: "",
    senha: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { showSuccess, showError } = useToast();

  const validateAge = (birthDate: string): boolean => {
    const today = new Date();
    const birth = new Date(birthDate);
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      return age - 1 >= 13;
    }

    return age >= 13;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validações
      if (formData.senha.length < 6) {
        showError(
          t("auth.error.weak_password"),
          t("auth.error.password_length"),
        );
        return;
      }

      if (!validateAge(formData.dataNascimento)) {
        showError(
          "Idade mínima",
          t("auth.error.age_verification"),
        );
        return;
      }

      devLog.log("📝 Iniciando registro...");

      if (!auth || isFirebaseOffline()) {
        showError(
          "Modo Offline",
          t("auth.error.offline"),
        );
        return;
      }

      // Criar conta no Firebase Auth
      const { user } = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.senha,
      );

      // Preparar dados do usuário
      const userData = {
        name: formData.nome,
        displayName: formData.apelido,
        email: formData.email,
        birthDate: formData.dataNascimento,
        avatar: "",
        bio: `Olá! Eu sou ${formData.apelido}, apaixonado(a) por cultura geek! 🚀`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        // Configurações padrões
        settings: {
          notifications: true,
          emailUpdates: true,
          publicProfile: true,
          showBirthday: false,
        },
        // Estatísticas iniciais
        stats: {
          totalMedia: 0,
          totalReviews: 0,
          totalMilestones: 0,
          joinedDate: new Date().toISOString(),
        },
      };

      // Salvar no Firestore
      await setDoc(doc(db, "users", user.uid), userData);

      devLog.log("✅ Conta criada com sucesso!");
      showSuccess(
        t("auth.register.success_title"),
        `${t("auth.register.success_msg_prefix")}, ${formData.apelido}! 🎉`,
      );


    } catch (error: any) {
      devLog.error("❌ Erro ao criar conta:", error);

      let errorMessage = t("auth.error.default");

      if (error.code === "auth/email-already-in-use") {
        errorMessage = t("auth.error.email_in_use");
      } else if (error.code === "auth/invalid-email") {
        errorMessage = t("auth.error.invalid_email");
      } else if (error.code === "auth/weak-password") {
        errorMessage = t("auth.error.weak_password");
      }

      showError("Erro no cadastro", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

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
            <button
              onClick={onCancel}
              className="absolute top-6 left-6 flex items-center space-x-2 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="text-sm">{t("auth.back")}</span>
            </button>

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
                {t("auth.register.title")}
              </span>
            </h1>
            <p className="text-slate-400">
              {t("auth.register.subtitle")}
            </p>
          </div>

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label={t("auth.register.fullname")}
              name="nome"
              value={formData.nome}
              onChange={handleInputChange}
              placeholder="João Silva"
              required
              leftIcon={<User size={20} className="text-cyan-400" />}
              containerClassName="text-left"
            />

            <Input
              label={t("auth.register.nickname")}
              name="apelido"
              value={formData.apelido}
              onChange={handleInputChange}
              placeholder="JoãoGamer"
              required
              leftIcon={<User size={20} className="text-purple-400" />}
              containerClassName="text-left"
            />

            <Input
              label={t("auth.register.birthdate")}
              type="date"
              name="dataNascimento"
              value={formData.dataNascimento}
              onChange={handleInputChange}
              required
              max={new Date().toISOString().split("T")[0]}
              leftIcon={<Calendar size={20} className="text-pink-400" />}
              helperText={t("auth.register.birthdate_helper")}
              containerClassName="text-left"
            />

            <Input
              label={t("auth.login.email")}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="seu@email.com"
              required
              leftIcon={<Mail size={20} className="text-cyan-400" />}
              containerClassName="text-left"
            />

            <Input
              label={t("auth.login.password")}
              type="password"
              name="senha"
              value={formData.senha}
              onChange={handleInputChange}
              placeholder="••••••••"
              required
              minLength={6}
              leftIcon={<Lock size={20} className="text-pink-400" />}
              helperText={t("auth.error.password_length")}
              containerClassName="text-left"
            />

            {/* Register Button */}
            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full"
              rightIcon={!isLoading && <UserPlus size={20} className="group-hover:translate-x-1 transition-transform" />}
            >
              {t("auth.register.submit")}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-slate-900 text-slate-400">
                {t("auth.register.already_account")}
              </span>
            </div>
          </div>

          {/* Login Button */}
          <Button
            variant="outline"
            onClick={onLogin || onCancel}
            className="w-full border-white/10 hover:border-cyan-500/50"
            leftIcon={<Shield size={20} className="text-cyan-400" />}
          >
            {t("auth.register.login_btn")}
          </Button>

          {/* Security Badge */}
          <div className="mt-6 flex items-center justify-center space-x-2 text-xs text-slate-500">
            <Shield className="w-4 h-4" />
            <span>{t("auth.security_badge")}</span>
          </div>
        </div>

        {/* Bottom Text */}
        <p className="text-center text-slate-500 text-sm mt-6">
          {t("auth.register.terms_agreement")}{" "}
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
