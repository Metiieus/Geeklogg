import React, { useState } from "react";
import { getAuth, getDB, isFirebaseOffline } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { User, Mail, Lock, Calendar, UserPlus, ArrowLeft } from "lucide-react";

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

      console.log("📝 Iniciando registro...");

      const auth = getAuth();
      const db = getDB();

      if (!auth || isFirebaseOffline()) {
        showError(
          "Modo Offline",
          "Não é possível criar conta no modo offline. Conecte-se à internet e tente novamente."
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
        theme: "dark",
        notifications: {
          email: true,
          push: true,
          achievements: true,
          social: true,
        },
        privacy: {
          profilePublic: true,
          showProgress: true,
          showFavorites: true,
        },
        // Inicializar favoritos vazios
        favorites: {
          characters: [],
          games: [],
          movies: [],
        },
        // Configurações padrão da biblioteca
        defaultLibrarySort: "updatedAt",
        // Estatísticas iniciais
        stats: {
          totalHours: 0,
          totalCompleted: 0,
          totalReviews: 0,
          totalMilestones: 0,
          averageRating: 0,
        },
      };

      // Gravar os dados no Firestore
      await setDoc(doc(db, "users", user.uid), userData);

      // Atualizar o contexto de usuário
      setUser(user);

      showSuccess(
        "Conta criada com sucesso!",
        `Bem-vindo(a), ${formData.apelido}! 🎉`,
      );

      console.log("🚀 Registro concluído com sucesso!");
    } catch (error: any) {
      console.error("❌ Erro no registro:", error);

      if (error.code === "auth/email-already-in-use") {
        showError(
          "Email já cadastrado",
          "Este email já está sendo usado por outra conta",
        );
      } else if (error.code === "auth/weak-password") {
        showError("Senha fraca", "Escolha uma senha mais forte");
      } else if (error.code === "auth/invalid-email") {
        showError("Email inválido", "Por favor, insira um email válido");
      } else {
        showError("Erro no registro", error.message || "Erro desconhecido");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center overflow-hidden px-4 py-6 relative">
      {/* Background Elements - mesmo padrão da Landing Page */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-cyan-500/20 to-transparent rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-r from-pink-500/20 to-transparent rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-gradient-to-r from-purple-500/15 to-transparent rounded-full blur-lg"></div>

        {/* Geometric elements */}
        <div className="absolute top-10 right-10 w-8 h-8 bg-cyan-400/25 rotate-45 opacity-60"></div>
        <div className="absolute bottom-10 left-10 w-6 h-6 bg-pink-400/30 rotate-12 opacity-50"></div>
        <div className="absolute top-1/3 left-10 w-4 h-4 bg-purple-400/35 -rotate-45 opacity-70"></div>
        <div className="absolute bottom-1/3 right-10 w-8 h-8 bg-indigo-400/25 -rotate-12 opacity-55"></div>
      </div>

      <div className="relative z-10 bg-gray-800/40 backdrop-blur-md p-6 sm:p-8 rounded-xl border border-gray-700/50 w-full max-w-md">
        <div className="text-center mb-6">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-cyan-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-500/25">
            <UserPlus className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">
            GeekLog
          </h1>
          <p className="text-gray-200 mt-3 text-sm sm:text-base">
            Crie sua conta
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nome Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-4 sm:h-5 w-4 sm:w-5 text-cyan-400" />
            </div>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleInputChange}
              placeholder="Nome completo"
              required
              className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-sm sm:text-base"
            />
          </div>

          {/* Apelido Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-4 sm:h-5 w-4 sm:w-5 text-purple-400" />
            </div>
            <input
              type="text"
              name="apelido"
              value={formData.apelido}
              onChange={handleInputChange}
              placeholder="Apelido"
              required
              className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm sm:text-base"
            />
          </div>

          {/* Data de Nascimento Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-4 sm:h-5 w-4 sm:w-5 text-pink-400" />
            </div>
            <input
              type="date"
              name="dataNascimento"
              value={formData.dataNascimento}
              onChange={handleInputChange}
              required
              className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all text-sm sm:text-base"
            />
          </div>

          {/* Email Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-4 sm:h-5 w-4 sm:w-5 text-indigo-400" />
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
              required
              className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm sm:text-base"
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-4 sm:h-5 w-4 sm:w-5 text-pink-400" />
            </div>
            <input
              type="password"
              name="senha"
              value={formData.senha}
              onChange={handleInputChange}
              placeholder="Senha (mín. 6 caracteres)"
              required
              className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all text-sm sm:text-base"
            />
          </div>

          {/* Register Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-300 flex items-center justify-center gap-2 group text-sm sm:text-base mt-6 ${
              isLoading
                ? "bg-slate-600 cursor-not-allowed"
                : "bg-gradient-to-r from-cyan-500 to-pink-500 hover:from-cyan-600 hover:to-pink-600"
            } text-white`}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <UserPlus className="w-4 sm:w-5 h-4 sm:h-5 group-hover:scale-110 transition-transform" />
            )}
            {isLoading ? "Registrando..." : "Criar conta"}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center">
          <div className="flex-1 border-t border-gray-700"></div>
          <span className="px-4 text-gray-200 text-sm">ou</span>
          <div className="flex-1 border-t border-gray-700"></div>
        </div>

        {/* Navigation Buttons */}
        <div className="space-y-3">
          {onLogin && (
            <button
              onClick={onLogin}
              className="w-full bg-gradient-to-r from-cyan-500/20 to-pink-500/20 border border-cyan-500/30 text-cyan-400 py-3 px-4 rounded-lg font-semibold hover:from-cyan-500/30 hover:to-pink-500/30 hover:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-300 text-sm sm:text-base flex items-center justify-center gap-2"
            >
              Já tenho conta
            </button>
          )}
          <button
            onClick={onCancel}
            className="w-full border border-gray-600/50 text-gray-300 py-3 px-4 rounded-lg font-semibold hover:border-gray-500 hover:bg-gray-600/10 transition-all duration-300 text-sm sm:text-base flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {onLogin ? "Voltar" : "Voltar ao login"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
