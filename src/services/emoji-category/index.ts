// ** Services
import axios from "@/services/axios-customize";

// ** Types
import type {ICategoryEmoji, ICreated, IUpdated} from "@/types/backend";

// ** Configs
import {CONFIG_API} from "@/configs/api";

// ** Types
import type {TEmojiCategoryCreateFormPayload} from "@/modules/EmojiCategory/EmojiCategoryCreateForm";
import type {TEmojiCategoryUpdateFormPayload} from "@/modules/EmojiCategory/EmojiCategoryUpdateForm";

// ** Utils

export const EmojiCategoryService = {
    list: async () => {
        return await axios.get<IBackendRes<ICategoryEmoji[]>>(`${CONFIG_API.EMOJI_CATEGORY.INDEX}/${CONFIG_API.COMMON.ADMIN}`);
    },
    detail: async (id: string) => {
        return await axios.get<IBackendRes<ICategoryEmoji>>(`${CONFIG_API.EMOJI_CATEGORY.INDEX}/${CONFIG_API.COMMON.ADMIN}/${id}`)
    },
    add: async (payload: TEmojiCategoryCreateFormPayload) => {
        return await axios.post<IBackendRes<ICreated>>(`${CONFIG_API.EMOJI_CATEGORY.INDEX}/${CONFIG_API.COMMON.ADMIN}`, payload)
    },
    update: async (id: string, payload: TEmojiCategoryUpdateFormPayload) => {
        return await axios.patch<IBackendRes<IUpdated>>(`${CONFIG_API.EMOJI_CATEGORY.INDEX}/${CONFIG_API.COMMON.ADMIN}/${id}`, payload)
    },
    status: async (id: string) => {
        return await axios.patch<IBackendRes<void>>(`${CONFIG_API.EMOJI_CATEGORY.INDEX}/${CONFIG_API.COMMON.ADMIN}/${id}/${CONFIG_API.COMMON.TOGGLE}`)
    },
    reorder: (ids: {ids: string[]}) => axios.patch<IBackendRes<void>>(`${CONFIG_API.EMOJI_CATEGORY.INDEX}/${CONFIG_API.COMMON.ADMIN}/${CONFIG_API.COMMON.REORDER}`, ids),
    delete: async (id: string) => {
        return await axios.delete<IBackendRes<void>>(`${CONFIG_API.EMOJI_CATEGORY.INDEX}/${CONFIG_API.COMMON.ADMIN}/${id}`)
    },
}