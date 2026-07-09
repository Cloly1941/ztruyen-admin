// ** Shadcn ui
import { DialogFooter } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

export function EmojiUpdateFormSkeleton() {
    return (
        <div className="space-y-4 animate-pulse">
            {/* Tabs skeleton */}
            <div className="flex border-b border-border">
                <Skeleton className="h-10 w-28 rounded-none border-b-2 border-transparent" />
                <Skeleton className="h-10 w-28 rounded-none border-b-2 border-transparent ml-4" />
            </div>

            {/* Preview skeleton */}
            <div className="flex flex-col items-center gap-3 pt-4">
                <Skeleton className="size-20 rounded-none" />
            </div>

            {/* Upload skeleton */}
            <div className="border-2 border-dashed border-border/50 rounded-lg p-6 flex flex-col items-center gap-2">
                <Skeleton className="size-8 rounded-md" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-40" />
            </div>

            {/* Category Select skeleton */}
            <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-10 w-full" />
            </div>

            {/* Input name skeleton */}
            <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
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
