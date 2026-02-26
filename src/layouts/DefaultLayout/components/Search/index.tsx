// ** React
import {useEffect, useState} from "react";

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
import Button from "@/components/common/Button.tsx";

// ** Icons
import {BarChart, Bell, Frame, History, MessageSquare, SearchIcon, Users} from "lucide-react";

const commandGroups = [
    {
        heading: "Các trang tổng quan",
        items: [
            { label: "Người dùng", icon: <Users /> },
            { label: "Khung avatar", icon: <Frame /> },
            { label: "Bình luận", icon: <MessageSquare /> },
            { label: "Thống kê truyện", icon: <BarChart /> },
            { label: "Lịch sử đọc", icon: <History /> },
            { label: "Thông báo", icon: <Bell /> },
        ]
    }
]

const Search = () => {

    const [open, setOpen] = useState(false)

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
            <div className="flex w-full max-w-sm flex-1 hidden lg:block" onClick={() => setOpen(true)}>
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
                    <CommandInput placeholder="Tìm kiếm..." />
                    <CommandList>
                        <CommandEmpty>Không tìm thấy kết quả nào.</CommandEmpty>
                        {commandGroups.map((group) => (
                            <CommandGroup key={group.heading} heading={group.heading}>
                                {group.items.map((item) => (
                                    <CommandItem key={item.label}>
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