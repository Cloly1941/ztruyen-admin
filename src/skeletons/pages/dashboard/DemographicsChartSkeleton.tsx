import { Skeleton } from "@/components/ui/skeleton";

export function DemographicsChartSkeleton() {
    return (
        <div className="absolute inset-0 flex items-center justify-center pt-6">
            <Skeleton className="h-44 w-44 rounded-full animate-pulse" />
        </div>
    );
}
