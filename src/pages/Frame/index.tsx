// ** Helmet
import {Helmet} from "react-helmet-async";

// ** Component
import DataTableServer from "@/components/common/DataTableServer";
import AlertDialogActionBtn from "@/components/common/AlertDialogActionBtn";

// ** Modules
import FrameCreateForm from "@/modules/Frame/FrameCreateForm";

// ** Columns
import {FrameColumns} from "@/modules/Frame/DataTable/FrameColumns";

// ** Config
import {CONFIG_QUERY_KEY} from "@/configs/query-key";

// ** Service
import {FrameService} from "@/services/frame";

const ListFrame = () => {

    return (
        <>
            <Helmet>
                <title>Danh sách khung avatar người dùng - ZTruyen Admin</title>
                <meta name="description" content="Danh sách khung avatar người dùng của ZTruyen"/>
                <meta name="robots" content="noindex, nofollow"/>
            </Helmet>

            <DataTableServer
                contentAddBtn={(close) => (
                    <FrameCreateForm onSuccess={close}/>
                )}
                title='khung'
                queryKey={CONFIG_QUERY_KEY.FRAME.LIST}
                queryFn={FrameService.list}
                searchField='name'
                columns={FrameColumns}
                searchPlaceholder='Tìm kiếm tên khung ...'
                columnLabels={{
                    name: "Tên",
                    image: "Khung avatar",
                    actions: "Hành động",
                    createdAt: "Ngày tạo",
                    updatedAt: "Ngày cập nhật",
                }}
                deleteMultipleLabel='Xoá'
                deleteMultipleSubLabel='khung'
                onDeleteMultiple={(selectedIds, onSuccess, open, onOpenChange) => (
                    <AlertDialogActionBtn
                        title='khung'
                        action='delete-multiple'
                        ids={selectedIds}
                        queryKey={CONFIG_QUERY_KEY.FRAME.LIST}
                        api={() => FrameService.multiDelete(selectedIds)}
                        open={open}
                        onOpenChange={onOpenChange}
                        onSuccess={onSuccess}
                    />
                )}
            />
        </>
    )
}

export default ListFrame