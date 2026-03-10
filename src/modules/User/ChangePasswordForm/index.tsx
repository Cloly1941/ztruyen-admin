// ** Shadcn ui
import {DialogClose, DialogFooter} from "@/components/ui/dialog.tsx";
import {Field, FieldError, FieldLabel} from "@/components/ui/field.tsx";

// ** Component
import InputPassword from "@/components/common/InputPassword";
import Button from "@/components/common/Button";

// ** zod
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";

// ** React hook form
import {Controller, useForm} from "react-hook-form";

// ** Hook
import usePatchMethod from "@/hooks/common/usePatchMethod.ts";

// ** Service
import {UserService} from "@/services/user";


const formSchema = z.object({
    newPassword: z.string().min(2, 'Mật khẩu mới không được để trống'),
})

export type TChangePasswordForm = z.infer<typeof formSchema>;

type TChangePasswordFormProps = {
    id: string;
    onSuccess?: () => void;
}

export type TChangePasswordFormPayload = {
    newPassword: string;
}

const ChangePasswordForm = ({id, onSuccess}: TChangePasswordFormProps) => {

    const {mutateAsync: changePassword, isPending} = usePatchMethod<TChangePasswordFormPayload, void>({
        api: (payload) => UserService.changePassword(id, payload)
    })

    const form = useForm<TChangePasswordForm>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            newPassword: ''
        },
    });

    const onSubmit = async (values: TChangePasswordForm) => {
        await changePassword(values)
        onSuccess?.()
    }

    return (
        <form id='form-change-password-user' onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            {/* New Password */}
            <Controller
                name='newPassword'
                control={form.control}
                render={({field, fieldState}) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor='form-create-user-newPassword'>Mật khẩu</FieldLabel>
                        <InputPassword<TChangePasswordForm, 'newPassword'>
                            field={field}
                            fieldState={fieldState}
                            id="form-create-user-newPassword"
                            placeholder='Nhập mật khẩu mới'
                        />
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
                <Button type="submit" form='form-change-password-user' isLoading={isPending}>Lưu thay đổi</Button>
            </DialogFooter>
        </form>
    )
}

export default ChangePasswordForm