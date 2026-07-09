import { Skeleton } from "@/components/ui/skeleton";

interface TopListSkeletonProps {
    limit?: number;
}

export function TopListSkeleton({ limit = 10 }: TopListSkeletonProps) {
    return (
        <div className="space-y-4">
            {Array.from({ length: limit }).map((_, i) => (
                <div
                    key={i}
                    className="flex items-center justify-between py-3 border-b last:border-0 border-border/50 animate-pulse"
                >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                        <Skeleton className="h-6 w-6 rounded-full shrink-0" />
                        <Skeleton className="h-4 w-32 sm:w-48 max-w-full" />
                    </div>
                    <Skeleton className="h-4 w-12 shrink-0 ml-2" />
                </div>
            ))}
        </div>
    );
}
