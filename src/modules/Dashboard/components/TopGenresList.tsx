// ** React
import { useEffect, useState } from "react";

// ** Icon
import { AlertCircle, RotateCcw } from "lucide-react";

// ** Library
import { toast } from "react-hot-toast";

// ** Shadcn ui
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardAction } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// ** Component
import { TopListSkeleton } from "@/skeletons/pages/dashboard";

// ** Hook
import useGetMethod from "@/hooks/common/useGetMethod";

// ** Service
import { DashboardService } from "@/services/dashboard";

// ** Config
import { CONFIG_QUERY_KEY } from "@/configs/query-key";

// ** Utils
import { getRankBadgeClass } from "@/utils/renderRankBadge";

export function TopGenresList() {
    const [limit, setLimit] = useState<number>(10);

    const { data, isLoading, isError, refetch } = useGetMethod({
        api: (signal) => DashboardService.topGenres({ limit }, signal),
        key: [CONFIG_QUERY_KEY.DASHBOARD.TOP_GENRES, { limit }],
    });

    useEffect(() => {
        if (isError) {
            toast.error("Không thể tải danh sách thể loại phổ biến.", {
                id: "top-genres-error",
            });
        }
    }, [isError]);

    const genres = data?.data?.data ?? [];

    return (
        <Card className="rounded-xl border border-border bg-card shadow-sm flex flex-col h-full min-h-[300px]">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-base font-semibold tracking-tight text-foreground">
                    Thể loại phổ biến
                </CardTitle>
                <CardAction>
                    <Select value={String(limit)} onValueChange={(val) => setLimit(Number(val) || 10)}>
                        <SelectTrigger className="w-[80px]" size="sm">
                            <SelectValue placeholder="Limit" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="20">20</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                        </SelectContent>
                    </Select>
                </CardAction>
            </CardHeader>
            <CardContent className="flex-1 py-4">
                {isLoading ? (
                    <TopListSkeleton limit={limit} />
                ) : isError ? (
                    <div className="h-full min-h-[200px] flex flex-col items-center justify-center text-center space-y-4 py-8 animate-in fade-in duration-200">
                        <div className="p-3 bg-destructive/10 rounded-full text-destructive">
                            <AlertCircle className="size-6" />
                        </div>
                        <div className="space-y-1">
                            <h4 className="font-semibold text-foreground text-sm">
                                Không thể tải danh sách thể loại phổ biến.
                            </h4>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => refetch()}
                            className="h-8 px-3 font-medium text-xs border-destructive/20 hover:bg-destructive/10 hover:text-destructive gap-1.5"
                        >
                            <RotateCcw className="size-3" />
                            Thử lại
                        </Button>
                    </div>
                ) : genres.length === 0 ? (
                    <div className="h-full min-h-[200px] flex flex-col items-center justify-center text-center py-12 animate-in fade-in duration-200">
                        <p className="text-sm text-muted-foreground">Không có dữ liệu hiển thị.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-border/50">
                        {genres.map((item, index) => (
                            <div
                                key={`${item.genre}-${index}`}
                                className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                            >
                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                    <span
                                        className={`flex items-center justify-center size-6 rounded-full text-xs shrink-0 ${getRankBadgeClass(
                                            index + 1
                                        )}`}
                                    >
                                        {index + 1}
                                    </span>
                                    <span className="font-medium text-sm text-foreground truncate max-w-full">
                                        {item.genre}
                                    </span>
                                </div>
                                <span className="text-sm font-semibold text-muted-foreground shrink-0 ml-2">
                                    {item.count.toLocaleString("vi-VN")}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
