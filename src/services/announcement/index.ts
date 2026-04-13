// ** Services
import axios from "@/services/axios-customize";

// ** Types
import type {IAnnouncement, ICreated, IUpdated} from "@/types/backend";
import type {TAnnouncementCreatePayload} from "@/modules/Announcement/AnnouncementCreateForm";
import type {TAnnouncementUpdatePayload} from "@/modules/Announcement/AnnouncementUpdateForm";

// ** Configs
import {CONFIG_API} from "@/configs/api";

// ** Types
import type {TQueryParams} from "@/hooks/common/useDataTable.ts";

// ** Utils
import {buildQueryString} from "@/utils/buildQueryString.ts";

export const AnnouncementService = {
    list: async (params: TQueryParams) => {
        const query = buildQueryString(params)
        return await axios.get<IBackendRes<IModelPaginate<IAnnouncement>>>(
            `${CONFIG_API.ANNOUNCEMENT.INDEX}?${query}`
        );
    },
    detail: async (id: string) => {
        return await axios.get<IBackendRes<IAnnouncement>>(`${CONFIG_API.ANNOUNCEMENT.INDEX}/${id}`);
    },
    add: async (payload: TAnnouncementCreatePayload) => {
        return await axios.post<IBackendRes<ICreated>>(`${CONFIG_API.ANNOUNCEMENT.INDEX}`, payload)
    },
    update: async (id: string, payload: TAnnouncementUpdatePayload) => {
        return await axios.patch<IBackendRes<IUpdated>>(`${CONFIG_API.ANNOUNCEMENT.INDEX}/${id}`, payload)
    },
    delete: async (id: string) => {
        return await axios.delete<IBackendRes<void>>(`${CONFIG_API.ANNOUNCEMENT.INDEX}/${id}`)
    },
    multiDelete: async (ids: string[]) => {
        return await axios.delete<IBackendRes<void>>(`${CONFIG_API.ANNOUNCEMENT.INDEX}`, {data: {ids}})
    },
    status: async (id: string) => {
        return await axios.patch<IBackendRes<IUpdated>>(`${CONFIG_API.ANNOUNCEMENT.INDEX}/${id}/${CONFIG_API.COMMON.TOGGLE}`)
    },
}