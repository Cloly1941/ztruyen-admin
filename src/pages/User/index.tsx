// ** Helmet
import {Helmet} from "react-helmet-async";

// ** Component
import DataTableServer from "@/components/common/DataTableServer";
import ImportDialog from "@/components/common/ImportDialog";

// ** Modules
import UserCreateForm from "@/modules/User/UserCreateForm";
import UserFilterGroup from "@/modules/User/DataTable/UserFilterGroup";

// ** Columns
import {UserColumns} from "@/modules/User/DataTable/UserColumns";
import {UserImportColumns} from "@/modules/User/DataTable/UserImportColumns";

// ** Config
import {CONFIG_QUERY_KEY} from "@/configs/query-key";
import {CONFIG_FIELD_EXCEL} from "@/configs/field-excel";

// ** Service
import {UserService} from "@/services/user";
import type {IUserImportColumn} from "@/types/columns";
import AlertDialogActionBtn from "@/components/common/AlertDialogActionBtn";

const ListUser = () => {

    return (
        <>
            <Helmet>
                <title>Danh sách người dùng - ZTruyen Admin</title>
                <meta name="description" content="Danh sách người dùng của ZTruyen"/>
                <meta name="robots" content="noindex, nofollow"/>
            </Helmet>

            <div className='space-y-4'>
                <DataTableServer
                    onImport={(close) => (
                        <ImportDialog<IUserImportColumn>
                            fieldMappings={CONFIG_FIELD_EXCEL.USER}
                            columns={UserImportColumns}
                            onSuccess={close}
                            importApi={UserService.import}
                            exportTemplateApi={() => UserService.exportTemplate('mau-danh-sach-nguoi-dung.xlsx')}
                            queryKey={[CONFIG_QUERY_KEY.USER.LIST]}
                        />
                    )}
                    onExport={(params) => UserService.export(params)}
                    contentAddBtn={(close) => (
                        <UserCreateForm onSuccess={close}/>
                    )}
                    title='người dùng'
                    queryKey={CONFIG_QUERY_KEY.USER.LIST}
                    queryFn={UserService.list}
                    searchField='name'
                    columns={UserColumns}
                    searchPlaceholder='Tìm kiếm tên người dùng ...'
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
                    deleteMultipleLabel='Cấm'
                    deleteMultipleSubLabel='nguời dùng'
                    onDeleteMultiple={(selectedIds, onSuccess, open, onOpenChange) => (
                        <AlertDialogActionBtn
                            title='nguời dùng'
                            action='ban-multiple'
                            ids={selectedIds}
                            count={selectedIds.length}
                            queryKey={CONFIG_QUERY_KEY.USER.LIST}
                            api={() => UserService.multiBan(selectedIds)}
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

export default ListUser