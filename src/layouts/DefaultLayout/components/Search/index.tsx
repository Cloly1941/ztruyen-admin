// ** React
import {useEffect, useState} from "react";

// ** React router
import {useNavigate} from "react-router";

// ** Shadcn ui
import {InputGroup, InputGroupAddon, InputGroupInput} from "@/components/ui/input-group.tsx";
import {Kbd} from "@/components/ui/kbd.tsx";
import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput, CommandItem,
    CommandList
} from "@/components/ui/command.tsx";

// ** Components
import Button from "@/components/common/Button";

// ** Icons
import {BarChart, Bell, Frame, History, MessageSquare, SearchIcon, Users} from "lucide-react";

// ** Config
import {CONFIG_ROUTER} from "@/configs/router";

const commandGroups = [
    {
        heading: "Các trang tổng quan",
        items: [
            {label: "Người dùng", icon: <Users/>, href: CONFIG_ROUTER.USER.INDEX},
            {label: "Khung avatar", icon: <Frame/>, href: CONFIG_ROUTER.USER.INDEX},
            {label: "Bình luận", icon: <MessageSquare/>, href: CONFIG_ROUTER.USER.INDEX},
        ]
    },
    {
        heading: "Thống kê & theo dõi",
        items: [
            {label: "Thống kê truyện", icon: <BarChart/>, href: CONFIG_ROUTER.USER.INDEX},
            {label: "Lịch sử đọc", icon: <History/>, href: CONFIG_ROUTER.USER.INDEX},
        ]
    },
    {
        heading: "Hệ thống",
        items: [
            {label: "Thông báo", icon: <Bell/>, href: CONFIG_ROUTER.USER.INDEX},
        ]
    }
]

const Search = () => {

    const [open, setOpen] = useState(false)
    const navigate = useNavigate()

    const handleSelect = (href: string) => {
        setOpen(false)
        navigate(href)
    }

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen(true)
            }
        }

        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    return (
        <>
            <Button size='icon-sm' variant='ghost' className='flex lg:hidden' onClick={() => setOpen(true)}>
                <SearchIcon/>
            </Button>
            <div className="w-full max-w-sm flex-1 hidden lg:flex" onClick={() => setOpen(true)}>
                <InputGroup>
                    <InputGroupInput placeholder="Tìm kiếm..."/>
                    <InputGroupAddon>
                        <SearchIcon/>
                    </InputGroupAddon>
                    <InputGroupAddon align="inline-end">
                        <Kbd>⌘ k</Kbd>
                    </InputGroupAddon>
                </InputGroup>
            </div>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <Command>
                    <CommandInput placeholder="Tìm kiếm..."/>
                    <CommandList>
                        <CommandEmpty>Không tìm thấy kết quả nào.</CommandEmpty>
                        {commandGroups.map((group) => (
                            <CommandGroup key={group.heading} heading={group.heading}>
                                {group.items.map((item) => (
                                    <CommandItem
                                        key={item.label}
                                        onSelect={() => handleSelect(item.href)}
                                    >
                                        {item.icon} {item.label}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        ))}
                    </CommandList>
                </Command>
            </CommandDialog>
        </>
    )
}

export default Search