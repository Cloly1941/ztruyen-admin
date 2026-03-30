// ** Services
import axios from "@/services/axios-customize";

// ** Types
import type {ICreated, IEmoji} from "@/types/backend";

// ** Configs
import {CONFIG_API} from "@/configs/api";

// ** Types
import type {TQueryParams} from "@/hooks/common/useDataTable.ts";
import type {TEmojiCreateFormPayload} from "@/modules/Emoji/EmojiCreateForm";

// ** Utils
import {buildQueryString} from "@/utils/buildQueryString.ts";


export const EmojiService = {
    list: async (params: TQueryParams) => {
        const query = buildQueryString(params)
        return await axios.get<IBackendRes<IModelPaginate<IEmoji>>>(
            `${CONFIG_API.EMOJI.INDEX}/${CONFIG_API.COMMON.ADMIN}?${query}`
        );
    },
    add: async (payload: TEmojiCreateFormPayload) => {
        return await axios.post<IBackendRes<ICreated>>(`${CONFIG_API.EMOJI.INDEX}/${CONFIG_API.COMMON.ADMIN}`, payload)
    },
    delete: async (id: string) => {
        return await axios.delete<IBackendRes<void>>(`${CONFIG_API.EMOJI.INDEX}/${CONFIG_API.COMMON.ADMIN}/${id}`)
    },
    multiDelete: async (ids: string[]) => {
        return await axios.delete<IBackendRes<void>>(`${CONFIG_API.EMOJI.INDEX}/${CONFIG_API.COMMON.ADMIN}/${CONFIG_API.COMMON.DELETE_MULTI}`, {data: {ids}})
    }
}