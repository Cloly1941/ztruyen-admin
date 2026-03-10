// ** React hot toast
import toast from "react-hot-toast";

// ** React query
import {type QueryKey, useMutation, useQueryClient} from "@tanstack/react-query";

// ** Util
import { handleResponse } from "@/utils/handleResponse.ts";

type TUsePatchMethod<TPayload, TData> = {
    api: (payload: TPayload) => Promise<IBackendRes<TData>>;
    keys?: QueryKey[];
};

const usePatchMethod = <TPayload, TData>({
                                             api,
                                             keys,
                                         }: TUsePatchMethod<TPayload, TData>) => {

    const queryClient = useQueryClient();

    return useMutation<IBackendRes<TData>, BackendError, TPayload>({
        mutationFn: async (payload: TPayload) => {
            const res = await api(payload);
            return handleResponse(res);
        },
        onSuccess: async (res) => {
            toast.success(res.message);

            if (keys?.length) {
                await Promise.all(
                    keys.map((key) =>
                        queryClient.invalidateQueries({ queryKey: key })
                    )
                );
            }
        },
        onError: (err: BackendError) => {
            toast.error(Array.isArray(err.message)
                ? err.message[0]
                : err.message);
        },
    });
};

export default usePatchMethod;