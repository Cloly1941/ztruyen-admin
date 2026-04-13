// ** React
import {useState, useRef, type ChangeEvent, useEffect} from "react";

// ** React hot toast
import toast from "react-hot-toast";

// ** Shadcn ui
import {DialogClose, DialogFooter} from "@/components/ui/dialog";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import {Input} from "@/components/ui/input";

// ** Zod
import {z} from "zod";

// ** Icon
import {Upload, X} from "lucide-react";

// ** Component
import Button from "@/components/common/Button";

// ** Services
import {EmojiCategoryService} from "@/services/emoji-category";

// ** Config
import {CONFIG_QUERY_KEY} from "@/configs/query-key";

// ** React hook form
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

// ** UI
import {Field, FieldError, FieldLabel} from "@/components/ui/field";

// ** Hook
import useGetMethod from "@/hooks/common/useGetMethod.ts";
import usePatchWithImage from "@/hooks/common/usePatchWithImage.ts";

// ** Type
import type {ICategoryEmoji, IUpdated} from "@/types/backend";

export const formSchema = z.object({
    name: z.string().min(1, "Tên khung avatar không được để trống"),
});

export type TEmojiCategoryForm = z.infer<typeof formSchema>;

export type TEmojiCategoryUpdateFormPayload = {
    name: string;
    image: string;
};

type TEmojiCategoryUpdateForm = {
    id: string;
    onSuccess?: () => void;
}

const EmojiCategoryUpdateForm = ({id, onSuccess}: TEmojiCategoryUpdateForm) => {
    const [preview, setPreview] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const {data, isLoading, error} = useGetMethod<ICategoryEmoji>({
        api: () => EmojiCategoryService.detail(id),
        key: [CONFIG_QUERY_KEY.EMOJI_CATEGORY.DETAIL, id],
        enabled: !!id && !!open
    });

    useEffect(() => {
        if (error) {
            toast.error('Không thể tải thông tin danh mục emoji. Vui lòng thử lại sau.');
        }
    }, [error]);

    const emojiCategory = data?.data;

    const {mutate, isPending} = usePatchWithImage<TEmojiCategoryUpdateFormPayload, IUpdated>({
        api: (payload) => EmojiCategoryService.update(id, payload),
        keys: [
            [CONFIG_QUERY_KEY.EMOJI_CATEGORY.LIST],
            [CONFIG_QUERY_KEY.EMOJI_CATEGORY.DETAIL, id],
        ],
        fileKey: 'image',
        fileCaption: (payload) => `${payload.name} ${Date.now()}`,
        fallbackImageId: emojiCategory?.image._id,
    });

    const form = useForm<TEmojiCategoryForm>({
        resolver: zodResolver(formSchema),
    });

    useEffect(() => {
        if (emojiCategory) {
            form.reset({name: emojiCategory.name});
        }
    }, [emojiCategory, form]);

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

    if (isLoading) return 'Đang tải danh mục emoji...';
    if (!emojiCategory) return 'Không tìm thấy thông tin danh mục emoji.';

    const onSubmit = async (values: TEmojiCategoryForm) => {
        await mutate({
            name: values.name,
            file,
        }, {
            onSuccess: () => {
                handleRemove();
                onSuccess?.();
            }
        });
    };

    return (
        <form
            id="form-update-emoji-category"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
        >
            <div className="flex flex-col items-center gap-3">
                <div className="relative">
                    <Avatar className="size-10 ring-2 ring-border rounded-none">
                        <AvatarImage src={preview ?? emojiCategory.image?.url}/>
                        <AvatarFallback className="text-2xl font-semibold rounded-none">
                            {form.watch("name")?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>

                    {preview && (
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="absolute -top-1 -right-6 size-5 rounded-full bg-destructive text-white flex items-center justify-center hover:bg-destructive/80 transition-colors"
                        >
                            <X className="size-3"/>
                        </button>
                    )}
                </div>
                <p className="text-sm text-muted-foreground">{preview && file?.name}</p>
            </div>

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
                name="name"
                control={form.control}
                render={({field, fieldState}) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="form-update-emoji-category-name">
                            Tên danh mục emoji
                        </FieldLabel>
                        <Input
                            {...field}
                            id="form-update-emoji-category-name"
                            placeholder="Nhập tên danh mục emoji"
                            autoComplete="name"
                            aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
                    </Field>
                )}
            />

            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="outline">Huỷ</Button>
                </DialogClose>
                <Button type="submit" form="form-update-emoji-category" isLoading={isPending}>
                    Lưu thay đổi
                </Button>
            </DialogFooter>
        </form>
    );
};

export default EmojiCategoryUpdateForm;