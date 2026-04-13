// ** React
import {useState, useRef, type ChangeEvent, useEffect} from "react";

// ** React query
import {useQuery} from "@tanstack/react-query";

// ** React hot toast
import toast from "react-hot-toast";

// ** Shadcn ui
import {DialogClose, DialogFooter} from "@/components/ui/dialog";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Field, FieldError, FieldLabel} from "@/components/ui/field";
import {Switch} from "@/components/ui/switch.tsx";

// ** Zod
import {z} from "zod";

// ** Icon
import {Upload, X} from "lucide-react";

// ** Component
import Button from "@/components/common/Button";

// ** Services
import {EmojiService} from "@/services/emoji";
import {UploadService} from "@/services/upload";
import {EmojiCategoryService} from "@/services/emoji-category";

// ** Config
import {CONFIG_QUERY_KEY} from "@/configs/query-key";

// ** React hook form
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

// ** Type
import type {IDetailEmoji, IUpdated, TType} from "@/types/backend";

// ** Hook
import useGetMethod from "@/hooks/common/useGetMethod.ts";
import usePatchMethod from "@/hooks/common/usePatchMethod.ts";

export const formSchema = z.object({
    type: z.enum(["image", "text"]),
    name: z.string().min(1, "Tên emoji không được để trống"),
    text: z.string().optional(),
    category: z.string().min(1, "Vui lòng chọn danh mục"),
    isGif: z.boolean(),
}).superRefine((data, ctx) => {
    if (data.type === "text" && !data.text) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Nội dung emoji không được để trống",
            path: ["text"],
        });
    }
});

export type TEmojiForm = z.infer<typeof formSchema>;

export type TEmojiUpdateFormPayload = {
    name: string;
    image?: string;
    type: TType;
    text?: string;
    category: string;
    isGif?: boolean;
};

type TEmojiUpdateForm = {
    id: string;
    onSuccess?: () => void;
}

const EmojiUpdateForm = ({id, onSuccess}: TEmojiUpdateForm) => {
    const [preview, setPreview] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [selectOpen, setSelectOpen] = useState(false);

    const {data: emojiData, isLoading, error} = useGetMethod<IDetailEmoji>({
        api: () => EmojiService.detail(id),
        key: [CONFIG_QUERY_KEY.EMOJI.DETAIL, id],
        enabled: !!id && !!open
    });

    useEffect(() => {
        if (error) {
            toast.error('Không thể tải thông tin danh mục emoji. Vui lòng thử lại sau.');
        }
    }, [error]);

    const emoji = emojiData?.data;

    const {data, isLoading: isLoadingEmoji} = useQuery({
        queryKey: [CONFIG_QUERY_KEY.EMOJI_CATEGORY.LIST],
        queryFn: () => EmojiCategoryService.list(),
        select: (res) => res.data ?? [],
        enabled: selectOpen
    });

    const {mutate, isPending} = usePatchMethod<TEmojiUpdateFormPayload, IUpdated>({
        api: (payload) => EmojiService.update(id, payload),
        keys: [[CONFIG_QUERY_KEY.EMOJI.LIST], [CONFIG_QUERY_KEY.EMOJI.DETAIL, id]],
    });

    const form = useForm<TEmojiForm>({
        resolver: zodResolver(formSchema),
    });

    useEffect(() => {
        if (emoji) {
            form.reset({
                name: emoji.name.replace(/\s*gif\s*/gi, '').trim(),
                category: emoji.category,
                text: emoji.text,
                type: emoji.type,
                isGif: emoji.isGif ?? false,
            });
        }
    }, [emoji, form]);

    const handleTabChange = (value: string) => {
        form.setValue("type", value as TType);
    };

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

    if (isLoading) return 'Đang tải chi tiết emoji...';
    if (!emoji) return 'Không tìm thấy thông tin emoji.';

    const onSubmit = async (values: TEmojiForm) => {
        if (values.type === "image") {
            const cleanName = values.name.replace(/\s*gif\s*/gi, '').trim();
            const name = values.isGif ? `${cleanName} gif` : cleanName;

            let imageId = emoji.image?._id;

            if (file) {
                const image = await UploadService.single(file, `emoji ${name} ${Date.now()}`);
                if (!image.data) {
                    toast.error("Tải ảnh lên thất bại.");
                    return;
                }
                imageId = image.data._id;
            }

            mutate({
                name,
                type: "image",
                category: values.category,
                image: imageId,
                isGif: values.isGif,
            }, {
                onSuccess: () => {
                    handleRemove();
                    onSuccess?.();
                }
            });
        } else {
            mutate({
                name: values.name,
                type: "text",
                category: values.category,
                text: values.text,
            }, {
                onSuccess: () => {
                    onSuccess?.();
                }
            });
        }
    };

    return (
        <form id="form-update-emoji" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Tabs value={form.watch("type")} onValueChange={handleTabChange}>
                <TabsList variant="line">
                    <TabsTrigger value="image">Emoji hình ảnh</TabsTrigger>
                    <TabsTrigger value="text">Emoji văn bản</TabsTrigger>
                </TabsList>

                <TabsContent value="image" className='mt-4'>
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative">
                            <Avatar className="size-20 ring-2 ring-border rounded-none">
                                <AvatarImage src={preview ?? emoji.image?.url}/>
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
                        className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center gap-2 cursor-pointer hover:border-primary hover:bg-accent/50 transition-colors mt-4"
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
                        name="isGif"
                        control={form.control}
                        render={({field}) => (
                            <Field>
                                <div className="flex items-center gap-2 mt-4">
                                    <Switch
                                        id="form-update-emoji-isGif"
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                    <FieldLabel htmlFor="form-update-emoji-isGif" className="mb-0 cursor-pointer">
                                        Là emoji GIF
                                    </FieldLabel>
                                </div>
                            </Field>
                        )}
                    />
                </TabsContent>

                <TabsContent value="text" className='mt-2'>
                    <Controller
                        name="text"
                        control={form.control}
                        render={({field, fieldState}) => (
                            <Field data-invalid={fieldState.invalid}>
                                <Input
                                    {...field}
                                    placeholder="Nhập emoji văn bản ( vd:   ╮(￣▽￣)╭  )"
                                    aria-invalid={fieldState.invalid}
                                />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
                            </Field>
                        )}
                    />
                </TabsContent>
            </Tabs>

            <Controller
                name="category"
                control={form.control}
                render={({field, fieldState}) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>Chọn danh mục</FieldLabel>
                        <Select
                            key={field.value}
                            open={selectOpen}
                            onOpenChange={setSelectOpen}
                            value={field.value}
                            onValueChange={field.onChange}
                        >
                            <SelectTrigger aria-invalid={fieldState.invalid}>
                                <SelectValue placeholder="Chọn danh mục..."/>
                            </SelectTrigger>
                            <SelectContent position="popper">
                                {isLoadingEmoji ? (
                                    <SelectItem value="loading" disabled>Đang tải...</SelectItem>
                                ) : (
                                    data?.map((cat) => (
                                        <SelectItem key={cat._id} value={cat._id}>
                                            <div className="flex items-center gap-2">
                                                <span>{cat.name}</span>
                                            </div>
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                        {fieldState.invalid && <FieldError errors={[fieldState.error]}/>}
                    </Field>
                )}
            />

            <Controller
                name="name"
                control={form.control}
                render={({field, fieldState}) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="form-update-emoji-name">Tên emoji</FieldLabel>
                        <Input
                            {...field}
                            id="form-update-emoji-name"
                            placeholder="Nhập tên emoji"
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
                <Button type="submit" form="form-update-emoji" isLoading={isPending}>
                    Lưu thay đổi
                </Button>
            </DialogFooter>
        </form>
    );
};

export default EmojiUpdateForm;