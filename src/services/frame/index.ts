// ** Services
import axios from "@/services/axios-customize";

// ** Types
import type {ICreated, IFrame, IUpdated} from "@/types/backend";

// Module type
import type {TFrameUpdateFormPayload} from "@/modules/Frame/FrameUpdateForm";
import type {TFrameCreateFormPayload} from "@/modules/Frame/FrameCreateForm";

// ** Configs
import {CONFIG_API} from "@/configs/api";

// ** Types
import type {TQueryParams} from "@/hooks/common/useDataTable.ts";

// ** Utils
import {buildQueryString} from "@/utils/buildQueryString.ts";

export const FrameService = {
    list: async (params: TQueryParams) => {
        const query = buildQueryString(params)
        return await axios.get<IBackendRes<IModelPaginate<IFrame>>>(
            `${CONFIG_API.FRAME.INDEX}?${query}`
        );
    },
    detail: async (id: string) => {
        return await axios.get<IBackendRes<IFrame>>(
            `${CONFIG_API.FRAME.INDEX}/${CONFIG_API.COMMON.DETAIL}/${id}`
        );
    },
    add: async (payload: TFrameCreateFormPayload) => {
        return await axios.post<IBackendRes<ICreated>>(CONFIG_API.FRAME.INDEX, payload)
    },
    update: async (id: string, payload: TFrameUpdateFormPayload) => {
        return await axios.patch<IBackendRes<IUpdated>>(`${CONFIG_API.FRAME.INDEX}/${id}`, payload)
    },

    delete: async (id: string) => {
        return await axios.delete<IBackendRes<void>>(`${CONFIG_API.FRAME.INDEX}/${CONFIG_API.COMMON.DELETE}/${id}`)
    },
    multiDelete: async (ids: string[]) => {
        return await axios.delete<IBackendRes<void>>(`${CONFIG_API.FRAME.INDEX}/${CONFIG_API.COMMON.DELETE_MULTI}`, {data: {ids}})
    }
}