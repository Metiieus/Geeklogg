import React, { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

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
        "Registro concluído!",
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
    <div
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://storage.googleapis.com/images-etherium/NERD%20LOG.%20(1).png')",
      }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 p-8 rounded-xl shadow-lg backdrop-filter backdrop-blur-lg bg-white bg-opacity-10 border border-gray-200 border-opacity-20 text-white w-96 max-h-[90vh] overflow-y-auto">
        <h2 className="text-3xl font-bold text-center mb-6">Registro</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="text-red-400 text-center">{error}</div>}
          <div className="relative">
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleInputChange}
              placeholder=" "
              className="peer w-full px-4 py-3 bg-transparent border-b-2 border-gray-300 focus:outline-none focus:border-purple-500 placeholder-transparent"
              required
            />
            <label
              htmlFor="nome"
              className="absolute left-4 -top-3.5 text-gray-300 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-purple-500 peer-focus:text-sm"
            >
              Nome
            </label>
            <span className="absolute right-4 top-3 text-gray-400">
              &#x1F464;
            </span>
          </div>

          <div className="relative">
            <input
              type="text"
              name="apelido"
              value={formData.apelido}
              onChange={handleInputChange}
              placeholder=" "
              className="peer w-full px-4 py-3 bg-transparent border-b-2 border-gray-300 focus:outline-none focus:border-purple-500 placeholder-transparent"
              required
            />
            <label
              htmlFor="apelido"
              className="absolute left-4 -top-3.5 text-gray-300 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-purple-500 peer-focus:text-sm"
            >
              Apelido
            </label>
            <span className="absolute right-4 top-3 text-gray-400">
              &#x1F3AD;
            </span>
          </div>

          <div className="relative">
            <input
              type="date"
              name="dataNascimento"
              value={formData.dataNascimento}
              onChange={handleInputChange}
              className="peer w-full px-4 py-3 bg-transparent border-b-2 border-gray-300 focus:outline-none focus:border-purple-500 text-white"
              required
            />
            <label
              htmlFor="dataNascimento"
              className="absolute left-4 -top-3.5 text-gray-300 text-sm transition-all peer-focus:text-purple-500"
            >
              Data de Nascimento
            </label>
            <span className="absolute right-4 top-3 text-gray-400">
              &#x1F4C5;
            </span>
          </div>

          <div className="relative">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder=" "
              className="peer w-full px-4 py-3 bg-transparent border-b-2 border-gray-300 focus:outline-none focus:border-purple-500 placeholder-transparent"
              required
            />
            <label
              htmlFor="email"
              className="absolute left-4 -top-3.5 text-gray-300 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-purple-500 peer-focus:text-sm"
            >
              Email
            </label>
            <span className="absolute right-4 top-3 text-gray-400">
              &#x2709;
            </span>
          </div>

          <div className="relative">
            <input
              type="password"
              name="senha"
              value={formData.senha}
              onChange={handleInputChange}
              placeholder=" "
              className="peer w-full px-4 py-3 bg-transparent border-b-2 border-gray-300 focus:outline-none focus:border-purple-500 placeholder-transparent"
              required
            />
            <label
              htmlFor="senha"
              className="absolute left-4 -top-3.5 text-gray-300 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-purple-500 peer-focus:text-sm"
            >
              Senha
            </label>
            <span className="absolute right-4 top-3 text-gray-400">
              &#x1F512;
            </span>
          </div>

          <div className="flex gap-3 mt-8">
            <button
              type="submit"
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition duration-300"
            >
              Registrar
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 rounded-lg transition duration-300"
            >
              Cancelar
            </button>
          </div>
        </form>

        <p className="text-center text-sm mt-6">
          Já tem uma conta?{" "}
          <button
            type="button"
            onClick={onCancel}
            className="text-purple-400 hover:underline focus:outline-none"
          >
            Fazer Login
          </button>
        </p>
      </div>
    </div>
  );
};
