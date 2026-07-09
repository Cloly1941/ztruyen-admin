// ** React
import { useCallback, useEffect, useState } from "react";

// ** Date
import { format, subDays } from "date-fns";
import { vi } from "date-fns/locale";
import type { DateRange } from "react-day-picker";

// ** Icon
import { RotateCcw, CalendarIcon } from "lucide-react";

// ** Library
import { toast } from "react-hot-toast";

// ** Shadcn ui
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// ** Component
import { OverviewCards } from "@/modules/Dashboard/components/OverviewCards";
import { RegistrationsChart } from "@/modules/Dashboard/components/RegistrationsChart";
import { DemographicsChart } from "@/modules/Dashboard/components/DemographicsChart";
import { TopGenresList } from "@/modules/Dashboard/components/TopGenresList";
import { TopComicsList } from "@/modules/Dashboard/components/TopComicsList";

// ** Hook
import useGetMethod from "@/hooks/common/useGetMethod";

// ** Service
import { DashboardService } from "@/services/dashboard";

// ** Config
import { CONFIG_QUERY_KEY } from "@/configs/query-key";

// ** Utils
import { cn } from "@/lib/utils";

const getDefaultRange = () => {
    const to = new Date();
    to.setHours(23, 59, 59, 999);
    const from = subDays(to, 29);
    from.setHours(0, 0, 0, 0);
    return { from, to };
};

const isSameDay = (d1: Date | undefined, d2: Date | undefined) => {
    if (!d1 || !d2) return false;
    return (
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate()
    );
};

export default function DashboardStatistics() {
    // Overview filter state
    const [overviewDateRange, setOverviewDateRange] = useState<{
        from: Date | undefined;
        to: Date | undefined;
    }>(() => getDefaultRange());

    const [overviewOpen, setOverviewOpen] = useState(false);
    const [overviewLocalRange, setOverviewLocalRange] = useState<DateRange | undefined>({
        from: overviewDateRange.from,
        to: overviewDateRange.to,
    });

    const [prevOverviewFrom, setPrevOverviewFrom] = useState<Date | undefined>(overviewDateRange.from);
    const [prevOverviewTo, setPrevOverviewTo] = useState<Date | undefined>(overviewDateRange.to);

    const isOverviewFromChanged = overviewDateRange.from?.getTime() !== prevOverviewFrom?.getTime();
    const isOverviewToChanged = overviewDateRange.to?.getTime() !== prevOverviewTo?.getTime();

    if (isOverviewFromChanged || isOverviewToChanged) {
        setPrevOverviewFrom(overviewDateRange.from);
        setPrevOverviewTo(overviewDateRange.to);
        setOverviewLocalRange({ from: overviewDateRange.from, to: overviewDateRange.to });
    }

    const handleOverviewSelect = (range: DateRange | undefined) => {
        setOverviewLocalRange(range);
        if (range?.from && range?.to) {
            setOverviewDateRange({ from: range.from, to: range.to });
            setOverviewOpen(false);
        }
    };

    const displayOverviewLabel = () => {
        if (overviewDateRange.from && overviewDateRange.to) {
            return `${format(overviewDateRange.from, "dd/MM/yyyy", { locale: vi })} - ${format(overviewDateRange.to, "dd/MM/yyyy", { locale: vi })}`;
        }
        return "Chọn khoảng ngày";
    };

    // Registrations filter state
    const [registrationsDateRange, setRegistrationsDateRange] = useState<{
        from: Date | undefined;
        to: Date | undefined;
    }>(() => getDefaultRange());
    const [registrationsGranularity, setRegistrationsGranularity] = useState<"day" | "month" | "year">("day");

    // Overview Query: dependent on overviewDateRange
    const overviewApi = useCallback(
        (signal?: AbortSignal) =>
            DashboardService.overview(
                {
                    from: overviewDateRange.from?.toISOString(),
                    to: overviewDateRange.to?.toISOString(),
                },
                signal
            ),
        [overviewDateRange.from, overviewDateRange.to]
    );
    const {
        data: overviewData,
        isLoading: isOverviewLoading,
        isError: isOverviewError,
        error: overviewError,
        refetch: refetchOverview,
    } = useGetMethod({
        api: overviewApi,
        key: [
            CONFIG_QUERY_KEY.DASHBOARD.OVERVIEW,
            {
                from: overviewDateRange.from?.toISOString(),
                to: overviewDateRange.to?.toISOString(),
            },
        ],
    });

    useEffect(() => {
        if (isOverviewError && overviewError) {
            toast.error("Không thể tải số liệu tổng quan.");
        }
    }, [isOverviewError, overviewError]);

    // Registrations Query: dependent on registrationsDateRange and registrationsGranularity
    const registrationsApi = useCallback(
        (signal?: AbortSignal) =>
            DashboardService.registrations(
                {
                    from: registrationsDateRange.from?.toISOString(),
                    to: registrationsDateRange.to?.toISOString(),
                    type: registrationsGranularity,
                },
                signal
            ),
        [registrationsDateRange.from, registrationsDateRange.to, registrationsGranularity]
    );
    const {
        data: registrationsData,
        isLoading: isRegistrationsLoading,
        isError: isRegistrationsError,
        error: registrationsError,
        refetch: refetchRegistrations,
    } = useGetMethod({
        api: registrationsApi,
        key: [
            CONFIG_QUERY_KEY.DASHBOARD.REGISTRATIONS,
            {
                from: registrationsDateRange.from?.toISOString(),
                to: registrationsDateRange.to?.toISOString(),
                type: registrationsGranularity,
            },
        ],
    });

    useEffect(() => {
        if (isRegistrationsError && registrationsError) {
            toast.error("Không thể tải số liệu lượt đăng ký.", { id: "registrations-error" });
        }
    }, [isRegistrationsError, registrationsError]);

    // Demographics Query: ignores date range
    const {
        data: demographicsData,
        isLoading: isDemographicsLoading,
        isError: isDemographicsError,
        error: demographicsError,
        refetch: refetchDemographics,
    } = useGetMethod({
        api: (signal) => DashboardService.demographics(signal),
        key: [CONFIG_QUERY_KEY.DASHBOARD.DEMOGRAPHICS],
    });

    useEffect(() => {
        if (isDemographicsError && demographicsError) {
            toast.error("Không thể tải độ tuổi người dùng.", { id: "demographics-error" });
        }
    }, [isDemographicsError, demographicsError]);

    const defaultRange = getDefaultRange();

    const isDefaultOverview =
        isSameDay(overviewDateRange.from, defaultRange.from) &&
        isSameDay(overviewDateRange.to, defaultRange.to);

    const isDefaultRegistrations =
        isSameDay(registrationsDateRange.from, defaultRange.from) &&
        isSameDay(registrationsDateRange.to, defaultRange.to);

    const hasActiveFilters =
        !isDefaultOverview ||
        !isDefaultRegistrations ||
        registrationsGranularity !== "day";

    const handleResetFilters = () => {
        const defaultRangeVal = getDefaultRange();
        setOverviewDateRange(defaultRangeVal);
        setRegistrationsDateRange(defaultRangeVal);
        setRegistrationsGranularity("day");
    };

    const generatedAt = overviewData?.data?.meta?.generated_at;
    let generatedAtStr = "";
    if (generatedAt) {
        const parsedDate = new Date(generatedAt);
        if (!isNaN(parsedDate.getTime())) {
            generatedAtStr = format(parsedDate, "HH:mm:ss dd/MM/yyyy", { locale: vi });
        }
    }

    return (
        <div className="space-y-6 p-0 md:p-2">
            {/* Page Title */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-[28px] font-bold tracking-[-0.02em] text-foreground">
                        Tổng quan thống kê
                    </h1>
                    {generatedAtStr && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Cập nhật lúc: {generatedAtStr}
                        </p>
                    )}
                </div>
                <div className="flex items-center gap-3 self-start sm:self-auto">
                    {/* Overview Date Filter */}
                    <Popover open={overviewOpen} onOpenChange={setOverviewOpen}>
                        <PopoverTrigger asChild>
                            <button
                                id="overview-date-range-picker"
                                type="button"
                                className={cn(
                                    "inline-flex items-center w-full sm:w-[240px] justify-start text-left font-normal border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 rounded-md h-9 px-3 py-2 text-sm transition-all outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] hover:border-primary/50",
                                    !overviewDateRange.from && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 size-4 text-muted-foreground" />
                                <span>{displayOverviewLabel()}</span>
                            </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 border bg-popover" align="end">
                            <Calendar
                                initialFocus
                                mode="range"
                                defaultMonth={overviewLocalRange?.from}
                                selected={overviewLocalRange}
                                onSelect={handleOverviewSelect}
                                numberOfMonths={2}
                                locale={vi}
                                disabled={(date) => {
                                    const today = new Date();
                                    today.setHours(23, 59, 59, 999);
                                    return date > today;
                                }}
                            />
                            {overviewLocalRange?.from && !overviewLocalRange?.to && (
                                <p className="px-4 py-2 text-xs text-muted-foreground text-center border-t">
                                    Chọn ngày kết thúc
                                </p>
                            )}
                        </PopoverContent>
                    </Popover>

                    {hasActiveFilters && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleResetFilters}
                            className="h-9 px-3 gap-2 text-muted-foreground hover:text-foreground animate-in fade-in duration-200"
                        >
                            <RotateCcw className="h-4 w-4" />
                            Đặt lại bộ lọc
                        </Button>
                    )}
                </div>
            </div>

            {/* Overview Cards Grid — 1 col mobile / 2 col tablet / 4 col desktop */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <OverviewCards
                    data={overviewData?.data?.data}
                    isLoading={isOverviewLoading}
                    isError={isOverviewError}
                    refetch={refetchOverview}
                />
            </div>

            {/* Charts Grid — 1 col mobile / 2/3 + 1/3 desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Registrations Chart Section */}
                <div className="lg:col-span-2">
                    <RegistrationsChart
                        data={registrationsData?.data?.data}
                        isLoading={isRegistrationsLoading}
                        isError={isRegistrationsError}
                        refetch={refetchRegistrations}
                        dateRange={registrationsDateRange}
                        granularity={registrationsGranularity}
                        onDateRangeChange={setRegistrationsDateRange}
                        onGranularityChange={setRegistrationsGranularity}
                    />
                </div>

                {/* Demographics Chart Section */}
                <div className="lg:col-span-1">
                    <DemographicsChart
                        data={demographicsData?.data?.data}
                        isLoading={isDemographicsLoading}
                        isError={isDemographicsError}
                        refetch={refetchDemographics}
                    />
                </div>
            </div>

            {/* Lists Grid — 1 col mobile / 50-50 tablet+ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TopGenresList />
                <TopComicsList />
            </div>
        </div>
    );
}
