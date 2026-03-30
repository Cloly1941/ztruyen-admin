// ** React helmet
import {Helmet} from "react-helmet-async";

// ** Components
import DataTableServer from "@/components/common/DataTableServer";
import AlertDialogActionBtn from "@/components/common/AlertDialogActionBtn";

// ** Module
import {CommentColumns} from "@/modules/Comment/DataTable/CommentColumns";

// ** Services
import {CommentService} from "@/services/comment";

// ** Config
import {CONFIG_QUERY_KEY} from "@/configs/query-key";


const ListComment = () => {
    return (
        <>
            <Helmet>
                <title>Danh sách bình luận - ZTruyen Admin</title>
                <meta name="description" content="Danh sách bình luận của ZTruyen"/>
                <meta name="robots" content="noindex, nofollow"/>
            </Helmet>

            <DataTableServer
                title='bình luận'
                queryKey={CONFIG_QUERY_KEY.COMMENT.LIST}
                queryFn={CommentService.list}
                searchField='comicName'
                defaultSort={{id: "createdAt", desc: true}}
                columns={CommentColumns}
                searchPlaceholder='Tìm kiếm theo truyện ...'
                columnLabels={{
                    comicName: "Tên truyện",
                    content: 'Bình luận',
                    actions: "Hành động",
                    createdAt: "Ngày bình luận",
                    userId: 'Tên người dùng'
                }}
                deleteMultipleLabel='Xoá'
                deleteMultipleSubLabel='bình luận'
                onDeleteMultiple={(selectedIds, onSuccess, open, onOpenChange) => (
                    <AlertDialogActionBtn
                        title='bình luận'
                        action='delete-multiple'
                        ids={selectedIds}
                        queryKey={CONFIG_QUERY_KEY.COMMENT.LIST}
                        api={() => CommentService.multiDelete(selectedIds)}
                        open={open}
                        onOpenChange={onOpenChange}
                        onSuccess={onSuccess}
                    />
                )}
            />
        </>
    )
}

export default ListComment