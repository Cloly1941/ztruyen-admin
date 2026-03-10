// ** Tanstack Table
import {
    type ColumnDef,
    type ColumnFiltersState,
    type PaginationState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable, type SortingState, getSortedRowModel,
} from "@tanstack/react-table"

// ** Shadcn ui
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {Input} from "@/components/ui/input"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"

// ** Component
import Button from "@/components/common/Button"

// ** React
import {useState} from "react"
import {ChevronLeft, ChevronRight} from "lucide-react";

interface DataTableClientProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    searchField?: keyof TData & string;
    searchPlaceholder?: string;
}

export function DataTableClient<TData, TValue>({
                                                   columns,
                                                   data,
                                                   searchField,
                                                   searchPlaceholder = 'Tìm kiếm...'
                                               }: DataTableClientProps<TData, TValue>) {

    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 5,
    });

    const [sorting, setSorting] = useState<SortingState>([]);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        state: {
            columnFilters,
            pagination,
            sorting
        },
    })

    return (
        <div className="space-y-4 overflow-hidden rounded-md border pb-4 px-4 max-w-sm sm:max-w-md">

            {/* Search */}
            {searchField && (
                <div className="pt-4">
                    <Input
                        placeholder={searchPlaceholder}
                        value={(table.getColumn(searchField)?.getFilterValue() as string) ?? ""}
                        onChange={(e) => table.getColumn(searchField)?.setFilterValue(e.target.value)}
                    />
                </div>
            )}

            {/* Table */}
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(header.column.columnDef.header, header.getContext())}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                Không có dữ liệu để hiển thị.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex items-center justify-between gap-2 pt-2">
                <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground whitespace-nowrap">Hiển thị</p>
                    <Select
                        value={String(pagination.pageSize)}
                        onValueChange={(val) => table.setPageSize(Number(val))}
                    >
                        <SelectTrigger className="w-16 h-8">
                            <SelectValue/>
                        </SelectTrigger>
                        <SelectContent>
                            {[5, 10, 20].map((size) => (
                                <SelectItem key={size} value={String(size)}>{size}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground whitespace-nowrap">
                        {pagination.pageIndex + 1} / {table.getPageCount()}
                    </p>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <ChevronLeft/>
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <ChevronRight/>
                    </Button>
                </div>
            </div>
        </div>
    )
}