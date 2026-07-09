import { useState } from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FilterBarProps {
    dateRange: { from: Date | undefined; to: Date | undefined };
    granularity?: "day" | "month" | "year";
    onDateRangeChange: (range: { from: Date | undefined; to: Date | undefined }) => void;
    onGranularityChange?: (granularity: "day" | "month" | "year") => void;
    showGranularity?: boolean;
    title?: string;
}

export function FilterBar({
    dateRange,
    granularity,
    onDateRangeChange,
    onGranularityChange,
    showGranularity = true,
    title,
}: FilterBarProps) {
    const [open, setOpen] = useState(false);
    const [localRange, setLocalRange] = useState<DateRange | undefined>({
        from: dateRange.from,
        to: dateRange.to,
    });

    const [prevFrom, setPrevFrom] = useState<Date | undefined>(dateRange.from);
    const [prevTo, setPrevTo] = useState<Date | undefined>(dateRange.to);

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

    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 rounded-xl border bg-card/50 backdrop-blur-md shadow-xs">
            {title && (
                <div className="flex flex-col gap-0.5">
                    <h3 className="text-base font-semibold tracking-tight text-foreground">
                        {title}
                    </h3>
                </div>
            )}

            <div className={cn(
                "flex flex-col sm:flex-row items-stretch sm:items-center gap-4",
                title ? "md:ml-auto" : "w-full"
            )}>
                <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        Chọn khoảng ngày
                    </span>
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <button
                                id="date-range-picker"
                                type="button"
                                className={cn(
                                    "inline-flex items-center w-full sm:w-[260px] justify-start text-left font-normal border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 rounded-md h-9 px-4 py-2 text-sm transition-all outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] hover:border-primary/50",
                                    !dateRange.from && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 size-4 text-muted-foreground" />
                                <span>{displayLabel()}</span>
                            </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 border bg-popover" align="start">
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
                </div>

                {showGranularity && granularity && onGranularityChange && (
                    <div className="flex flex-col gap-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground sm:text-left">
                            Độ chia thời gian
                        </span>
                        <Tabs
                            value={granularity}
                            onValueChange={(val) =>
                                onGranularityChange(val as "day" | "month" | "year")
                            }
                            className="w-full sm:w-auto"
                        >
                            <TabsList className="grid w-full grid-cols-3 sm:w-[240px] bg-muted/60 p-1 rounded-lg">
                                <TabsTrigger
                                    value="day"
                                    className="rounded-md py-1.5 text-xs font-medium transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-xs"
                                >
                                    Ngày
                                </TabsTrigger>
                                <TabsTrigger
                                    value="month"
                                    className="rounded-md py-1.5 text-xs font-medium transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-xs"
                                >
                                    Tháng
                                </TabsTrigger>
                                <TabsTrigger
                                    value="year"
                                    className="rounded-md py-1.5 text-xs font-medium transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-xs"
                                >
                                    Năm
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                )}
            </div>
        </div>
    );
}
