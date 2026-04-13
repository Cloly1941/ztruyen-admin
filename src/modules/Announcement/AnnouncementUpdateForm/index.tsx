// ** React hot toast
import toast from "react-hot-toast";

// ** Shadcn ui
import {DialogClose, DialogFooter} from "@/components/ui/dialog";

// ** Zod
import {z} from "zod";

// ** Component
import Button from "@/components/common/Button";

// ** Services
import {AnnouncementService} from "@/services/announcement";

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
import usePatchMethod from "@/hooks/common/usePatchMethod.ts";

// ** Type
import type {IAnnouncement, IUpdated, TTypeAnnouncement} from "@/types/backend";
import {ANNOUNCEMENT_TYPE_OPTIONS} from "@/modules/Announcement/AnnouncementCreateForm";
import {useEffect} from "react";
import useGetMethod from "@/hooks/common/useGetMethod.ts";

export const formSchema = z.object({
    title: z.string().min(1, "Tiêu đề không được để trống"),
    content: z.string().min(1, "Nội dung không được để trống"),
    type: z.enum(["info", "warning", "maintenance", "event"]),
});

export type TAnnouncementUpdateForm = z.infer<typeof formSchema>;

export type TAnnouncementUpdatePayload = {
    title: string;
    content: string;
    type: TTypeAnnouncement;
};

type TAnnouncementUpdate = {
    id: string;
    onSuccess?: () => void;
};

const AnnouncementUpdate = ({id, onSuccess}: TAnnouncementUpdate) => {

    const {data, isLoading, error} = useGetMethod<IAnnouncement>({
        api: () => AnnouncementService.detail(id),
        key: [CONFIG_QUERY_KEY.ANNOUNCEMENT.DETAIL, id],
        enabled: !!id && !!open
    });

    useEffect(() => {
        if (error) {
            toast.error('Không thể tải thông tin thông báo. Vui lòng thử lại sau.');
        }
    }, [error]);

    const announcement = data?.data;

    const {mutate, isPending} = usePatchMethod<TAnnouncementUpdatePayload, IUpdated>({
        api: (payload) => AnnouncementService.update(id, payload),
        keys: [
            [CONFIG_QUERY_KEY.ANNOUNCEMENT.LIST],
            [CONFIG_QUERY_KEY.ANNOUNCEMENT.DETAIL, id],
        ],
    });

    const form = useForm<TAnnouncementUpdateForm>({
        resolver: zodResolver(formSchema)
    });

    // default data user
    useEffect(() => {
        if (announcement) {
            form.reset({
                title: announcement?.title,
                content: announcement?.content,
                type: announcement?.type,
            })
        }
    }, [announcement, form])

    const onSubmit = (values: TAnnouncementUpdateForm) => {
        mutate(values, {
            onSuccess: () => {
                onSuccess?.();
            }
        });
    };

    if (isLoading) return 'Đang tải thông báo...';
    if (!announcement) return 'Không tìm thấy thông tin thông báo.';

    return (
        <form
            id="form-update-announcement"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
        >
            {/* Tiêu đề */}
            <Controller
                name="title"
                control={form.control}
                render={({field, fieldState}) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="form-update-announcement-title">
                            Tiêu đề
                        </FieldLabel>
                        <Input
                            {...field}
                            id="form-update-announcement-title"
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

            {/* Nội dung */}
            <Controller
                name="content"
                control={form.control}
                render={({field, fieldState}) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="form-update-announcement-content">
                            Nội dung
                        </FieldLabel>
                        <Textarea
                            {...field}
                            id="form-update-announcement-content"
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

            {/* Loại thông báo */}
            <Controller
                name="type"
                control={form.control}
                render={({field, fieldState}) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="form-update-announcement-type">
                            Loại thông báo
                        </FieldLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger id="form-update-announcement-type">
                                <SelectValue placeholder="Chọn loại"/>
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
                    form="form-update-announcement"
                    isLoading={isPending}
                >
                    Cập nhật
                </Button>
            </DialogFooter>
        </form>
    );
};

export default AnnouncementUpdate;