// ** Axios
import axios, {AxiosError, type AxiosResponse, type InternalAxiosRequestConfig} from "axios";
import { Mutex } from "async-mutex";

// ** Configs
import {BASE_URL} from "@/configs/api";
import {CONFIG_ROUTER} from "@/configs/router";
import {CONFIG_LOCALSTORAGE} from "@/configs/local-storage";

// Extend InternalAxiosRequestConfig để thêm các properties tùy chỉnh
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
    skipAuth?: boolean;
}

const instance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true
});

// Tạo mutex để quản lý refresh token
const refreshTokenMutex = new Mutex();

// Add a request interceptor
instance.interceptors.request.use(
    function (config: CustomAxiosRequestConfig) {
        // Chỉ thêm access token nếu không có flag skipAuth
        if (!config.skipAuth) {
            const accessToken = localStorage.getItem(CONFIG_LOCALSTORAGE.ACCESS_TOKEN);
            if (accessToken) {
                config.headers.Authorization = `Bearer ${accessToken}`;
            }
        }
        return config;
    },
    function (error: AxiosError) {
        return Promise.reject(error);
    }
);

// Add a response interceptor
instance.interceptors.response.use(
    function (response: AxiosResponse) {
        if (response && response.data) return response.data;
        return response;
    },
    async function (error: AxiosError) {
        const originalRequest = error.config as CustomAxiosRequestConfig;

        // Kiểm tra nếu lỗi 401 (Unauthorized), chưa retry và không phải skipAuth
        if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.skipAuth) {
            originalRequest._retry = true;

            // Sử dụng mutex để đảm bảo chỉ 1 request refresh token tại 1 thời điểm
            return refreshTokenMutex.runExclusive(async () => {
                try {
                    // Kiểm tra xem token đã được refresh bởi request khác chưa
                    const currentToken = localStorage.getItem(CONFIG_LOCALSTORAGE.ACCESS_TOKEN);
                    const oldToken = originalRequest.headers.Authorization?.toString().replace('Bearer ', '');

                    // Nếu token đã được refresh (khác với token cũ), retry luôn
                    if (currentToken && currentToken !== oldToken) {
                        originalRequest.headers.Authorization = `Bearer ${currentToken}`;
                        return instance(originalRequest);
                    }

                    // Lấy accessToken cũ trước khi refresh
                    const oldAccessToken = localStorage.getItem(CONFIG_LOCALSTORAGE.ACCESS_TOKEN);

                    // Gọi API refresh token với accessToken cũ trong header
                    const response = await axios.get(
                        `${BASE_URL}/auth/refresh`,
                        {
                            withCredentials: true,
                            headers: {
                                Authorization: `Bearer ${oldAccessToken}`
                            }
                        }
                    );

                    const newAccessToken = response.data.data.access_token;

                    // Lưu access token mới
                    localStorage.setItem(CONFIG_LOCALSTORAGE.ACCESS_TOKEN, newAccessToken);

                    // Cập nhật header mặc định
                    instance.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;

                    // Cập nhật header cho request ban đầu
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                    // Retry request ban đầu với token mới
                    return instance.request(originalRequest);
                } catch (refreshError) {
                    // Refresh token thất bại - xóa token và redirect về login
                    localStorage.removeItem(CONFIG_LOCALSTORAGE.ACCESS_TOKEN);
                    window.location.href = CONFIG_ROUTER.LOGIN;
                    return Promise.reject(refreshError);
                }
            });
        }

        // Xử lý các lỗi khác
        if (error && error.response && error.response.data) return error.response.data;
        return Promise.reject(error);
    }
);

export default instance;