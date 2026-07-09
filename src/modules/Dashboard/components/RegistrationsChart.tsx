import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { format, parseISO } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import {
    AppChartContainer,
    AppChartTooltip,
    AppChartTooltipContent
} from "@/components/custom-ui/chart";
import type { ChartConfig } from "@/components/custom-ui/chart";
import type { IDashboardRegistration } from "@/types/backend";

interface RegistrationsChartProps {
    data?: IDashboardRegistration[];
    isLoading: boolean;
    isError: boolean;
    refetch: () => void;
    granularity: "day" | "month" | "year";
}

const chartConfig = {
    count: {
        label: "Lượt đăng ký",
        color: "var(--color-indigo-600)",
    },
} satisfies ChartConfig;

export function RegistrationsChart({
    data,
    isLoading,
    isError,
    refetch,
    granularity,
}: RegistrationsChartProps) {
    const uniqueId = React.useId();
    const gradientId = `gradient-${uniqueId.replace(/:/g, "")}`;

    const processedData = React.useMemo(() => {
        if (!data) return [];
        return data.map((d) => ({
            ...d,
            count: Number(d.count) || 0,
        }));
    }, [data]);
    // 1. Loading state
    if (isLoading) {
        return (
            <div className="rounded-xl border bg-card text-card-foreground shadow-xs p-6 h-[350px] flex flex-col justify-between">
                <div className="flex justify-between items-center pb-4 border-b">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-8 w-24" />
                </div>
                <div className="flex-1 flex items-end justify-between gap-4 pt-6">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <Skeleton
                            key={i}
                            className="w-full rounded-t-md bg-accent/60"
                            style={{ height: `${((i * 17 + 23) % 60) + 20}%` }}
                        />
                    ))}
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
                        Không thể tải biểu đồ lượt đăng ký
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

    // 3. Empty state
    const hasData = data && data.length > 0;
    if (!hasData) {
        return (
            <div className="rounded-xl border bg-card text-card-foreground shadow-xs p-6 h-[350px] flex flex-col items-center justify-center text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                    Không có dữ liệu trong khoảng thời gian này.
                </p>
            </div>
        );
    }

    // Format X-axis ticks
    const formatXAxis = (tick: string) => {
        try {
            const d = parseISO(tick);
            if (isNaN(d.getTime())) return tick;
            if (granularity === "day") return format(d, "yyyy-MM-dd");
            if (granularity === "month") return format(d, "yyyy-MM");
            if (granularity === "year") return format(d, "yyyy");
            return tick;
        } catch {
            return tick;
        }
    };

    return (
        <div className="rounded-xl border bg-card text-card-foreground shadow-xs p-6 flex flex-col h-[350px]" role="region" aria-label="Biểu đồ lượt đăng ký thành viên">
            <div className="flex-1 w-full min-w-0 h-full">
                <AppChartContainer config={chartConfig} className="w-full h-full min-h-0 min-w-0 aspect-none flex">
                    <AreaChart
                        data={processedData}
                        margin={{
                            top: 10,
                            right: 10,
                            left: -20,
                            bottom: 0,
                        }}
                    >
                        <defs>
                            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-count)" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="var(--color-count)" stopOpacity={0.0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={formatXAxis}
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            allowDecimals={false}
                        />
                        <AppChartTooltip
                            cursor={false}
                            content={
                                <AppChartTooltipContent
                                    labelFormatter={(value) => {
                                        try {
                                            const d = parseISO(value as string);
                                            if (isNaN(d.getTime())) return String(value);
                                            if (granularity === "day") return format(d, "dd/MM/yyyy");
                                            if (granularity === "month") return format(d, "MM/yyyy");
                                            if (granularity === "year") return format(d, "yyyy");
                                            return String(value);
                                        } catch {
                                            return String(value);
                                        }
                                    }}
                                />
                            }
                        />
                        <Area
                            type="monotone"
                            dataKey="count"
                            stroke="var(--color-count)"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill={`url(#${gradientId})`}
                        />
                    </AreaChart>
                </AppChartContainer>
            </div>
        </div>
    );
}
