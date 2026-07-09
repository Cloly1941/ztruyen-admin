import { useCallback, useState } from "react";
import { FilterBar } from "@/modules/Dashboard/components/FilterBar";
import useGetMethod from "@/hooks/common/useGetMethod";
import { DashboardService } from "@/services/dashboard";
import { CONFIG_QUERY_KEY } from "@/configs/query-key";

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
    const { data: overviewData } = useGetMethod({
        api: overviewApi,
        key: [
            CONFIG_QUERY_KEY.DASHBOARD.OVERVIEW,
            {
                from: overviewDateRange.from?.toISOString(),
                to: overviewDateRange.to?.toISOString(),
            },
        ],
    });

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
    const { data: registrationsData } = useGetMethod({
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
    const { data: demographicsData } = useGetMethod({
        api: (signal) => DashboardService.demographics(signal),
        key: [CONFIG_QUERY_KEY.DASHBOARD.DEMOGRAPHICS],
    });

    // Top Genres Query: ignores date range
    const { data: topGenresData } = useGetMethod({
        api: (signal) => DashboardService.topGenres({ limit }, signal),
        key: [CONFIG_QUERY_KEY.DASHBOARD.TOP_GENRES, { limit }],
    });

    // Top Comics Query: ignores date range
    const { data: topComicsData } = useGetMethod({
        api: (signal) => DashboardService.topComics({ limit }, signal),
        key: [CONFIG_QUERY_KEY.DASHBOARD.TOP_COMICS, { limit }],
    });

    return (
        <div className="space-y-6 p-0 md:p-2">
            {/* Page Title */}
            <div>
                <h1 className="text-[28px] font-bold tracking-[-0.02em] text-foreground">
                    Tổng quan thống kê
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                    Xem báo cáo hoạt động và thống kê hệ thống của ZTruyện
                </p>
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
                {/* Slots for overview stat cards (Epic 2) */}
                {Array.from({ length: 4 }).map((_, i) => (
                    <div
                        key={i}
                        className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 min-h-[120px] flex items-center justify-center text-muted-foreground text-sm"
                    >
                        Card {i + 1}
                    </div>
                ))}
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
