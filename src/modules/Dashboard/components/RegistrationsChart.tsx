// ** React
import * as React from "react";

// ** Recharts
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

// ** Date
import { format, parseISO } from "date-fns";
import { vi } from "date-fns/locale";
import type { DateRange } from "react-day-picker";

// ** Icon
import { AlertCircle, CalendarIcon } from "lucide-react";

// ** Shadcn ui
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    AppChartContainer,
    AppChartTooltip,
    AppChartTooltipContent
} from "@/components/custom-ui/chart";

// ** Component
import { RegistrationsChartSkeleton } from "@/skeletons/pages/dashboard";

// ** Utils
import { cn } from "@/lib/utils";

// ** Type
import type { ChartConfig } from "@/components/custom-ui/chart";
import type { IDashboardRegistration } from "@/types/backend";

interface RegistrationsChartProps {
    data?: IDashboardRegistration[];
    isLoading: boolean;
    isError: boolean;
    refetch: () => void;
    dateRange: { from: Date | undefined; to: Date | undefined };
    granularity: "day" | "month" | "year";
    onDateRangeChange: (range: { from: Date | undefined; to: Date | undefined }) => void;
    onGranularityChange: (granularity: "day" | "month" | "year") => void;
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
    dateRange,
    granularity,
    onDateRangeChange,
    onGranularityChange,
}: RegistrationsChartProps) {
    const uniqueId = React.useId();
    const gradientId = `gradient-${uniqueId.replace(/:/g, "")}`;

    const [open, setOpen] = React.useState(false);
    const [localRange, setLocalRange] = React.useState<DateRange | undefined>({
        from: dateRange.from,
        to: dateRange.to,
    });

    const [prevFrom, setPrevFrom] = React.useState<Date | undefined>(dateRange.from);
    const [prevTo, setPrevTo] = React.useState<Date | undefined>(dateRange.to);

    const isFromChanged = dateRange.from?.getTime() !== prevFrom?.getTime();
    const isToChanged = dateRange.to?.getTime() !== prevTo?.getTime();

    if (isFromChanged || isToChanged) {
        setPrevFrom(dateRange.from);
        setPrevTo(dateRange.to);
        setLocalRange({ from: dateRange.from, to: dateRange.to });
    }

    const handleSelect = (range: DateRange | undefined) => {
        setLocalRange(range);
        if (range?.from && range?.to) {
            onDateRangeChange({ from: range.from, to: range.to });
            setOpen(false);
        }
    };

    const displayLabel = () => {
        if (dateRange.from && dateRange.to) {
            return `${format(dateRange.from, "dd/MM/yyyy", { locale: vi })} - ${format(dateRange.to, "dd/MM/yyyy", { locale: vi })}`;
        }
        return "30 ngày qua";
    };

    const processedData = React.useMemo(() => {
        if (!data) return [];
        return data.map((d) => ({
            ...d,
            count: Number(d.count) || 0,
        }));
    }, [data]);

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

    const hasData = data && data.length > 0;

    return (
        <div className="rounded-xl border bg-card text-card-foreground shadow-xs p-6 flex flex-col h-[400px]" role="region" aria-label="Biểu đồ lượt đăng ký thành viên">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 mb-4 border-b border-border/50 gap-4">
                <h3 className="text-base font-semibold tracking-tight text-foreground">
                    Lượt đăng ký tài khoản
                </h3>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    {/* Date picker (without text label above) */}
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <button
                                id="date-range-picker"
                                type="button"
                                className={cn(
                                    "inline-flex items-center w-full sm:w-[240px] justify-start text-left font-normal border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 rounded-md h-9 px-3 py-2 text-sm transition-all outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] hover:border-primary/50",
                                    !dateRange.from && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 size-4 text-muted-foreground" />
                                <span>{displayLabel()}</span>
                            </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 border bg-popover" align="end">
                            <Calendar
                                initialFocus
                                mode="range"
                                defaultMonth={localRange?.from}
                                selected={localRange}
                                onSelect={handleSelect}
                                numberOfMonths={2}
                                locale={vi}
                                disabled={(date) => {
                                    const today = new Date();
                                    today.setHours(23, 59, 59, 999);
                                    return date > today;
                                }}
                            />
                            {localRange?.from && !localRange?.to && (
                                <p className="px-4 py-2 text-xs text-muted-foreground text-center border-t">
                                    Chọn ngày kết thúc
                                </p>
                            )}
                        </PopoverContent>
                    </Popover>

                    {/* Granularity Tabs (without text label above) */}
                    <Tabs
                        value={granularity}
                        onValueChange={(val) =>
                            onGranularityChange(val as "day" | "month" | "year")
                        }
                        className="w-full sm:w-auto"
                    >
                        <TabsList className="grid w-full grid-cols-3 sm:w-[200px] bg-muted/60 p-1 rounded-lg">
                            <TabsTrigger
                                value="day"
                                className="rounded-md py-1 text-xs font-medium transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-xs"
                            >
                                Ngày
                            </TabsTrigger>
                            <TabsTrigger
                                value="month"
                                className="rounded-md py-1 text-xs font-medium transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-xs"
                            >
                                Tháng
                            </TabsTrigger>
                            <TabsTrigger
                                value="year"
                                className="rounded-md py-1 text-xs font-medium transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-xs"
                            >
                                Năm
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 w-full min-w-0 h-full min-h-0 relative">
                {isLoading ? (
                    <RegistrationsChartSkeleton />
                ) : isError ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center space-y-3">
                        <div className="p-2.5 bg-destructive/10 rounded-full text-destructive">
                            <AlertCircle className="h-5 w-5" />
                        </div>
                        <div className="space-y-0.5">
                            <h4 className="font-semibold text-foreground text-sm">
                                Không thể tải biểu đồ lượt đăng ký
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
                ) : !hasData ? (
                    <div className="absolute inset-0 flex items-center justify-center text-center">
                        <p className="text-sm text-muted-foreground">
                            Không có dữ liệu trong khoảng thời gian này.
                        </p>
                    </div>
                ) : (
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
                )}
            </div>
        </div>
    );
}

