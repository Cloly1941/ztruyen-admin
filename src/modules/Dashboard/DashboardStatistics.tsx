import { useCallback, useEffect, useState } from "react";
import { FilterBar } from "@/modules/Dashboard/components/FilterBar";
import { OverviewCards } from "@/modules/Dashboard/components/OverviewCards";
import useGetMethod from "@/hooks/common/useGetMethod";
import { DashboardService } from "@/services/dashboard";
import { CONFIG_QUERY_KEY } from "@/configs/query-key";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { toast } from "react-hot-toast";

export default function DashboardStatistics() {
    // Overview filter state
    const [overviewDateRange, setOverviewDateRange] = useState<{
        from: Date | undefined;
        to: Date | undefined;
    }>({
        from: undefined,
        to: undefined,
    });

    // Registrations filter state
    const [registrationsDateRange, setRegistrationsDateRange] = useState<{
        from: Date | undefined;
        to: Date | undefined;
    }>({
        from: undefined,
        to: undefined,
    });
    const [registrationsGranularity, setRegistrationsGranularity] = useState<"day" | "month" | "year">("day");

    const limit = 10;

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
    useGetMethod({
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

    // Demographics Query: ignores date range
    useGetMethod({
        api: (signal) => DashboardService.demographics(signal),
        key: [CONFIG_QUERY_KEY.DASHBOARD.DEMOGRAPHICS],
    });

    // Top Genres Query: ignores date range
    useGetMethod({
        api: (signal) => DashboardService.topGenres({ limit }, signal),
        key: [CONFIG_QUERY_KEY.DASHBOARD.TOP_GENRES, { limit }],
    });

    // Top Comics Query: ignores date range
    useGetMethod({
        api: (signal) => DashboardService.topComics({ limit }, signal),
        key: [CONFIG_QUERY_KEY.DASHBOARD.TOP_COMICS, { limit }],
    });

    const hasActiveFilters =
        overviewDateRange.from !== undefined ||
        overviewDateRange.to !== undefined ||
        registrationsDateRange.from !== undefined ||
        registrationsDateRange.to !== undefined ||
        registrationsGranularity !== "day";

    const handleResetFilters = () => {
        setOverviewDateRange({ from: undefined, to: undefined });
        setRegistrationsDateRange({ from: undefined, to: undefined });
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
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-1">
                        <p className="text-muted-foreground text-sm">
                            Xem báo cáo hoạt động và thống kê hệ thống của ZTruyện
                        </p>
                        {generatedAtStr && (
                            <>
                                <span className="hidden sm:inline text-muted-foreground/40 text-xs">•</span>
                                <p className="text-muted-foreground text-xs">
                                    Số liệu tính đến: {generatedAtStr}
                                </p>
                            </>
                        )}
                    </div>
                </div>
                {hasActiveFilters && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleResetFilters}
                        className="h-9 px-3 gap-2 text-muted-foreground hover:text-foreground self-start sm:self-auto animate-in fade-in duration-200"
                    >
                        <RotateCcw className="h-4 w-4" />
                        Đặt lại bộ lọc
                    </Button>
                )}
            </div>

            {/* Overview Filter Bar */}
            <FilterBar
                title="Số liệu tổng quan"
                showGranularity={false}
                dateRange={overviewDateRange}
                onDateRangeChange={setOverviewDateRange}
            />

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
                <div className="lg:col-span-2 space-y-4">
                    <FilterBar
                        title="Lượt đăng ký thành viên"
                        showGranularity={true}
                        dateRange={registrationsDateRange}
                        granularity={registrationsGranularity}
                        onDateRangeChange={setRegistrationsDateRange}
                        onGranularityChange={setRegistrationsGranularity}
                    />
                    <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 min-h-[350px] flex items-center justify-center text-muted-foreground text-sm">
                        Biểu đồ chính (Epic 3)
                    </div>
                </div>

                {/* Demographics Chart Section */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="flex items-center h-[68px] px-4 rounded-xl border bg-card/50 backdrop-blur-md shadow-xs">
                        <h3 className="text-base font-semibold tracking-tight text-foreground">
                            Cơ cấu độc giả
                        </h3>
                    </div>
                    <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 min-h-[350px] flex items-center justify-center text-muted-foreground text-sm">
                        Biểu đồ phụ (Epic 3)
                    </div>
                </div>
            </div>

            {/* Lists Grid — 1 col mobile / 50-50 tablet+ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 min-h-[300px] flex items-center justify-center text-muted-foreground text-sm">
                    Danh sách 1 (Epic 4)
                </div>
                <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 min-h-[300px] flex items-center justify-center text-muted-foreground text-sm">
                    Danh sách 2 (Epic 4)
                </div>
            </div>
        </div>
    );
}
