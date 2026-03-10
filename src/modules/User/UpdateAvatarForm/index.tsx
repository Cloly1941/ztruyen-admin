// ** React
import {useState, useRef, useEffect, type ChangeEvent} from "react";

// ** React query
import {useQueryClient} from "@tanstack/react-query";

// ** React hot toast
import toast from "react-hot-toast";

// ** Shadcn ui
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import {DialogClose, DialogFooter} from "@/components/ui/dialog.tsx";

// ** Icon
import {Upload, X} from "lucide-react";

// ** Component
import Button from "@/components/common/Button";

// ** Hooks
import useGetMethod from "@/hooks/common/useGetMethod.ts";

// ** Services
import {UserService} from "@/services/user";
import {UploadService} from "@/services/upload";

// ** Config
import {CONFIG_QUERY_KEY} from "@/configs/query-key";

// ** Type
import type {IUser} from "@/types/backend";

type TUpdateAvatarForm = {
    id: string;
    onSuccess?: () => void;
}

const UpdateAvatarForm = ({id, onSuccess}: TUpdateAvatarForm) => {

    const [preview, setPreview] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const [loading, setLoading] = useState(false)

    const {data, isLoading, error} = useGetMethod<IUser>({
        api: () => UserService.detail(id),
        key: [CONFIG_QUERY_KEY.USER.DETAIL, id],
        enabled: !!id && !!open
    })

    const queryClient = useQueryClient();

    // fetch detail user fail
    useEffect(() => {
        if (error) {
            toast.error(
                'Không thể tải thông tin người dùng. Vui lòng thử lại sau.'
            )
        }
    }, [error])

    const userDetail = data?.data

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (!selected) return;

        if (!selected.type.startsWith("image/")) {
            toast.error("Vui lòng chọn file ảnh hợp lệ.");
            return;
        }

        if (selected.size > 5 * 1024 * 1024) {
            toast.error("Ảnh không được vượt quá 5MB.");
            return;
        }

        setFile(selected);
        setPreview(URL.createObjectURL(selected));
    };

    const handleRemove = () => {
        setFile(null);
        setPreview(null);
        if (inputRef.current) inputRef.current.value = "";
    };

    const handleSubmit = async () => {
        if (!file) {
            toast.error("Vui lòng chọn ảnh trước.");
            return;
        }

       try {
           setLoading(true)

           const image = await UploadService.single(file, `avatar ${userDetail?.name ?? ''} ${Date.now()}`)

           if (!image.data) return toast.error("Tải ảnh lên thất bại. Vui lòng thử lại.")

           await UserService.avatar(id, image.data._id)

           await queryClient.invalidateQueries({queryKey: [CONFIG_QUERY_KEY.USER.LIST]});

           toast.success("Cập nhật ảnh đại diện thành công!");
           onSuccess?.()
       } catch (err) {
           toast.error("Có lỗi xảy ra. Vui lòng thử lại.")
           console.error(err)
       } finally {
           setLoading(false)
       }
    };

    if (isLoading) return 'Đang tải ảnh đại diện...'

    if (!userDetail) return 'Không tìm thấy thông tin người dùng.'

    return (
        <div className="space-y-5">

            {/* Preview */}
            <div className="flex flex-col items-center gap-3">
                <div className="relative">
                    <Avatar className="size-20 ring-2 ring-border">
                        <AvatarImage
                            src={preview ?? userDetail?.avatar?.url}
                            alt={userDetail.name}
                        />
                        <AvatarFallback className="text-2xl font-semibold">
                            {userDetail.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    {preview && (
                        <button
                            onClick={handleRemove}
                            className="absolute -top-1 -right-6 size-5 rounded-full bg-destructive text-white flex items-center justify-center hover:bg-destructive/80 transition-colors"
                        >
                            <X className="size-3"/>
                        </button>
                    )}
                </div>
                <p className="text-sm text-muted-foreground">
                    {preview && file?.name}
                </p>
            </div>

            {/* Upload */}
            <div
                onClick={() => inputRef.current?.click()}
                className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center gap-2 cursor-pointer hover:border-primary hover:bg-accent/50 transition-colors"
            >
                <Upload className="size-8 text-muted-foreground"/>
                <p className="text-sm font-medium">Nhấn để chọn ảnh</p>
                <p className="text-xs text-muted-foreground">PNG, JPG, WEBP — tối đa 5MB</p>
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                />
            </div>

            {/* Actions */}
            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="outline">Huỷ</Button>
                </DialogClose>
                <Button onClick={handleSubmit} isLoading={loading}>
                    Lưu ảnh
                </Button>
            </DialogFooter>
        </div>
    )
}

export default UpdateAvatarForm