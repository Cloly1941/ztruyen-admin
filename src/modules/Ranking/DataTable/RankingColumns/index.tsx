// ** Tanstack Table Column
import type {ColumnDef} from "@tanstack/react-table"

// ** Shadcn ui
import {Checkbox} from "@/components/ui/checkbox"

// ** Types
import type {IComic} from "@/types/backend";

// ** Dayjs
import dayjs from "dayjs";

// ** Component
import {DataTableColumnHeader} from "@/components/common/DataTableColumnHeader";

// ** Module
import ActionGroup from "@/modules/Ranking/DataTable/ActionGroup";

// ** Utils
import {renderCountryImg} from "@/utils/renderCountryImg.tsx";
import {renderColorTop} from "@/utils/renderColorTop.tsx";

// ** Config
import {CONFIG_IMAGE} from "@/configs/image";

// ** Utils
import {renderArrayBadge} from "@/utils/renderArrayBadge.tsx";
import {renderStatus} from "@/utils/renderStatus.tsx";

export const RankingColumns: ColumnDef<IComic>[] = [
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
        header: ({column}) => (
            <div className="w-[180px]">
                <DataTableColumnHeader column={column} title="Tên truyện"/>
            </div>
        ),
        cell: ({row}) => (
            <div className="w-[180px] whitespace-normal break-words font-medium">
                {row.getValue("name")}
            </div>
        ),
    },
    // ** Thumb
    {
        accessorKey: "thumb_url",
        header: 'Ảnh bìa',
        cell: ({row}) => {
            const data = row.original
            const name = data.name
            const thumbUrl = data?.thumb_url
            return (
                <img src={`${CONFIG_IMAGE.OTRUYEN_IMG}/${thumbUrl}`} alt={name}
                     className='aspect-[3/4] max-h-[180px] rounded-md overflow-hidden'/>
            )
        }
    },
    // ** Country
    {
        accessorKey: "country",
        header: ({column}) => <DataTableColumnHeader column={column} title="Quốc gia"/>,
        cell: ({row}) => (
            <div className='ml-4'>{renderCountryImg(row.getValue("country"))}</div>
        )
    },
    // ** Top
    {
        accessorKey: "rank",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Top"/>
        ),
        cell: ({row}) => {
            const rank = Number(row.getValue("rank"));

            return (
                <span className={`ml-1 font-bold text-[17px] ${renderColorTop(rank)}`}>
                    {rank}
                </span>
            );
        },
    },
    // Status
    {
        accessorKey: "status",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Trạng thái"/>
        ),
        cell: ({row}) => renderStatus(row.getValue("status")),
    },
    // Author
    {
        accessorKey: "authors",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Tác giả"/>
        ),
        cell: ({row}) => renderArrayBadge(row.getValue("authors")),
    },
    // Genres
    {
        accessorKey: "genres",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Thể loại"/>
        ),
        cell: ({row}) => renderArrayBadge(row.getValue("genres")),
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
            const comicId = data._id
            return <ActionGroup comicId={comicId} />
        },
    },
]