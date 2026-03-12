import {ChevronRight, type LucideIcon} from "lucide-react"

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible.tsx"
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar.tsx"

import {useLocation} from "react-router";
import {Link} from "react-router-dom";
import {useThemeCustomizer} from "@/context/ThemeCustomizerContext.tsx";
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {useIsMobile} from "@/hooks/use-mobile.ts";

export function NavMain({
                            items, title
                        }: {
    items: {
        title: string
        url: string
        icon?: LucideIcon
        isActive?: boolean
        items?: {
            title: string
            url: string
        }[]
    }[],
    title: string
}) {

    const {pathname} = useLocation()
    const {sidebarMode} = useThemeCustomizer()
    const isMobile = useIsMobile()

    const isActive = (url: string) => {
        if (url === "#") return false
        if (pathname === url) return true

        const urlSegments = url.split("/").filter(Boolean)
        const pathSegments = pathname.split("/").filter(Boolean)
         
        if (urlSegments.length !== pathSegments.length) return false

        return urlSegments.every((seg, i) => seg === pathSegments[i])
    }

    return (
        <SidebarGroup>
            <SidebarGroupLabel>{title}</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => {

                    const isParentActive = item.items?.some((sub) => isActive(sub.url))

                    if (item.items?.length === 1) {
                        const singleItem = item.items[0]
                        return (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                    asChild
                                    isActive={isActive(singleItem.url)}
                                    tooltip={item.title}
                                >
                                    <Link to={singleItem.url}>
                                        {item.icon && <item.icon/>}
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        )
                    }

                    if (sidebarMode === 'default' || isMobile) return (
                        <Collapsible
                            key={item.title}
                            asChild
                            defaultOpen={isParentActive}
                            className="group/collapsible"
                        >
                            <SidebarMenuItem>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton tooltip={item.title}>
                                        {item.icon && <item.icon/>}
                                        <span>{item.title}</span>
                                        <ChevronRight
                                            className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"/>
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        {item.items?.map((subItem) => (
                                            <SidebarMenuSubItem key={subItem.title}>
                                                <SidebarMenuSubButton asChild isActive={isActive(subItem.url)}>
                                                    <Link to={subItem.url}>
                                                        <span>{subItem.title}</span>
                                                    </Link>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        ))}
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            </SidebarMenuItem>
                        </Collapsible>
                    )

                    return (
                        <SidebarMenuItem key={item.title}>
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <SidebarMenuButton
                                        isActive={isParentActive}
                                        tooltip={item.title}
                                    >
                                        {item.icon && <item.icon/>}
                                        <span>{item.title}</span>
                                    </SidebarMenuButton>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent side="right" align="start" className="min-w-[180px]">
                                    <DropdownMenuLabel className="text-muted-foreground text-xs">
                                        {item.title}
                                    </DropdownMenuLabel>
                                    {item.items?.map((sub) => (
                                        <DropdownMenuItem key={sub.title} asChild>
                                            <Link
                                                to={sub.url}
                                                className={isActive(sub.url) ? "text-primary font-medium" : ""}
                                            >
                                                {sub.title}
                                            </Link>
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </SidebarMenuItem>
                    )
                })}
            </SidebarMenu>
        </SidebarGroup>
    )
}