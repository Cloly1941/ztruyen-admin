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
import Filters, {type TAnnouncementFilter} from "@/modules/Announcement/DataTable/AnnouncementFilterGroup/Filters";

// ** Hooks
import {useIsMobile} from "@/hooks/use-mobile.ts";

// Icons
import {Funnel, X} from "lucide-react";

type TAnnouncementFilterGroupProps = TAnnouncementFilter

const AnnouncementFilterGroup = ({
                                      filters, onFilterChange,
                                  }: TAnnouncementFilterGroupProps) => {

    const [localFilters, setLocalFilters] = useState(filters)

    const isMobile = useIsMobile()

    const clearFilters = () => {
        const cleared = {provider: [], gender: []}
        setLocalFilters(cleared)
        onFilterChange(cleared)
    }

    // Clear all filters
    const handleClearAll = () => {
        clearFilters()
    };

    // Get total selected count
    const getTotalSelectedCount = () => {
        return Object.values(filters).reduce((acc, curr) => acc + curr.length, 0);
    };


    if (!isMobile) return (
        <>
            <Filters
                filters={filters}
                onFilterChange={onFilterChange}
                localFilters={localFilters}
                setLocalFilters={setLocalFilters}
            />

            {/* Reset All Button */}
            {((getTotalSelectedCount() > 0)) && (
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
                    {/* Reset All Button */}
                    {((getTotalSelectedCount() > 0)) && (
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

export default AnnouncementFilterGroup;