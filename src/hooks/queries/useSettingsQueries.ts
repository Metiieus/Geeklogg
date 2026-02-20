import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSettings, saveSettings } from "../../services/settingsService";
import { UserSettings } from "../../types";

export const useSettings = (userId?: string) => {
    return useQuery({
        queryKey: ["settings", userId],
        queryFn: () => getSettings(userId || ""), // settingsService requires string
        enabled: !!userId, // Only fetch if userId is available
        staleTime: 1000 * 60 * 30, // 30 minutes
    });
};

export const useUpdateSettings = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ userId, settings }: { userId: string; settings: UserSettings }) => saveSettings(userId, settings),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["settings", variables.userId] });
        }
    });
};
