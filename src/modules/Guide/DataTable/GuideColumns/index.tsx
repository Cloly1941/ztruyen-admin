// ** Tanstack Table Column
import type {ColumnDef} from "@tanstack/react-table"

// ** Shadcn ui
import {Checkbox} from "@/components/ui/checkbox"

// ** Types
import type {IGuide} from "@/types/backend";

// ** Dayjs
import dayjs from "dayjs";

// ** Component
import {DataTableColumnHeader} from "@/components/common/DataTableColumnHeader";

// ** Module
import DropdownAction from "@/modules/Guide/DataTable/GuideColumns/DropdownAction";

// ** Utils
import {renderActiveBadge} from "@/utils/renderActiveBadge.tsx";

export const GuideColumns: ColumnDef<IGuide>[] = [
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
    // Title
    {
        accessorKey: "title",
        header: ({column}) => <DataTableColumnHeader column={column} title="Tiêu đề"/>,
        cell: ({row}) => <span className="font-medium">{row.getValue("title")}</span>,
    },
    // Desc
    {
        accessorKey: "description",
        header: ({column}) => <DataTableColumnHeader column={column} title="Mô tả"/>,
        cell: ({row}) => <span className="font-medium">{row.getValue("description")}</span>,
    },
    // Content
    {
        accessorKey: "content",
        header: ({column}) => <DataTableColumnHeader column={column} title="Nội dung"/>,
        cell: ({row}) => <span>{row.getValue("content")}</span>,
    },

    // Platform
    {
        accessorKey: "platform",
        header: ({column}) => <DataTableColumnHeader column={column} title="Thiết bị"/>,
        cell: ({row}) => <span className="font-medium">{row.getValue("platform")}</span>,
    },
    // Status
    {
        accessorKey: "isActive",
        header: ({column}) => <DataTableColumnHeader column={column} title="Trạng thái"/>,
        cell: ({row}) => renderActiveBadge(row.getValue<boolean>("isActive")),
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
            const guideId = data._id
            const isActive = data.isActive
            return <DropdownAction guideId={guideId} isActive={isActive}/>
        },
    },
]