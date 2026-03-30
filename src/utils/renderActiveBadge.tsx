// ** Shadcn ui
import { Badge } from "@/components/ui/badge";

export const renderActiveBadge = (isActive?: boolean) => {
    return isActive
        ? <Badge variant="default">Hoạt động</Badge>
        : <Badge variant="secondary">Chưa hoạt động</Badge>;
};