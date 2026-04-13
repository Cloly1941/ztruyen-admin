// ** React helmet
import {Helmet} from "react-helmet-async";

// ** Components
import DataTableServer from "@/components/common/DataTableServer";
import AlertDialogActionBtn from "@/components/common/AlertDialogActionBtn";

// ** Module
import {AnnouncementColumns} from "@/modules/Announcement/DataTable/AnnouncementColumns";

// ** Services
import {AnnouncementService} from "@/services/announcement";

// ** Config
import {CONFIG_QUERY_KEY} from "@/configs/query-key";

// ** Module
import AnnouncementCreate from "@/modules/Announcement/AnnouncementCreateForm";
import AnnouncementFilterGroup from "@/modules/Announcement/DataTable/AnnouncementFilterGroup";

const ListAnnouncement = () => {
    return (
        <>
            <Helmet>
                <title>Danh sách thông báo - ZTruyen Admin</title>
                <meta name="description" content="Danh sách thông báo của ZTruyen"/>
                <meta name="robots" content="noindex, nofollow"/>
            </Helmet>

            <DataTableServer
                contentAddBtn={(close) => (
                    <AnnouncementCreate onSuccess={close}/>
                )}
                title='thông báo'
                queryKey={CONFIG_QUERY_KEY.ANNOUNCEMENT.LIST}
                queryFn={AnnouncementService.list}
                searchField='title'
                columns={AnnouncementColumns}
                searchPlaceholder='Tìm kiếm theo tiêu đề ...'
                columnLabels={{
                    title: "Tiêu đề",
                    isActive: 'Trạng thái',
                    type: 'Loại',
                    content: 'Nội dung',
                    actions: "Hành động",
                    createdAt: "Ngày tạo",
                    updatedAt: 'Ngày cập nhật'
                }}
                toolbar={(filters, onFilterChange) => (
                    <AnnouncementFilterGroup
                        filters={filters}
                        onFilterChange={onFilterChange}
                    />
                )}
                deleteMultipleLabel='Xoá'
                deleteMultipleSubLabel='thông báo'
                onDeleteMultiple={(selectedIds, onSuccess, open, onOpenChange) => (
                    <AlertDialogActionBtn
                        title='thông báo'
                        action='delete-multiple'
                        ids={selectedIds}
                        queryKey={CONFIG_QUERY_KEY.ANNOUNCEMENT.LIST}
                        api={() => AnnouncementService.multiDelete(selectedIds)}
                        open={open}
                        onOpenChange={onOpenChange}
                        onSuccess={onSuccess}
                    />
                )}
            />
        </>
    )
}

export default ListAnnouncement