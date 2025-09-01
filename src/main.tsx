import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Context Providers
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";

// Analytics & Performance
import './styles/performance-optimizations.css';
import './styles/library-animations.css';
import './styles/futuristic-library.css';

console.log('🚀 GeekLog inicializando...');

// Error handling para carregamento inicial
const handleInitError = (error: Error) => {
  console.error('❌ Erro na inicialização:', error);
  
  // Criar uma interface de erro simples se a inicialização falhar
  const fallbackUI = `
    <div style="
      min-height: 100vh; 
      background: #111827; 
      color: white; 
      display: flex; 
      align-items: center; 
      justify-content: center;
      font-family: system-ui, -apple-system, sans-serif;
      padding: 20px;
    ">
      <div style="text-align: center; max-width: 400px;">
        <h1 style="color: #ef4444; margin-bottom: 16px;">Erro de Inicialização</h1>
        <p style="color: #9ca3af; margin-bottom: 20px;">
          Não foi possível carregar o GeekLog. Verifique sua conexão e tente novamente.
        </p>
        <button 
          onclick="window.location.reload()" 
          style="
            background: #3b82f6; 
            color: white; 
            border: none; 
            padding: 12px 24px; 
            border-radius: 8px; 
            cursor: pointer;
            font-size: 16px;
          "
        >
          Recarregar
        </button>
      </div>
    </div>
  `;
  
  document.body.innerHTML = fallbackUI;
};

// Verificar se o root element existe
const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error('❌ Root element não encontrado!');
  handleInitError(new Error('Root element não encontrado'));
} else {
  try {
    console.log('✅ Root element encontrado');
    
    const root = createRoot(rootElement);
    
    root.render(
      <StrictMode>
        <ToastProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </ToastProvider>
      </StrictMode>
    );
    
    console.log('✅ GeekLog renderizado com sucesso!');
    console.log('🎉 Bem-vindo à sua jornada nerd!');
    
    // Log de informações do ambiente
    if (import.meta.env.DEV) {
      console.log('🔧 Modo de desenvolvimento ativo');
      console.log('📊 Informações do ambiente:', {
        node: import.meta.env.NODE_ENV,
        dev: import.meta.env.DEV,
        prod: import.meta.env.PROD,
        base: import.meta.env.BASE_URL,
      });
    }
    
  } catch (error) {
    console.error('❌ Erro ao renderizar a aplicação:', error);
    handleInitError(error as Error);
  }
}

// Global error handler para erros não capturados
window.addEventListener('error', (event) => {
  console.error('❌ Erro global capturado:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('❌ Promise rejeitada não tratada:', event.reason);
});

// Performance monitoring em desenvolvimento
if (import.meta.env.DEV) {
  // Log de performance do carregamento inicial
  window.addEventListener('load', () => {
    const loadTime = performance.now();
    console.log(`⚡ Aplicação carregada em ${loadTime.toFixed(2)}ms`);
  });
  
  // Observer de recursos carregados
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'navigation') {
          console.log('📊 Navegação:', {
            duration: `${entry.duration.toFixed(2)}ms`,
            type: (entry as PerformanceNavigationTiming).type,
          });
        }
      }
    });
    
    try {
      observer.observe({ entryTypes: ['navigation'] });
    } catch (e) {
      console.warn('⚠️ Performance Observer não suportado:', e);
    }
  }
}

// Service Worker registration para PWA (futuro)
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('✅ Service Worker registrado:', registration);
      })
      .catch((error) => {
        console.log('❌ Service Worker falhou:', error);
      });
  });
}
