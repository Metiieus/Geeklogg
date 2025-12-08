import { z } from "zod";

const MEDIA_TYPES = ["game", "movie", "tv", "book", "anime", "manga"] as const;
const STATUS_TYPES = ["completed", "in-progress", "dropped", "planned"] as const;

export const mediaSchema = z.object({
    title: z.string().min(1, "O título é obrigatório"),
    type: z.enum(MEDIA_TYPES),
    status: z.enum(STATUS_TYPES),
    rating: z.coerce.number().min(0).max(5).optional(), // Coerce handles string input from forms
    hoursSpent: z.coerce.number().min(0).optional(),
    totalPages: z.coerce.number().min(1).optional(),
    currentPage: z.coerce.number().min(0).optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    notes: z.string().optional(),
    tags: z.array(z.string()).optional(), // Handled specially in UI usually
    platform: z.string().optional(),
    review: z.string().optional(),
    externalLink: z.string().optional(),
    description: z.string().optional(),
});

export type MediaFormData = z.infer<typeof mediaSchema>;
