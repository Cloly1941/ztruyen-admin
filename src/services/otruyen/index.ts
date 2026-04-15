// ** Axios
import axios from "axios";

// ** Types
import type {ICategory} from "@/types/backend";

// ** Configs
import {CONFIG_API} from "@/configs/api";

const baseUrl = import.meta.env.VITE_OTRUYEN_API

export const otruyenAxios = axios.create({baseURL: baseUrl});

otruyenAxios.interceptors.response.use(
    (response) => response.data,
);

export const OtruyenService = {
    categories: async (): Promise<IApiOtruyenRes<ICategory[]>> => {
        return otruyenAxios.get(`${CONFIG_API.OTRUYEN.CATEGORY}`);
    },
};