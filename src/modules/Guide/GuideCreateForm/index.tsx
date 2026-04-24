// ** Shadcn ui
import {DialogClose, DialogFooter} from "@/components/ui/dialog";

// ** Zod
import {z} from "zod";

// ** Component
import Button from "@/components/common/Button";

// ** Services
import {GuideService} from "@/services/guide";

// ** Config
import {CONFIG_QUERY_KEY} from "@/configs/query-key";

// ** React hook form
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

// ** UI
import {Field, FieldError, FieldLabel} from "@/components/ui/field";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// ** Hook
import usePostMethod from "@/hooks/common/usePostMethod.ts";

// ** Type
import type {ICreated, TPlatform} from "@/types/backend";


export const PlATFORM_OPTIONS: { value: TPlatform; label: string }[] =
    [
        {value: "IOS", label: "IOS"},
        {value: "PC", label: "PC"},
        {value: "Android", label: "Android"},
        {value: "None", label: "Không"},
    ];

export const formSchema = z.object({
    title: z.string().min(1, "Tiêu đề không được để trống"),
    description: z.string().min(1, "Nội dung mô tả không được để trống"),
    content: z.string().min(1, "Nội dung không được để trống"),
    platform: z.enum(["IOS", "PC", "Android", "None"]),
});

export type TGuideForm = z.infer<typeof formSchema>;

export type TGuideCreatePayload = {
    title: string
    description: string
    content: string;
    platform: TPlatform;
};

type TGuideCreate = {
    onSuccess?: () => void;
};

const GuideCreate = ({onSuccess}: TGuideCreate) => {
    const {mutate, isPending} = usePostMethod<TGuideCreatePayload, ICreated>({
        api: GuideService.add,
        key: [CONFIG_QUERY_KEY.GUIDE.LIST],
    });

    const form = useForm<TGuideForm>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            content: "",
            platform: "None",
        },
    });

    const onSubmit = (values: TGuideForm) => {
        mutate(values, {
            onSuccess: () => {
                onSuccess?.();
            }
        });
    };

    return (
        <form
            id="form-create-guide"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
        >
            {/* Title */}
            <Controller
                name="title"
                control={form.control}
                render={({field, fieldState}) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="form-create-guide-title">
                            Tiêu đề
                        </FieldLabel>
                        <Input
                            {...field}
                            id="form-create-guide-title"
                            placeholder="Nhập tiêu đề"
                            autoComplete="off"
                            aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]}/>
                        )}
                    </Field>
                )}
            />

            {/* Content */}
            <Controller
                name="description"
                control={form.control}
                render={({field, fieldState}) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="form-create-guide-desc">
                            Mô tả
                        </FieldLabel>
                        <Textarea
                            {...field}
                            id="form-create-guide-desc"
                            placeholder="Nhập mô tả"
                            rows={4}
                            aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]}/>
                        )}
                    </Field>
                )}
            />

            {/* Content */}
            <Controller
                name="content"
                control={form.control}
                render={({field, fieldState}) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="form-create-guide-content">
                            Nội dung
                        </FieldLabel>
                        <Textarea
                            {...field}
                            id="form-create-guide-content"
                            placeholder="Nhập nội dung thông báo"
                            rows={4}
                            aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]}/>
                        )}
                    </Field>
                )}
            />

            {/* Platform */}
            <Controller
                name="platform"
                control={form.control}
                render={({field, fieldState}) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="form-create-guide-type">
                            Thiết bị
                        </FieldLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger id="form-create-guide-type">
                                <SelectValue placeholder="Chọn loại"/>
                            </SelectTrigger>
                            <SelectContent>
                                {PlATFORM_OPTIONS.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]}/>
                        )}
                    </Field>
                )}
            />

            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="outline">Huỷ</Button>
                </DialogClose>
                <Button
                    type="submit"
                    form="form-create-guide"
                    isLoading={isPending}
                >
                    Tạo thông báo
                </Button>
            </DialogFooter>
        </form>
    );
};

export default GuideCreate;