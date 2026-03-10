// ** React
import {useState} from "react";

// ** Shadcn ui
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {Button} from "@/components/ui/button.tsx";

// ** Modules components
import RangeFilter, {type TUserRangeFilter} from "@/modules/User/DataTable/UserFilterGroup/RangeFilter";
import Filters, {type TUserFilter} from "@/modules/User/DataTable/UserFilterGroup/Filters";

// ** Hooks
import {useIsMobile} from "@/hooks/use-mobile.ts";

// Icons
import {Funnel, X} from "lucide-react";

type TUserFilterGroupProps = TUserRangeFilter & TUserFilter

const UserFilterGroup = ({
                             filters, onFilterChange,
                             rangeFilters, onRangeFilterChange
                         }: TUserFilterGroupProps) => {

    const [localFilters, setLocalFilters] = useState(filters)

    const isMobile = useIsMobile()

    const clearFilters = () => {
        const cleared = {provider: [], gender: []}
        setLocalFilters(cleared)
        onFilterChange(cleared)
    }

    const clearRangeFilter = () => {
        onRangeFilterChange({
            ...rangeFilters,
            age: {
                min: undefined,
                max: undefined,
            },
        })
    }

    // Clear all filters
    const handleClearAll = () => {
        clearFilters()
        clearRangeFilter()
    };

    // Get total selected count
    const getTotalSelectedCount = () => {
        return Object.values(filters).reduce((acc, curr) => acc + curr.length, 0);
    };

    const hasAgeRange =  rangeFilters?.age?.min !== undefined || rangeFilters?.age?.max !== undefined


    if (!isMobile) return (
        <>
            <Filters
                filters={filters}
                onFilterChange={onFilterChange}
                localFilters={localFilters}
                setLocalFilters={setLocalFilters}
            />
            <RangeFilter rangeFilters={rangeFilters} onRangeFilterChange={onRangeFilterChange}/>

            {/* Reset All Button */}
            {((getTotalSelectedCount() > 0) || hasAgeRange) && (
                <>
                    <Button
                        variant="ghost"
                        onClick={handleClearAll}
                    >
                        Làm mới bộ lọc
                        <X className='size-3.5'/>
                    </Button>
                </>
            )}
        </>
    )

    return (
        <Popover>
            <PopoverTrigger>
                <Button variant="outline" size='icon'>
                    <Funnel/>
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-fit p-3'>
                <div className='flex flex-col gap-2'>
                    <Filters
                        filters={filters}
                        onFilterChange={onFilterChange}
                        localFilters={localFilters}
                        setLocalFilters={setLocalFilters}
                    />
                    <RangeFilter rangeFilters={rangeFilters} onRangeFilterChange={onRangeFilterChange}/>
                    {/* Reset All Button */}
                    {((getTotalSelectedCount() > 0) || hasAgeRange) && (
                        <>
                            <Button
                                variant="ghost"
                                onClick={handleClearAll}
                            >
                                Làm mới bộ lọc
                            </Button>
                        </>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
};

export default UserFilterGroup;