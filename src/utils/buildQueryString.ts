import type {TQueryParams} from "@/hooks/common/useDataTable.ts";

export const buildQueryString = (params: TQueryParams): string => {
    const query = new URLSearchParams()

    query.set("page", String(params.page))
    query.set("limit", String(params.limit))

    if (params.sort) query.set("sort", params.sort)

    if (params.search && params.search.trim()) {
        query.set("search", params.search.trim())
    }

    if (params.filters) {
        Object.entries(params.filters).forEach(([key, values]) => {
            values.forEach(value => {
                query.append(key, value)
            })
        })
    }

    if (params.rangeFilters) {
        Object.entries(params.rangeFilters).forEach(([key, range]) => {
            if (range.min !== undefined && range.min !== "") {
                query.append(`${key}>`, String(range.min))
            }
            if (range.max !== undefined && range.max !== "") {
                query.append(`${key}<`, String(range.max))
            }
        })
    }

    return query.toString()
}