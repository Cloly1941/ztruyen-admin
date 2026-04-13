// ** React
import {useState, useRef, type ChangeEvent} from "react";

// ** React hot toast
import toast from "react-hot-toast";

// ** Shadcn ui
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {DialogClose, DialogFooter} from "@/components/ui/dialog";

// ** Zod
import {z} from "zod";

// ** Icon
import {Upload, X} from "lucide-react";

// ** Component
import Button from "@/components/common/Button";

// ** Services
import {FrameService} from "@/services/frame";
import {UploadService} from "@/services/upload";

// ** Config
import {CONFIG_QUERY_KEY} from "@/configs/query-key";

// ** React hook form
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

// ** UI
import {Field, FieldError, FieldLabel} from "@/components/ui/field";
import {Input} from "@/components/ui/input";

// ** Hook
import usePostMethod from "@/hooks/common/usePostMethod.ts";
import type {ICreated} from "@/types/backend";

export const formSchema = z.object({
    name: z.string().min(1, "Tên khung avatar không được để trống"),
});

export type TFrameForm = z.infer<typeof formSchema>;

export type TFrameCreateFormPayload = {
    name: string;
    image: string;
};

type TFrameCreateForm = {
    onSuccess?: () => void;

};

const FrameCreateForm = ({onSuccess}: TFrameCreateForm) => {
    const [preview, setPreview] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const {mutate, isPending} = usePostMethod<TFrameCreateFormPayload, ICreated>({
        api: FrameService.add,
        key: [CONFIG_QUERY_KEY.FRAME.LIST],
    });

    const form = useForm<TFrameForm>({
        resolver: zodResolver(formSchema),
    });

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

    const onSubmit = async (values: TFrameForm) => {
        if (!file) {
            toast.error("Vui lòng chọn ảnh khung avatar.");
            return;
        }

        const image = await UploadService.single(file, `${values.name} ${Date.now()}`);
        if (!image.data) {
            toast.error("Tải ảnh lên thất bại.");
            return;
        }

        mutate({
            name: values.name,
            image: image.data._id,
        }, {
            onSuccess: () => {
                form.reset();
                handleRemove();
                onSuccess?.();
            }
        });
    };

    return (
        <form
            id="form-create-frame"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
        >
            <div className="flex flex-col items-center gap-3">
                <div className="relative">
                    <Avatar className="size-20 ring-2 ring-border">
                        <AvatarImage src={preview ?? ""}/>
                        <AvatarFallback className="text-2xl font-semibold">
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
                        <FieldLabel htmlFor="form-create-frame-name">
                            Tên khung avatar
                        </FieldLabel>
                        <Input
                            {...field}
                            id="form-create-frame-name"
                            placeholder="Nhập tên khung"
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
                <Button type="submit" form="form-create-frame" isLoading={isPending}>
                    Tạo khung
                </Button>
            </DialogFooter>
        </form>
    );
};

export default FrameCreateForm;