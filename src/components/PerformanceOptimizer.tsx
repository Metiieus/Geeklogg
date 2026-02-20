import React, { useEffect } from "react";
import { logger } from '../utils/logger';

/**
 * Componente para aplicar otimizações globais de performance
 * Deve ser montado uma vez na aplicação
 */
const PerformanceOptimizer: React.FC = () => {
  useEffect(() => {
    // 1. Preconnect para recursos externos críticos
    const preconnectDomains = [
      "https://fonts.googleapis.com",
      "https://fonts.gstatic.com",
    ];

    preconnectDomains.forEach((domain) => {
      const link = document.createElement("link");
      link.rel = "preconnect";
      link.href = domain;
      link.crossOrigin = "anonymous";
      document.head.appendChild(link);
    });

    // 2. Prefetch de recursos que podem ser usados em breve (desativado para evitar chamadas a backend inexistente em dev)
    const prefetchResources: string[] = [];

    prefetchResources.forEach((resource) => {
      const link = document.createElement("link");
      link.rel = "prefetch";
      link.href = resource;
      document.head.appendChild(link);
    });

    // 3. Otimizar viewport para dispositivos móveis
    const viewportMeta = document.querySelector(
      'meta[name="viewport"]',
    ) as HTMLMetaElement;
    if (viewportMeta) {
      viewportMeta.content =
        "width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover";
    }

    // 4. Configurar service worker se disponível
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          logger.log("🔧 Service Worker registrado:", registration.scope);
        })
        .catch((error) => {
          logger.log("❌ Falha ao registrar Service Worker:", error);
        });
    }

    // 5. Configurar intersection observer para lazy loading global
    if ("IntersectionObserver" in window) {
      const lazyElements = document.querySelectorAll(".lazy-load");
      const imageObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const element = entry.target as HTMLElement;
              element.classList.add("loaded");
              imageObserver.unobserve(element);
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: "50px",
        },
      );

      lazyElements.forEach((el) => imageObserver.observe(el));
    }

    // 6. Configurar hints de performance para navegadores modernos
    if ("connection" in navigator) {
      const connection = (navigator as any).connection;
      if (connection) {
        // Adaptar qualidade baseado na conexão
        document.body.setAttribute(
          "data-connection",
          connection.effectiveType || "unknown",
        );

        if (connection.saveData) {
          document.body.classList.add("save-data");
        }
      }
    }

    // 7. Configurar reduce motion se preferido pelo usuário
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.body.classList.add("reduce-motion");
    }

    // 8. Configurar dark mode baseado na preferência do sistema
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.body.classList.add("system-dark");
    }

    // 9. Memory cleanup ao desmontar
    return () => {
      // Cleanup de observers se necessário
      const observers = (window as any)._performanceObservers || [];
      observers.forEach((observer: any) => observer.disconnect());
    };
  }, []);

  // 10. Performance monitor (desenvolvimento)
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.duration > 100) {
            // Log apenas operações lentas
            logger.warn(
              `⚠️ Performance: ${entry.name} demorou ${entry.duration}ms`,
            );
          }
        });
      });

      observer.observe({ entryTypes: ["measure", "navigation"] });

      // Armazenar para cleanup
      (window as any)._performanceObservers =
        (window as any)._performanceObservers || [];
      (window as any)._performanceObservers.push(observer);
    }
  }, []);

  return null; // Este componente não renderiza nada
};

export default PerformanceOptimizer;
