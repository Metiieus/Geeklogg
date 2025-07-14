import React, { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { User, Mail, Lock, Calendar, UserPlus, ArrowLeft } from "lucide-react";

interface RegisterProps {
  onCancel: () => void;
}

export const Register: React.FC<RegisterProps> = ({ onCancel }) => {
  const [formData, setFormData] = useState({
    nome: "",
    apelido: "",
    dataNascimento: "",
    email: "",
    senha: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { logout } = useAuth();
  const { showError, showSuccess } = useToast();

  const getErrorMessage = (error: any): string => {
    const code = error?.code || error?.message || "";

    switch (code) {
      case "auth/email-already-in-use":
        return "Este email já está em uso. Tente fazer login ou use outro email.";
      case "auth/invalid-email":
        return "Email inválido. Verifique o formato do email.";
      case "auth/operation-not-allowed":
        return "Registro desabilitado. Entre em contato com o suporte.";
      case "auth/weak-password":
        return "Senha muito fraca. Use pelo menos 6 caracteres.";
      case "auth/network-request-failed":
        return "Erro de conexão. Verifique sua internet e tente novamente.";
      default:
        return "Erro no registro. Tente novamente.";
    }
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

    // Validações
    if (!formData.nome.trim()) {
      showError("Nome obrigatório", "Por favor, insira seu nome completo");
      return;
    }

    if (formData.nome.trim().length < 2) {
      showError("Nome muito curto", "O nome deve ter pelo menos 2 caracteres");
      return;
    }

    if (!formData.apelido.trim()) {
      showError("Apelido obrigatório", "Por favor, insira um apelido");
      return;
    }

    if (!formData.dataNascimento) {
      showError("Data obrigatória", "Por favor, insira sua data de nascimento");
      return;
    }

    // Validar idade mínima (13 anos)
    const birthDate = new Date(formData.dataNascimento);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    if (age < 13) {
      showError(
        "Idade mínima",
        "Você deve ter pelo menos 13 anos para se registrar",
      );
      return;
    }

    if (!formData.email.trim()) {
      showError("Email obrigatório", "Por favor, insira seu email");
      return;
    }

    if (!formData.email.includes("@")) {
      showError("Email inválido", "Por favor, insira um email válido");
      return;
    }

    if (!formData.senha.trim()) {
      showError("Senha obrigatória", "Por favor, insira uma senha");
      return;
    }

    if (formData.senha.length < 6) {
      showError(
        "Senha muito curta",
        "A senha deve ter pelo menos 6 caracteres",
      );
      return;
    }

    setIsLoading(true);

    try {
      if (!auth || !db) {
        throw new Error(
          "Firebase não foi inicializado. Verifique sua configuração.",
        );
      }

      console.log("🚀 Iniciando cadastro...");

      let userCredential;
      // Check if we're using mock auth (demo mode)
      if (typeof auth.createUserWithEmailAndPassword === "function") {
        // Mock auth - use the mock function
        userCredential = await auth.createUserWithEmailAndPassword(
          formData.email.trim(),
          formData.senha,
        );
      } else {
        // Real Firebase auth
        userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email.trim(),
          formData.senha,
        );
      }

      const user = userCredential.user;
      console.log("✅ Usuário criado com UID:", user.uid);

      // Preparar os dados
      const userData = {
        uid: user.uid,
        nome: formData.nome.trim(),
        apelido: formData.apelido.trim(),
        dataNascimento: formData.dataNascimento,
        email: formData.email.trim(),
        createdAt: new Date().toISOString(),
      };

      // Gravar os dados no Firestore
      console.log("✍️ Gravando dados no Firestore...");
      await setDoc(doc(db, "users", user.uid), userData);
      console.log("🎉 Dados do usuário salvos com sucesso!");

      showSuccess(
        "Registro conclu��do!",
        "Conta criada com sucesso. Agora você pode fazer login.",
      );

      // Deslogar o usuário após cadastro
      await logout();

      onCancel();
    } catch (err: any) {
      console.error("❌ Erro ao registrar usuário:", err);
      const message = getErrorMessage(err);
      showError("Erro no registro", message);
    } finally {
      setIsLoading(false);
    }
  };

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

      {/* Register Card - responsivo */}
      <div className="relative z-10 w-full max-w-md mx-auto">
        <div className="bg-gray-800/50 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-6 sm:p-8 shadow-2xl">
          {/* Header com logo - responsivo */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center justify-center mb-4">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F7f1b9e9c1d27434ebacaa7f16ca51525%2Fa7818e35c5d54df9ba951473e49bd460?format=webp&width=100"
                alt="GeekLog"
                className="w-20 sm:w-24 h-20 sm:h-24 object-contain"
              />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">
              GeekLog
            </h1>
            <p className="text-gray-200 mt-2 text-sm sm:text-base">
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

          {/* Back to Login Button */}
          <button
            onClick={onCancel}
            className="w-full bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-500/30 text-purple-400 py-3 px-4 rounded-lg font-semibold hover:from-purple-500/30 hover:to-indigo-500/30 hover:border-purple-400/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-300 text-sm sm:text-base flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao login
          </button>

          {/* Demo Info */}
          <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gradient-to-r from-cyan-900/20 to-purple-900/20 border border-cyan-500/20 rounded-lg">
            <p className="text-xs text-cyan-400 text-center">
              💡 <strong>Modo Demo:</strong> Use qualquer email/senha para
              registrar
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
