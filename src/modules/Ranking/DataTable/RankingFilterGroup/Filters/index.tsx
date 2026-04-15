// ** React
import {useEffect, useState} from 'react';

// ** Shadcn ui
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {Checkbox} from "@/components/ui/checkbox";
import {Badge} from "@/components/ui/badge";
import {Separator} from "@/components/ui/separator";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";

// ** Icons
import {PlusCircle} from "lucide-react";

type FilterOption = {
    value: string;
    label: string;
};

type FilterGroup = {
    key: string;
    label: string;
    options: FilterOption[];
};

export type TRankingFilter = {
    filters: Record<string, string[]>
    onFilterChange: (filters: Record<string, string[]>) => void
}

type TRankingFilters = TRankingFilter & {
    localFilters: Record<string, string[]>
    setLocalFilters: (filters: Record<string, string[]>) => void
}

const rankOptions = Array.from({ length: 50 }, (_, i) => {
    const rank = i + 1;
    return {
        value: String(rank),
        label: `Top ${rank}`,
    };
});

const FILTER_GROUPS: FilterGroup[] = [
    {
        key: 'country',
        label: 'Quốc gia',
        options: [
            {value: 'trung', label: 'Trung Quốc'},
            {value: 'han', label: 'Hàn Quốc'},
            {value: 'nhat', label: 'Nhật Bản'},
        ],
    },
    {
        key: 'status',
        label: 'Trạng thái',
        options: [
            { value: "ongoing", label: "Đang tiến hành" },
            { value: "coming_soon", label: "Sắp ra mắt" },
            { value: "completed", label: "Đã hoàn thành" },
        ],
    },
    {
        key: "rank",
        label: "Top",
        options: rankOptions,
    },
];

const RankingFilters = ({filters, onFilterChange, localFilters, setLocalFilters}: TRankingFilters) => {

    const [openPopovers, setOpenPopovers] = useState<Record<string, boolean>>({});

    useEffect(() => {
        setLocalFilters(filters)
    }, [filters, setLocalFilters])

    // Toggle filter option
    const handleToggleFilter = (groupKey: string, value: string) => {
        const groupFilters = localFilters[groupKey] || []
        const newFilters = groupFilters.includes(value)
            ? groupFilters.filter((v) => v !== value)
            : [...groupFilters, value]

        const updated = {...localFilters, [groupKey]: newFilters}
        setLocalFilters(updated)
        onFilterChange(updated)
    };

    // Get label for selected value
    const getOptionLabel = (groupKey: string, value: string) => {
        const group = FILTER_GROUPS.find((g) => g.key === groupKey);
        return group?.options.find((o) => o.value === value)?.label || value;
    };

    return (
        <>
            {/* Provider */}
            {FILTER_GROUPS.map((group) => {
                const listFilter = filters[group.key] || []
                return (
                    <div key={group.key} className="flex items-center gap-2">
                        {/* Filter Button/Label */}
                        <Popover
                            open={openPopovers[group.key]}
                            onOpenChange={(open) =>
                                setOpenPopovers((prev) => ({...prev, [group.key]: open}))
                            }
                        >
                            <PopoverTrigger className='w-full'>
                                <Button
                                    variant="outline"
                                    className='w-full'
                                >
                                    <PlusCircle className="size-3.5"/>
                                    <span className="text-sm">{group.label}</span>

                                    {listFilter.length > 0 && (
                                        <>
                                            <Separator orientation='vertical' className='h-4 mx-2'/>

                                            {listFilter.length <= 2 ? (
                                                <div className="flex items-center gap-1">
                                                    {listFilter.map((value) => (
                                                        <Badge
                                                            key={`${group.key}-${value}`}
                                                            variant="secondary"
                                                        >
                                                            {getOptionLabel(group.key, value)}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            ) : (
                                                <Badge variant="secondary" className="font-normal">
                                                    {listFilter.length} mục
                                                </Badge>
                                            )}
                                        </>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[220px] p-0" align="center">
                                <Command>
                                    <CommandInput
                                        placeholder={`Tìm kiếm ${group.label.toLowerCase()}...`}
                                    />
                                    <CommandList>
                                        <CommandEmpty>Không tìm thấy kết quả nào.</CommandEmpty>
                                        <CommandGroup>
                                            {group.options.map((option) => (
                                                <CommandItem
                                                    key={option.value}
                                                    onSelect={() => handleToggleFilter(group.key, option.value)}
                                                >
                                                    <Checkbox
                                                        checked={filters[group.key]?.includes(option.value)}
                                                        onCheckedChange={() =>
                                                            handleToggleFilter(group.key, option.value)
                                                        }
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                    <span className="text-sm">
                                                        {option.label}
                                                    </span>
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>

                                    {/* Clear Filters Button */}
                                    {filters[group.key]?.length > 0 && (
                                        <>
                                            <Separator/>
                                            <div className="p-1">
                                                <Button
                                                    variant="ghost"
                                                    className='w-full'
                                                    onClick={() => {
                                                        const updated = {
                                                            ...localFilters,
                                                            [group.key]: []
                                                        }
                                                        setLocalFilters(updated)
                                                        onFilterChange(updated)
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
                )
            })}
        </>
    )
}

export default RankingFilters