// ** Tanstack Table Column
import type {ColumnDef} from "@tanstack/react-table"

// ** Shadcn ui
import {Checkbox} from "@/components/ui/checkbox"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";

// ** Types
import type {IImage, IFrame} from "@/types/backend";

// ** Dayjs
import dayjs from "dayjs";

// ** Component
import {DataTableColumnHeader} from "@/components/common/DataTableColumnHeader";

// ** Module
import DropdownAction from "@/modules/Frame/DataTable/DropdownAction";

export const FrameColumns: ColumnDef<IFrame>[] = [
    // Checkbox
    {
        id: "select",
        header: ({table}) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
            />
        ),
        cell: ({row}) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(v) => row.toggleSelected(!!v)}
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    // Avatar
    {
        accessorKey: "image",
        header: "Khung avatar",
        cell: ({row}) => {
            const frame = row.getValue<IImage | undefined>("image")
            return (
                <div className='ml-2'>
                    <Avatar size='lg'>
                        <AvatarImage src={frame?.url} alt={row.getValue("name")}/>
                        <AvatarFallback>
                            {row.getValue<string>("name")?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                </div>
            )
        }
    },
    // Name
    {
        accessorKey: "name",
        header: ({column}) => <DataTableColumnHeader column={column} title="Tên"/>,
        cell: ({row}) => <span className="font-medium">{row.getValue("name")}</span>,
    },
    // Created at
    {
        accessorKey: "createdAt",
        header: ({column}) => <DataTableColumnHeader column={column} title="Ngày tạo"/>,
        cell: ({row}) => {
            const date = row.getValue<string>("createdAt")
            return (
                <span className="text-muted-foreground text-sm">
                    {dayjs(date).format("HH:mm DD/MM/YYYY")}
                </span>
            )
        }
    },
    // Updated at
    {
        accessorKey: "updatedAt",
        header: ({column}) => <DataTableColumnHeader column={column} title="Ngày cập nhật"/>,
        cell: ({row}) => {
            const date = row.getValue<string>("updatedAt")
            return (
                <span className="text-muted-foreground text-sm">
                    {dayjs(date).format("HH:mm DD/MM/YYYY")}
                </span>
            )
        }
    },
    // Actions
    {
        id: "actions",
        header: "Hành động",
        cell: ({row}) => {
            const data = row.original
            const userId = data._id
            return <DropdownAction userId={userId}/>
        },
    },
]