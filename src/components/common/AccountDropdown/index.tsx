// ** React
import React, { type ReactNode } from "react";

// ** React router
import { Link, useNavigate } from "react-router-dom";

// ** React hot toast
import toast from "react-hot-toast";

// ** React query
import { useMutation } from "@tanstack/react-query";

// ** Icons
import { BadgeCheck, LayoutDashboard, LogOut } from "lucide-react";

// ** Components
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";

import AvatarWithFrame from "@/components/common/AvatarWithFrame";

// ** Services
import { AuthService } from "@/services/auth";

// ** Hooks
import { useAuth } from "@/hooks/common/useAuth.ts";

// ** Utils
import { handleResponse } from "@/utils/handleResponse.ts";

// ** Configs
import { CONFIG_ROUTER } from "@/configs/router";
import { CONFIG_LOCALSTORAGE } from "@/configs/local-storage";

type TAccountDropdownProps = {
    children: ReactNode;
    side?: "top" | "bottom" | "left" | "right";
    align?: "start" | "center" | "end";
    sideOffset?: number;
};

const ForwardRefWrapper = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ children, ...props }, ref) => {
    return (
        <div ref={ref} {...props}>
            {children}
        </div>
    );
});
ForwardRefWrapper.displayName = "ForwardRefWrapper";

const AccountDropdown = ({
    children,
    side = "bottom",
    align = "end",
    sideOffset = 4,
}: TAccountDropdownProps) => {
    const { user, setIsAuthenticated, setUser } = useAuth();
    const navigate = useNavigate();

    const logoutMutation = useMutation({
        mutationFn: async () => {
            const res = await AuthService.logout();
            return handleResponse(res);
        },
        onSuccess: (res) => {
            localStorage.removeItem(CONFIG_LOCALSTORAGE.ACCESS_TOKEN);
            setIsAuthenticated(false);
            setUser(null);
            toast.success(res.message || "Đăng xuất thành công");
            navigate(CONFIG_ROUTER.LOGIN);
        },
        onError: (err: Error) => {
            toast.error(
                Array.isArray(err?.message)
                    ? err.message[0]
                    : err?.message || "Đăng xuất thất bại"
            );
        },
    });

    if (!user) return null;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <ForwardRefWrapper>
                    {children}
                </ForwardRefWrapper>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                side={side}
                align={align}
                sideOffset={sideOffset}
            >
                <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                        <AvatarWithFrame
                            className="size-8 ml-1 mr-1"
                            classAvatar="h-8 w-8 rounded-lg"
                            avatarUrl={user.avatar?.url}
                            avatarName={user.name}
                            frameUrl={user.avatar_frame?.image?.url}
                            frameName={user.avatar_frame?.name}
                        />
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-semibold">{user.name}</span>
                            <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                        </div>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem asChild className="cursor-pointer">
                        <Link to={CONFIG_ROUTER.PROFILE}>
                            <BadgeCheck className="size-4" />
                            Tài khoản
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer">
                        <Link to={CONFIG_ROUTER.HOME}>
                            <LayoutDashboard className="size-4" />
                            Tổng quan
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className="text-red-500 hover:text-red-500 hover:bg-red-50 focus:text-red-500 focus:bg-red-50 dark:hover:bg-red-950 dark:focus:bg-red-950 cursor-pointer disabled:opacity-50"
                    disabled={logoutMutation.isPending}
                    onClick={() => logoutMutation.mutate()}
                >
                    <LogOut className="size-4" />
                    <span>Đăng xuất</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default AccountDropdown;
