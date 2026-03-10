// ** React hot toast
import {Toaster} from 'react-hot-toast';

const Toast = () => {
    return (
        <Toaster
            position="top-center"
            toastOptions={{
                className:
                    '!max-w-none !bg-primary !text-white px-4 py-2 font-ui',
                duration: 3000,

                success: {
                    className: '!max-w-none !text-xs !bg-primary !text-white font-ui',
                    icon: '(=^･ｪ･^=)/',
                },

                error: {
                    className: '!max-w-none !text-xs !bg-red-400 !text-white font-ui',
                    icon: '(=ＴェＴ=)',
                },
            }}
        />
    )
}

export default Toast;