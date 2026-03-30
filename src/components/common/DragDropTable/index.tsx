// ** React
import {useState, type ReactNode, useMemo} from "react"

// ** DnD Kit
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
    type DragStartEvent,
    DragOverlay,
} from "@dnd-kit/core"
import {restrictToVerticalAxis, restrictToWindowEdges} from "@dnd-kit/modifiers"
import {
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import {CSS} from "@dnd-kit/utilities"

// ** Tanstack table
import {
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
    type ColumnDef,
    type Row,
} from "@tanstack/react-table"

// ** UI
import {Columns2, GripVertical} from "lucide-react"
import {Input} from "@/components/ui/input.tsx"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx"
import Button from "@/components/common/Button"
import DialogActionBtn from "@/components/common/DialogActionBtn"

// ** Hooks
import {useDragDropTable} from "@/hooks/common/useDragDropTable.ts"
import {useDebounce} from "@/hooks/common/useDebounce.ts"

// ** Types
import type {AxiosResponse} from "axios"
import type {TRangeFilter} from "@/hooks/common/useDataTable.ts"

type TDragDropTableProps<T extends { _id: string }> = {
    queryKey: string
    queryFn: () => Promise<IBackendRes<T[]>>
    reorderFn: (ids: string[]) => Promise<AxiosResponse<IBackendRes<void>>>
    columns: ColumnDef<T>[]
    title?: string
    searchField?: string
    searchPlaceholder?: string
    columnLabels?: Record<string, string>
    contentAddBtn?: (close: () => void) => ReactNode
    onImport?: (close: () => void) => ReactNode
    toolbar?: (
        filters: Record<string, string[]>,
        onFilterChange: (f: Record<string, string[]>) => void,
        rangeFilters: Record<string, TRangeFilter>,
        onRangeFilterChange: (f: Record<string, TRangeFilter>) => void
    ) => ReactNode
}

// ---------- SortableRow ----------
function SortableRow<T extends { _id: string }>({row}: { row: Row<T> }) {
    const {attributes, listeners, setNodeRef, transform, transition, isDragging} = useSortable({
        id: row.original._id,
    })

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.3 : 1,
    }

    return (
        <tr
            ref={setNodeRef}
            style={style}
            className="hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors"
        >
            <TableCell className="p-2 align-middle w-[40px]">
                <button
                    {...attributes}
                    {...listeners}
                    className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground p-1 rounded touch-none select-none"
                >
                    <GripVertical className="size-4"/>
                </button>
            </TableCell>
            {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
            ))}
        </tr>
    )
}

// ---------- DragDropTable ----------
const DragDropTable = <T extends { _id: string }>({
                                                      queryKey,
                                                      queryFn,
                                                      reorderFn,
                                                      columns,
                                                      title,
                                                      searchField,
                                                      searchPlaceholder = "Tìm kiếm...",
                                                      columnLabels = {},
                                                      contentAddBtn,
                                                      onImport,
                                                      toolbar,
                                                  }: TDragDropTableProps<T>) => {
    const {
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
    } = useDragDropTable({queryKey, queryFn, reorderFn})

    const [addOpen, setAddOpen] = useState(false)
    const [importOpen, setImportOpen] = useState(false)
    const [search, setSearch] = useState("")
    const [filters, setFilters] = useState<Record<string, string[]>>({})
    const [rangeFilters, setRangeFilters] = useState<Record<string, TRangeFilter>>({})

    const debouncedSearch = useDebounce(search, 500)

    const handleFilterChange = (newFilters: Record<string, string[]>) => setFilters(newFilters)
    const handleRangeFilterChange = (newRangeFilters: Record<string, TRangeFilter>) => setRangeFilters(newRangeFilters)

    const filteredItems = useMemo(() => {
        let result = items

        // Search
        if (debouncedSearch && searchField) {
            result = result.filter((item) => {
                const value = (item as Record<string, unknown>)[searchField]
                return String(value ?? "").toLowerCase().includes(debouncedSearch.toLowerCase())
            })
        }

        // Filters
        if (Object.keys(filters).length > 0) {
            result = result.filter((item) =>
                Object.entries(filters).every(([key, values]) => {
                    if (!values.length) return true
                    const value = String((item as Record<string, unknown>)[key] ?? "")
                    return values.includes(value)
                })
            )
        }

        // Range filters
        if (Object.keys(rangeFilters).length > 0) {
            result = result.filter((item) =>
                Object.entries(rangeFilters).every(([key, range]) => {
                    const value = Number((item as Record<string, unknown>)[key] ?? 0)
                    if (range.min !== undefined && range.min !== "" && value < Number(range.min)) return false
                    if (range.max !== undefined && range.max !== "" && value > Number(range.max)) return false
                    return true
                })
            )
        }

        return result
    }, [items, debouncedSearch, searchField, filters, rangeFilters])

    const sensors = useSensors(
        useSensor(PointerSensor, {activationConstraint: {distance: 8}}),
        useSensor(KeyboardSensor, {coordinateGetter: sortableKeyboardCoordinates})
    )

    const table = useReactTable({
        data: filteredItems,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: {columnVisibility, sorting},
        onColumnVisibilityChange: setColumnVisibility,
        onSortingChange: setSorting,
    })

    const handleDragStart = (event: DragStartEvent) => setActiveId(event.active.id as string)

    const handleDragCancel = () => setActiveId(null)

    const handleDragEndEvent = (event: DragEndEvent) => {
        const {active, over} = event
        setActiveId(null)
        if (!over || active.id === over.id) return

        // Tính index từ items gốc (chưa sort) để reorder đúng
        const oldIndex = items.findIndex((item) => item._id === active.id)
        const newIndex = items.findIndex((item) => item._id === over.id)
        handleDragEnd(oldIndex, newIndex)
    }

    const sortedRows = table.getRowModel().rows

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-32 text-sm text-muted-foreground">
                Đang tải...
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {title && <h1 className="text-2xl font-bold tracking-tight">Danh sách {title}</h1>}
                <div className="flex gap-2">
                    {onImport && (
                        <DialogActionBtn
                            title={title}
                            render={onImport}
                            action="import"
                            open={importOpen}
                            onOpenChange={setImportOpen}
                        />
                    )}
                    {contentAddBtn && (
                        <DialogActionBtn
                            title={title}
                            render={contentAddBtn}
                            open={addOpen}
                            onOpenChange={setAddOpen}
                        />
                    )}
                </div>
            </div>

            <div className="space-y-4 pt-2">
                {/* Toolbar */}
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <Input
                            placeholder={searchPlaceholder}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="max-w-sm"
                        />
                        {toolbar?.(filters, handleFilterChange, rangeFilters, handleRangeFilterChange)}
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Button variant="outline">
                                <span className="hidden lg:block">Cột hiển thị</span>
                                <Columns2/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[180px]">
                            <DropdownMenuLabel>Chọn cột hiển thị</DropdownMenuLabel>
                            <DropdownMenuSeparator/>
                            {table
                                .getAllColumns()
                                .filter((col) => col.getCanHide())
                                .map((col) => (
                                    <DropdownMenuCheckboxItem
                                        key={col.id}
                                        checked={col.getIsVisible()}
                                        onCheckedChange={(v) => col.toggleVisibility(!!v)}
                                    >
                                        {columnLabels[col.id] ?? col.id}
                                    </DropdownMenuCheckboxItem>
                                ))}
                            <DropdownMenuSeparator/>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="w-full"
                                onClick={() => table.resetColumnVisibility()}
                            >
                                Hiển thị tất cả
                            </Button>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Table */}
                <div className="rounded-md border relative">
                    {isPending && (
                        <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10 rounded-md">
                            <span className="text-sm text-muted-foreground">Đang lưu thứ tự...</span>
                        </div>
                    )}

                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEndEvent}
                        onDragCancel={handleDragCancel}
                    >
                        <SortableContext
                            items={sortedRows.map((row) => row.original._id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <Table>
                                <TableHeader className="[&_tr]:border-b">
                                    {table.getHeaderGroups().map((hg) => (
                                        <TableRow key={hg.id}>
                                            <TableHead/>
                                            {hg.headers.map((header) => (
                                                <TableHead key={header.id}>
                                                    {header.isPlaceholder
                                                        ? null
                                                        : flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )
                                                    }
                                                </TableHead>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableHeader>
                                <TableBody>
                                    {sortedRows.length ? (
                                        sortedRows.map((row) => (
                                            <SortableRow key={row.original._id} row={row}/>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <td
                                                colSpan={columns.length + 1}
                                                className="h-24 text-center text-sm text-muted-foreground"
                                            >
                                                Không có dữ liệu.
                                            </td>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </SortableContext>

                        <DragOverlay dropAnimation={null}>
                            {activeId ? (
                                <Table>
                                    <TableBody>
                                        <TableRow className="border-b">
                                            <TableCell className="p-2 align-middle w-[40px]">
                                                <GripVertical className="size-4 text-muted-foreground"/>
                                            </TableCell>
                                            {sortedRows
                                                .find((row) => row.original._id === activeId)
                                                ?.getVisibleCells()
                                                .map((cell) => (
                                                    <TableCell key={cell.id}>
                                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                    </TableCell>
                                                ))}
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            ) : null}
                        </DragOverlay>
                    </DndContext>
                </div>
            </div>
        </div>
    )
}

export default DragDropTable