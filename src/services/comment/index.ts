// ** Services
import axios from "@/services/axios-customize";

// ** Types
import type {IComment} from "@/types/backend";

// ** Configs
import {CONFIG_API} from "@/configs/api";

// ** Types
import type {TQueryParams} from "@/hooks/common/useDataTable.ts";

// ** Utils
import {buildQueryString} from "@/utils/buildQueryString.ts";

export const CommentService = {
    list: async (params: TQueryParams) => {
        const query = buildQueryString(params)
        return await axios.get<IBackendRes<IModelPaginate<IComment>>>(
            `${CONFIG_API.COMMENT.INDEX}/${CONFIG_API.COMMON.ADMIN}?${query}`
        );
    },
    delete: async (id: string) => {
        return await axios.delete<IBackendRes<void>>(`${CONFIG_API.COMMENT.INDEX}/${CONFIG_API.COMMON.ADMIN}/${id}`)
    },
    multiDelete: async (ids: string[]) => {
        return await axios.delete<IBackendRes<void>>(`${CONFIG_API.COMMENT.INDEX}/${CONFIG_API.COMMON.ADMIN}/${CONFIG_API.COMMON.DELETE_MULTI}`, {data: {ids}})
    }
}