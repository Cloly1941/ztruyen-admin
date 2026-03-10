// ** React query
import {type QueryKey, useQuery} from "@tanstack/react-query";

// ** Util
import { handleResponse } from "@/utils/handleResponse.ts";

type TUseGetMethod<TData> = {
    api: () => Promise<IBackendRes<TData>>;
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
        queryFn: async () => {
            const res = await api();
            return handleResponse(res);
        },
        enabled,
        retry: false,
        refetchOnWindowFocus: false,
    });
};

export default useGetMethod;