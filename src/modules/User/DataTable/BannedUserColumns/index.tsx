// ** Tanstack table
import type {ColumnDef} from "@tanstack/react-table"

// ** Module
import {UserColumns} from "@/modules/User/DataTable/UserColumns"
import DropdownAction from "@/modules/User/DataTable/BannedUserColumns/DropdownAction"

// ** Type
import type {IUser} from "@/types/backend"

export const BannedUserColumns: ColumnDef<IUser>[] = [
    ...UserColumns.filter((col) => col.id !== "actions"),
    {
        id: "actions",
        cell: ({row}) => {
            const data = row.original
            return <DropdownAction userId={data._id}/>
        },
    },
]