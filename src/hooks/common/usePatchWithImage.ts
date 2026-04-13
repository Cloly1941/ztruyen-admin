// ** React hot toast
import toast from "react-hot-toast";

// ** React query
import {type QueryKey, useQueryClient, useMutation} from "@tanstack/react-query";

// ** Util
import {handleResponse} from "@/utils/handleResponse.ts";

// ** Services
import {UploadService} from "@/services/upload";

type TUsePatchWithImage<TPayload extends Record<string, unknown>, TData> = {
    api: (payload: TPayload) => Promise<IBackendRes<TData>>;
    keys?: QueryKey[];
    fileCaption: (payload: Partial<TPayload>) => string;
    fileKey: keyof TPayload;
    fallbackImageId?: string;
};

const usePatchWithImage = <TPayload extends Record<string, unknown>, TData>({
                                                                                api,
                                                                                keys,
                                                                                fileCaption,
                                                                                fileKey,
                                                                                fallbackImageId,
                                                                            }: TUsePatchWithImage<TPayload, TData>) => {

    const queryClient = useQueryClient();

    const {mutate: baseMutate, isPending} = useMutation<IBackendRes<TData>, BackendError, TPayload>({
        mutationFn: async (payload: TPayload) => {
            const res = await api(payload);
            return handleResponse(res);
        },
        onSuccess: async (res) => {
            toast.success(res.message);
            if (keys?.length) {
                await Promise.all(
                    keys.map((key) => queryClient.invalidateQueries({queryKey: key}))
                );
            }
        },
        onError: (err: BackendError) => {
            toast.error(Array.isArray(err.message) ? err.message[0] : err.message);
        },
    });

    const mutate = async (
        payload: Partial<TPayload> & { file: File | null },
        options?: { onSuccess?: () => void }
    ) => {
        const {file, ...rest} = payload as { file: File | null } & Record<string, unknown>;

        let imageId = fallbackImageId;

        if (file) {
            const caption = fileCaption(rest as Partial<TPayload>);
            const image = await UploadService.single(file, caption);

            if (!image.data) {
                toast.error("Tải ảnh lên thất bại.");
                return;
            }

            imageId = image.data._id;
        }

        if (!imageId) {
            toast.error("Vui lòng chọn ảnh.");
            return;
        }

        baseMutate(
            {...rest, [fileKey]: imageId} as unknown as TPayload,
            {onSuccess: options?.onSuccess}
        );
    };

    return {mutate, isPending};
};

export default usePatchWithImage;