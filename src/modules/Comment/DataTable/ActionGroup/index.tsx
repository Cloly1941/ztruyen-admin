// ** React
import {useState} from "react";

// ** Components
import AlertDialogActionBtn from "@/components/common/AlertDialogActionBtn";
import Button from "@/components/common/Button";

// ** Config
import {CONFIG_QUERY_KEY} from "@/configs/query-key";

// ** Service
import {CommentService} from "@/services/comment";

// ** Icon
import {Trash} from "lucide-react";

type TActionGroup = {
    userId: string;
}

const ActionGroup = ({userId}: TActionGroup) => {

    const [activeDialog, setActiveDialog] = useState<string | null>(null);

    return (
       <>
           {/* Delete */}
           <Button
               variant='ghost'
               className='text-red-500 hover:text-red-500 ml-4'
               onClick={() => setActiveDialog("delete")}
           >
               <Trash/>
           </Button>

           {/* Delete */}
           <AlertDialogActionBtn
               action='delete'
               id={userId}
               title='bình luận'
               queryKey={CONFIG_QUERY_KEY.COMMENT.LIST}
               api={CommentService.delete}
               open={activeDialog === "delete"}
               onOpenChange={(open) => !open && setActiveDialog(null)}
           />
       </>
    )
}

export default ActionGroup;