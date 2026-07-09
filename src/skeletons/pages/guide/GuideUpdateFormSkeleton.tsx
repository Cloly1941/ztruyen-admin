// ** Shadcn ui
import { DialogFooter } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

export function GuideUpdateFormSkeleton() {
    return (
        <div className="space-y-4 animate-pulse">
            <div className="space-y-2">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-24 w-full" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-24 w-full" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full" />
            </div>
            <DialogFooter>
                <Skeleton className="h-10 w-16" />
                <Skeleton className="h-10 w-24" />
            </DialogFooter>
        </div>
    );
}
