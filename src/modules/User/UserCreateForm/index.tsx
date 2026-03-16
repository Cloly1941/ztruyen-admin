// ** Shadcn ui
import {DialogClose, DialogFooter} from "@/components/ui/dialog.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Calendar} from "@/components/ui/calendar"
import {Field, FieldError, FieldLabel} from "@/components/ui/field.tsx";
import {Input} from "@/components/ui/input.tsx";

// ** Component
import Button from "@/components/common/Button";
import InputPassword from "@/components/common/InputPassword";

// ** Zod
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";

// ** React hook form
import {Controller, useForm} from "react-hook-form";

// ** Util
import {getAgeToBirthday, getDefaultBirthdayMonth, isBirthdayValid} from "@/utils/date.ts";

// ** Icon
import {CalendarIcon} from "lucide-react";

// ** date-fns
import {format} from 'date-fns';

// ** React day picker
import {vi} from 'react-day-picker/locale';

// ** Hook
import usePostMethod from "@/hooks/common/usePostMethod.ts";

// ** Service
import {UserService} from "@/services/user";

// ** Config
import {CONFIG_QUERY_KEY} from "@/configs/query-key";

// ** Type
import type {IUserCreated} from "@/types/backend";

const formSchema = z.object({
    name: z.string().min(1, 'Tên không được để trống'),
    email: z.string().email({message: 'Email không hợp lệ'}),
    password: z.string().min(1, 'Mật khẩu không được để trống'),
    confirmPassword: z.string().min(1, 'Vui lòng nhập lại mật khẩu'),
    gender: z
        .string()
        .optional()
        .refine((val) => !!val, {
            message: 'Vui lòng chọn giới tính',
        })
        .refine((val) => !val || ['male', 'female', 'other'].includes(val), {
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
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Mật khẩu không khớp',
        path: ['confirmPassword'],
    });

export type TUserCreateForm = z.infer<typeof formSchema>;

export type TUserCreateFormPayload = {
    name: string;
    email: string;
    password: string;
    gender?: string;
    birthday: string;
    age: number;
}

type TUserCreateFormProps = {
    onSuccess?: () => void;
}

const UserCreateForm = ({onSuccess}: TUserCreateFormProps) => {

    const { mutateAsync: created, isPending } = usePostMethod<TUserCreateFormPayload, IUserCreated>({
        api: UserService.add,
        key: [CONFIG_QUERY_KEY.USER.LIST],
    });

    const form = useForm<TUserCreateForm>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            gender: undefined,
        },
    });

    const onSubmit = async (values: TUserCreateForm) => {
        await created(
            {
                name: values.name,
                email: values.email,
                password: values.password,
                age: getAgeToBirthday(values.birthday),
                birthday: values.birthday.toISOString(),
                gender: values.gender
            }
        )

        onSuccess?.()
    }

    return (
        <form id='form-create-user' onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            {/* Name */}
            <Controller
                name='name'
                control={form.control}
                render={({field, fieldState}) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor='form-create-user-name'>Tên</FieldLabel>
                        <Input
                            {...field}
                            id='form-create-user-name'
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


            {/* Email */}
            <Controller
                name='email'
                control={form.control}
                render={({field, fieldState}) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor='form-create-user-email'>Email</FieldLabel>
                        <Input
                            {...field}
                            id='form-create-user-email'
                            aria-invalid={fieldState.invalid}
                            placeholder='Nhập email người dùng'
                            autoComplete="email"
                        />
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]}/>
                        )}
                    </Field>
                )}
            />


            {/* Password */}
            <Controller
                name='password'
                control={form.control}
                render={({field, fieldState}) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor='form-create-user-password'>Mật khẩu</FieldLabel>
                        <InputPassword<TUserCreateForm, 'password'>
                            field={field}
                            fieldState={fieldState}
                            id="form-create-user-password"
                        />
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]}/>
                        )}
                    </Field>
                )}
            />

            {/* Confirm Password */}
            <Controller
                name='confirmPassword'
                control={form.control}
                render={({field, fieldState}) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor='form-create-user-confirm-password'>Nhập lại mật khẩu</FieldLabel>
                        <InputPassword<TUserCreateForm, 'confirmPassword'>
                            field={field}
                            fieldState={fieldState}
                            id="form-create-user-confirm-password"
                            placeholder='Nhập lại mật khẩu'
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
                        <FieldLabel htmlFor='form-create-user-gender'>Giới tính</FieldLabel>
                        <Select
                            value={field.value}
                            onValueChange={field.onChange}
                        >
                            <SelectTrigger id="form-create-user-gender">
                                <SelectValue placeholder="Chọn giới tính"/>
                            </SelectTrigger>
                            <SelectContent position="popper">
                                <SelectItem value="male">Nam</SelectItem>
                                <SelectItem value="female">Nữ</SelectItem>
                                <SelectItem value="other">Khác</SelectItem>
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
                        <FieldLabel htmlFor='form-create-user-birthday'>Ngày sinh</FieldLabel>
                        <Popover>
                            <PopoverTrigger id="form-create-user-birthday">
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
                <Button type="submit" form='form-create-user' isLoading={isPending}>Lưu thay đổi</Button>
            </DialogFooter>
        </form>
    )
}

export default UserCreateForm