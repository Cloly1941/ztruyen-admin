// ** React
import { useEffect, useMemo, useState } from "react";

// ** React Query
import { useQuery } from "@tanstack/react-query";

// ** Shadcn ui
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";

// ** Icons
import { PlusCircle } from "lucide-react";

// ** Services
import { EmojiCategoryService } from "@/services/emoji-category";

// ** Config
import { CONFIG_QUERY_KEY } from "@/configs/query-key";

type FilterOption = {
    value: string;
    label: string;
};

type FilterGroup = {
    key: string;
    label: string;
    options: FilterOption[];
};

export type TEmojiFilter = {
    filters: Record<string, string[]>;
    onFilterChange: (filters: Record<string, string[]>) => void;
};

type TEmojiFilters = TEmojiFilter & {
    localFilters: Record<string, string[]>;
    setLocalFilters: (filters: Record<string, string[]>) => void;
};

// ================= BASE FILTER =================
const BASE_FILTER_GROUPS: FilterGroup[] = [
    {
        key: "isActive",
        label: "Trạng thái",
        options: [
            { value: "true", label: "Hoạt động" },
            { value: "false", label: "Chưa hoạt động" },
        ],
    },
    {
        key: "type",
        label: "Loại",
        options: [
            { value: "image", label: "Hình ảnh" },
            { value: "text", label: "Văn bản" },
        ],
    },
];


const EmojiFilters = ({
                          filters,
                          onFilterChange,
                          localFilters,
                          setLocalFilters,
                      }: TEmojiFilters) => {
    const [openPopovers, setOpenPopovers] = useState<Record<string, boolean>>({});

    const { data: categories = [] } = useQuery({
        queryKey: [CONFIG_QUERY_KEY.EMOJI_CATEGORY.LIST],
        queryFn: () => EmojiCategoryService.list(),
        select: (res) => res.data ?? [],
        enabled: openPopovers["category"] === true,
    });

    // Build filterGroups
    const filterGroups: FilterGroup[] = useMemo(() => {
        const categoryGroup: FilterGroup = {
            key: "category",
            label: "Danh mục",
            options: categories.map((c) => ({
                value: c._id,
                label: c.name,
            })),
        };

        return [...BASE_FILTER_GROUPS, categoryGroup];
    }, [categories]);

    useEffect(() => {
        setLocalFilters(filters);
    }, [filters, setLocalFilters]);

    const handleToggleFilter = (groupKey: string, value: string) => {
        const groupFilters = localFilters[groupKey] || [];

        const newFilters = groupFilters.includes(value)
            ? groupFilters.filter((v) => v !== value)
            : [...groupFilters, value];

        const updated = { ...localFilters, [groupKey]: newFilters };

        setLocalFilters(updated);
        onFilterChange(updated);
    };

    const getOptionLabel = (groupKey: string, value: string) => {
        const group = filterGroups.find((g) => g.key === groupKey);
        return group?.options.find((o) => o.value === value)?.label || value;
    };

    return (
        <>
            {filterGroups.map((group) => {
                const listFilter = localFilters[group.key] || [];

                return (
                    <div key={group.key} className="flex items-center gap-2">
                        <Popover
                            open={openPopovers[group.key]}
                            onOpenChange={(open) =>
                                setOpenPopovers((prev) => ({
                                    ...prev,
                                    [group.key]: open,
                                }))
                            }
                        >
                            <PopoverTrigger className='w-full'>
                                <Button variant="outline" className="w-full">
                                    <PlusCircle className="size-3.5 mr-1" />
                                    <span className="text-sm">{group.label}</span>

                                    {listFilter.length > 0 && (
                                        <>
                                            <Separator
                                                orientation="vertical"
                                                className="h-4 mx-2"
                                            />

                                            {listFilter.length <= 2 ? (
                                                <div className="flex gap-1">
                                                    {listFilter.map((value) => (
                                                        <Badge
                                                            key={`${group.key}-${value}`}
                                                            variant="secondary"
                                                        >
                                                            {getOptionLabel(
                                                                group.key,
                                                                value
                                                            )}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            ) : (
                                                <Badge variant="secondary">
                                                    {listFilter.length} mục
                                                </Badge>
                                            )}
                                        </>
                                    )}
                                </Button>
                            </PopoverTrigger>

                            <PopoverContent className="w-[220px] p-0">
                                <Command>
                                    <CommandInput
                                        placeholder={`Tìm ${group.label.toLowerCase()}...`}
                                    />

                                    <CommandList>
                                        <CommandEmpty>
                                            Không có dữ liệu
                                        </CommandEmpty>

                                        <CommandGroup>
                                            {group.options.map((option) => (
                                                <CommandItem
                                                    key={option.value}
                                                    onSelect={() =>
                                                        handleToggleFilter(
                                                            group.key,
                                                            option.value
                                                        )
                                                    }
                                                >
                                                    <Checkbox
                                                        checked={listFilter.includes(
                                                            option.value
                                                        )}
                                                        onCheckedChange={() =>
                                                            handleToggleFilter(
                                                                group.key,
                                                                option.value
                                                            )
                                                        }
                                                        onClick={(e) =>
                                                            e.stopPropagation()
                                                        }
                                                    />
                                                    <span className="text-sm">
                                                        {option.label}
                                                    </span>
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>

                                    {/* Clear */}
                                    {listFilter.length > 0 && (
                                        <>
                                            <Separator />
                                            <div className="p-1">
                                                <Button
                                                    variant="ghost"
                                                    className="w-full"
                                                    onClick={() => {
                                                        const updated = {
                                                            ...localFilters,
                                                            [group.key]: [],
                                                        };
                                                        setLocalFilters(updated);
                                                        onFilterChange(updated);
                                                    }}
                                                >
                                                    Bỏ chọn tất cả
                                                </Button>
                                            </div>
                                        </>
                                    )}
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>
                );
            })}
        </>
    );
};

export default EmojiFilters;