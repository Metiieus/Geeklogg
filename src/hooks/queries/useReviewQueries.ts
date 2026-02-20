import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getReviews, addReview, updateReview, deleteReview } from "../../services/reviewService";
import { Review } from "../../types";

export const useReviews = (userId?: string) => {
    return useQuery({
        queryKey: ["reviews", userId],
        queryFn: () => getReviews(userId),
        staleTime: 1000 * 60 * 5,
    });
};

export const useAddReview = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: addReview,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["reviews"] });
        }
    });
};

export const useUpdateReview = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, updates }: { id: string; updates: Partial<Review> }) => updateReview(id, updates),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["reviews"] });
        }
    });
};

export const useDeleteReview = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteReview,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["reviews"] });
        }
    });
};
