// ** Shadcn ui
import { DialogFooter } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

export function EmojiCategoryUpdateFormSkeleton() {
    return (
        <div className="space-y-4 animate-pulse">
            {/* Preview skeleton */}
            <div className="flex flex-col items-center gap-3">
                <Skeleton className="size-10 rounded-md" />
            </div>

            {/* Upload skeleton */}
            <div className="border-2 border-dashed border-border/50 rounded-lg p-6 flex flex-col items-center gap-2">
                <Skeleton className="size-8 rounded-md" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-40" />
            </div>

            {/* Input name skeleton */}
            <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-full" />
            </div>

            {/* Actions skeleton */}
            <DialogFooter>
                <Skeleton className="h-10 w-16" />
                <Skeleton className="h-10 w-20" />
            </DialogFooter>
        </div>
    );
}
