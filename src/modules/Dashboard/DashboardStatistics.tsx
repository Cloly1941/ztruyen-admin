export default function DashboardStatistics() {
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

            {/* Overview Cards Grid — 1 col mobile / 2 col tablet / 4 col desktop */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Slots for overview stat cards (Epic 2) */}
                {Array.from({length: 4}).map((_, i) => (
                    <div
                        key={i}
                        className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 min-h-[120px] flex items-center justify-center text-muted-foreground text-sm"
                    >
                        Card {i + 1}
                    </div>
                ))}
            </div>

            {/* Charts Grid — 1 col mobile / 2/3 + 1/3 desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 rounded-xl border bg-card text-card-foreground shadow-sm p-6 min-h-[350px] flex items-center justify-center text-muted-foreground text-sm">
                    Biểu đồ chính (Epic 3)
                </div>
                <div className="lg:col-span-1 rounded-xl border bg-card text-card-foreground shadow-sm p-6 min-h-[350px] flex items-center justify-center text-muted-foreground text-sm">
                    Biểu đồ phụ (Epic 3)
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
