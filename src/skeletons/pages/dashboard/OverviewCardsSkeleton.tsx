import { Skeleton } from "@/components/ui/skeleton";

export function OverviewCardsSkeleton() {
    return (
        <>
            {Array.from({ length: 4 }).map((_, i) => (
                <div
                    key={i}
                    className="rounded-xl border bg-card text-card-foreground shadow-xs p-6 flex flex-col justify-between h-[120px] animate-pulse"
                >
                    <div className="flex justify-between items-start">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-8 w-8 rounded-lg" />
                    </div>
                    <Skeleton className="h-8 w-20 mt-2" />
                </div>
            ))}
        </>
    );
}
