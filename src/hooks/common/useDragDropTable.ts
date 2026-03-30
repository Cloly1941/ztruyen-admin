// ** React
import {useState} from "react"

// ** React query
import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query"

// ** Dnd
import {arrayMove} from "@dnd-kit/sortable"

// ** React Table
import type {SortingState, VisibilityState} from "@tanstack/react-table"

// ** Axios
import type {AxiosResponse} from "axios"

type TUseDragDropTableOptions<T extends { _id: string }> = {
    queryKey: string
    queryFn: () => Promise<IBackendRes<T[]>>
    reorderFn: (ids: string[]) => Promise<AxiosResponse<IBackendRes<void>>>
}

export const useDragDropTable = <T extends { _id: string }>({
                                                                queryKey,
                                                                queryFn,
                                                                reorderFn,
                                                            }: TUseDragDropTableOptions<T>) => {
    const queryClient = useQueryClient()

    const {data: serverItems = [], isLoading} = useQuery({
        queryKey: [queryKey],
        queryFn,
        select: (res) => res.data ?? [],
    })

    const [overrideItems, setOverrideItems] = useState<T[] | null>(null)
    const [activeId, setActiveId] = useState<string | null>(null)
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [sorting, setSorting] = useState<SortingState>([])

    const items = overrideItems ?? serverItems

    const {mutate: reorder, isPending} = useMutation({
        mutationFn: (ids: string[]) => reorderFn(ids),
        onSuccess: () => {
            setOverrideItems(null)
            queryClient.invalidateQueries({queryKey: [queryKey]})
        },
        onError: () => setOverrideItems(null),
    })

    const handleDragEnd = (oldIndex: number, newIndex: number) => {
        const newItems = arrayMove(items, oldIndex, newIndex)
        setOverrideItems(newItems)
        reorder(newItems.map((item) => item._id))
    }

    return {
        items,
        activeId,
        setActiveId,
        isLoading,
        isPending,
        columnVisibility,
        setColumnVisibility,
        sorting,
        setSorting,
        handleDragEnd,
    }
}