// ** React router
import {Outlet} from "react-router";

// ** Layout component
import {AppSidebar} from "@/layouts/DefaultLayout/components/SideBar/app-sidebar.tsx";

// ** Shadcn ui
import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar.tsx";

// ** Component
import Header from "@/layouts/DefaultLayout/components/Header";
import {useThemeCustomizer} from "@/context/ThemeCustomizerContext.tsx";

const DefaultLayout = () => {

    const {sidebarMode, setSidebarMode} = useThemeCustomizer()

    return (
        <>
            <SidebarProvider
                open={sidebarMode === "default"}
                onOpenChange={(open) => setSidebarMode(open ? "default" : "icon")}
            >
                <AppSidebar/>
                <SidebarInset>
                    <Header/>
                    <div className='p-4'>
                        <Outlet/>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </>
    )
}

export default DefaultLayout