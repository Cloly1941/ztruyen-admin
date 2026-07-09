import { PieChart, Pie, Cell } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import {
    AppChartContainer,
    AppChartTooltip,
    AppChartTooltipContent
} from "@/components/custom-ui/chart";
import type { ChartConfig } from "@/components/custom-ui/chart";
import type { IDashboardDemographic } from "@/types/backend";

interface DemographicsChartProps {
    data?: IDashboardDemographic[];
    isLoading: boolean;
    isError: boolean;
    refetch: () => void;
}

const chartConfig = {
    count: {
        label: "Số lượng",
    },
    "<18": { label: "Dưới 18 tuổi", color: "var(--chart-1)" },
    "18-25": { label: "18 - 25 tuổi", color: "var(--chart-2)" },
    "26-35": { label: "26 - 35 tuổi", color: "var(--chart-3)" },
    "36-45": { label: "36 - 45 tuổi", color: "var(--chart-4)" },
    ">45": { label: "Trên 45 tuổi", color: "var(--chart-5)" },
    "Unknown": { label: "Không xác định", color: "var(--color-muted-foreground)" },
} satisfies ChartConfig;

const orderedRanges = ["<18", "18-25", "26-35", "36-45", ">45", "Unknown"];

export function DemographicsChart({ data, isLoading, isError, refetch }: DemographicsChartProps) {
    // 1. Loading state
    if (isLoading) {
        return (
            <div className="rounded-xl border bg-card text-card-foreground shadow-xs p-6 h-[350px] flex flex-col justify-between">
                <div className="pb-4 border-b">
                    <Skeleton className="h-5 w-40" />
                </div>
                <div className="flex-1 flex items-center justify-center pt-6">
                    <Skeleton className="h-44 w-44 rounded-full" />
                </div>
            </div>
        );
    }

    // 2. Error state
    if (isError) {
        return (
            <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-6 h-[350px] flex flex-col items-center justify-center text-center space-y-4 shadow-sm animate-in fade-in duration-200">
                <div className="p-3 bg-destructive/10 rounded-full text-destructive">
                    <AlertCircle className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                    <h4 className="font-semibold text-foreground text-base">
                        Không thể tải biểu đồ cơ cấu độc giả
                    </h4>
                    <p className="text-sm text-muted-foreground max-w-md">
                        Đã xảy ra lỗi khi tải dữ liệu biểu đồ. Vui lòng thử lại.
                    </p>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => refetch()}
                    className="h-9 px-4 font-medium text-sm border-destructive/20 hover:bg-destructive/10 hover:text-destructive"
                >
                    Thử lại
                </Button>
            </div>
        );
    }

    // Process demographic data to ensure all 6 age groups are present in strict order
    const processedData = orderedRanges.map((range) => {
        const found = data?.find((d) => d.range === range);
        const count = found ? Number(found.count) || 0 : 0;
        return {
            name: range,
            count: count > 0 ? count : 0,
        };
    });

    const totalCount = processedData.reduce((acc, curr) => acc + curr.count, 0);

    // 3. Empty state - when API returns zero records or all counts are 0
    if (totalCount === 0) {
        return (
            <div className="rounded-xl border bg-card text-card-foreground shadow-xs p-6 h-[350px] flex flex-col items-center justify-center text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                    Không có dữ liệu trong khoảng thời gian này.
                </p>
            </div>
        );
    }

    return (
        <div className="rounded-xl border bg-card text-card-foreground shadow-xs p-6 flex flex-col h-[350px]" role="region" aria-label="Biểu đồ cơ cấu độc giả">
            <div className="flex-1 w-full min-w-0 h-full">
                <AppChartContainer config={chartConfig} className="w-full h-full min-h-0 min-w-0 aspect-none flex justify-center items-center">
                    <PieChart>
                        <AppChartTooltip
                            cursor={false}
                            content={
                                <AppChartTooltipContent
                                    nameKey="name"
                                    formatter={(value, name) => {
                                        const configItem = chartConfig[name as keyof typeof chartConfig];
                                        const label = configItem?.label || name;
                                        return (
                                            <div className="flex items-center gap-1">
                                                <span className="text-muted-foreground">{label}:</span>
                                                <span className="font-mono font-medium text-foreground">{Number(value).toLocaleString("vi-VN")}</span>
                                            </div>
                                        );
                                    }}
                                />
                            }
                        />
                        <Pie
                            data={processedData}
                            dataKey="count"
                            nameKey="name"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={2}
                        >
                            {processedData.map((entry, index) => {
                                const rangeKey = entry.name as keyof typeof chartConfig;
                                const configItem = chartConfig[rangeKey] as { label: string; color?: string } | undefined;
                                const color = configItem?.color || "var(--color-muted-foreground)";
                                return (
                                    <Cell key={`cell-${index}`} fill={color} />
                                );
                            })}
                        </Pie>
                    </PieChart>
                </AppChartContainer>
            </div>
            {/* Legend for 6 age groups */}
            <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
                {processedData.map((entry) => {
                    const rangeKey = entry.name as keyof typeof chartConfig;
                    const configItem = chartConfig[rangeKey] as { label: string; color?: string } | undefined;
                    const percentage = (typeof totalCount === "number" && totalCount > 0 && !isNaN(totalCount))
                        ? ((Number(entry.count) || 0) / totalCount * 100).toFixed(1)
                        : "0.0";
                    return (
                        <div key={entry.name} className="flex items-center gap-1.5 min-w-0">
                            <span
                                className="h-2.5 w-2.5 shrink-0 rounded-full"
                                style={{ backgroundColor: configItem?.color || "var(--color-muted-foreground)" }}
                            />
                            <span className="text-muted-foreground truncate">{configItem?.label || entry.name}</span>
                            <span className="font-mono font-medium ml-auto text-foreground shrink-0">{percentage}%</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
