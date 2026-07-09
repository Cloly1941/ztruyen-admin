import { Skeleton } from "@/components/ui/skeleton";
import type { IDashboardOverview } from "@/types/backend";
import { Users, UserPlus, Heart, TrendingUp, TrendingDown, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OverviewCardsProps {
    data?: IDashboardOverview;
    isLoading: boolean;
    isError: boolean;
    refetch: () => void;
}

export function OverviewCards({ data, isLoading, isError, refetch }: OverviewCardsProps) {
    // 1. Loading State (AC 1)
    if (isLoading) {
        return (
            <>
                {Array.from({ length: 4 }).map((_, i) => (
                    <div
                        key={i}
                        className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 flex flex-col justify-between h-[120px] animate-pulse"
                    >
                        <div className="flex justify-between items-start">
                            <Skeleton className="h-4 w-28" />
                            <Skeleton className="h-8 w-8 rounded-lg" />
                        </div>
                        <Skeleton className="h-8 w-20 mt-2" />
                    </div>
                ))}
            </>
        );
    }

    // 2. Error State (AC 4)
    if (isError) {
        return (
            <div className="col-span-full rounded-xl border border-destructive/20 bg-destructive/5 p-8 flex flex-col items-center justify-center text-center space-y-4 shadow-sm animate-in fade-in duration-200">
                <div className="p-3 bg-destructive/10 rounded-full text-destructive">
                    <AlertCircle className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                    <h4 className="font-semibold text-foreground text-base">
                        Không thể tải số liệu tổng quan
                    </h4>
                    <p className="text-sm text-muted-foreground max-w-md">
                        Đã xảy ra lỗi khi tải dữ liệu thống kê từ hệ thống. Vui lòng thử lại.
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

    // Fallbacks for missing stats (AC 5)
    const totalUsers = data?.total_users ?? 0;
    const newUsersCurrentPeriod = data?.new_users_current_period ?? 0;
    const newUsersGrowthPercent = data?.new_users_growth_percent;
    const totalFavorites = data?.total_favorites ?? 0;

    // Growth Formatter Logic (AC 3)
    const getGrowthConfig = (val?: number | string | null) => {
        if (val === undefined || val === null || val === "") {
            return {
                text: "—",
                colorClass: "text-muted-foreground",
                icon: null,
                bgClass: "bg-muted/10",
            };
        }
        const numVal = typeof val === "string" ? parseFloat(val) : val;
        if (isNaN(numVal)) {
            return {
                text: "—",
                colorClass: "text-muted-foreground",
                icon: null,
                bgClass: "bg-muted/10",
            };
        }
        if (numVal > 0) {
            return {
                text: `+${numVal.toFixed(1)}%`,
                colorClass: "text-emerald-500 dark:text-emerald-400 font-semibold",
                icon: TrendingUp,
                bgClass: "bg-emerald-500/10 text-emerald-500 dark:text-emerald-400",
            };
        }
        if (numVal < 0) {
            return {
                text: `${numVal.toFixed(1)}%`, // Negatives naturally contain the minus sign
                colorClass: "text-red-500 dark:text-red-400 font-semibold",
                icon: TrendingDown,
                bgClass: "bg-red-500/10 text-red-500 dark:text-red-400",
            };
        }
        return {
            text: "0.0%",
            colorClass: "text-muted-foreground font-semibold",
            icon: null,
            bgClass: "bg-muted/10 text-muted-foreground",
        };
    };

    const growth = getGrowthConfig(newUsersGrowthPercent);
    const GrowthIcon = growth.icon;

    // Card items definition
    const cards = [
        {
            title: "Tổng số người dùng",
            value: totalUsers.toLocaleString("vi-VN"),
            icon: Users,
            iconClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
            extra: null,
        },
        {
            title: "Người dùng mới",
            value: newUsersCurrentPeriod.toLocaleString("vi-VN"),
            icon: UserPlus,
            iconClass: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
            extra: null,
        },
        {
            title: "Tỷ lệ tăng trưởng",
            value: growth.text,
            icon: GrowthIcon || TrendingUp,
            iconClass: growth.bgClass,
            isGrowth: true,
            extra: null,
        },
        {
            title: "Tổng lượt yêu thích",
            value: totalFavorites.toLocaleString("vi-VN"),
            icon: Heart,
            iconClass: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
            extra: null,
        },
    ];

    return (
        <>
            {cards.map((card, idx) => {
                const CardIcon = card.icon;
                return (
                    <div
                        key={idx}
                        className="rounded-xl border bg-card text-card-foreground shadow-xs p-6 flex flex-col justify-between h-[120px] transition-all hover:shadow-md hover:border-muted-foreground/20 duration-200"
                    >
                        <div className="flex justify-between items-start">
                            <span className="text-muted-foreground text-sm font-medium">
                                {card.title}
                            </span>
                            <div className={`p-2 rounded-lg ${card.iconClass}`}>
                                <CardIcon className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="flex items-baseline mt-2">
                            <span
                                className={`text-2xl font-bold tracking-tight text-foreground ${card.isGrowth ? growth.colorClass : ""
                                    }`}
                            >
                                {card.value}
                            </span>
                        </div>
                    </div>
                );
            })}
        </>
    );
}
