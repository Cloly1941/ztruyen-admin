// ** Tanstack Table
import type {Column} from "@tanstack/react-table"

// ** Icons
import {ArrowDown, ArrowUp, ChevronsUpDown, EyeOff} from "lucide-react"

// ** Shadcn ui
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger} from "@/components/ui/dropdown-menu.tsx"

// ** Component
import Button from "@/components/common/Button"

type TDataTableColumnHeader<T> = {
    column: Column<T>
    title: string
}

export function DataTableColumnHeader<T>({column, title}: TDataTableColumnHeader<T>) {
    if (!column.getCanSort()) return <span>{title}</span>

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Button variant="ghost" isTable>
                    {title}
                    {column.getIsSorted() === "asc"
                        ? <ArrowUp/>
                        : column.getIsSorted() === "desc"
                            ? <ArrowDown/>
                            : <ChevronsUpDown/>
                    }
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
                    <ArrowUp className="text-muted-foreground"/>
                    Tăng dần
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
                    <ArrowDown className="text-muted-foreground"/>
                    Giảm dần
                </DropdownMenuItem>
                <DropdownMenuSeparator/>
                <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
                    <EyeOff className="text-muted-foreground"/>
                    Ẩn cột
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}