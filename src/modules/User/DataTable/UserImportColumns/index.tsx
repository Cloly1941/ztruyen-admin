// ** Tanstack Table Column
import type {ColumnDef} from "@tanstack/react-table"

// ** Component
import Button from "@/components/common/Button"

// ** Types
import type {IUserImportColumn} from "@/types/columns";
import type {TProvider} from "@/types/backend";

// ** Icons
import {ArrowUpDown} from "lucide-react"

// ** Utils
import {getProviderIcon} from "@/utils/getProviderIcon.ts";
import {renderGenderBadge} from "@/utils/renderGenderBadge.tsx";

export const UserImportColumns: ColumnDef<IUserImportColumn>[] = [
    // Name
    {
        accessorKey: "name",
        header: ({column}) => (
            <Button size='sm' variant="ghost" isTable
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Tên
                <ArrowUpDown/>
            </Button>
        ),
        cell: ({row}) => <span className="font-medium">{row.getValue("name")}</span>,
    },
    // Email
    {
        accessorKey: "email",
        header: ({column}) => (
            <Button size='sm' variant="ghost" isTable
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Email
                <ArrowUpDown/>
            </Button>
        ),
    },
    // Gender
    {
        accessorKey: "gender",
        header: ({column}) => (
            <Button size='sm' variant="ghost" isTable
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Giới tính
                <ArrowUpDown/>
            </Button>
        ),
        cell: ({row}) => renderGenderBadge(row.getValue("gender")),
    },
    // Age
    {
        accessorKey: "age",
        header: ({column}) => (
            <Button size='sm' variant="ghost" isTable
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Tuổi
                <ArrowUpDown/>
            </Button>
        ),
        cell: ({row}) => <span className="font-medium">{row.getValue("age")}</span>,
    },
    // Provider
    {
        accessorKey: "provider",
        header: ({column}) => (
            <Button size='sm' variant="ghost" isTable
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Loại tài khoản
                <ArrowUpDown/>
            </Button>
        ),
        cell: ({row}) => {
            const provider = row.getValue<string>("provider")
            const urlImgProvider = getProviderIcon(provider as TProvider)
            return <img src={urlImgProvider} alt={`${provider} icon`} className='size-5 ml-9'/>
        },
    },
]