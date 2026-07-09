// ** React
import * as React from "react";

// ** Recharts
import { PieChart, Pie, Cell } from "recharts";

// ** Icon
import { AlertCircle } from "lucide-react";

// ** Shadcn ui
import { Button } from "@/components/ui/button";
import {
    AppChartContainer,
    AppChartTooltip,
    AppChartTooltipContent
} from "@/components/custom-ui/chart";

// ** Component
import { DemographicsChartSkeleton } from "@/skeletons/pages/dashboard";

// ** Type
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
    // Process demographic data to ensure all 6 age groups are present in strict order
    const processedData = React.useMemo(() => {
        return orderedRanges.map((range) => {
            const found = data?.find((d) => d.group === range);
            const count = found ? Number(found.count) || 0 : 0;
            return {
                name: range,
                count: count > 0 ? count : 0,
            };
        });
    }, [data]);

    const totalCount = React.useMemo(() => {
        return processedData.reduce((acc, curr) => acc + curr.count, 0);
    }, [processedData]);

    return (
        <div className="rounded-xl border bg-card text-card-foreground shadow-xs p-6 flex flex-col h-[400px]" role="region" aria-label="Biểu đồ độ tuổi người dùng">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 mb-4 border-b border-border/50 gap-4 shrink-0">
                <h3 className="text-base font-semibold tracking-tight text-foreground">
                    Độ tuổi người dùng
                </h3>
            </div>

            {/* Content Area */}
            <div className="flex-1 w-full min-w-0 h-full min-h-0 relative flex flex-col justify-between">
                {isLoading ? (
                    <DemographicsChartSkeleton />
                ) : isError ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center space-y-3">
                        <div className="p-2.5 bg-destructive/10 rounded-full text-destructive">
                            <AlertCircle className="h-5 w-5" />
                        </div>
                        <div className="space-y-0.5">
                            <h4 className="font-semibold text-foreground text-sm">
                                Không thể tải biểu đồ độ tuổi người dùng
                            </h4>
                            <p className="text-xs text-muted-foreground">
                                Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại.
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => refetch()}
                            className="h-8 px-3 text-xs border-destructive/20 hover:bg-destructive/10 hover:text-destructive"
                        >
                            Thử lại
                        </Button>
                    </div>
                ) : totalCount === 0 ? (
                    <div className="absolute inset-0 flex items-center justify-center text-center">
                        <p className="text-sm text-muted-foreground">
                            Không có dữ liệu trong khoảng thời gian này.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="flex-1 w-full min-w-0 h-full min-h-0 flex justify-center items-center">
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
                                        innerRadius={55}
                                        outerRadius={75}
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
                        <div className="grid grid-cols-2 gap-2 mt-4 text-xs shrink-0">
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
                    </>
                )}
            </div>
        </div>
    );
}

