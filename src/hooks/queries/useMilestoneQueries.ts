import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMilestones, addMilestone, updateMilestone, deleteMilestone } from "../../services/milestoneService";
import { Milestone } from "../../types";

export const useMilestones = (userId?: string) => {
    return useQuery({
        queryKey: ["milestones", userId],
        queryFn: () => getMilestones(userId),
        staleTime: 1000 * 60 * 30, // 30 minutes
    });
};

export const useAddMilestone = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: addMilestone,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["milestones"] });
        }
    });
};

export const useUpdateMilestone = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, updates }: { id: string; updates: Partial<Milestone> }) => updateMilestone(id, updates),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["milestones"] });
        }
    });
};

export const useDeleteMilestone = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteMilestone,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["milestones"] });
        }
    });
};
