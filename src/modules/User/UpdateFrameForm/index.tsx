import { DialogClose, DialogFooter } from "@/components/ui/dialog.tsx";
import Button from "@/components/common/Button";
import { useEffect, useState } from "react";
import useGetMethod from "@/hooks/common/useGetMethod.ts";
import type { IFrame } from "@/types/backend";
import { FrameService } from "@/services/frame";
import { CONFIG_QUERY_KEY } from "@/configs/query-key";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { UserService } from "@/services/user";
import { ChevronLeft, ChevronRight, Search, ArrowUpDown, Check } from "lucide-react";
import AvatarWithFrame from "@/components/common/AvatarWithFrame";
import { useDebounce } from "@/hooks/common/useDebounce";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


type TSortOption = { label: string; value: string };

const SORT_OPTIONS: TSortOption[] = [
    { label: "Mới nhất", value: "-updatedAt" },
    { label: "Cũ nhất", value: "updatedAt" },
    { label: "A → Z", value: "name" },
    { label: "Z → A", value: "-name" },
];

type TUpdateFrameForm = {
    id: string;
    onSuccess?: () => void;
    avatarUrl?: string;
    avatarName?: string;
    frameId?: string;
}

const UpdateFrameForm = ({ id, avatarName, avatarUrl, frameId, onSuccess }: TUpdateFrameForm) => {
    const [loading, setLoading] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(frameId || null);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("-updatedAt");

    const debouncedSearch = useDebounce(search, 400);

    const limit = 3;

    useEffect(() => {
        setPage(1);
    }, [debouncedSearch, sort]);

    const queryParams = {
        page,
        limit,
        sort,
        search: debouncedSearch,
        searchField: "name",
    };

    const { data, isLoading, error } = useGetMethod<IModelPaginate<IFrame>>({
        api: () => FrameService.list(queryParams),
        key: [CONFIG_QUERY_KEY.FRAME.LIST, page, sort, debouncedSearch],
        enabled: true,
    });

    useEffect(() => {
        if (error) {
            toast.error("Không thể tải thông tin khung avatar. Vui lòng thử lại sau.");
        }
    }, [error]);

    const queryClient = useQueryClient();

    const listFrame = data?.data?.result;
    const totalPages = data?.data?.meta?.totalPages ?? 1;

    const currentSortLabel = SORT_OPTIONS.find(o => o.value === sort)?.label ?? "Sắp xếp";

    const handleSubmit = async () => {
        setLoading(true);
        if (!selectedId) {
            toast.error("Vui lòng chọn một khung.");
            setLoading(false);
            return;
        }
        try {
            await UserService.frame(id, selectedId);
            toast.success("Cập nhật khung thành công!");
            queryClient.invalidateQueries({ queryKey: [CONFIG_QUERY_KEY.USER.LIST] });
            onSuccess?.();
        } catch {
            toast.error("Cập nhật thất bại. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            {/* Search + Sort */}
            <div className="flex items-center gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Tìm tên khung..."
                        className="pl-8 h-8"
                    />
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Button variant="outline" size="sm" className="gap-1.5 whitespace-nowrap">
                            <ArrowUpDown />
                            {currentSortLabel}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center">
                        {SORT_OPTIONS.map(option => (
                            <DropdownMenuItem
                                key={option.value}
                                onClick={() => setSort(option.value)}
                                className="gap-2"
                            >
                                <Check className={cn(sort === option.value ? "opacity-100" : "opacity-0")} />
                                {option.label}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Frame list */}
            {isLoading ? (
                <div className="text-sm text-muted-foreground text-center py-6">
                    Đang tải khung avatar...
                </div>
            ) : !listFrame?.length ? (
                <div className="text-sm text-muted-foreground text-center py-6">
                    {search ? `Không tìm thấy khung "${search}"` : "Không tìm thấy danh sách khung."}
                </div>
            ) : (
                <div className="grid grid-cols-3 gap-3">
                    {listFrame.map((frame: IFrame) => {
                        const isSelected = selectedId === frame._id;
                        return (
                            <div
                                key={frame._id}
                                onClick={() => setSelectedId(frame._id)}
                                className={cn(
                                    "flex flex-col items-center gap-1.5 p-2 rounded-lg cursor-pointer",
                                    "border-2 transition-all duration-150",
                                    isSelected
                                        ? "border-primary bg-primary/5"
                                        : "border-transparent hover:bg-muted/50"
                                )}
                            >
                                <div className="relative my-4">
                                    <AvatarWithFrame
                                        className="size-12"
                                        avatarName={avatarName}
                                        avatarUrl={avatarUrl}
                                        frameUrl={frame.image.url}
                                        frameName={frame.name}
                                    />
                                    {isSelected && (
                                        <span className="absolute -bottom-8 -right-8 flex items-center justify-center w-5 h-5 bg-primary rounded-full">
                                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                                <polyline
                                                    points="1.5,5 4,7.5 8.5,2.5"
                                                    stroke="white"
                                                    strokeWidth="1.5"
                                                    strokeLinecap="round"
                                                />
                                            </svg>
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-center text-muted-foreground leading-tight">
                                    {frame.name}
                                </p>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setPage(p => p - 1)}
                        disabled={page === 1}
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <span className="text-sm text-muted-foreground tabular-nums">
                        {page} / {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setPage(p => p + 1)}
                        disabled={page === totalPages}
                    >
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>
            )}

            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="outline">Huỷ</Button>
                </DialogClose>
                <Button onClick={handleSubmit} isLoading={loading} disabled={!selectedId}>
                    Lưu khung
                </Button>
            </DialogFooter>
        </div>
    );
};

export default UpdateFrameForm;