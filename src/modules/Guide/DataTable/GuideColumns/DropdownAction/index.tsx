// ** React
import {useState} from "react";

// ** Shadcn ui
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";

// ** Components
import Button from "@/components/common/Button";
import AlertDialogActionBtn from "@/components/common/AlertDialogActionBtn";
import DialogActionBtn from "@/components/common/DialogActionBtn";

// ** Icon
import {MoreHorizontal} from "lucide-react";

// ** Config
import {CONFIG_QUERY_KEY} from "@/configs/query-key";

// ** Service
import {GuideService} from "@/services/guide";

// ** Module
import GuideUpdateForm from "@/modules/Guide/GuideUpdateForm";
import GuideDetail from "@/modules/Guide/GuideDetail";

type TDropdownAction = {
    guideId: string
    isActive: boolean
}

const DropdownAction = ({guideId, isActive}: TDropdownAction) => {

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [activeDialog, setActiveDialog] = useState<string | null>(null);

    return (
        <>
            <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                <DropdownMenuTrigger className='ml-4'>
                    <Button variant="ghost" size="icon">
                        <MoreHorizontal className="size-4"/>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem
                        onSelect={() => {
                            setDropdownOpen(false)
                            setActiveDialog("detail")
                        }}>
                        <span>Xem chi tiết</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onSelect={() => {
                            setDropdownOpen(false)
                            setActiveDialog("status")
                        }}>
                        <span>{isActive ? 'Tắt trạng thái' : 'Bật trạng thái'}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onSelect={() => {
                            setDropdownOpen(false)
                            setActiveDialog("update")
                        }}>
                        <span>Cập nhật hướng dẫn</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem
                        onSelect={() => {
                            setDropdownOpen(false)
                            setActiveDialog("delete")
                        }}>
                        <span className='text-red-500'>Xoá hướng dẫn</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <DialogActionBtn
                action="detail"
                title="hướng dẫn"
                open={activeDialog === "detail"}
                onOpenChange={(open) => !open && setActiveDialog(null)}
                render={() => <GuideDetail guideId={guideId}/>}
            />

            <DialogActionBtn
                action="edit"
                title="hướng dẫn"
                open={activeDialog === "update"}
                onOpenChange={(open) => !open && setActiveDialog(null)}
                render={(close) => <GuideUpdateForm onSuccess={close} id={guideId}/>}
            />


            <AlertDialogActionBtn
                action='status'
                id={guideId}
                title='hướng dẫn'
                queryKey={CONFIG_QUERY_KEY.GUIDE.LIST}
                api={GuideService.status}
                open={activeDialog === "status"}
                onOpenChange={(open) => !open && setActiveDialog(null)}
            />
            <AlertDialogActionBtn
                action='delete'
                id={guideId}
                title='hướng dẫn'
                queryKey={CONFIG_QUERY_KEY.GUIDE.LIST}
                api={GuideService.delete}
                open={activeDialog === "delete"}
                onOpenChange={(open) => !open && setActiveDialog(null)}
            />
        </>
    )
}

export default DropdownAction;