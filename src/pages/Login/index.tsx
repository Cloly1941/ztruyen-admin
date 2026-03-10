// ** Helmet
import { Helmet } from 'react-helmet-async';

// ** Module components
import FormLogin from "@/modules/Login/FormLogin";

const Login = () => {
    return (
        <>
            <Helmet>
                <title>Đăng nhập - ZTruyen Admin</title>
                <meta name="description" content="Đăng nhập vào hệ thống quản trị ZTruyen" />
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            <main className='grid grid-cols-1 lg:grid-cols-2 h-screen overflow-hidden'>
                <section className='hidden lg:block'>
                    <img src="/login.webp" alt="ztruyen login page" loading='lazy' width='1000' height='1000' decoding='async' className='size-full object-cover'/>
                </section>
                <section className='flex justify-center items-center'>
                    <div className='max-w-md space-y-8 px-4 w-full'>
                        <div className='text-center'>
                            <h2 className='mt-6 text-3xl font-bold'>Chào mừng bạn trở lại</h2>
                            <p className='text-muted-foreground mt-2 text-sm'>
                                Vui lòng đăng nhập vào tài khoản của bạn
                            </p>
                        </div>
                        <FormLogin/>
                    </div>
                </section>
            </main>
        </>
    )
}

export default Login