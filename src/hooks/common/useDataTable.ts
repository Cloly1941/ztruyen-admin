// ** React
import {useState} from "react"

// ** Tanstack query
import {keepPreviousData, useQuery} from "@tanstack/react-query"

// ** Tanstack table
import type {SortingState, VisibilityState} from "@tanstack/react-table"

// ** Hooks
import {useDebounce} from "@/hooks/common/useDebounce"

type TUseDataTableOptions<T> = {
    queryKey: string
    queryFn: (params: TQueryParams) => Promise<IBackendRes<IModelPaginate<T>>>
    searchField: string,
    defaultSort?: { id: string; desc: boolean }
}

export type TRangeFilter = {
    min?: number | string
    max?: number | string
}

export type TQueryParams = {
    page: number
    limit: number
    search?: string
    searchField?: string
    sort?: string
    filters?: Record<string, string[]>
    rangeFilters?: Record<string, TRangeFilter>
}


export const useDataTable = <T>({
                                    queryKey, queryFn, searchField = "name",
                                    defaultSort = { id: "updatedAt", desc: true }
                                }: TUseDataTableOptions<T>) => {
    const [sorting, setSorting] = useState<SortingState>([defaultSort])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})
    const [pagination, setPagination] = useState({pageIndex: 0, pageSize: 10})
    const [search, setSearch] = useState("")
    const [filters, setFilters] = useState<Record<string, string[]>>({})
    const [rangeFilters, setRangeFilters] = useState<Record<string, TRangeFilter>>({})

    const debouncedSearch = useDebounce(search, 500)

    // Convert sorting state -> "-field" or "field"
    const sort = sorting[0]
        ? `${sorting[0].desc ? "-" : ""}${sorting[0].id}`
        : ""

    const {data, isLoading} = useQuery({
        queryKey: [queryKey, pagination, sort, debouncedSearch, filters, rangeFilters],
        queryFn: () => queryFn({
            page: pagination.pageIndex + 1,
            limit: pagination.pageSize,
            search: debouncedSearch,
            searchField,
            sort,
            filters,
            rangeFilters
        }),
        placeholderData: keepPreviousData,
        refetchOnReconnect: false,
    })

    const handleSearch = (value: string) => {
        setSearch(value)
        setPagination(prev => ({...prev, pageIndex: 0}))
    }

    const handleFilterChange = (newFilters: Record<string, string[]>) => {
        setFilters(newFilters)
        setPagination(prev => ({...prev, pageIndex: 0}))
    }

    const handleRangeFilterChange = (newRangeFilters: Record<string, TRangeFilter>) => {
        setRangeFilters(newRangeFilters)
        setPagination(prev => ({...prev, pageIndex: 0}))
    }

    return {
        data: data?.data?.result ?? [],
        pageCount: data?.data?.meta?.totalPages ?? 0,
        total: data?.data?.meta?.totalItems ?? 0,
        isLoading,
        search, handleSearch,
        sorting, setSorting,
        columnVisibility, setColumnVisibility,
        rowSelection, setRowSelection,
        pagination, setPagination,
        filters, handleFilterChange,
        rangeFilters, handleRangeFilterChange,
        params: {
            page: pagination.pageIndex + 1,
            limit: pagination.pageSize,
            sort: sort,
            search,
            filters,
            rangeFilters,
        }
    }
}