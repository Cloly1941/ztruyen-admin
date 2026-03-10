// ** Shadcn ui
import { Badge } from "@/components/ui/badge";

// ** Type
import type {TGender} from "@/types/backend";

export const renderGenderBadge = (gender?: TGender) => {
    switch (gender) {
        case "male":
            return <Badge variant="default">Nam</Badge>;
        case "female":
            return <Badge variant="secondary">Nữ</Badge>;
        case "lgbt":
            return <Badge variant="outline">LGBT</Badge>;
        default:
            return <Badge variant="destructive">Không xác định</Badge>;
    }
};