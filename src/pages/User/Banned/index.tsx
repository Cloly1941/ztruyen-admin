// ** Helmet
import {Helmet} from "react-helmet-async";

// ** Component
import DataTableServer from "@/components/common/DataTableServer";
import AlertDialogActionBtn from "@/components/common/AlertDialogActionBtn";

// ** Modules
import UserFilterGroup from "@/modules/User/DataTable/UserFilterGroup";

// ** Columns
import {BannedUserColumns} from "@/modules/User/DataTable/BannedUserColumns";

// ** Config
import {CONFIG_QUERY_KEY} from "@/configs/query-key";

// ** Service
import {UserService} from "@/services/user";

const BannedUser = () => {
    return (
        <>
            <Helmet>
                <title>Danh sách người dùng bị cấm - ZTruyen Admin</title>
                <meta name="description" content="Danh sách người dùng bị cấm của ZTruyen"/>
                <meta name="robots" content="noindex, nofollow"/>
            </Helmet>

            <div className='space-y-4'>
                <DataTableServer
                    title='người dùng bị cấm'
                    queryKey={CONFIG_QUERY_KEY.USER.LIST_TRASH}
                    queryFn={UserService.listTrash}
                    searchField='name'
                    columns={BannedUserColumns}
                    searchPlaceholder='Tìm kiếm tên người dùng bị cấm ...'
                    columnLabels={{
                        avatar: 'Ảnh đại diện',
                        name: 'Tên',
                        email: 'Email',
                        age: 'Tuổi',
                        provider: 'Loại tài khoản',
                        createdAt: 'Ngày tạo',
                        updatedAt: 'Ngày cập nhật',
                        actions: 'Hành động'
                    }}
                    toolbar={(filters, onFilterChange, rangeFilters, onRangeFilterChange) => (
                        <UserFilterGroup
                            filters={filters}
                            onFilterChange={onFilterChange}
                            rangeFilters={rangeFilters}
                            onRangeFilterChange={onRangeFilterChange}
                        />
                    )}
                    deleteMultipleLabel='Xoá'
                    deleteMultipleSubLabel='nguời dùng'
                    onDeleteMultiple={(selectedIds, onSuccess, open, onOpenChange) => (
                        <AlertDialogActionBtn
                            title='nguời dùng'
                            action='delete-multiple'
                            ids={selectedIds}
                            queryKey={CONFIG_QUERY_KEY.USER.LIST_TRASH}
                            api={() => UserService.multiDelete(selectedIds)}
                            open={open}
                            onOpenChange={onOpenChange}
                            onSuccess={onSuccess}
                        />
                    )}
                    onRestoreMultiple={(selectedIds, onSuccess, open, onOpenChange) => (
                        <AlertDialogActionBtn
                            title='nguời dùng'
                            action='restore-multiple'
                            ids={selectedIds}
                            queryKey={CONFIG_QUERY_KEY.USER.LIST_TRASH}
                            api={() => UserService.multiRestore(selectedIds)}
                            open={open}
                            onOpenChange={onOpenChange}
                            onSuccess={onSuccess}
                        />
                    )}
                />

            </div>
        </>
    )
}

export default BannedUser