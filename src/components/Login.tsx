import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Register } from './Register';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showRegister, setShowRegister] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  if (showRegister) {
    return <Register onCancel={() => setShowRegister(false)} />;
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-20 space-y-4 text-white">
      <h2 className="text-2xl text-center font-bold">Login</h2>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Email"
        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none"
      />
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Senha"
        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg focus:outline-none"
      />
      <div className="flex gap-2">
        <button type="submit" className="flex-1 bg-purple-600 px-4 py-2 rounded-lg">Entrar</button>
        <button type="button" onClick={() => setShowRegister(true)} className="flex-1 bg-slate-600 px-4 py-2 rounded-lg">Cadastrar</button>
      </div>
    </form>
  );
};
