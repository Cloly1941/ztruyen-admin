// ** Shadcn ui
import { DialogFooter } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

export function RankingUpdateFormSkeleton() {
    return (
        <div className="space-y-4 animate-pulse">
            <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-10 w-full" />
                </div>
            </div>
            <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-4 w-10" />
                <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-20 w-full" />
            </div>
            <DialogFooter>
                <Skeleton className="h-10 w-16" />
                <Skeleton className="h-10 w-32" />
            </DialogFooter>
        </div>
    );
}
