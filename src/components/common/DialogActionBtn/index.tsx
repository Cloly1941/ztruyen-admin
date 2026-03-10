// ** React
import {type ReactNode} from "react";

// ** Shadcn ui
import {
    Dialog, DialogContent, DialogDescription,
    DialogHeader, DialogTitle,
} from "@/components/ui/dialog";

// ** Component
import Button from "@/components/common/Button";

// ** Icons
import {Plus, Upload} from "lucide-react";

type TDialogActionBtn = {
    title?: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    render: (close: () => void) => ReactNode;
    action?: "add" | "edit" | "detail" | "changePassword" | "import";
};

const DialogActionBtn = ({
                             title, render,
                             action = "add",
                             open, onOpenChange}: TDialogActionBtn) => {
    const close = () => onOpenChange(false);

    const renderTrigger = () => {
        switch (action) {
            case "add": return <Button><Plus/>Thêm {title}</Button>;
            case "edit": return <span className="dialog-trigger">Cập nhật {title}</span>;
            case "detail": return <span className="dialog-trigger">Xem thông tin {title}</span>;
            case "changePassword": return <span className="dialog-trigger">Đổi mật khẩu</span>;
            default: return <Button variant='outline'><Upload/>Nhập</Button>;
        }
    };

    const renderHeader = () => {
        switch (action) {
            case "add": return { titleText: `Thêm mới ${title}`, descriptionText: `Tạo ${title} tại đây. Nhấn lưu khi hoàn tất.` };
            case "edit": return { titleText: `Cập nhật ${title}`, descriptionText: `Chỉnh sửa ${title} tại đây. Nhấn lưu khi hoàn tất.` };
            case "detail": return { titleText: `Chi tiết thông tin ${title}` };
            case "changePassword": return { titleText: `Đổi mật khẩu ${title}`, descriptionText: `Đổi mật khẩu ${title} tại đây. Nhấn lưu khi hoàn tất.` };
            default: return { titleText: `Nhập ${title}`, descriptionText: `Tải file ${title} tại đây. Nhấn lưu khi hoàn tất.` };
        }
    };

    const {titleText, descriptionText} = renderHeader();

    const isStandalone = action === "add" || action === "import";

    return (
        <>
            {isStandalone && (
                <span onClick={() => onOpenChange(true)}>
                   {renderTrigger()}
                </span>
            )}

            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{titleText}</DialogTitle>
                        {descriptionText && <DialogDescription>{descriptionText}</DialogDescription>}
                    </DialogHeader>
                    {render(close)}
                </DialogContent>
            </Dialog>
        </>
    );
};

export default DialogActionBtn;