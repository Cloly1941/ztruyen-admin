import {Badge} from "@/components/ui/badge.tsx";

export const renderArrayBadge = (items?: string[]) => {
    if (!items || items.length === 0) return "-";

    return (
        <div className="flex flex-wrap gap-1 max-w-[220px]">
            {items.map((item, index) => (
                <Badge key={index} variant='ghost'>
                    {item}
                </Badge>
            ))}
        </div>
    );
};