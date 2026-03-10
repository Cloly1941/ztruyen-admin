// ** React
import {Fragment, useState} from "react";

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

// ** Icon
import {MoreHorizontal} from "lucide-react";

// ** Config
import {CONFIG_QUERY_KEY} from "@/configs/query-key";

// ** Service
import {UserService} from "@/services/user";

// ** Actions
import {getUserActions} from "@/modules/User/DataTable/UserColumns/UserActions";

type TDropdownAction = {
    userId: string;
    provider: string
}

const DropdownAction = ({userId, provider}: TDropdownAction) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [activeDialog, setActiveDialog] = useState<string | null>(null);

    const actions = getUserActions(userId, provider);

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
                    {actions
                        .filter(a => a.show !== false)
                        .map(action => (
                            <DropdownMenuItem
                                key={action.key}
                                onSelect={() => {
                                    setDropdownOpen(false);
                                    setActiveDialog(action.key);
                                }}>
                                {action.label}
                            </DropdownMenuItem>
                        ))}
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem
                        onSelect={() => {
                            setDropdownOpen(false)
                            setActiveDialog("ban")
                        }}>
                        <span className='text-red-500'>Cấm người dùng</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {actions
                .filter(a => a.show !== false)
                .map(action => (
                    <Fragment key={action.key}>
                        {action.renderDialog(
                            activeDialog === action.key,
                            (open) => !open && setActiveDialog(null)
                        )}
                    </Fragment>
                ))}
            <AlertDialogActionBtn
                action='ban'
                id={userId}
                title='người dùng'
                queryKey={CONFIG_QUERY_KEY.USER.LIST}
                api={UserService.ban}
                open={activeDialog === "ban"}
                onOpenChange={(open) => !open && setActiveDialog(null)}
            />
        </>
    );
};

export default DropdownAction