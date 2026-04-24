// ** React
import {useEffect} from "react";

// ** React hot toast
import toast from "react-hot-toast";

// ** Shadcn ui
import {DialogClose, DialogFooter} from "@/components/ui/dialog";
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

// ** Hook
import usePatchMethod from "@/hooks/common/usePatchMethod.ts";
import useGetMethod from "@/hooks/common/useGetMethod.ts";

// ** Type
import type {IGuide, IUpdated, TPlatform} from "@/types/backend";
import {PlATFORM_OPTIONS, formSchema as createSchema} from "@/modules/Guide/GuideCreateForm";

export const formSchema = createSchema;

export type TGuideUpdateForm = z.infer<typeof formSchema>;

export type TGuideUpdatePayload = {
    title: string;
    description: string;
    content: string;
    platform: TPlatform;
};

type TGuideUpdate = {
    id: string;
    onSuccess?: () => void;
};

const GuideUpdate = ({id, onSuccess}: TGuideUpdate) => {
    const {data, isLoading, error} = useGetMethod<IGuide>({
        api: () => GuideService.detail(id),
        key: [CONFIG_QUERY_KEY.GUIDE.DETAIL, id],
        enabled: !!id,
    });

    useEffect(() => {
        if (error) {
            toast.error("Không thể tải thông tin hướng dẫn. Vui lòng thử lại sau.");
        }
    }, [error]);

    const guide = data?.data;

    const {mutate, isPending} = usePatchMethod<TGuideUpdatePayload, IUpdated>({
        api: (payload) => GuideService.update(id, payload),
        keys: [
            [CONFIG_QUERY_KEY.GUIDE.LIST],
            [CONFIG_QUERY_KEY.GUIDE.DETAIL, id],
        ],
    });

    const form = useForm<TGuideUpdateForm>({
        resolver: zodResolver(formSchema),
    });

    useEffect(() => {
        if (guide) {
            form.reset({
                title: guide.title,
                description: guide.description,
                content: guide.content,
                platform: guide.platform,
            });
        }
    }, [guide, form]);

    const onSubmit = (values: TGuideUpdateForm) => {
        mutate(values);
        onSuccess?.();
    };

    if (isLoading) return "Đang tải hướng dẫn...";
    if (!guide) return "Không tìm thấy thông tin hướng dẫn.";

    return (
        <form
            id="form-update-guide"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
        >
            {/* Title */}
            <Controller
                name="title"
                control={form.control}
                render={({field, fieldState}) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="form-update-guide-title">
                            Tiêu đề
                        </FieldLabel>
                        <Input
                            {...field}
                            id="form-update-guide-title"
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

            {/* Desc */}
            <Controller
                name="description"
                control={form.control}
                render={({field, fieldState}) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="form-update-guide-desc">
                            Mô tả
                        </FieldLabel>
                        <Textarea
                            {...field}
                            id="form-update-guide-desc"
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
                        <FieldLabel htmlFor="form-update-guide-content">
                            Nội dung
                        </FieldLabel>
                        <Textarea
                            {...field}
                            id="form-update-guide-content"
                            placeholder="Nhập nội dung"
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
                        <FieldLabel htmlFor="form-update-guide-platform">
                            Thiết bị
                        </FieldLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger id="form-update-guide-platform">
                                <SelectValue placeholder="Chọn thiết bị"/>
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
                    form="form-update-guide"
                    isLoading={isPending}
                >
                    Cập nhật
                </Button>
            </DialogFooter>
        </form>
    );
};

export default GuideUpdate;