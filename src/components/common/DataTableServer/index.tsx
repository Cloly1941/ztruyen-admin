import {flexRender, getCoreRowModel, getSortedRowModel, useReactTable, type ColumnDef} from "@tanstack/react-table"
import type {TQueryParams, TRangeFilter} from "@/hooks/common/useDataTable"
import {useDataTable} from "@/hooks/common/useDataTable"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";
import {Input} from "@/components/ui/input.tsx";
import Button from "@/components/common/Button";
import {
    DropdownMenu, DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel, DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";

import {Columns2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Trash2, ArchiveRestore} from "lucide-react";
import {type ReactNode, useState} from "react";
import ExportButton from "@/components/common/ExportButton";
import DialogActionBtn from "@/components/common/DialogActionBtn";

type TDataTableServerProps<T> = {
    queryKey: string
    queryFn: (params: TQueryParams) => Promise<IBackendRes<IModelPaginate<T>>>
    columns: ColumnDef<T>[]
    searchPlaceholder?: string
    toolbar?: (
        filters: Record<string, string[]>,
        onFilterChange: (f: Record<string, string[]>) => void,
        rangeFilters: Record<string, TRangeFilter>,
        onRangeFilterChange: (f: Record<string, TRangeFilter>) => void
    ) => ReactNode
    columnLabels?: Partial<Record<keyof T | "actions" | "content", string>>
    searchField: string;
    defaultSort?: { id: string; desc: boolean }
    title?: string
    onExport?: (params: TQueryParams) => void
    contentAddBtn?: (close: () => void) => ReactNode
    onImport?: (close: () => void) => ReactNode
    onDeleteMultiple?: (
        selectedIds: string[],
        onSuccess: () => void,
        open: boolean,
        onOpenChange: (open: boolean) => void,
    ) => ReactNode;
    deleteMultipleLabel?: string;
    deleteMultipleSubLabel?: string;
    onRestoreMultiple?: (
        selectedIds: string[],
        onSuccess: () => void,
        open: boolean,
        onOpenChange: (open: boolean) => void,
    ) => ReactNode;
    extraButtons?: ReactNode
}

const DataTableServer = <T, >({
                                  queryKey,
                                  queryFn,
                                  columns,
                                  searchPlaceholder = "Tìm kiếm...",
                                  toolbar,
                                  columnLabels = {},
                                  searchField,
                                  defaultSort,
                                  title,
                                  onExport,
                                  contentAddBtn,
                                  onImport,
                                  onDeleteMultiple,
                                  deleteMultipleLabel = "Xoá",
                                  deleteMultipleSubLabel,
                                  onRestoreMultiple,
                                  extraButtons
                              }: TDataTableServerProps<T>) => {
    const {
        data, pageCount, total, isLoading,
        search, handleSearch,
        sorting, setSorting,
        columnVisibility, setColumnVisibility,
        rowSelection, setRowSelection,
        pagination, setPagination,
        filters, handleFilterChange,
        rangeFilters, handleRangeFilterChange, params,
    } = useDataTable<T>({queryKey, queryFn, searchField, defaultSort})

    const table = useReactTable({
        data,
        columns,
        pageCount,
        manualSorting: true,
        manualPagination: true,
        manualFiltering: true,
        onSortingChange: setSorting,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: {sorting, columnVisibility, rowSelection, pagination},
    })

    const [addOpen, setAddOpen] = useState(false)
    const [importOpen, setImportOpen] = useState(false)
    const [deleteMultiOpen, setDeleteMultiOpen] = useState(false)
    const [restoreMultiOpen, setRestoreMultiOpen] = useState(false)

    const selectedIds = table
        .getSelectedRowModel()
        .rows.map((row) => (row.original as T & { _id: string })._id)

    const clearSelection = () => table.resetRowSelection()

    return (
        <div className='space-y-4'>
            {/* Header */}
            <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3'>
                {title && <h1 className='text-2xl font-bold tracking-tight'>Danh sách {title}</h1>}
                <div className='flex gap-2'>
                    {selectedIds.length > 1 && (
                        <>
                            {/* Restore Multi */}
                            {
                                onRestoreMultiple && (
                                    <>
                                        <Button
                                            variant='secondary'
                                            onClick={() => setRestoreMultiOpen(true)}
                                        >
                                            <ArchiveRestore/>
                                            Khôi phục {selectedIds.length} {title}
                                        </Button>
                                        {onRestoreMultiple?.(selectedIds, clearSelection, restoreMultiOpen, setRestoreMultiOpen)}
                                    </>
                                )
                            }

                            {/* Delete Multi */}
                            <Button
                                onClick={() => setDeleteMultiOpen(true)}
                            >
                                <Trash2/>
                                {deleteMultipleLabel} {selectedIds.length} {deleteMultipleSubLabel}
                            </Button>
                            {onDeleteMultiple?.(selectedIds, clearSelection, deleteMultiOpen, setDeleteMultiOpen)}
                        </>
                    )}
                    {extraButtons}
                    {onImport && (
                        <DialogActionBtn
                            title={title}
                            render={onImport}
                            action='import'
                            open={importOpen}
                            onOpenChange={setImportOpen}
                        />)}

                    {onExport &&
                        <ExportButton
                            onExport={onExport}
                            params={params}
                        />}
                    {contentAddBtn && (
                        <DialogActionBtn
                            title={title}
                            render={contentAddBtn}
                            open={addOpen}
                            onOpenChange={setAddOpen}
                        />)}
                </div>
            </div>

            <div className="space-y-4 pt-2">
                {/* Toolbar */}
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <Input
                            placeholder={searchPlaceholder}
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="max-w-sm"
                        />
                        {toolbar?.(filters, handleFilterChange, rangeFilters, handleRangeFilterChange)}
                    </div>
                    <div className="flex items-center gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <Button variant="outline">
                                    <span className='hidden lg:block'>Cột hiển thị</span>
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
                                            {(columnLabels as Record<string, string>)[col.id] ?? col.id}
                                        </DropdownMenuCheckboxItem>
                                    ))}
                                <DropdownMenuSeparator/>
                                <Button
                                    variant="ghost"
                                    size='sm'
                                    className="w-full"
                                    onClick={() => table.resetColumnVisibility()}
                                >
                                    Hiển thị tất cả
                                </Button>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Table */}
                <div className="rounded-md border relative">
                    {isLoading && (
                        <div
                            className="absolute inset-0 bg-background/50 flex items-center justify-center z-10 rounded-md">
                            <span className="text-sm text-muted-foreground">Đang tải...</span>
                        </div>
                    )}
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((hg) => (
                                <TableRow key={hg.id}>
                                    {hg.headers.map((header) => (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder ? null : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
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
                                !isLoading && (
                                    <TableRow>
                                        <TableCell colSpan={columns.length} className="h-24 text-center">
                                            Không có dữ liệu.
                                        </TableCell>
                                    </TableRow>
                                )
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-sm text-muted-foreground hidden sm:block">
                    Tổng: {total} bản ghi
                </span>

                    <div className="flex items-center gap-1 text-sm flex-wrap justify-center">

                        <div className="flex items-center gap-2 mr-2">
                            <span className="text-sm text-muted-foreground hidden md:block">Số hàng mỗi trang</span>
                            <Select
                                value={String(pagination.pageSize)}
                                onValueChange={(val) => setPagination(prev => ({
                                    ...prev,
                                    pageSize: Number(val),
                                    pageIndex: 0
                                }))}
                            >
                                <SelectTrigger className="h-8 w-[70px]">
                                    <SelectValue/>
                                </SelectTrigger>
                                <SelectContent>
                                    {[5, 10, 20, 50].map(size => (
                                        <SelectItem key={size} value={String(size)}>{size}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* First */}
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0"
                                onClick={() => table.setPageIndex(0)}
                                disabled={!table.getCanPreviousPage() || isLoading}
                        >
                            <ChevronsLeft/>
                        </Button>

                        {/* Prev */}
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0"
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage() || isLoading}
                        >
                            <ChevronLeft/>
                        </Button>

                        <div className="hidden sm:flex items-center gap-1">
                            {Array.from({length: pageCount}, (_, i) => i + 1)
                                .filter(page => {
                                    const current = pagination.pageIndex + 1
                                    return page === 1 || page === pageCount || Math.abs(page - current) <= 1
                                })
                                .reduce<(number | "...")[]>((acc, page, idx, arr) => {
                                    if (idx > 0 && (page as number) - (arr[idx - 1] as number) > 1) acc.push("...")
                                    acc.push(page)
                                    return acc
                                }, [])
                                .map((page, idx) =>
                                    page === "..." ? (
                                        <span key={`ellipsis-${idx}`}
                                              className="h-8 w-8 flex items-center justify-center text-muted-foreground">...</span>
                                    ) : (
                                        <Button
                                            key={page}
                                            variant={pagination.pageIndex + 1 === page ? "default" : "outline"}
                                            size="sm"
                                            className="h-8 w-8 p-0"
                                            onClick={() => table.setPageIndex((page as number) - 1)}
                                            disabled={isLoading}
                                        >
                                            {page}
                                        </Button>
                                    )
                                )}
                        </div>


                        <span className="sm:hidden text-sm text-muted-foreground px-2">
                        {pagination.pageIndex + 1} / {pageCount}
                    </span>

                        {/* Next */}
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0"
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage() || isLoading}
                        >
                            <ChevronRight/>
                        </Button>

                        {/* Last */}
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0"
                                onClick={() => table.setPageIndex(pageCount - 1)}
                                disabled={!table.getCanNextPage() || isLoading}
                        >
                            <ChevronsRight/>
                        </Button>

                        <span className="text-muted-foreground ml-2 hidden sm:block">
                        Trang {pagination.pageIndex + 1} / {pageCount}
                    </span>
                    </div>

                    <span className="text-sm text-muted-foreground sm:hidden">
                    Tổng: {total} bản ghi
                </span>
                </div>
            </div>
        </div>
    )
}

export default DataTableServer