import React, { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

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
  const [error, setError] = useState<string | null>(null);

  const { logout } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("🚀 Tentando registrar novo usuário...");

    try {
      if (!auth || !db) {
        throw new Error(
          "Firebase não foi inicializado. Verifique sua configuração.",
        );
      }

      // Criar o usuário no Firebase Auth
      console.log("🚀 Iniciando cadastro no Firebase Auth...");

      let userCredential;
      // Check if we're using mock auth (demo mode)
      if (typeof auth.createUserWithEmailAndPassword === "function") {
        // Mock auth - use the mock function
        userCredential = await auth.createUserWithEmailAndPassword(
          formData.email,
          formData.senha,
        );
      } else {
        // Real Firebase auth
        userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.senha,
        );
      }
      const user = userCredential.user;
      console.log("✅ Usuário criado com UID:", user.uid);

      // Validar se o usuário realmente está autenticado
      console.log("🛡️ Usuário autenticado:", auth.currentUser);
      if (!auth.currentUser) {
        throw new Error("Usuário não autenticado no momento da gravação.");
      }

      // Preparar os dados
      const userData = {
        uid: user.uid,
        nome: formData.nome,
        apelido: formData.apelido,
        dataNascimento: formData.dataNascimento,
        email: formData.email,
        createdAt: new Date().toISOString(),
      };

      console.log("🛠️ Dados preparados para gravação:", userData);

      // Validar se existem campos inválidos
      if (
        Object.values(userData).some(
          (value) => value === undefined || value === null || value === "",
        )
      ) {
        console.error("🚨 Dados inválidos detectados:", userData);
        setError("Existem campos vazios ou inválidos.");
        return;
      }

      // Gravar os dados no Firestore
      console.log("✍️ Gravando dados no Firestore...");
      await setDoc(doc(db, "users", user.uid), userData);
      console.log("🎉 Dados do usuário salvos com sucesso no Firestore!");

      // Deslogar o usuário após cadastro (opcional)
      await logout();
      console.log("👋 Usuário deslogado após cadastro.");

      onCancel();
    } catch (err: any) {
      console.error("❌ Erro ao registrar usuário:", err);
      // Mensagens amigáveis para erros de registro
      if (err.code === "auth/email-already-in-use") {
        setError("Opa! Esse email já está sendo usado 📧");
      } else if (err.code === "auth/weak-password") {
        setError("Essa senha tá fraquinha... que tal uma mais forte? 💪");
      } else if (err.code === "auth/invalid-email") {
        setError("Esse email não parece válido 📧");
      } else {
        setError("Algo deu errado no cadastro... tenta de novo? 😅");
      }
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
