// ** React
import type {ReactNode} from "react";

// ** Components
import DialogActionBtn from "@/components/common/DialogActionBtn";

// ** Modules Components
import ChangePasswordForm from "@/modules/User/ChangePasswordForm";
import UpdateAvatarForm from "@/modules/User/UpdateAvatarForm";
import UserUpdateForm from "@/modules/User/UserUpdateForm";
import UserDetail from "@/modules/User/UserDetail";

export type TActionItem = {
    key: string
    show?: boolean
    label: string
    renderDialog: (open: boolean, onOpenChange: (v: boolean) => void) => ReactNode
}

export const getUserActions = (userId: string, provider?: string): TActionItem[] => {
    return [
        {
            key: "detail",
            label: "Xem thông tin người dùng",
            renderDialog: (open, onOpenChange) => (
                <DialogActionBtn
                    action="detail"
                    title="người dùng"
                    open={open} onOpenChange={onOpenChange}
                    render={() => <UserDetail id={userId}/>}
                />
            ),
        },
        {
            key: "changePassword",
            show: provider === "local",
            label: "Đổi mật khẩu",
            renderDialog: (open, onOpenChange) => (
                <DialogActionBtn
                    action="changePassword"
                    title="người dùng"
                    open={open} onOpenChange={onOpenChange}
                    render={(close) => <ChangePasswordForm onSuccess={close} id={userId}/>}
                />
            ),
        },
        {
            key: "avatar",
            label: "Cập nhật ảnh đại diện",
            renderDialog: (open, onOpenChange) => (
                <DialogActionBtn
                    action="edit"
                    title="ảnh đại diện"
                    open={open} onOpenChange={onOpenChange}
                    render={(close) => <UpdateAvatarForm onSuccess={close} id={userId}/>}
                />
            ),
        },
        {
            key: "updateUser",
            label: "Cập nhật thông tin người dùng",
            renderDialog: (open, onOpenChange) => (
                <DialogActionBtn
                    action="edit"
                    title="thông tin người dùng"
                    open={open} onOpenChange={onOpenChange}
                    render={(close) => <UserUpdateForm onSuccess={close} id={userId}/>}
                />
            ),
        },
    ]
}