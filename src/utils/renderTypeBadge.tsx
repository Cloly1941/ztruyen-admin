// ** Shadcn ui
import { Badge } from "@/components/ui/badge";

// ** Type
import type { TType } from "@/types/backend";

export const renderTypeBadge = (type?: TType) => {
    switch (type) {
        case "image":
            return <Badge variant="default">Hình ảnh</Badge>;
        case "text":
            return <Badge variant="secondary">Văn bản</Badge>;
        default:
            return <Badge variant="outline">Không xác định</Badge>;
    }
};