// ** React
import {useEffect} from "react";

// ** React hot toast
import toast from "react-hot-toast";

// ** Shadcn ui
import {DialogClose, DialogFooter} from "@/components/ui/dialog.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Calendar} from "@/components/ui/calendar"

// ** Component
import Button from "@/components/common/Button";

// ** Zod
import {z} from "zod";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Field, FieldError, FieldLabel} from "@/components/ui/field.tsx";
import {Input} from "@/components/ui/input.tsx";
import {getAgeToBirthday, getDefaultBirthdayMonth, isBirthdayValid} from "@/utils/date.ts";
import {CalendarIcon} from "lucide-react";
// ** date-fns
import {format} from 'date-fns';

// ** React day picker
import {vi} from 'react-day-picker/locale';

// ** Hooks
import useGetMethod from "@/hooks/common/useGetMethod.ts";
import usePatchMethod from "@/hooks/common/usePatchMethod.ts";

// ** Service
import {UserService} from "@/services/user";

// ** Config
import {CONFIG_QUERY_KEY} from "@/configs/query-key";

// ** Type
import type {IUser, IUserUpdated} from "@/types/backend";


const formSchema = z.object({
    name: z.string().min(1, 'Tên không được để trống'),
    gender: z
        .string()
        .optional()
        .refine((val) => !!val, {
            message: 'Vui lòng chọn giới tính',
        })
        .refine((val) => !val || ['male', 'female', 'lgbt'].includes(val), {
            message: 'Giới tính không hợp lệ',
        }),
    birthday: z
        .date({
            message: 'Vui lòng chọn ngày sinh',
        })
        .refine((date) => {
            const age = getAgeToBirthday(date);
            return age >= 10 && age <= 100;
        }, {
            message: 'Vui lòng chọn ngày sinh phù hợp (từ 10 đến 100 tuổi)'
        }),
})

export type TUserUpdateForm = z.infer<typeof formSchema>;

export type TUserUpdateFormPayload = {
    name: string;
    gender?: string;
    birthday: string;
    age: number;
}

type TUserUpdateFormProps = {
    id: string;
    onSuccess?: () => void;
}

const UserUpdateForm = ({id, onSuccess}: TUserUpdateFormProps) => {

    const {data, isLoading, error} = useGetMethod<IUser>({
        api: () => UserService.detail(id),
        key: [CONFIG_QUERY_KEY.USER.DETAIL, id],
        enabled: !!id && !!open
    })
    const {mutateAsync: updated, isPending} = usePatchMethod<TUserUpdateFormPayload, IUserUpdated>({
        api: (payload) => UserService.update(id, payload),
        keys: [
            [CONFIG_QUERY_KEY.USER.DETAIL, id],
            [CONFIG_QUERY_KEY.USER.LIST]
        ]
    })

    // fetch detail user fail
    useEffect(() => {
        if (error) {
            toast.error(
                'Không thể tải thông tin người dùng. Vui lòng thử lại sau.'
            )
        }
    }, [error])

    const userDetail = data?.data

    const form = useForm<TUserUpdateForm>({
        resolver: zodResolver(formSchema)
    });

    // default data user
    useEffect(() => {
        if (userDetail) {
            form.reset({
                name: userDetail.name,
                gender: userDetail.gender ?? undefined,
                birthday: userDetail.birthday
                    ? new Date(userDetail.birthday)
                    : undefined
            })
        }
    }, [userDetail, form])

    const onSubmit = async (values: TUserUpdateForm) => {
        await updated(
            {
                name: values.name,
                age: getAgeToBirthday(values.birthday),
                birthday: values.birthday.toISOString(),
                gender: values.gender
            }
        )

        onSuccess?.()
    }

    if (isLoading) return 'Đang tải thông tin người dùng...'

    if (!userDetail) return 'Không tìm thấy thông tin người dùng.'

    return (
        <form id='form-update-user' onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            {/* Name */}
            <Controller
                name='name'
                control={form.control}
                render={({field, fieldState}) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor='form-update-user-name'>Tên</FieldLabel>
                        <Input
                            {...field}
                            id='form-update-user-name'
                            aria-invalid={fieldState.invalid}
                            placeholder='Nhập tên người dùng'
                            autoComplete="name"
                        />
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]}/>
                        )}
                    </Field>
                )}
            />

            {/* Gender */}
            <Controller
                name="gender"
                control={form.control}
                render={({field, fieldState}) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor='form-update-user-gender'>Giới tính</FieldLabel>
                        <Select
                            value={field.value}
                            onValueChange={field.onChange}
                        >
                            <SelectTrigger id="form-update-user-gender">
                                <SelectValue placeholder="Chọn giới tính"/>
                            </SelectTrigger>
                            <SelectContent position="popper">
                                <SelectItem value="male">Nam</SelectItem>
                                <SelectItem value="female">Nữ</SelectItem>
                                <SelectItem value="lgbt">LGBT</SelectItem>
                            </SelectContent>
                        </Select>
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]}/>
                        )}
                    </Field>
                )}
            />

            {/* Birthday */}
            <Controller
                name='birthday'
                control={form.control}
                render={({field, fieldState}) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor='form-update-user-birthday'>Ngày sinh</FieldLabel>
                        <Popover>
                            <PopoverTrigger id="form-update-user-birthday">
                                <Button variant="outline" className='w-full'>
                                    <CalendarIcon className="mr-2"/>
                                    {field.value
                                        ? format(field.value, 'dd/MM/yyyy', {locale: vi})
                                        : 'Chọn ngày sinh của người dùng'}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent align="center" className='p-2 w-[var(--radix-popover-trigger-width)]'>
                                <Calendar
                                    className='w-full'
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    defaultMonth={getDefaultBirthdayMonth()}
                                    captionLayout="dropdown"
                                    disabled={(date) => !isBirthdayValid(date)}
                                    locale={vi}
                                    formatters={{
                                        formatMonthDropdown: (date) =>
                                            format(date, "MMMM", {locale: vi}),
                                    }}
                                />
                            </PopoverContent>
                        </Popover>
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
                <Button type="submit" form='form-update-user' isLoading={isPending}>Lưu thay đổi</Button>
            </DialogFooter>
        </form>
    )
}

export default UserUpdateForm