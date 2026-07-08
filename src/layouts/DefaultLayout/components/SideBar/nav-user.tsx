import {
    ChevronsUpDown,
} from "lucide-react"

import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar.tsx"
import AccountDropdown from "@/components/common/AccountDropdown";
import AvatarWithFrame from "@/components/common/AvatarWithFrame";

// ** Type
import type { IUserProfile } from "@/types/backend";

export function NavUser({
    user,
}: {
    user: IUserProfile
}) {
    const { isMobile } = useSidebar()

    if (!user) return null;

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <AccountDropdown
                    side={isMobile ? "bottom" : "right"}
                    align="end"
                    sideOffset={4}
                >
                    <SidebarMenuButton
                        size="lg"
                        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                    >
                        <AvatarWithFrame
                            className="size-8"
                            classAvatar="h-8 w-8 rounded-lg"
                            avatarUrl={user.avatar?.url}
                            avatarName={user.name}
                            frameUrl={user.avatar_frame?.image?.url}
                            frameName={user.avatar_frame?.name}
                        />
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-medium">{user.name}</span>
                            <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                        </div>
                        <ChevronsUpDown className="ml-auto size-4" />
                    </SidebarMenuButton>
                </AccountDropdown>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
