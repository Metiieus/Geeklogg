import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function DebugCheckout() {
  const [logs, setLogs] = useState<string[]>([]);
  const [testing, setTesting] = useState(false);
  const { user } = useAuth();

  const addLog = (message: string) => {
    console.log(message);
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testConnectivity = async () => {
    setTesting(true);
    setLogs([]);
    addLog('🔍 Iniciando testes de conectividade...');

    const urlsToTest = [
      window.location.origin,
      'http://localhost:4242',
      'http://127.0.0.1:4242',
    ];

    for (const url of urlsToTest) {
      try {
        addLog(`📡 Testando: ${url}/health`);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        
        const response = await fetch(`${url}/health`, {
          method: 'GET',
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          const data = await response.text();
          addLog(`✅ ${url} - SUCESSO: ${data}`);
        } else {
          addLog(`❌ ${url} - ERRO: ${response.status} ${response.statusText}`);
        }
      } catch (error) {
        addLog(`❌ ${url} - FALHA: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      }
    }

    // Teste de criação de preferência
    if (user) {
      addLog('🚀 Testando criação de preferência...');
      
      try {
        const response = await fetch(`http://localhost:4242/api/create-preference`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            uid: user.uid,
            email: user.email,
            title: 'Teste',
            price: 1.0
          }),
        });

        if (response.ok) {
          const data = await response.json();
          addLog(`✅ Preferência criada: ${data.init_point ? 'Sucesso' : 'Sem init_point'}`);
        } else {
          const errorText = await response.text();
          addLog(`❌ Erro na preferência: ${response.status} - ${errorText}`);
        }
      } catch (error) {
        addLog(`❌ Falha na preferência: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      }
    } else {
      addLog('⚠️ Usuário não logado - pulando teste de preferência');
    }

    setTesting(false);
    addLog('✅ Testes concluídos!');
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 max-w-2xl mx-auto">
      <h3 className="text-lg font-semibold text-white mb-4">🔧 Debug do Checkout</h3>
      
      <div className="mb-4">
        <button
          onClick={testConnectivity}
          disabled={testing}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          {testing ? 'Testando...' : 'Testar Conectividade'}
        </button>
      </div>

      {logs.length > 0 && (
        <div className="bg-black/30 rounded-lg p-4 border border-slate-600/50">
          <h4 className="text-sm font-medium text-slate-300 mb-2">Logs:</h4>
          <div className="space-y-1 max-h-60 overflow-y-auto">
            {logs.map((log, index) => (
              <div key={index} className="text-xs font-mono text-slate-400">
                {log}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 text-sm text-slate-400">
        <p><strong>URL atual:</strong> {window.location.origin}</p>
        <p><strong>Hostname:</strong> {window.location.hostname}</p>
        <p><strong>Usuário logado:</strong> {user ? '✅ Sim' : '❌ Não'}</p>
      </div>
    </div>
  );
}
