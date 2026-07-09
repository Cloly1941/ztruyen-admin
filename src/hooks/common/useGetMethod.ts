// ** React query
import {type QueryKey, useQuery} from "@tanstack/react-query";

// ** Util
import { handleResponse } from "@/utils/handleResponse.ts";

type TUseGetMethod<TData> = {
    api: (signal?: AbortSignal) => Promise<IBackendRes<TData>>;
    key: QueryKey;
    enabled?: boolean;
};

const useGetMethod = <TData>({
                                 api,
                                 key,
                                 enabled = true,
                             }: TUseGetMethod<TData>) => {
    return useQuery<IBackendRes<TData>, BackendError>({
        queryKey: key,
        queryFn: async ({ signal }) => {
            const res = await api(signal);
            return handleResponse(res);
        },
        enabled,
        retry: false,
        refetchOnWindowFocus: false,
    });
};

export default useGetMethod;