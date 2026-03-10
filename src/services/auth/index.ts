// ** Services
import axios from "@/services/axios-customize"

// ** Types
import type {ILogin} from "@/types/backend";

// ** Configs
import {CONFIG_API} from "@/configs/api";

export type TLoginPayload = {
    email: string;
    password: string;
    cfToken: string;
}

export const AuthService = {
    login: (payload: TLoginPayload) => axios.post<IBackendRes<ILogin>>(`${CONFIG_API.AUTH.INDEX}/${CONFIG_API.AUTH.LOGIN}`, payload, {skipAuth: true}),
    logout: () => axios.post<IBackendRes<string>>(`${CONFIG_API.AUTH.INDEX}/${CONFIG_API.AUTH.LOGOUT}`)
};
