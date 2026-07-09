// ** Shadcn ui
import { Separator } from "@/components/ui/separator.tsx";
import { Skeleton } from "@/components/ui/skeleton";

export function UserDetailSkeleton() {
    return (
        <div className="space-y-5 animate-pulse">
            {/* Avatar , cover , name skeleton */}
            <div className="relative h-32 rounded-md bg-accent">
                <div className="flex items-baseline gap-4 absolute -bottom-[16%] left-[5%]">
                    <div className="size-12 rounded-full bg-background p-0.5">
                        <Skeleton className="size-full rounded-full" />
                    </div>
                    <Skeleton className="h-5 w-32" />
                </div>
            </div>

            <Separator className="mt-9" />

            {/* Detail skeleton */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                {Array.from({ length: 8 }).map((_, idx) => (
                    <div key={idx} className="space-y-1.5">
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-4 w-36" />
                    </div>
                ))}
            </div>
        </div>
    );
}
