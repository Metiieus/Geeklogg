import React from "react";

export const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
    <div className={`animate-pulse bg-slate-700/50 rounded ${className}`} />
);

export const LibrarySkeleton: React.FC = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {[...Array(10)].map((_, i) => (
            <div key={i} className="space-y-3">
                <Skeleton className="w-full aspect-[2/3] rounded-xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
            </div>
        ))}
    </div>
);

export const ReviewSkeleton: React.FC = () => (
    <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
            <div key={i} className="p-4 border border-white/10 rounded-xl space-y-3">
                <div className="flex gap-4">
                    <Skeleton className="w-12 h-16 rounded-lg" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-1/3" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                    </div>
                </div>
            </div>
        ))}
    </div>
);

export const ProfileSkeleton: React.FC = () => (
    <div className="space-y-6">
        <div className="h-40 rounded-2xl bg-slate-800/50 animate-pulse relative">
            <div className="absolute -bottom-12 left-6">
                <Skeleton className="w-24 h-24 rounded-full border-4 border-slate-900" />
            </div>
        </div>
        <div className="pt-14 space-y-4 px-4">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4">
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
        </div>
    </div>
);
