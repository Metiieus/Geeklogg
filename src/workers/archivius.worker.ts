import { archiviusService } from "../services/archiviusService";

export type WorkerMessage = {
  id: string;
  mediaItems: any[];
  reviews: any[];
  settings: any;
  milestones?: any[];
};

self.addEventListener("message", (e: MessageEvent<WorkerMessage>) => {
  const { id, mediaItems, reviews, settings, milestones } = e.data;
  try {
    const context = archiviusService.generateEnhancedContext(
      mediaItems,
      reviews,
      settings,
      milestones || [],
    );

    // Posta resultado de volta
    (self as any).postMessage({ id, context });
  } catch (err) {
    (self as any).postMessage({ id, error: String(err) });
  }
});
