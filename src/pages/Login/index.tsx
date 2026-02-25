// ** Helmet
import { Helmet } from 'react-helmet-async';

const Login = () => {
    return (
        <>
            <Helmet>
                <title>Đăng nhập - ZTruyen Admin</title>
                <meta name="description" content="Đăng nhập vào hệ thống quản trị ZTruyen" />
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            <div>Login page</div>
        </>
    )
}

export default Login