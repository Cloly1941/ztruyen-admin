// ** Tanstack Table Column
import type {ColumnDef} from "@tanstack/react-table"

// ** Shadcn ui
import {Checkbox} from "@/components/ui/checkbox"

// ** Types
import type {IComment, IUserComment} from "@/types/backend";

// ** Dayjs
import dayjs from "dayjs";

// ** Component
import {DataTableColumnHeader} from "@/components/common/DataTableColumnHeader";

// ** Module
import ActionGroup from "@/modules/Comment/DataTable/ActionGroup";

export const CommentColumns: ColumnDef<IComment>[] = [
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
    // user name
    {
        accessorKey: "userId",
        header: ({column}) => <DataTableColumnHeader column={column} title="Tên người dùng"/>,
        cell: ({row}) => {
            const user = row.getValue<IUserComment | undefined>("userId")
            return (
                <span className="font-medium">{user?.name}</span>
            )
        },
    },
    // content comment
    {
        accessorKey: "content",
        header: ({column}) => <DataTableColumnHeader column={column} title="Nội dung bình luận"/>,
        cell: ({row}) => <span>{row.getValue("content")}</span>,
    },
    // Comic name
    {
        accessorKey: "comicName",
        header: ({column}) => <DataTableColumnHeader column={column} title="Tên truyện"/>,
        cell: ({row}) => <span className="font-medium">{row.getValue("comicName")}</span>,
    },
    // Created at
    {
        accessorKey: "createdAt",
        header: ({column}) => <DataTableColumnHeader column={column} title="Ngày bình luận"/>,
        cell: ({row}) => {
            const date = row.getValue<string>("createdAt")
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
            const commentId = data._id
            return <ActionGroup commentId={commentId}/>
        },
    },
]