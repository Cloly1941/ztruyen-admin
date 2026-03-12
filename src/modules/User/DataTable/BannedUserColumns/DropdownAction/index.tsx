// ** React
import {useState} from "react";

// ** Shadcn ui
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";

// ** Component
import Button from "@/components/common/Button";
import AlertDialogActionBtn from "@/components/common/AlertDialogActionBtn";

// ** Module components
import UserDetail from "@/modules/User/UserDetail";

// ** Icon
import {MoreHorizontal} from "lucide-react";

// ** Config
import {CONFIG_QUERY_KEY} from "@/configs/query-key";

// ** Service
import {UserService} from "@/services/user";

// ** Actions
import DialogActionBtn from "@/components/common/DialogActionBtn";

type TDropdownAction = {
    userId: string;
}

const DropdownAction = ({userId}: TDropdownAction) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [activeDialog, setActiveDialog] = useState<string | null>(null);

    return (
        <>
            <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                <DropdownMenuTrigger>
                    <Button variant="ghost" size="icon">
                        <MoreHorizontal className="size-4"/>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem
                        onSelect={() => {
                            setDropdownOpen(false);
                            setActiveDialog('detail');
                        }}>
                        Xem thông tin người dùng
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onSelect={() => {
                            setDropdownOpen(false)
                            setActiveDialog("restore")
                        }}>
                        <span>Khôi phục người dùng</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem
                        onSelect={() => {
                            setDropdownOpen(false)
                            setActiveDialog("delete")
                        }}>
                        <span className='text-red-500'>Xoá người dùng</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Detail */}
            <DialogActionBtn
                action="detail"
                title="người dùng"
                open={activeDialog === "detail"}
                onOpenChange={(open) => !open && setActiveDialog(null)}
                render={() =>
                    <UserDetail
                        id={userId}
                        queryKey={[CONFIG_QUERY_KEY.USER.LIST_TRASH, userId]}
                        api={() => UserService.detailTrash(userId)}
                    />}
            />

            {/* Delete */}
            <AlertDialogActionBtn
                action='delete'
                id={userId}
                title='người dùng'
                queryKey={CONFIG_QUERY_KEY.USER.LIST_TRASH}
                api={UserService.delete}
                open={activeDialog === "delete"}
                onOpenChange={(open) => !open && setActiveDialog(null)}
            />


            {/* Restore */}
            <AlertDialogActionBtn
                action='restore'
                id={userId}
                title='người dùng'
                queryKey={CONFIG_QUERY_KEY.USER.LIST_TRASH}
                api={UserService.restore}
                open={activeDialog === "restore"}
                onOpenChange={(open) => !open && setActiveDialog(null)}
            />
        </>
    );
};

export default DropdownAction