import { Skeleton } from "@/components/ui/skeleton";

export function RegistrationsChartSkeleton() {
    return (
        <div className="absolute inset-0 flex items-end justify-between gap-4 pt-4">
            {Array.from({ length: 12 }).map((_, i) => (
                <Skeleton
                    key={i}
                    className="w-full rounded-t-md bg-accent/60"
                    style={{ height: `${((i * 17 + 23) % 60) + 20}%` }}
                />
            ))}
        </div>
    );
}
