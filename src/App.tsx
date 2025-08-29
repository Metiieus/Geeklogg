import React from 'react';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center">GeekLog está funcionando! 🎉</h1>
        
        <div className="bg-slate-800 rounded-xl p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Status do Sistema</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-600/20 border border-green-500/50 rounded-lg p-4">
              <h3 className="font-semibold text-green-400 mb-2">✅ React</h3>
              <p className="text-sm text-green-300">Funcionando perfeitamente</p>
            </div>
            <div className="bg-green-600/20 border border-green-500/50 rounded-lg p-4">
              <h3 className="font-semibold text-green-400 mb-2">✅ Vite</h3>
              <p className="text-sm text-green-300">Build system ativo</p>
            </div>
            <div className="bg-green-600/20 border border-green-500/50 rounded-lg p-4">
              <h3 className="font-semibold text-green-400 mb-2">✅ Tailwind CSS</h3>
              <p className="text-sm text-green-300">Estilos carregados</p>
            </div>
            <div className="bg-green-600/20 border border-green-500/50 rounded-lg p-4">
              <h3 className="font-semibold text-green-400 mb-2">✅ TypeScript</h3>
              <p className="text-sm text-green-300">Tipagem ativa</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Próximos Passos</h2>
          <ul className="space-y-2 text-slate-300">
            <li>• Integrar sistema de autenticação Firebase</li>
            <li>• Implementar navegação entre páginas</li>
            <li>• Adicionar componentes da biblioteca</li>
            <li>• Configurar banco de dados</li>
            <li>• Adicionar sistema de resenhas</li>
          </ul>
        </div>

        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-purple-600 px-6 py-3 rounded-lg">
            <span className="text-white font-semibold">Sistema Base Funcionando</span>
            <span className="text-2xl">🚀</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
