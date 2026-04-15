// ** Services
import axios from "@/services/axios-customize";

// ** Types
import type {IComic, ICreated, IImportComic, IUpdated} from "@/types/backend";
import type {TRankingCreatePayload} from "@/modules/Ranking/RankingCreateForm";

// ** Configs
import {CONFIG_API} from "@/configs/api";

// ** Types
import type {TQueryParams} from "@/hooks/common/useDataTable.ts";

// ** Utils
import {buildQueryString} from "@/utils/buildQueryString.ts";

// ** Payload
export type TImportComicPayload = {
    name: string;
    slug: string;
    thumb_url?: string;
    authors?: string[];
    status?: string;
    genres?: string[];
    latest_chapter?: string;
    chapter_api_data?: string;
    country?: string;
    rank: number;
    updatedAt?: string;
};

export const ComicService = {
    list: async (params: TQueryParams) => {
        const query = buildQueryString(params)
        return await axios.get<IBackendRes<IModelPaginate<IComic>>>(
            `${CONFIG_API.COMIC.INDEX}/${CONFIG_API.COMMON.ADMIN}?${query}`
        );
    },
    detail: async (id: string) => {
        return await axios.get<IBackendRes<IComic>>(`${CONFIG_API.COMIC.INDEX}/${CONFIG_API.COMMON.ADMIN}/${id}`);
    },
    add: async (payload: TRankingCreatePayload) => {
        return await axios.post<IBackendRes<ICreated>>(`${CONFIG_API.COMIC.INDEX}/${CONFIG_API.COMMON.ADMIN}`, payload)
    },
    update: async (id: string, payload: TRankingCreatePayload) => {
        return await axios.patch<IBackendRes<IUpdated>>(`${CONFIG_API.COMIC.INDEX}/${CONFIG_API.COMMON.ADMIN}/${id}`, payload)
    },
    delete: async (id: string) => {
        return await axios.delete<IBackendRes<void>>(`${CONFIG_API.COMIC.INDEX}/${CONFIG_API.COMMON.ADMIN}/${id}`)
    },
    multiDelete: async (ids: string[]) => {
        return await axios.delete<IBackendRes<void>>(`${CONFIG_API.COMIC.INDEX}/${CONFIG_API.COMMON.ADMIN}/${CONFIG_API.COMMON.DELETE_MULTI}`,
            {data: {ids}}
        )
    },
    import: async (payload: TImportComicPayload[]) => {
        return axios.post<IBackendRes<IImportComic>>(`${CONFIG_API.COMIC.INDEX}/${CONFIG_API.COMMON.ADMIN}/${CONFIG_API.COMMON.IMPORT}`, { items: payload })
    }
}