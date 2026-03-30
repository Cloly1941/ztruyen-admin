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
import {EmojiService} from "@/services/emoji";

// ** Module
import EmojiUpdateForm from "@/modules/Emoji/EmojiUpdateForm";

type TDropdownAction = {
    emojiId: string
    isActive: boolean
}

const DropdownAction = ({emojiId, isActive}: TDropdownAction) => {

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
                            setActiveDialog("status")
                        }}>
                        <span>{isActive ? 'Tắt trạng thái' : 'Bật trạng thái'}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onSelect={() => {
                            setDropdownOpen(false)
                            setActiveDialog("update")
                        }}>
                        <span>Cập nhật emoji</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem
                        onSelect={() => {
                            setDropdownOpen(false)
                            setActiveDialog("delete")
                        }}>
                        <span className='text-red-500'>Xoá emoji</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>


            <DialogActionBtn
                action="edit"
                title="danh mục emoji"
                open={activeDialog === "update"}
                onOpenChange={(open) => !open && setActiveDialog(null)}
                render={(close) => <EmojiUpdateForm onSuccess={close} id={emojiId}/>}
            />


            <AlertDialogActionBtn
                action='status'
                id={emojiId}
                title='emoji'
                queryKey={CONFIG_QUERY_KEY.EMOJI.LIST}
                api={EmojiService.status}
                open={activeDialog === "status"}
                onOpenChange={(open) => !open && setActiveDialog(null)}
            />
            <AlertDialogActionBtn
                action='delete'
                id={emojiId}
                title='emoji'
                queryKey={CONFIG_QUERY_KEY.EMOJI.LIST}
                api={EmojiService.delete}
                open={activeDialog === "delete"}
                onOpenChange={(open) => !open && setActiveDialog(null)}
            />
        </>
    )
}

export default DropdownAction;