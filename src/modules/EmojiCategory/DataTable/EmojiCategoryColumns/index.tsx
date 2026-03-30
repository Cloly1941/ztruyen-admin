// ** Tanstack Table Column
import type {ColumnDef} from "@tanstack/react-table"

// ** Types
import type {ICategoryEmoji, IImage} from "@/types/backend";

// ** Dayjs
import dayjs from "dayjs";

// ** Component
import {DataTableColumnHeader} from "@/components/common/DataTableColumnHeader";

// ** Utils
import {renderActiveBadge} from "@/utils/renderActiveBadge.tsx";

// ** Module
import DropdownAction from "@/modules/EmojiCategory/DataTable/EmojiCategoryColumns/DropdownAction";

export const EmojiCategoryColumns: ColumnDef<ICategoryEmoji>[] = [
    // Name
    {
        accessorKey: "name",
        header: ({column}) => <DataTableColumnHeader column={column} title="Tên emoji"/>,
        cell: ({row}) => <span className="font-medium">{row.getValue("name")}</span>,
    },
    // Content
    {
        accessorKey: "image",
        header: "Emoji",
        cell: ({row}) => {
            const image = row.getValue<IImage>("image")
            return (
                <img
                    src={image?.url}
                    alt={row.getValue("name")}
                    className="size-6 object-contain"
                />
            )
        }
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

            const categoryId = data._id
            const isActive = data.isActive

            return <DropdownAction categoryId={categoryId} isActive={isActive}/>
        },
    },
]