import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { LandingPage } from './components/LandingPage';
import { Login } from './components/Login';
import { Register } from './components/Register';

// Minimal App to test basic functionality
const App: React.FC = () => {
  const { user, loading } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Carregando GeekLog...</p>
        </div>
      </div>
    );
  }

  // Show login modal
  if (showLogin) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Login 
          onCancel={() => setShowLogin(false)}
          onRegister={() => {
            setShowLogin(false);
            setShowRegister(true);
          }}
        />
      </div>
    );
  }

  // Show register modal
  if (showRegister) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Register 
          onCancel={() => setShowRegister(false)}
          onLogin={() => {
            setShowRegister(false);
            setShowLogin(true);
          }}
        />
      </div>
    );
  }

  // User is authenticated - show simple dashboard
  if (user) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Bem-vindo ao GeekLog!</h1>
          <div className="bg-slate-800 rounded-xl p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Dashboard</h2>
            <p className="text-slate-300 mb-4">
              Olá, {user.email}! Seu GeekLog está funcionando perfeitamente.
            </p>
            <button 
              onClick={() => useAuth().logout()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Sair
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-800 rounded-xl p-4">
              <h3 className="font-semibold mb-2">Biblioteca</h3>
              <p className="text-slate-400 text-sm">0 itens</p>
            </div>
            <div className="bg-slate-800 rounded-xl p-4">
              <h3 className="font-semibold mb-2">Resenhas</h3>
              <p className="text-slate-400 text-sm">0 resenhas</p>
            </div>
            <div className="bg-slate-800 rounded-xl p-4">
              <h3 className="font-semibold mb-2">Marcos</h3>
              <p className="text-slate-400 text-sm">0 marcos</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // User is not authenticated - show landing page
  return (
    <LandingPage
      onLogin={() => setShowLogin(true)}
      onRegister={() => setShowRegister(true)}
    />
  );
};

export default App;
