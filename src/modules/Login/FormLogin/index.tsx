// ** React
import {useEffect, useState} from "react";

// ** React router
import {useNavigate} from "react-router";

// ** zod
import {z} from "zod";

// ** React hook form
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

// ** React hot toast
import toast from "react-hot-toast";

// ** Components
import Button from "@/components/common/Button";
import InputPassword from "@/components/common/InputPassword";
import TurnstileWidget from "@/modules/Login/TurnstileWidget";

// ** Shadcn ui
import {Field, FieldError} from "@/components/ui/field";
import {Input} from "@/components/ui/input";

// ** Hooks
import {useLogin} from "@/hooks/auth/useLogin.ts";
import {useAuth} from "@/hooks/common/useAuth.ts";

// ** Config
import {CONFIG_ROLE} from "@/configs/role";
import {MESSAGE_AUTH} from "@/configs/messages/auth";

const formSchema = z.object({
    email: z.string().email({message: 'Email không hợp lệ'}),
    password: z.string().min(1, 'Mật khẩu không được để trống'),
});

export type TLoginForm = z.infer<typeof formSchema>;

const FormLogin = () => {

    const navigate = useNavigate();

    const [cfToken, setCfToken] = useState<string | null>(null);

    const {isAuthenticated, user} = useAuth()

    const isLogin = isAuthenticated && user?.role === CONFIG_ROLE.ADMIN

    useEffect(() => {
        if (isLogin) {
            navigate("/");
        }
    }, [isLogin, navigate])

    const {mutateAsync: login, isPending} = useLogin();

    const form = useForm<TLoginForm>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async (values: TLoginForm) => {

        if (!cfToken) {
            toast.error(MESSAGE_AUTH.VERIFY_NOT_BOT);
            return;
        }

        await login({
            email: values.email,
            password: values.password,
            cfToken,
        });
    }

    return (
        <form id='form-login' onSubmit={form.handleSubmit(onSubmit)} className='mt-8 space-y-4'>
            {/* Email */}
            <Controller
                name='email'
                control={form.control}
                render={({field, fieldState}) => (
                    <Field data-invalid={fieldState.invalid}>
                        <Input
                            {...field}
                            id='form-login-email'
                            aria-invalid={fieldState.invalid}
                            placeholder='Địa chỉ email của bạn'
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
                        <InputPassword<TLoginForm, 'password'>
                            field={field}
                            fieldState={fieldState}
                            id="form-login-password"
                        />
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]}/>
                        )}
                    </Field>
                )}
            />

            {/* Cloudflare turnstile*/}
            <div className="mt-4">
                <TurnstileWidget onVerify={setCfToken}/>
            </div>

            <Button type='submit' form='form-login' className='w-full' isLoading={isPending}>Đăng nhập</Button>
        </form>
    )
}

export default FormLogin;