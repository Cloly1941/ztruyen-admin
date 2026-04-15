"use client"

import * as React from "react"
import {
    BarChart, Bell,
    Frame,
    GalleryVerticalEnd, Laugh, MessageSquare,
    Users,
} from "lucide-react"

import {NavMain} from "@/layouts/DefaultLayout/components/SideBar/nav-main.tsx"
import {NavUser} from "@/layouts/DefaultLayout/components/SideBar/nav-user.tsx"
import {TeamSwitcher} from "@/layouts/DefaultLayout/components/SideBar/team-switcher.tsx"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar.tsx"
import {useAuth} from "@/hooks/common/useAuth.ts";
import type {IUserProfile} from "@/types/backend";

// ** Config
import {CONFIG_ROUTER} from "@/configs/router";

// This is sample data.
const data = {
    teams: [
        {
            name: "Ztruyện",
            logo: GalleryVerticalEnd,
            plan: "Quản trị viên",
        }
    ],
    navManage: [
        {
            title: "Người dùng",
            url: "#",
            icon: Users,
            items: [
                {
                    title: "Danh sách người dùng",
                    url: CONFIG_ROUTER.USER.INDEX,
                },
                {
                    title: "Người dùng bị cấm",
                    url: `${CONFIG_ROUTER.USER.INDEX}${CONFIG_ROUTER.USER.BAN}`,
                },
            ],
        },
        {
            title: "Khung avatar",
            url: "#",
            icon: Frame,
            items: [
                {
                    title: "Danh sách khung avatar",
                    url: `${CONFIG_ROUTER.FRAME.INDEX}`,
                }
            ],
        },
        {
            title: "Bình luận",
            url: "#",
            icon: MessageSquare,
            items: [
                {
                    title: "Danh sách bình luận",
                    url: `${CONFIG_ROUTER.COMMENT.INDEX}`,
                },
                {
                    title: "Bình luận bị báo cáo",
                    url: "#",
                }
            ],
        },
        {
            title: "Emoji",
            url: "#",
            icon: Laugh,
            items: [
                {
                    title: "Danh mục Emoji",
                    url: `${CONFIG_ROUTER.EMOJI.INDEX}${CONFIG_ROUTER.EMOJI.CATEGORY}`,
                },
                {
                    title: "Emoji",
                    url: `${CONFIG_ROUTER.EMOJI.INDEX}`,
                },
            ],
        }
    ],
    navAnalytics: [
        {
            title: "Thống kê",
            url: "#",
            icon: BarChart,
            items: [
                {title: "Tổng quan", url: "#"},
                {title: "Bảng xếp hạng tuần", url: CONFIG_ROUTER.COMIC.RANKING},
            ],
        }
    ],
    navSystem: [
        {
            title: "Thông báo",
            url: "#",
            icon: Bell,
            items: [
                {
                    title: "Danh sách thông báo",
                    url: `${CONFIG_ROUTER.ANNOUNCEMENT.INDEX}`
                },
            ],
        },
    ],
}

export function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {

    const {user} = useAuth()

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <TeamSwitcher teams={data.teams}/>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navAnalytics} title='Thống kê & theo dõi'/>
                <NavMain items={data.navManage} title='Quản lý'/>
                <NavMain items={data.navSystem} title='Hệ thống'/>
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={user as IUserProfile}/>
            </SidebarFooter>
            <SidebarRail/>
        </Sidebar>
    )
}
