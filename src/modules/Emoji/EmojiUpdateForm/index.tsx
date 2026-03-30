// ** React
import {useState, useRef, type ChangeEvent, useEffect} from "react";

// ** React query
import {useQuery, useQueryClient} from "@tanstack/react-query";

// ** React hot toast
import toast from "react-hot-toast";

// ** Shadcn ui
import {DialogClose, DialogFooter} from "@/components/ui/dialog";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Field, FieldError, FieldLabel} from "@/components/ui/field";

// ** Zod
import {z} from "zod";

// ** Icon
import {Upload, X} from "lucide-react";

// ** Component
import Button from "@/components/common/Button";

// ** Services
import {EmojiService} from "@/services/emoji";
import {UploadService} from "@/services/upload";

// ** Config
import {CONFIG_QUERY_KEY} from "@/configs/query-key";

// ** React hook form
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

// ** Type
import type {IDetailEmoji, TType} from "@/types/backend";
import {EmojiCategoryService} from "@/services/emoji-category";
import useGetMethod from "@/hooks/common/useGetMethod.ts";


export const formSchema = z.object({
    type: z.enum(["image", "text"]),
    name: z.string().min(1, "Tên emoji không được để trống"),
    text: z.string().optional(),
    category: z.string().min(1, "Vui lòng chọn danh mục"),
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
};

type TEmojiUpdateForm = {
    id: string
    onSuccess?: () => void;
}

const EmojiUpdateForm = ({id, onSuccess}: TEmojiUpdateForm) => {
    const [preview, setPreview] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);
    const [tab, setTab] = useState<TType>("image");
    const [selectOpen, setSelectOpen] = useState(false)

    const {data: emojiData, isLoading, error} = useGetMethod<IDetailEmoji>({
        api: () => EmojiService.detail(id),
        key: [CONFIG_QUERY_KEY.EMOJI.DETAIL, id],
        enabled: !!id && !!open
    })

    // fetch detail emoji category fail
    useEffect(() => {
        if (error) {
            toast.error(
                'Không thể tải thông tin danh mục emoji. Vui lòng thử lại sau.'
            )
        }
    }, [error])

    const emoji = emojiData?.data

    const queryClient = useQueryClient();

    const {data, isLoading: isLoadingEmoji} = useQuery({
        queryKey: [CONFIG_QUERY_KEY.EMOJI_CATEGORY.LIST],
        queryFn: () => EmojiCategoryService.list(),
        select: (res) => res.data ?? [],
        enabled: selectOpen
    })

    const form = useForm<TEmojiForm>({
        resolver: zodResolver(formSchema),
    });

    // default frame name
    useEffect(() => {
        if (emoji) {
            form.reset({
                name: emoji.name,
                category: emoji.category,
                text: emoji.text,
                type: emoji.type
            })

            setTab(emoji.type);
        }
    }, [emoji, form])

    const handleTabChange = (value: string) => {
        const type = value as TType;
        setTab(type);
        form.setValue("type", type);
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

    if (!emoji) return 'Không tìm thấy thông tin emoji.'

    const onSubmit = async (values: TEmojiForm) => {
        try {
            setLoading(true);

            let imageId = emoji?.image?._id;

            if (values.type === "image") {
                if (file) {
                    const image = await UploadService.single(file, `${values.name} ${Date.now()}`);

                    if (!image.data) {
                        toast.error("Tải ảnh lên thất bại.");
                        return;
                    }

                    imageId = image.data._id;
                }

                await EmojiService.update(id, {
                    name: values.name,
                    type: "image",
                    category: values.category,
                    image: imageId,
                });
            } else {
                await EmojiService.update(id, {
                    name: values.name,
                    type: "text",
                    category: values.category,
                    text: values.text,
                });
            }

            await queryClient.invalidateQueries({
                queryKey: [CONFIG_QUERY_KEY.EMOJI.LIST],
            });

            toast.success("Cập nhật emoji thành công!");
            if (tab === "image") {
                form.reset({type: "image", name: ""});
            } else {
                form.reset({type: "text", name: "", text: ""});
            }
            handleRemove();
            onSuccess?.();
        } catch (err) {
            toast.error("Có lỗi xảy ra.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    if (isLoading) return 'Đang tải chi tiết emoji...'

    return (
        <form id="form-update-emoji" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Tabs value={tab} onValueChange={handleTabChange}>
                <TabsList variant="line">
                    <TabsTrigger value="image">Emoji hình ảnh</TabsTrigger>
                    <TabsTrigger value="text">Emoji văn bản</TabsTrigger>
                </TabsList>

                <TabsContent value="image" className='mt-4'>
                    {/* Preview */}
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative">

                            <Avatar
                                className="size-20 ring-2 ring-border rounded-none">
                                <AvatarImage src={preview ?? emoji?.image?.url}/>
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

                    {/* Upload */}
                    <div
                        onClick={() => inputRef.current?.click()}
                        className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center gap-2 cursor-pointer hover:border-primary hover:bg-accent/50 transition-colors"
                    >
                        <Upload className="size-8 text-muted-foreground"/>
                        <p className="text-sm font-medium">Nhấn để chọn ảnh</p>
                        <p className="text-xs text-muted-foreground">
                            PNG, JPG, WEBP — tối đa 5MB
                        </p>

                        <input
                            ref={inputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </div>
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

            {/* Category Select */}
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
                                    <SelectItem value="loading" disabled>
                                        Đang tải...
                                    </SelectItem>
                                ) : (
                                    data?.map((emoji) => (
                                        <SelectItem key={emoji._id} value={emoji._id}>
                                            <div className="flex items-center gap-2">
                                                <span>{emoji.name}</span>
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

            {/* Name */}
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

            {/* Actions */}
            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="outline">Huỷ</Button>
                </DialogClose>

                <Button
                    type="submit"
                    form="form-update-emoji"
                    isLoading={loading}
                >
                    Lưu thay đổi
                </Button>
            </DialogFooter>
        </form>
    )
}

export default EmojiUpdateForm