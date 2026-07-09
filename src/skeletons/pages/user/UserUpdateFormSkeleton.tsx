// ** Shadcn ui
import { DialogFooter } from "@/components/ui/dialog.tsx";
import { Skeleton } from "@/components/ui/skeleton";

export function UserUpdateFormSkeleton() {
    return (
        <div className="space-y-4 animate-pulse">
            <div className="space-y-2">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
            </div>
            <DialogFooter className="pt-4">
                <Skeleton className="h-10 w-16" />
                <Skeleton className="h-10 w-28" />
            </DialogFooter>
        </div>
    );
}
