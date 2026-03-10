// ** Shadcn ui
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import type {TRangeFilter} from "@/hooks/common/useDataTable.ts";

export type TUserRangeFilter = {
    rangeFilters: Record<string, TRangeFilter>
    onRangeFilterChange: (f: Record<string, TRangeFilter>) => void
}

const AGE_RANGE_OPTIONS = [
    {label: "Tất cả độ tuổi", min: undefined, max: undefined},
    {label: "Dưới 13 tuổi", min: undefined, max: 12},
    {label: "13 - 17 tuổi", min: 13, max: 17},
    {label: "18 - 22 tuổi", min: 18, max: 22},
    {label: "23 - 30 tuổi", min: 23, max: 30},
    {label: "31 - 40 tuổi", min: 31, max: 40},
    {label: "Trên 40 tuổi", min: 41, max: undefined},
]

const UserRangeFilter = ({rangeFilters, onRangeFilterChange}: TUserRangeFilter) => {
    return (

    <Select
        value={
            AGE_RANGE_OPTIONS.findIndex(
                (o) => o.min === rangeFilters?.age?.min && o.max === rangeFilters?.age?.max
            ).toString()
        }
        onValueChange={(index) => {
            const option = AGE_RANGE_OPTIONS[Number(index)]
            onRangeFilterChange({
                ...rangeFilters,
                age: {min: option.min, max: option.max},
            })
        }}
    >
        <SelectTrigger className='w-full'>
            <SelectValue placeholder="Chọn độ tuổi"/>
        </SelectTrigger>
        <SelectContent position="popper">
            <SelectGroup>
                {AGE_RANGE_OPTIONS.map((option, index) => (
                    <SelectItem key={index} value={index.toString()}>
                        {option.label}
                    </SelectItem>
                ))}
            </SelectGroup>
        </SelectContent>
    </Select>
    )
}

export default UserRangeFilter