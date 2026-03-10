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

    return (
        <SidebarGroup>
            <SidebarGroupLabel>{title}</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => {

                    const isParentActive = item.items?.some(
                        (sub) => sub.url !== "#" && pathname.startsWith(sub.url)
                    )

                    if (sidebarMode === 'default' || isMobile) return (
                        <Collapsible
                            key={item.title}
                            asChild
                            defaultOpen={isParentActive}
                            className="group/collapsible"
                        >
                            <SidebarMenuItem key={item.title}>
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
                                        {item.items?.map((subItem) => {
                                            const isSubActive =
                                                subItem.url !== "#" &&
                                                pathname.startsWith(subItem.url)
                                            return (
                                                (
                                                    <SidebarMenuSubItem key={subItem.title}>
                                                        <SidebarMenuSubButton asChild isActive={isSubActive}>
                                                            <Link to={subItem.url}>
                                                                <span>{subItem.title}</span>
                                                            </Link>
                                                        </SidebarMenuSubButton>
                                                    </SidebarMenuSubItem>
                                                )
                                            )
                                        })}
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
                                    {item.items?.map((sub) => {
                                        const isSubActive =
                                            sub.url !== "#" && pathname.startsWith(sub.url)
                                        return (
                                            <DropdownMenuItem key={sub.title} asChild>
                                                <Link
                                                    to={sub.url}
                                                    className={isSubActive ? "text-primary font-medium" : ""}
                                                >
                                                    {sub.title}
                                                </Link>
                                            </DropdownMenuItem>
                                        )
                                    })}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </SidebarMenuItem>
                    )
                })}
            </SidebarMenu>
        </SidebarGroup>
    )
}
