// ** React router
import {Link} from "react-router-dom";

// ** Shadcn ui
import {SidebarTrigger} from "@/components/ui/sidebar.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";

// ** Layout component
import Search from "@/layouts/DefaultLayout/components/Search";
import Panel from "@/layouts/DefaultLayout/components/Panel";

// ** Components
import {ModeToggle} from "@/components/common/ModeToggle.tsx";

// ** Icons
import {BadgeCheck, Bell, LogOut} from "lucide-react";

import {useAuth} from "@/hooks/common/useAuth.ts";

const Header = () => {

    const {user} = useAuth()

    return (
        <header
            className="bg-background/40 sticky top-0 z-50 flex h-(--header-height) shrink-0 items-center gap-2 border-b backdrop-blur-md transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) md:rounded-tl-xl md:rounded-tr-xl">
            <div className="flex w-full items-center gap-1 px-4 lg:gap-2">
                <SidebarTrigger/>
                <Separator
                    orientation="vertical"
                    className="data-[orientation=vertical]:h-4 mx-2"
                />

                {/* Search */}
                <Search/>

                {/* Right content */}
                <div className='ml-auto flex items-center gap-2'>
                    <ModeToggle/>
                    <Panel/>
                    <Separator
                        orientation="vertical"
                        className="data-[orientation=vertical]:h-4 mx-2"
                    />
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Avatar>
                                <AvatarImage src={user?.avatar?.url || "https://github.com/shadcn.png"} alt={user?.name}/>
                                <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                            align='end'
                        >
                            <DropdownMenuGroup>
                                <DropdownMenuLabel>
                                    <div className='flex items-center gap-2 text-left text-sm'>
                                        <Avatar>
                                            <AvatarImage src={user?.avatar?.url || "https://github.com/shadcn.png"} alt={user?.name}/>
                                            <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className='grid flex-1 text-left text-sm leading-tight'>
                                            <span className='truncate font-semibold'>{user?.name}</span>
                                            <span
                                                className='text-muted-foreground truncate text-xs'>{user?.email}</span>
                                        </div>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator/>
                                <DropdownMenuGroup>
                                    <Link to='/'>
                                        <DropdownMenuItem>
                                            <BadgeCheck/>
                                            Tài khoản
                                        </DropdownMenuItem>
                                    </Link>
                                    <Link to='/'>
                                        <DropdownMenuItem>
                                            <Bell/>
                                            Thông báo
                                        </DropdownMenuItem>
                                    </Link>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator/>
                                <Link to='/'>
                                    <DropdownMenuItem>
                                        <LogOut/>
                                        Đăng xuất
                                    </DropdownMenuItem>
                                </Link>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    )
}

export default Header