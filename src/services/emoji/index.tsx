// ** Services
import axios from "@/services/axios-customize";

// ** Types
import type {ICreated, IDetailEmoji, IEmoji, IUpdated} from "@/types/backend";

// ** Configs
import {CONFIG_API} from "@/configs/api";

// ** Types
import type {TQueryParams} from "@/hooks/common/useDataTable.ts";
import type {TEmojiCreateFormPayload} from "@/modules/Emoji/EmojiCreateForm";
import type {TEmojiUpdateFormPayload} from "@/modules/Emoji/EmojiUpdateForm";

// ** Utils
import {buildQueryString} from "@/utils/buildQueryString.ts";



export const EmojiService = {
    list: async (params: TQueryParams) => {
        const query = buildQueryString(params)
        return await axios.get<IBackendRes<IModelPaginate<IEmoji>>>(
            `${CONFIG_API.EMOJI.INDEX}/${CONFIG_API.COMMON.ADMIN}?${query}`
        );
    },
    detail: async (id: string) => {
        return await axios.get<IBackendRes<IDetailEmoji>>(`${CONFIG_API.EMOJI.INDEX}/${CONFIG_API.COMMON.ADMIN}/${id}`)
    },
    add: async (payload: TEmojiCreateFormPayload) => {
        return await axios.post<IBackendRes<ICreated>>(`${CONFIG_API.EMOJI.INDEX}/${CONFIG_API.COMMON.ADMIN}`, payload)
    },
    update: async (id: string, payload: TEmojiUpdateFormPayload) => {
        return await axios.patch<IBackendRes<IUpdated>>(`${CONFIG_API.EMOJI.INDEX}/${CONFIG_API.COMMON.ADMIN}/${id}`, payload)
    },
    status: async (id: string) => {
        return await axios.patch<IBackendRes<void>>(`${CONFIG_API.EMOJI.INDEX}/${CONFIG_API.COMMON.ADMIN}/${id}/${CONFIG_API.COMMON.TOGGLE}`)
    },
    delete: async (id: string) => {
        return await axios.delete<IBackendRes<void>>(`${CONFIG_API.EMOJI.INDEX}/${CONFIG_API.COMMON.ADMIN}/${id}`)
    },
    multiDelete: async (ids: string[]) => {
        return await axios.delete<IBackendRes<void>>(`${CONFIG_API.EMOJI.INDEX}/${CONFIG_API.COMMON.ADMIN}/${CONFIG_API.COMMON.DELETE_MULTI}`, {data: {ids}})
    }
}