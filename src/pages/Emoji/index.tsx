// ** React helmet
import {Helmet} from "react-helmet-async";

// ** Components
import DataTableServer from "@/components/common/DataTableServer";
import AlertDialogActionBtn from "@/components/common/AlertDialogActionBtn";

// ** Module
import {EmojiColumns} from "@/modules/Emoji/DataTable/EmojiColumns";

// ** Services
import {EmojiService} from "@/services/emoji";

// ** Config
import {CONFIG_QUERY_KEY} from "@/configs/query-key";

// ** Module
import EmojiCreateForm from "@/modules/Emoji/EmojiCreateForm";
import EmojiFilterGroup from "@/modules/Emoji/DataTable/EmojiFilterGroup";


const ListEmoji = () => {
    return (
        <>
            <Helmet>
                <title>Danh sách emoji - ZTruyen Admin</title>
                <meta name="description" content="Danh sách emoji của ZTruyen"/>
                <meta name="robots" content="noindex, nofollow"/>
            </Helmet>

            <DataTableServer
                contentAddBtn={(close) => (
                    <EmojiCreateForm onSuccess={close}/>
                )}
                title='emoji'
                queryKey={CONFIG_QUERY_KEY.EMOJI.LIST}
                queryFn={EmojiService.list}
                searchField='name'
                columns={EmojiColumns}
                searchPlaceholder='Tìm kiếm theo tên ...'
                columnLabels={{
                    name: "Tên emoji",
                    isActive: 'Trạng thái',
                    type: 'Loại',
                    content: 'Emoji',
                    category: 'Danh mục',
                    actions: "Hành động",
                    createdAt: "Ngày tạo",
                    updatedAt: 'Ngày cập nhật'
                }}
                toolbar={(filters, onFilterChange) => (
                    <EmojiFilterGroup
                        filters={filters}
                        onFilterChange={onFilterChange}
                    />
                )}
                deleteMultipleLabel='Xoá'
                deleteMultipleSubLabel='emoji'
                onDeleteMultiple={(selectedIds, onSuccess, open, onOpenChange) => (
                    <AlertDialogActionBtn
                        title='emoji'
                        action='delete-multiple'
                        ids={selectedIds}
                        queryKey={CONFIG_QUERY_KEY.EMOJI.LIST}
                        api={() => EmojiService.multiDelete(selectedIds)}
                        open={open}
                        onOpenChange={onOpenChange}
                        onSuccess={onSuccess}
                    />
                )}
            />
        </>
    )
}

export default ListEmoji