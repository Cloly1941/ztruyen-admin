// ** React
import {useState, useRef, useEffect, type ChangeEvent} from "react";

// ** React query
import {useQueryClient} from "@tanstack/react-query";

// ** React hot toast
import toast from "react-hot-toast";

// ** Shadcn ui
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import {DialogClose, DialogFooter} from "@/components/ui/dialog.tsx";

// ** Zod
import { z } from "zod";

// ** Icon
import {Upload, X} from "lucide-react";

// ** Component
import Button from "@/components/common/Button";

// ** Hooks
import useGetMethod from "@/hooks/common/useGetMethod.ts";

// ** Services
import {FrameService} from "@/services/frame";
import {UploadService} from "@/services/upload";

// ** Config
import {CONFIG_QUERY_KEY} from "@/configs/query-key";

// ** Type
import type {IFrame} from "@/types/backend";
import {Input} from "@/components/ui/input.tsx";

import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Field, FieldError, FieldLabel} from "@/components/ui/field.tsx";

export const formSchema = z.object({
    name: z.string().min(1, "Tên khung avatar không được để trống")

});

export type TFrameForm = z.infer<typeof formSchema>;

export type TFrameUpdateFormPayload = {
    name: string;
    image: string;
}

type TFrameUpdateForm = {
    id: string;
    onSuccess?: () => void;
}

const FrameUpdateForm = ({id, onSuccess}: TFrameUpdateForm) => {

    const [preview, setPreview] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const [loading, setLoading] = useState(false)

    const {data, isLoading, error} = useGetMethod<IFrame>({
        api: () => FrameService.detail(id),
        key: [CONFIG_QUERY_KEY.FRAME.DETAIL, id],
        enabled: !!id && !!open
    })

    // fetch detail frame fail
    useEffect(() => {
        if (error) {
            toast.error(
                'Không thể tải thông tin khung avatar. Vui lòng thử lại sau.'
            )
        }
    }, [error])

    const queryClient = useQueryClient();

    const frame = data?.data

    const form = useForm<TFrameForm>({
        resolver: zodResolver(formSchema)
    });

    // default frame name
    useEffect(() => {
        if (frame) {
            form.reset({
                name: frame.name
            })
        }
    }, [frame, form])

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

    if (!frame) return 'Không tìm thấy thông tin khung avatar.'

    const onSubmit = async (values: TFrameForm) => {

        try {
            setLoading(true)

            let imageId = frame.image._id;

            if (file) {
                const image = await UploadService.single(
                    file,
                    `${values.name} ${Date.now()}`
                );

                if (!image.data) {
                    toast.error("Tải ảnh lên thất bại.");
                    return;
                }

                imageId = image.data._id;
            }

            await FrameService.update(id, {
                name: values.name,
                image: imageId
            });

            await queryClient.invalidateQueries({
                queryKey: [CONFIG_QUERY_KEY.FRAME.LIST]
            });

            toast.success("Cập nhật khung avatar thành công!");
            onSuccess?.();

        } catch (err) {
            toast.error("Có lỗi xảy ra.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (isLoading) return 'Đang tải khung avatar...'

    return (
        <form id='form-update-frame' onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>

            {/* Preview */}
            <div className="flex flex-col items-center gap-3">
                <div className="relative">
                    <Avatar className="size-20 ring-2 ring-border">
                        <AvatarImage
                            src={preview ?? frame?.image?.url}
                            alt={frame.name}
                        />
                        <AvatarFallback className="text-2xl font-semibold">
                            {frame.name?.charAt(0).toUpperCase()}
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

            <Controller
                name='name'
                control={form.control}
                render={({field, fieldState}) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor='form-update-frame-name'>Tên khung avatar</FieldLabel>
                        <Input
                            {...field}
                            id='form-update-frame-name'
                            aria-invalid={fieldState.invalid}
                            placeholder='Nhập tên khung'
                            autoComplete="name"
                        />
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]}/>
                        )}
                    </Field>
                )}
            />

            {/* Actions */}
            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="outline">Huỷ</Button>
                </DialogClose>
                <Button type="submit" form='form-update-frame' isLoading={loading}>
                    Lưu khung
                </Button>
            </DialogFooter>
        </form>
    )
}

export default FrameUpdateForm