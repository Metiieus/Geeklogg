import React, { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useAuth } from '../context/AuthContext';

interface RegisterProps {
  onCancel: () => void;
}

export const Register: React.FC<RegisterProps> = ({ onCancel }) => {
  const [formData, setFormData] = useState({
    nome: '',
    apelido: '',
    dataNascimento: '',
    email: '',
    senha: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const { register, logout } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(formData.email, formData.senha);

      const uid = auth.currentUser?.uid;
      if (uid) {
        const settings = {
          name: formData.apelido,
          theme: 'dark',
          defaultLibrarySort: 'updatedAt'
        };
        await setDoc(doc(db, 'users', uid, 'data', 'settings'), {
          value: settings
        });
        window.localStorage.setItem('nerdlog-settings', JSON.stringify(settings));
      }

      await logout();
      onCancel();
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('https://storage.googleapis.com/images-etherium/geek%20log.png')" }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div> {/* Overlay para escurecer a imagem */}
      <div className="relative z-10 p-8 rounded-xl shadow-lg backdrop-filter backdrop-blur-lg bg-white bg-opacity-10 border border-gray-200 border-opacity-20 text-white w-96 max-h-[90vh] overflow-y-auto">
        <h2 className="text-3xl font-bold text-center mb-6">Registro</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
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
            <span className="absolute right-4 top-3 text-gray-400">&#x1F464;</span> {/* Ícone de pessoa */}
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
            <span className="absolute right-4 top-3 text-gray-400">&#x1F3AD;</span> {/* Ícone de máscara */}
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
            <span className="absolute right-4 top-3 text-gray-400">&#x1F4C5;</span> {/* Ícone de calendário */}
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
            <span className="absolute right-4 top-3 text-gray-400">&#x2709;</span> {/* Ícone de email */}
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
            <span className="absolute right-4 top-3 text-gray-400">&#x1F512;</span> {/* Ícone de cadeado */}
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
          Já tem uma conta?{' '}
          <button type="button" onClick={onCancel} className="text-purple-400 hover:underline focus:outline-none">
            Fazer Login
          </button>
        </p>
      </div>
    </div>
  );
};

