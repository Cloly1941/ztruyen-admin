// ** Services
import axios from "@/services/axios-customize";

// ** Types
import type {IGuide, ICreated, IUpdated} from "@/types/backend";
import type {TGuideCreatePayload} from "@/modules/Guide/GuideCreateForm";
import type {TGuideUpdatePayload} from "@/modules/Guide/GuideUpdateForm";

// ** Configs
import {CONFIG_API} from "@/configs/api";

// ** Types
import type {TQueryParams} from "@/hooks/common/useDataTable.ts";

// ** Utils
import {buildQueryString} from "@/utils/buildQueryString.ts";

export const GuideService = {
    list: async (params: TQueryParams) => {
        const query = buildQueryString(params)
        return await axios.get<IBackendRes<IModelPaginate<IGuide>>>(
            `${CONFIG_API.GUIDE.INDEX}/${CONFIG_API.COMMON.ADMIN}?${query}`
        );
    },
    detail: async (id: string) => {
        return await axios.get<IBackendRes<IGuide>>(`${CONFIG_API.GUIDE.INDEX}/${CONFIG_API.COMMON.ADMIN}/${id}`);
    },
    add: async (payload: TGuideCreatePayload) => {
        return await axios.post<IBackendRes<ICreated>>(`${CONFIG_API.GUIDE.INDEX}/${CONFIG_API.COMMON.ADMIN}`, payload)
    },
    update: async (id: string, payload: TGuideUpdatePayload) => {
        return await axios.patch<IBackendRes<IUpdated>>(`${CONFIG_API.GUIDE.INDEX}/${CONFIG_API.COMMON.ADMIN}/${id}`, payload)
    },
    delete: async (id: string) => {
        return await axios.delete<IBackendRes<void>>(`${CONFIG_API.GUIDE.INDEX}/${CONFIG_API.COMMON.ADMIN}/${id}`)
    },
    multiDelete: async (ids: string[]) => {
        return await axios.delete<IBackendRes<void>>(`${CONFIG_API.GUIDE.INDEX}/${CONFIG_API.COMMON.ADMIN}`, {data: {ids}})
    },
    status: async (id: string) => {
        return await axios.patch<IBackendRes<IUpdated>>(`${CONFIG_API.GUIDE.INDEX}/${CONFIG_API.COMMON.ADMIN}/${id}/${CONFIG_API.COMMON.TOGGLE}`)
    },
}