import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMedias, addMedia, updateMedia, deleteMedia } from "../../services/mediaService";
import { MediaItem } from "../../types";

export const useMedias = (userId?: string) => {
    return useQuery({
        queryKey: ["medias", userId],
        queryFn: () => getMedias(userId),
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

export const useAddMedia = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: addMedia,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["medias"] });
        }
    });
};

export const useUpdateMedia = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, updates }: { id: string; updates: Partial<MediaItem> }) => updateMedia(id, updates),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["medias"] });
        }
    });
};

export const useDeleteMedia = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteMedia,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["medias"] });
        }
    });
};
