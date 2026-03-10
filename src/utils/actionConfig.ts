export type TAction =
    | 'delete'
    | 'restore'
    | 'delete-multiple'
    | 'restore-multiple'
    | 'ban'
    | 'ban-multiple'

export const actionConfig: Record<TAction, { label: string; title: string; desc: string }> = {
    delete: {
        label: "Xoá",
        title: "Xác nhận xoá",
        desc: "Hành động này sẽ xoá vĩnh viễn mục này."
    },
    "delete-multiple": {
        label: "Xoá",
        title: "Xác nhận xoá",
        desc: "Bạn có chắc muốn xoá các mục đã chọn?"
    },
    restore: {
        label: "Khôi phục",
        title: "Xác nhận khôi phục",
        desc: "Mục này sẽ được khôi phục."
    },
    "restore-multiple": {
        label: "Khôi phục",
        title: "Xác nhận khôi phục",
        desc: "Các mục đã chọn sẽ được khôi phục."
    },
    "ban-multiple": {
        label: "Cấm",
        title: "Xác nhận cấm",
        desc: "người dùng được chọn sẽ bị cấm truy cập hệ thống."
    },
    ban: {
        label: "Cấm",
        title: "Xác nhận cấm",
        desc: "Người dùng sẽ bị cấm truy cập hệ thống."
    }
}