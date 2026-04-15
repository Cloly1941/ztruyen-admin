// ** React
import type { ReactNode } from "react";

// ** Icons
import { ChevronDown } from "lucide-react";

// ** Shadcn ui
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import Button from "@/components/common/Button";

type TOption = {
    label: string;
    value: string;
};

type TMultiSelectDropdownProps = {
    options: TOption[];
    value: string[];
    onChange: (val: string[]) => void;
    placeholder?: string;
    isLoading?: boolean;
    loadingText?: string;
    emptyText?: string;
    renderTag?: (option: TOption, onRemove: () => void) => ReactNode;
};

const MultiSelectDropdown = ({
                                 options,
                                 value,
                                 onChange,
                                 placeholder = "Chọn...",
                                 isLoading = false,
                                 loadingText = "Đang tải...",
                                 emptyText = "Không có dữ liệu",
                                 renderTag,
                             }: TMultiSelectDropdownProps) => {
    const handleCheckedChange = (optionValue: string, checked: boolean) => {
        if (checked) {
            onChange([...value, optionValue]);
        } else {
            onChange(value.filter((v) => v !== optionValue));
        }
    };

    const handleRemove = (optionValue: string) => {
        onChange(value.filter((v) => v !== optionValue));
    };

    const selectedOptions = options.filter((opt) => value.includes(opt.value));

    return (
        <div className="space-y-1">
            <DropdownMenu>
                <DropdownMenuTrigger className='w-full'>
                    <Button
                        variant="outline"
                        className="w-full justify-between font-normal"
                    >
                        {value.length > 0 ? `Đã chọn ${value.length}` : placeholder}
                        <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    className="w-[var(--radix-dropdown-menu-trigger-width)] max-h-60 overflow-y-auto"
                    align="start"
                >
                    {isLoading ? (
                        <div className="px-2 py-1.5 text-sm text-muted-foreground">
                            {loadingText}
                        </div>
                    ) : options.length === 0 ? (
                        <div className="px-2 py-1.5 text-sm text-muted-foreground">
                            {emptyText}
                        </div>
                    ) : (
                        options.map((opt) => (
                            <DropdownMenuCheckboxItem
                                key={opt.value}
                                checked={value.includes(opt.value)}
                                onCheckedChange={(checked) =>
                                    handleCheckedChange(opt.value, checked)
                                }
                                onSelect={(e) => e.preventDefault()}
                            >
                                {opt.label}
                            </DropdownMenuCheckboxItem>
                        ))
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Tags */}
            {selectedOptions.length > 0 && (
                <div className="flex flex-wrap gap-1">
                    {selectedOptions.map((opt) =>
                        renderTag ? (
                            renderTag(opt, () => handleRemove(opt.value))
                        ) : (
                            <Badge
                                key={opt.value}
                                variant="secondary"
                                className="cursor-pointer gap-1 hover:bg-destructive hover:text-destructive-foreground transition-colors"
                                onClick={() => handleRemove(opt.value)}
                            >
                                {opt.label}
                                <span className="text-xs leading-none">×</span>
                            </Badge>
                        )
                    )}
                </div>
            )}
        </div>
    );
};

export default MultiSelectDropdown;