// ** React
import {useState} from "react";

// ** Component
import Button from "@/components/common/Button";
import AlertDialogActionBtn from "@/components/common/AlertDialogActionBtn";
import DialogActionBtn from "@/components/common/DialogActionBtn";

// ** Icon
import {Edit, Trash} from "lucide-react";

// ** Config
import {CONFIG_QUERY_KEY} from "@/configs/query-key";

// ** Service
import {FrameService} from "@/services/frame";

// ** Module
import FrameUpdateForm from "@/modules/Frame/FrameUpdateForm";

type TDropdownAction = {
    userId: string;
}

const DropdownAction = ({userId}: TDropdownAction) => {

    const [activeDialog, setActiveDialog] = useState<string | null>(null);

    return (
        <>
            {/* Update */}
            <Button
                variant='ghost'
                onClick={() => setActiveDialog("update")}
            >
                <Edit/>
            </Button>

            {/* Delete */}
            <Button
                variant='ghost'
                className='text-red-500 hover:text-red-500'
                onClick={() => setActiveDialog("delete")}
            >
                <Trash/>
            </Button>


            {/* Update */}
            <DialogActionBtn
                action="edit"
                title="khung"
                open={activeDialog === "update"}
                onOpenChange={(open) => !open && setActiveDialog(null)}
                render={(close) => (<FrameUpdateForm id={userId} onSuccess={close}/>)}
            />

            {/* Delete */}
            <AlertDialogActionBtn
                action='delete'
                id={userId}
                title='khung'
                queryKey={CONFIG_QUERY_KEY.FRAME.LIST}
                api={FrameService.delete}
                open={activeDialog === "delete"}
                onOpenChange={(open) => !open && setActiveDialog(null)}
            />
        </>
    );
};

export default DropdownAction