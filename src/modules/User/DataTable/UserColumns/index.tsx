// ** Tanstack Table Column
import type {ColumnDef} from "@tanstack/react-table"

// ** Shadcn ui
import {Checkbox} from "@/components/ui/checkbox"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";

// ** Types
import type {IImage, IUser, TProvider} from "@/types/backend";

// ** Dayjs
import dayjs from "dayjs";

// ** Utils
import {getProviderIcon} from "@/utils/getProviderIcon.ts";
import {renderGenderBadge} from "@/utils/renderGenderBadge.tsx";

// ** Dropdown action
import DropdownAction from "@/modules/User/DataTable/UserColumns/DropdownAction";

// ** Component
import {DataTableColumnHeader} from "@/components/common/DataTableColumnHeader";

export const UserColumns: ColumnDef<IUser>[] = [
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
        accessorKey: "avatar",
        header: "Ảnh đại diện",
        cell: ({row}) => {
            const avatar = row.getValue<IImage | undefined>("avatar")
            return (
                <div className='ml-2'>
                    <Avatar>
                        <AvatarImage src={avatar?.url} alt={row.getValue("name")}/>
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
    // Email
    {
        accessorKey: "email",
        header: ({column}) => <DataTableColumnHeader column={column} title="Email"/>,
    },
    // Gender
    {
        accessorKey: "gender",
        header: ({column}) => <DataTableColumnHeader column={column} title="Giới tính"/>,
        cell: ({row}) => renderGenderBadge(row.getValue("gender")),
    },
    // Age
    {
        accessorKey: "age",
        header: ({column}) => <DataTableColumnHeader column={column} title="Tuổi"/>,
        cell: ({row}) => <span className="font-medium">{row.getValue("age")}</span>,
    },
    // Provider
    {
        accessorKey: "provider",
        header: ({column}) => <DataTableColumnHeader column={column} title="Loại tài khoản"/>,
        cell: ({row}) => {
            const provider = row.getValue<string>("provider")
            const urlImgProvider = getProviderIcon(provider as TProvider)
            return <img src={urlImgProvider} alt={`${provider} icon`} className='size-5 ml-9'/>
        },
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
        cell: ({row}) => {
            const data = row.original
            const userId = data._id
            return <DropdownAction userId={userId} provider={data.provider}/>
        },
    },
]