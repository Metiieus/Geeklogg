import { useEffect, useRef } from "react";

export function useArchiviusWorker() {
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    // cria worker como módulo (vite-friendly)
    workerRef.current = new Worker(new URL("../workers/archivius.worker.ts", import.meta.url), { type: "module" });

    return () => {
      workerRef.current?.terminate();
      workerRef.current = null;
    };
  }, []);

  const analyze = (mediaItems: any[], reviews: any[], settings: any, milestones?: any[]) => {
    return new Promise((resolve, reject) => {
      if (!workerRef.current) {
        reject(new Error("Worker não inicializado"));
        return;
      }

      const id = Math.random().toString(36).slice(2);

      const handler = (e: MessageEvent) => {
        const data = (e.data as any) || {};
        if (data.id !== id) return;
        workerRef.current?.removeEventListener("message", handler as any);
        if (data.error) reject(new Error(data.error));
        else resolve(data.context);
      };

      workerRef.current.addEventListener("message", handler as any);
      workerRef.current.postMessage({ id, mediaItems, reviews, settings, milestones });
    });
  };

  return { analyze };
}
