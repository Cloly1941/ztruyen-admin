// ** Shadcn ui
import {SidebarTrigger} from "@/components/ui/sidebar.tsx";
import {Separator} from "@/components/ui/separator.tsx";

// ** Layout component
import Search from "@/layouts/DefaultLayout/components/Search";
import Panel from "@/layouts/DefaultLayout/components/Panel";

// ** Components
import {ModeToggle} from "@/components/common/ModeToggle";
import AvatarWithFrame from "@/components/common/AvatarWithFrame";
import AccountDropdown from "@/components/common/AccountDropdown";

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
                    <AccountDropdown>
                        <button className="cursor-pointer focus:outline-none flex items-center justify-center">
                            <AvatarWithFrame
                                avatarUrl={user?.avatar?.url}
                                avatarName={user?.name}
                                frameUrl={user?.avatar_frame?.image?.url}
                                frameName={user?.avatar_frame?.name}
                            />
                        </button>
                    </AccountDropdown>
                </div>
            </div>
        </header>
    )
}

export default Header