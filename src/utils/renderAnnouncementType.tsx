import type {TTypeAnnouncement} from "@/types/backend";

const TYPE_CONFIG: Record<TTypeAnnouncement, { label: string; className: string }> = {
    info: {label: "Thông tin", className: "bg-blue-100 text-blue-700 border-blue-200"},
    warning: {label: "Cảnh báo", className: "bg-yellow-100 text-yellow-700 border-yellow-200"},
    maintenance: {label: "Bảo trì", className: "bg-red-100 text-red-700 border-red-200"},
    event: {label: "Sự kiện", className: "bg-green-100 text-green-700 border-green-200"},
};

export const renderAnnouncementType = (type: TTypeAnnouncement) => {
    const config = TYPE_CONFIG[type];
    if (!config) return <span className="text-muted-foreground text-sm">{type}</span>;

    return (
        <span
            className={`inline-flex items-center gap-1 rounded-lg border px-2 py-0.5 text-xs font-medium ${config.className}`}>
            {config.label}
        </span>
    );
};