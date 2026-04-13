// ** React hot toast
import toast from "react-hot-toast";

// ** React query
import {type QueryKey, useQueryClient, useMutation} from "@tanstack/react-query";

// ** Util
import {handleResponse} from "@/utils/handleResponse.ts";

// ** Services
import {UploadService} from "@/services/upload";

type TUsePostWithImage<TPayload extends Record<string, unknown>, TData> = {
    api: (payload: TPayload) => Promise<IBackendRes<TData>>;
    key: QueryKey;
    fileCaption: (payload: Omit<TPayload, "file">) => string;
    fileKey: keyof TPayload;
};

const usePostWithImage = <TPayload extends Record<string, unknown>, TData>({
                                                                               api,
                                                                               key,
                                                                               fileCaption,
                                                                               fileKey,
                                                                           }: TUsePostWithImage<TPayload, TData>) => {

    const queryClient = useQueryClient();

    const {mutate: baseMutate, isPending} = useMutation<IBackendRes<TData>, BackendError, TPayload>({
        mutationFn: async (payload: TPayload) => {
            const res = await api(payload);
            return handleResponse(res);
        },
        onSuccess: async (res) => {
            toast.success(res.message);
            await queryClient.invalidateQueries({queryKey: key});
        },
        onError: (err: BackendError) => {
            toast.error(Array.isArray(err.message) ? err.message[0] : err.message);
        },
    });

    const mutate = async (
        payload: Partial<TPayload> & { file: File | null },
        options?: { onSuccess?: () => void }
    ) => {
        const {file, ...rest} = payload;

        if (!file) {
            toast.error("Vui lòng chọn ảnh.");
            return;
        }

        const caption = fileCaption(rest as unknown as Omit<TPayload, "file">);
        const image = await UploadService.single(file, caption);

        if (!image.data) {
            toast.error("Tải ảnh lên thất bại.");
            return;
        }

        baseMutate(
            {...rest, [fileKey]: image.data._id} as unknown as TPayload,
            {onSuccess: options?.onSuccess}
        );
    };

    return {mutate, isPending};
};

export default usePostWithImage;