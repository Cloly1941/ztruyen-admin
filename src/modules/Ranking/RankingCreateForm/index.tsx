// ** React query
import {useQuery} from "@tanstack/react-query";

// ** React hook form
import {Controller, useForm} from "react-hook-form";

// ** Zod
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";

// ** Component
import MultiSelectDropdown from "@/components/common/MultiSelectDropdown";

// ** Shadcn ui
import {DialogClose, DialogFooter} from "@/components/ui/dialog";
import Button from "@/components/common/Button";
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

// ** Config
import {CONFIG_QUERY_KEY} from "@/configs/query-key";

// ** Hook
import usePostMethod from "@/hooks/common/usePostMethod.ts";

// ** Type
import type {ICategory, ICreated} from "@/types/backend";

// ** Services
import {ComicService} from "@/services/comic";
import {OtruyenService} from "@/services/otruyen";
import {useEffect} from "react";
import toast from "react-hot-toast";

export const formSchema = z.object({
    name: z.string().min(1, "Tên truyện không được để trống"),
    slug: z.string().min(1, "Slug không được để trống"),
    thumb_url: z.string().min(1, "URL ảnh bìa không được để trống"),
    authors: z.string().min(1, "Tác giả không được để trống"),
    status: z.string().min(1, "Vui lòng chọn trạng thái"),
    genres: z.array(z.string()).min(1, "Vui lòng chọn ít nhất 1 thể loại"),
    latest_chapter: z.string().optional(),
    chapter_api_data: z.string().optional(),
    country: z.string().min(1, "Vui lòng chọn quốc gia"),
    rank: z.number().min(1, "Rank phải lớn hơn 0"),
});

export type TRankingForm = z.infer<typeof formSchema>;

export type TRankingCreatePayload = {
    name: string;
    slug: string;
    thumb_url: string;
    authors: string[];
    status: string;
    genres: string[];
    latest_chapter: string;
    chapter_api_data: string;
    country: string;
    rank: number;
};

type TRankingCreate = {
    onSuccess?: () => void;
};

const STATUS_OPTIONS = [
    {value: "ongoing", label: "Đang tiến hành"},
    {value: "coming_soon", label: "Sắp phát hành"},
    {value: "completed", label: "Hoàn thành"},
];

const COUNTRY_OPTIONS = [
    {value: "trung", label: "Trung Quốc"},
    {value: "nhat", label: "Nhật Bản"},
    {value: "han", label: "Hàn Quốc"},
];

const RankingCreate = ({onSuccess}: TRankingCreate) => {
    const {data, isLoading, error} = useQuery({
        queryKey: [CONFIG_QUERY_KEY.OTRUYEN.CATEGORY],
        queryFn: async () => OtruyenService.categories(),
        enabled: true,
        retry: false,
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        if (error) {
            toast.error('Không thể tải thông tin thể loại. Vui lòng thử lại sau.');
        }
    }, [error]);

    const {mutate, isPending} = usePostMethod<TRankingCreatePayload, ICreated>({
        api: ComicService.add,
        key: [CONFIG_QUERY_KEY.COMIC.RANKING_LIST],
    });

    const categories = data?.data?.items ?? [];

    const form = useForm<TRankingForm>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            slug: "",
            thumb_url: "",
            authors: "",
            status: "",
            genres: [],
            latest_chapter: "",
            chapter_api_data: "",
            country: "",
            rank: 1,
        },
    });

    const onSubmit = (values: TRankingForm) => {
        const payload: TRankingCreatePayload = {
            ...values,
            authors: values.authors.split(",").map((a) => a.trim()),
            latest_chapter: values.latest_chapter ?? "",
            chapter_api_data: values.chapter_api_data ?? "",
        };

        mutate(payload);

        onSuccess?.()
    };

    return (
        <form
            id="form-create-ranking"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
        >
            {/* Tên truyện */}
            <Controller
                control={form.control}
                name="name"
                render={({field, fieldState}) => (
                    <Field>
                        <FieldLabel>Tên truyện</FieldLabel>
                        <Input placeholder="Nhập tên truyện..." {...field} />
                        {fieldState.error && (
                            <FieldError>{fieldState.error.message}</FieldError>
                        )}
                    </Field>
                )}
            />

            {/* Slug */}
            <Controller
                control={form.control}
                name="slug"
                render={({field, fieldState}) => (
                    <Field>
                        <FieldLabel>Slug</FieldLabel>
                        <Input placeholder="ten-truyen-cua-ban" {...field} />
                        {fieldState.error && (
                            <FieldError>{fieldState.error.message}</FieldError>
                        )}
                    </Field>
                )}
            />

            {/* Thumbnail URL */}
            <Controller
                control={form.control}
                name="thumb_url"
                render={({field, fieldState}) => (
                    <Field>
                        <FieldLabel>URL ảnh bìa</FieldLabel>
                        <Input placeholder="https://..." {...field} />
                        {fieldState.error && (
                            <FieldError>{fieldState.error.message}</FieldError>
                        )}
                    </Field>
                )}
            />

            {/* Authors */}
            <Controller
                control={form.control}
                name="authors"
                render={({field, fieldState}) => (
                    <Field>
                        <FieldLabel>Tác giả</FieldLabel>
                        <Input
                            placeholder="Tác giả A, Tác giả B (phân cách bằng dấu phẩy)"
                            {...field}
                        />
                        {fieldState.error && (
                            <FieldError>{fieldState.error.message}</FieldError>
                        )}
                    </Field>
                )}
            />

            <div className="grid grid-cols-2 gap-4">
                {/* Status */}
                <Controller
                    control={form.control}
                    name="status"
                    render={({field, fieldState}) => (
                        <Field>
                            <FieldLabel>Trạng thái</FieldLabel>
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn trạng thái"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {STATUS_OPTIONS.map((opt) => (
                                        <SelectItem key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {fieldState.error && (
                                <FieldError>{fieldState.error.message}</FieldError>
                            )}
                        </Field>
                    )}
                />

                {/* Country */}
                <Controller
                    control={form.control}
                    name="country"
                    render={({field, fieldState}) => (
                        <Field>
                            <FieldLabel>Quốc gia</FieldLabel>
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn quốc gia"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {COUNTRY_OPTIONS.map((opt) => (
                                        <SelectItem key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {fieldState.error && (
                                <FieldError>{fieldState.error.message}</FieldError>
                            )}
                        </Field>
                    )}
                />
            </div>

            {/* Genres */}
            <Controller
                control={form.control}
                name="genres"
                render={({field, fieldState}) => (
                    <Field>
                        <FieldLabel>Thể loại</FieldLabel>
                        <MultiSelectDropdown
                            options={categories.map((cat: ICategory) => ({
                                label: cat.name,
                                value: cat.name,
                            }))}
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Chọn thể loại"
                            isLoading={isLoading}
                        />
                        {fieldState.error && (
                            <FieldError>{fieldState.error.message}</FieldError>
                        )}
                    </Field>
                )}
            />

            {/* Rank */}
            <Controller
                control={form.control}
                name="rank"
                render={({field, fieldState}) => (
                    <Field>
                        <FieldLabel>Rank</FieldLabel>
                        <Input
                            type="number"
                            min={1}
                            placeholder="1"
                            value={field.value}
                            onBlur={field.onBlur}
                            name={field.name}
                            ref={field.ref}
                            onChange={(e) => field.onChange(e.target.valueAsNumber)}
                        />
                        {fieldState.error && (
                            <FieldError>{fieldState.error.message}</FieldError>
                        )}
                    </Field>
                )}
            />

            {/* Chapter API Data */}
            <Controller
                control={form.control}
                name="chapter_api_data"
                render={({field, fieldState}) => (
                    <Field>
                        <FieldLabel>Chapter API Data</FieldLabel>
                        <Textarea
                            placeholder="URL hoặc dữ liệu API chapter..."
                            rows={3}
                            {...field}
                        />
                        {fieldState.error && (
                            <FieldError>{fieldState.error.message}</FieldError>
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
                    form="form-create-ranking"
                    isLoading={isPending}
                >
                    Tạo mới truyện
                </Button>
            </DialogFooter>
        </form>
    );
};

export default RankingCreate;