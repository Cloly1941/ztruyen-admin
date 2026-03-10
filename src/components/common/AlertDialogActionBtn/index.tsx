// ** Shadcn ui
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// ** Component
import Button from "@/components/common/Button";

// ** Util
import {actionConfig, type TAction} from "@/utils/actionConfig.ts";

// ** Types
import {type TUseActionMutation, useActionMutation} from "@/hooks/common/useActionMutation.ts";

export type TSingleAction<T> = {
    id: string
    ids?: never
    api: (id: string) => Promise<IBackendRes<T>>
}

export type TMultipleAction<T> = {
    ids: string[]
    id?: never
    api: (ids: string[]) => Promise<IBackendRes<T>>
}


type TAlertDialogAction<T> = TUseActionMutation<T> & {
    action?: TAction
    count?: number
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
    title: string
}

const AlertDialogActionBtn = <T, >(props: TAlertDialogAction<T>) => {

    const {count, action = "delete", queryKey, open, onOpenChange, onSuccess, title} = props

    const config = actionConfig[action]

    const {mutate, isPending} = useActionMutation(
        props.ids !== undefined
            ? {ids: props.ids, api: props.api, queryKey}
            : {id: props.id, api: props.api, queryKey}
    )

    const handleAction = async () => {
        await mutate()
        onOpenChange(false);
        onSuccess?.();
    }

    return (
        <>
            <AlertDialog open={open} onOpenChange={onOpenChange}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{config.title} {title}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {count && action.includes("multiple")
                                && `${count}`
                            } {config.desc}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Huỷ</AlertDialogCancel>
                        <AlertDialogAction asChild>
                            <Button isLoading={isPending} onClick={handleAction}>
                                {config.label}
                            </Button>
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

export default AlertDialogActionBtn