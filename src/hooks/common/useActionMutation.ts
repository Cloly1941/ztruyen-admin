// ** React query
import {useMutation, useQueryClient} from "@tanstack/react-query";

// ** React hot toast
import toast from "react-hot-toast";

// ** Util
import {handleResponse} from "@/utils/handleResponse.ts";

// ** Types
import type {TMultipleAction, TSingleAction} from "@/components/common/AlertDialogActionBtn";

export type TUseActionMutation<T> = (TSingleAction<T> | TMultipleAction<T>) & {
    queryKey: string
}

export const useActionMutation = <T>({queryKey, api, ids, id } : TUseActionMutation<T>) => {

    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async () => {
            let res
            if (ids !== undefined) {
                // multiple
                res = await (api)(ids)
            } else {
                // single
                res = await (api)(id)
            }

            return handleResponse(res)
        },
        onSuccess: async (res) => {
            toast.success(res.message);

            await queryClient.invalidateQueries({queryKey: [queryKey]});
        },
        onError: (err) => {
            toast.error(Array.isArray(err.message)
                ? err.message[0]
                : err.message);
        },
    })
}