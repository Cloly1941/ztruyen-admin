import { Badge } from "@/components/ui/badge";

const STATUS_CONFIG: Record<
    string,
    { label: string; className: string }
> = {
    ongoing: {
        label: "Đang cập nhật",
        className: "bg-green-100 text-green-700 hover:bg-green-100",
    },
    coming_soon: {
        label: "Sắp phát hành",
        className: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
    },
    completed: {
        label: "Hoàn thành",
        className: "bg-blue-100 text-blue-700 hover:bg-blue-100",
    },
};

export const renderStatus = (statusRaw?: string) => {
    if (!statusRaw) return "-";

    const key = statusRaw.toLowerCase();
    const config = STATUS_CONFIG[key];

    if (!config) {
        return <Badge variant="secondary">{statusRaw}</Badge>;
    }

    return (
        <Badge className={config.className}>
            {config.label}
        </Badge>
    );
};