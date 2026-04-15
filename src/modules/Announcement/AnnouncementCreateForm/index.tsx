// ** Shadcn ui
import { DialogClose, DialogFooter } from "@/components/ui/dialog";

// ** Zod
import { z } from "zod";

// ** Component
import Button from "@/components/common/Button";

// ** Services
import { AnnouncementService } from "@/services/announcement";

// ** Config
import { CONFIG_QUERY_KEY } from "@/configs/query-key";

// ** React hook form
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// ** UI
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import type {ICreated, TTypeAnnouncement} from "@/types/backend";


export const ANNOUNCEMENT_TYPE_OPTIONS: { value: TTypeAnnouncement; label: string }[] =
    [
        { value: "info", label: "Thông tin" },
        { value: "warning", label: "Cảnh báo" },
        { value: "maintenance", label: "Bảo trì" },
        { value: "event", label: "Sự kiện" },
    ];

export const formSchema = z.object({
    title: z.string().min(1, "Tiêu đề không được để trống"),
    content: z.string().min(1, "Nội dung không được để trống"),
    type: z.enum(["info", "warning", "maintenance", "event"]),
});

export type TAnnouncementForm = z.infer<typeof formSchema>;

export type TAnnouncementCreatePayload = {
    title: string;
    content: string;
    type: TTypeAnnouncement;
};

type TAnnouncementCreate = {
    onSuccess?: () => void;
};

const AnnouncementCreate = ({ onSuccess }: TAnnouncementCreate) => {
    const { mutate, isPending } = usePostMethod<TAnnouncementCreatePayload, ICreated>({
        api: AnnouncementService.add,
        key: [CONFIG_QUERY_KEY.ANNOUNCEMENT.LIST],
    });

    const form = useForm<TAnnouncementForm>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            content: "",
            type: "info",
        },
    });

    const onSubmit = (values: TAnnouncementForm) => {
        mutate(values, {
            onSuccess: () => {
                onSuccess?.();
            }
        });
    };

    return (
        <form
            id="form-create-announcement"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
        >
            {/* Title */}
            <Controller
                name="title"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="form-create-announcement-title">
                            Tiêu đề
                        </FieldLabel>
                        <Input
                            {...field}
                            id="form-create-announcement-title"
                            placeholder="Nhập tiêu đề"
                            autoComplete="off"
                            aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                        )}
                    </Field>
                )}
            />

            {/* Content */}
            <Controller
                name="content"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="form-create-announcement-content">
                            Nội dung
                        </FieldLabel>
                        <Textarea
                            {...field}
                            id="form-create-announcement-content"
                            placeholder="Nhập nội dung thông báo"
                            rows={4}
                            aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                        )}
                    </Field>
                )}
            />

            {/* Type */}
            <Controller
                name="type"
                control={form.control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="form-create-announcement-type">
                            Loại thông báo
                        </FieldLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger id="form-create-announcement-type">
                                <SelectValue placeholder="Chọn loại" />
                            </SelectTrigger>
                            <SelectContent>
                                {ANNOUNCEMENT_TYPE_OPTIONS.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
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
                    form="form-create-announcement"
                    isLoading={isPending}
                >
                    Tạo thông báo
                </Button>
            </DialogFooter>
        </form>
    );
};

export default AnnouncementCreate;