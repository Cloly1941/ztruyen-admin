import {Popover, PopoverContent, PopoverDescription, PopoverHeader, PopoverTrigger} from "@/components/ui/popover"
import {Label} from "@/components/ui/label.tsx";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {ToggleGroup, ToggleGroupItem} from "@/components/ui/toggle-group.tsx";
import Button from "@/components/common/Button.tsx";
import {Palette} from "lucide-react";
import {
    type ColorMode,
    type Radius,
    type Scale,
    type SidebarMode,
    useThemeCustomizer
} from "@/context/ThemeCustomizerContext.tsx";

const themePresetOptions = [
    {title: "Mặc định", value: "default", color: "#c96442"},
    {title: "Hồ xanh", value: "lake-view", color: "#0ea5e9"},
    {title: "Hoàng hôn", value: "sunset-glow", color: "#f97316"},
    {title: "Rừng xanh", value: "forest-whisper", color: "#22c55e"},
    {title: "Gió biển", value: "ocean-breeze", color: "#06b6d4"},
    {title: "Tím mộng mơ", value: "lavender-dream", color: "#a855f7"},
]

const scaleOptions: { label: string, value: Scale }[] = [
    {label: "—", value: "none"},
    {label: "XS", value: "xs"},
    {label: "LG", value: "lg"},
]

const radiusOptions: { label: string, value: Radius }[] = [
    {label: "—", value: "none"},
    {label: "SM", value: "sm"},
    {label: "MD", value: "md"},
    {label: "LG", value: "lg"},
    {label: "XL", value: "xl"},
]

const Panel = () => {
    const {
        themePreset, setThemePreset,
        colorMode, setColorMode,
        scale, setScale,
        radius, setRadius,
        sidebarMode, setSidebarMode,
        resetAll
    } = useThemeCustomizer()

    return (
        <Popover>
            <PopoverTrigger>
                <Button variant="ghost" size='icon-sm'>
                    <Palette/>
                </Button>
            </PopoverTrigger>
            <PopoverContent align='end' className="w-72">
                <PopoverHeader>
                    <PopoverDescription>
                        <div className='grid space-y-4'>

                            {/* Theme preset */}
                            <div className="flex flex-col gap-2">
                                <Label>Chủ đề:</Label>
                                <Select value={themePreset} onValueChange={setThemePreset}>
                                    <SelectTrigger className='w-full'>
                                        <SelectValue placeholder="Mặc định"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {themePresetOptions.map(t => (
                                                <SelectItem value={t.value} key={t.value}>
                                                    <div className="flex items-center gap-2">
                                                        <span
                                                            className="size-1.5 rounded-full flex-shrink-0 mt-0.5"
                                                            style={{backgroundColor: t.color}}
                                                        />
                                                        {t.title}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Scale */}
                            <div className="flex flex-col gap-2">
                                <Label>Tỉ lệ:</Label>
                                <ToggleGroup
                                    type="single"
                                    value={scale}
                                    onValueChange={(v) => v && setScale(v as Scale)}
                                    spacing={3}
                                    className='w-full'
                                >
                                    {scaleOptions.map(s => (
                                        <ToggleGroupItem key={s.value} value={s.value} className="flex-1">
                                            {s.label}
                                        </ToggleGroupItem>
                                    ))}
                                </ToggleGroup>
                            </div>

                            {/* Radius */}
                            <div className="flex flex-col gap-2">
                                <Label>Bo góc:</Label>
                                <ToggleGroup
                                    type="single"
                                    value={radius}
                                    onValueChange={(v) => v && setRadius(v as Radius)}
                                    spacing={3}
                                    className='w-full'
                                >
                                    {radiusOptions.map(r => (
                                        <ToggleGroupItem key={r.value} value={r.value} className="flex-1">
                                            {r.label}
                                        </ToggleGroupItem>
                                    ))}
                                </ToggleGroup>
                            </div>

                            {/* Color mode */}
                            <div className="flex flex-col gap-2">
                                <Label>Chế độ màu:</Label>
                                <ToggleGroup
                                    type="single"
                                    value={colorMode}
                                    onValueChange={(v) => v && setColorMode(v as ColorMode)}
                                    spacing={4}
                                    className='w-full'
                                >
                                    {(["light", "dark"] as ColorMode[]).map(m => (
                                        <ToggleGroupItem key={m} value={m} className="flex-1">
                                            {m === "light" ? "Sáng" : "Tối"}
                                        </ToggleGroupItem>
                                    ))}
                                </ToggleGroup>
                            </div>

                            {/* Sidebar mode */}
                            <div className="hidden flex-col gap-2 lg:flex">
                                <Label>Sidebar:</Label>
                                <ToggleGroup
                                    type="single"
                                    value={sidebarMode}
                                    onValueChange={(v) => v && setSidebarMode(v as SidebarMode)}
                                    spacing={4}
                                    className='w-full'
                                >
                                    {(["default", "icon"] as SidebarMode[]).map(s => (
                                        <ToggleGroupItem key={s} value={s} className="flex-1">
                                            {s === "default" ? "Mặc định" : "Icon"}
                                        </ToggleGroupItem>
                                    ))}
                                </ToggleGroup>
                            </div>

                            {/* Reset */}
                            <Button className="w-full" onClick={resetAll}>
                                Đặt lại mặc định
                            </Button>

                        </div>
                    </PopoverDescription>
                </PopoverHeader>
            </PopoverContent>
        </Popover>
    )
}

export default Panel