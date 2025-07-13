import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Register } from './Register';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showRegister, setShowRegister] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      await login(email, password);
    } catch (err: any) {
      console.error('Falha no login:', err);
      // Mensagens amigáveis para erros comuns
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential' || err.code === 'auth/invalid-login-credentials') {
        setError('Opa! Não é essa senha não 🤔');
      } else if (err.code === 'auth/user-not-found') {
        setError('Hmm... esse email não está cadastrado 🤷‍♂️');
      } else if (err.code === 'auth/invalid-email') {
        setError('Esse email não parece válido 📧');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Calma aí! Muitas tentativas. Tenta de novo em alguns minutos ⏰');
      } else {
        setError('Algo deu errado... tenta de novo? 😅');
      }
    }
  };

  if (showRegister) {
    return <Register onCancel={() => setShowRegister(false)} />;
  }

  return (
      <div
        className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('https://storage.googleapis.com/images-etherium/NERD%20LOG.%20(1).png')" }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div> {/* Overlay para escurecer a imagem */}
        <span className="absolute top-2 right-4 text-xs text-white/60 select-none pointer-events-none">
          By: Metieus
        </span>
        <div className="relative z-10 p-8 rounded-xl shadow-lg backdrop-filter backdrop-blur-lg bg-white bg-opacity-10 border border-gray-200 border-opacity-20 text-white w-96">
        <h2 className="text-3xl font-bold text-center mb-6">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="text-red-400 text-center">
              {error}
            </div>
          )}
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder=" "
              className="peer w-full px-4 py-3 bg-transparent border-b-2 border-gray-300 focus:outline-none focus:border-purple-500 placeholder-transparent"
            />
            <label
              htmlFor="email"
              className="absolute left-4 -top-3.5 text-gray-300 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-purple-500 peer-focus:text-sm"
            >
              Email
            </label>
            <span className="absolute right-4 top-3 text-gray-400">&#x1F464;</span> {/* Ícone de pessoa */}
          </div>

          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder=" "
              className="peer w-full px-4 py-3 bg-transparent border-b-2 border-gray-300 focus:outline-none focus:border-purple-500 placeholder-transparent"
            />
            <label
              htmlFor="password"
              className="absolute left-4 -top-3.5 text-gray-300 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-purple-500 peer-focus:text-sm"
            >
              Senha
            </label>
            <span className="absolute right-4 top-3 text-gray-400">&#x1F512;</span> {/* Ícone de cadeado */}
          </div>

          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="form-checkbox text-purple-600 bg-gray-700 border-gray-600 rounded" />
              Lembre-me
            </label>
            <a href="#" className="text-gray-300 hover:text-purple-400">Esqueceu a senha?</a>
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition duration-300"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm mt-6">
          Não tem uma conta?{' '}
          <button type="button" onClick={() => setShowRegister(true)} className="text-purple-400 hover:underline focus:outline-none">
            Cadastre-se
          </button>
        </p>
      </div>
    </div>
  );
};

