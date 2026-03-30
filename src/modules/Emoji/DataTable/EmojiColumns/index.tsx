// ** Tanstack Table Column
import type {ColumnDef} from "@tanstack/react-table"

// ** Shadcn ui
import {Checkbox} from "@/components/ui/checkbox"

// ** Types
import type {IEmoji, TType} from "@/types/backend";

// ** Dayjs
import dayjs from "dayjs";

// ** Component
import {DataTableColumnHeader} from "@/components/common/DataTableColumnHeader";

// ** Utils
import {renderTypeBadge} from "@/utils/renderTypeBadge.tsx";
import {renderActiveBadge} from "@/utils/renderActiveBadge.tsx";

// ** Module


export const EmojiColumns: ColumnDef<IEmoji>[] = [
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
    // Name
    {
        accessorKey: "name",
        header: ({column}) => <DataTableColumnHeader column={column} title="Tên emoji"/>,
        cell: ({row}) => <span className="font-medium">{row.getValue("name")}</span>,
    },
    // Type
    {
        accessorKey: "type",
        header: ({column}) => <DataTableColumnHeader column={column} title="Loại"/>,
        cell: ({row}) => renderTypeBadge(row.getValue<TType>("type"))
    },
    // Content (text or image)
    {
        id: "content",
        header: "Emoji",
        cell: ({row}) => {
            const type = row.getValue<TType>("type")
            const text = row.original.text
            const image = row.original.image

            if (type === "image" && image) {
                return (
                    <img
                        src={image}
                        alt={row.getValue("name")}
                        className="w-8 h-8 object-contain"
                    />
                )
            }

            return <span className="text-sm">{text ?? "—"}</span>
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

            // return <ActionGroup userId={userId}/>
        },
    },
]