// ** Shadcn ui
import { Skeleton } from "@/components/ui/skeleton";

export function UpdateFrameFormSkeleton() {
    return (
        <div className="grid grid-cols-3 gap-3 animate-pulse">
            {Array.from({ length: 3 }).map((_, i) => (
                <div
                    key={i}
                    className="flex flex-col items-center gap-1.5 py-4 rounded-lg border-2 border-transparent"
                >
                    <Skeleton className="size-20 rounded-full" />
                    <Skeleton className="h-3 w-16" />
                </div>
            ))}
        </div>
    );
}
