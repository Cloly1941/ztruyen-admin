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
import {ComicService} from "@/services/comic";

// ** Module
import RankingUpdateForm from "@/modules/Ranking/RankingUpdateForm";

type TActionGroup = {
    comicId: string;
}

const ActionGroup = ({comicId}: TActionGroup) => {

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
                title="truyện"
                open={activeDialog === "update"}
                onOpenChange={(open) => !open && setActiveDialog(null)}
                render={(close) => (<RankingUpdateForm id={comicId} onSuccess={close}/>)}
            />

            {/* Delete */}
            <AlertDialogActionBtn
                action='delete'
                id={comicId}
                title='truyện'
                queryKey={CONFIG_QUERY_KEY.COMIC.RANKING_LIST}
                api={ComicService.delete}
                open={activeDialog === "delete"}
                onOpenChange={(open) => !open && setActiveDialog(null)}
            />
        </>
    );
};

export default ActionGroup