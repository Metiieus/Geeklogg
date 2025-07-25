import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { database } from '../services/database';

const FirebaseTest: React.FC = () => {
  const { user } = useAuth();
  const [testResult, setTestResult] = useState<string>('Testando...');

  useEffect(() => {
    const testFirebase = async () => {
      try {
        console.log('🔥 Testando Firebase...');
        console.log('User:', user);
        
        if (!user) {
          setTestResult('❌ Usuário não autenticado');
          return;
        }

        // Teste 1: Verificar se consegue acessar o documento do usuário
        console.log('Testando acesso ao documento do usuário...');
        const userDoc = await database.get(['users'], user.uid);
        console.log('Documento do usuário:', userDoc);
        
        if (userDoc.exists()) {
          setTestResult('✅ Firebase funcionando! Documento encontrado.');
          console.log('Dados do usuário:', userDoc.data());
        } else {
          setTestResult('⚠️ Firebase conectado, mas documento do usuário não existe.');
          
          // Teste 2: Tentar criar um documento de teste
          console.log('Criando documento de teste...');
          await database.set(['users'], user.uid, {
            name: 'Teste',
            bio: 'Documento de teste',
            createdAt: new Date().toISOString()
          }, { merge: true });
          
          setTestResult('✅ Firebase funcionando! Documento criado.');
        }
        
      } catch (error: any) {
        console.error('❌ Erro no teste do Firebase:', error);
        setTestResult(`❌ Erro: ${error.message || error.code || 'Erro desconhecido'}`);
      }
    };

    if (user) {
      testFirebase();
    }
  }, [user]);

  if (!user) {
    return <div className="p-4 bg-yellow-100 border border-yellow-400 rounded">
      Usuário não autenticado - Faça login para testar o Firebase
    </div>;
  }

  return (
    <div className="p-4 bg-blue-100 border border-blue-400 rounded">
      <h3 className="font-bold mb-2">🔥 Teste do Firebase</h3>
      <p className="text-sm">{testResult}</p>
      <details className="mt-2">
        <summary className="cursor-pointer text-xs text-gray-600">
          Detalhes técnicos
        </summary>
        <pre className="text-xs bg-gray-100 p-2 mt-1 rounded overflow-auto">
          {JSON.stringify({
            userUid: user?.uid,
            userEmail: user?.email,
          }, null, 2)}
        </pre>
      </details>
    </div>
  );
};

export default FirebaseTest;
