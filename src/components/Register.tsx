import React, { useState } from "react";
import { motion } from "framer-motion";
import { devLog } from "../utils/logger";
import { auth, db, isFirebaseOffline } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { User, Mail, Lock, Calendar, UserPlus, ArrowLeft, Sparkles, Shield } from "lucide-react";

interface RegisterProps {
  onCancel: () => void;
  onLogin?: () => void;
}

export const Register: React.FC<RegisterProps> = ({ onCancel, onLogin }) => {
  const [formData, setFormData] = useState({
    nome: "",
    apelido: "",
    dataNascimento: "",
    email: "",
    senha: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useAuth();
  const { showError, showSuccess } = useToast();

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
          "Senha muito curta",
          "A senha deve ter pelo menos 6 caracteres",
        );
        return;
      }

      if (!validateAge(formData.dataNascimento)) {
        showError(
          "Idade mínima",
          "Você precisa ter pelo menos 13 anos para se registrar",
        );
        return;
      }

      devLog.log("📝 Iniciando registro...");

      if (!auth || isFirebaseOffline()) {
        showError(
          "Modo Offline",
          "Não é possível criar conta no modo offline. Conecte-se à internet e tente novamente.",
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
        "Conta criada!",
        `Bem-vindo(a), ${formData.apelido}! 🎉`,
      );

      setUser({
        uid: user.uid,
        ...userData,
      });
    } catch (error: any) {
      devLog.error("❌ Erro ao criar conta:", error);

      let errorMessage = "Erro ao criar conta. Tente novamente.";

      if (error.code === "auth/email-already-in-use") {
        errorMessage = "Este email já está em uso. Tente fazer login.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Email inválido. Verifique o formato.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Senha muito fraca. Use pelo menos 6 caracteres.";
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
              <span className="text-sm">Voltar</span>
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
                Crie Sua Conta
              </span>
            </h1>
            <p className="text-slate-400">
              Junte-se à comunidade nerd
            </p>
          </div>

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nome Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">
                Nome Completo
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="w-5 h-5 text-cyan-400" />
                </div>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  placeholder="João Silva"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Apelido Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">
                Apelido
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="w-5 h-5 text-purple-400" />
                </div>
                <input
                  type="text"
                  name="apelido"
                  value={formData.apelido}
                  onChange={handleInputChange}
                  placeholder="JoãoGamer"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Data de Nascimento Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">
                Data de Nascimento
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Calendar className="w-5 h-5 text-pink-400" />
                </div>
                <input
                  type="date"
                  name="dataNascimento"
                  value={formData.dataNascimento}
                  onChange={handleInputChange}
                  required
                  max={new Date().toISOString().split("T")[0]}
                  className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                />
              </div>
              <p className="text-xs text-slate-500">
                Você deve ter pelo menos 13 anos
              </p>
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-cyan-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="seu@email.com"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Senha Input */}
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
                  name="senha"
                  value={formData.senha}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                />
              </div>
              <p className="text-xs text-slate-500">
                Mínimo de 6 caracteres
              </p>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-pink-500 hover:from-cyan-600 hover:to-pink-600 disabled:from-slate-600 disabled:to-slate-600 transition-all duration-300 font-semibold shadow-lg shadow-cyan-500/25 disabled:shadow-none flex items-center justify-center space-x-2 group"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Criando conta...</span>
                </>
              ) : (
                <>
                  <span>Criar Conta</span>
                  <UserPlus className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
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
                Já tem uma conta?
              </span>
            </div>
          </div>

          {/* Login Button */}
          <button
            onClick={onLogin || onCancel}
            className="w-full py-3 rounded-xl border-2 border-white/10 hover:border-cyan-500/50 hover:bg-white/5 transition-all duration-300 font-semibold flex items-center justify-center space-x-2"
          >
            <Shield className="w-5 h-5 text-cyan-400" />
            <span>Fazer Login</span>
          </button>

          {/* Security Badge */}
          <div className="mt-6 flex items-center justify-center space-x-2 text-xs text-slate-500">
            <Shield className="w-4 h-4" />
            <span>Seus dados estão protegidos e criptografados</span>
          </div>
        </div>

        {/* Bottom Text */}
        <p className="text-center text-slate-500 text-sm mt-6">
          Ao criar uma conta, você concorda com nossos{" "}
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
