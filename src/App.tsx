import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { LandingPage } from './components/LandingPage';
import { Login } from './components/Login';
import { Register } from './components/Register';

const App: React.FC = () => {
  const { user, loading } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [debugInfo, setDebugInfo] = useState('Iniciando...');

  useEffect(() => {
    console.log('App montado - Auth State:', { user, loading });
    setDebugInfo(`Loading: ${loading}, User: ${user ? 'Logado' : 'Não logado'}`);
  }, [user, loading]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Debug info */}
      <div className="fixed top-4 left-4 bg-black/50 text-xs p-2 rounded z-50">
        {debugInfo}
      </div>

      {loading ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white text-lg">Carregando GeekLog...</p>
            <p className="text-slate-400 text-sm mt-2">Verificando autenticação...</p>
          </div>
        </div>
      ) : showLogin ? (
        <Login 
          onCancel={() => setShowLogin(false)}
          onRegister={() => {
            setShowLogin(false);
            setShowRegister(true);
          }}
        />
      ) : showRegister ? (
        <Register 
          onCancel={() => setShowRegister(false)}
          onLogin={() => {
            setShowRegister(false);
            setShowLogin(true);
          }}
        />
      ) : user ? (
        <div className="min-h-screen p-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Bem-vindo ao GeekLog!</h1>
            <div className="bg-slate-800 rounded-xl p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Dashboard</h2>
              <p className="text-slate-300 mb-4">
                Olá, {user.email}! Seu GeekLog está funcionando perfeitamente.
              </p>
              <button 
                onClick={() => {
                  const auth = useAuth();
                  auth.logout();
                }}
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
      ) : (
        <LandingPage
          onLogin={() => setShowLogin(true)}
          onRegister={() => setShowRegister(true)}
        />
      )}
    </div>
  );
};

export default App;
