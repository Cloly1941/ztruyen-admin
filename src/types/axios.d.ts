// eslint-disable-next-line @typescript-eslint/no-unused-vars
import axios from 'axios'

declare module 'axios' {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-object-type
    export interface AxiosResponse<T = any> extends Promise<T> {
    }
    export interface AxiosRequestConfig {
        skipAuth?: boolean;
    }
}
