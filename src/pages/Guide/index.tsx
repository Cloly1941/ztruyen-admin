// ** React helmet
import {Helmet} from "react-helmet-async";

// ** Components
import DataTableServer from "@/components/common/DataTableServer";
import AlertDialogActionBtn from "@/components/common/AlertDialogActionBtn";

// ** Module
import {GuideColumns} from "@/modules/Guide/DataTable/GuideColumns";

// ** Services
import {GuideService} from "@/services/guide";

// ** Config
import {CONFIG_QUERY_KEY} from "@/configs/query-key";

// ** Module
import GuideCreate from "@/modules/Guide/GuideCreateForm";
import GuideFilterGroup from "@/modules/Guide/DataTable/GuideFilterGroup";

const ListGuide = () => {
    return (
        <>
            <Helmet>
                <title>Danh sách hướng dẫn - ZTruyen Admin</title>
                <meta name="description" content="Danh sách hướng dẫn của ZTruyen"/>
                <meta name="robots" content="noindex, nofollow"/>
            </Helmet>

            <DataTableServer
                contentAddBtn={(close) => (
                    <GuideCreate onSuccess={close}/>
                )}
                title='hướng dẫn'
                queryKey={CONFIG_QUERY_KEY.GUIDE.LIST}
                queryFn={GuideService.list}
                searchField='title'
                columns={GuideColumns}
                searchPlaceholder='Tìm kiếm theo tiêu đề ...'
                columnLabels={{
                    title: "Tiêu đề",
                    isActive: 'Trạng thái',
                    description: 'Mô tả',
                    platform: 'Thiết bị',
                    content: 'Nội dung',
                    actions: "Hành động",
                    createdAt: "Ngày tạo",
                    updatedAt: 'Ngày cập nhật'
                }}
                toolbar={(filters, onFilterChange) => (
                    <GuideFilterGroup
                        filters={filters}
                        onFilterChange={onFilterChange}
                    />
                )}
                deleteMultipleLabel='Xoá'
                deleteMultipleSubLabel='hướng dẫn'
                onDeleteMultiple={(selectedIds, onSuccess, open, onOpenChange) => (
                    <AlertDialogActionBtn
                        title='hướng dẫn'
                        action='delete-multiple'
                        ids={selectedIds}
                        queryKey={CONFIG_QUERY_KEY.GUIDE.LIST}
                        api={() => GuideService.multiDelete(selectedIds)}
                        open={open}
                        onOpenChange={onOpenChange}
                        onSuccess={onSuccess}
                    />
                )}
            />
        </>
    )
}

export default ListGuide