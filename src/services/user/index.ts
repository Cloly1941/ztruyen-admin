// ** Services
import axios from "@/services/axios-customize";

// ** Types
import type {IUser, IUserCreated, IUserProfile, IUserUpdated} from "@/types/backend";

// ** Configs
import {CONFIG_API} from "@/configs/api";

// ** Types
import type {TQueryParams} from "@/hooks/common/useDataTable.ts";

// ** Utils
import {buildQueryString} from "@/utils/buildQueryString.ts";

// ** Service
import {ExportService} from "@/services/export";

// ** Type
import type {TUserCreateFormPayload} from "@/modules/User/UserCreateForm";
import type {TUserUpdateFormPayload} from "@/modules/User/UserUpdateForm";
import type {TChangePasswordFormPayload} from "@/modules/User/ChangePasswordForm";

export const UserService = {
    profile: () => axios.get<IBackendRes<IUserProfile>>(`${CONFIG_API.USER.INDEX}/${CONFIG_API.USER.PROFILE}`),
    profileFrame: async (frameId: string) => {
        return await axios.patch<IBackendRes<IUserUpdated>>(`${CONFIG_API.USER.INDEX}/${CONFIG_API.USER.PROFILE}/${CONFIG_API.USER.FRAME}`, {avatar_frame: frameId})
    },

    list: async (params: TQueryParams) => {
        const query = buildQueryString(params)
        return await axios.get<IBackendRes<IModelPaginate<IUser>>>(
            `${CONFIG_API.USER.INDEX}?${query}`
        );
    },
    detail: async (id: string) => {
        return await axios.get<IBackendRes<IUser>>(
            `${CONFIG_API.USER.INDEX}/${CONFIG_API.USER.DETAIL}/${id}`
        );
    },
    add: async (payload: TUserCreateFormPayload) => {
        return await axios.post<IBackendRes<IUserCreated>>(CONFIG_API.USER.INDEX, payload)
    },
    update: async (id: string, payload: TUserUpdateFormPayload) => {
        return await axios.patch<IBackendRes<IUserUpdated>>(`${CONFIG_API.USER.INDEX}/${CONFIG_API.USER.UPDATE}/${id}`, payload)
    },
    avatar: async (id: string, avatar: string) => {
        return await axios.patch<IBackendRes<IUserUpdated>>(`${CONFIG_API.USER.INDEX}/${CONFIG_API.USER.UPDATE}/${id}`, {avatar})
    },
    frame: async (id: string, frameId: string) => {
        return await axios.patch<IBackendRes<void>>(`${CONFIG_API.USER.INDEX}/${CONFIG_API.USER.FRAME}/${id}`, {avatar_frame: frameId})
    },

    changePassword: async (id: string, payload: TChangePasswordFormPayload) => {
        return await axios.patch<IBackendRes<void>>(`${CONFIG_API.USER.INDEX}/${CONFIG_API.USER.CHANGE_PASSWORD}/${id}`, payload)
    },

    ban: async (id: string) => {
        return await axios.delete<IBackendRes<void>>(`${CONFIG_API.USER.INDEX}/${CONFIG_API.USER.DELETE}/${id}`)
    },
    multiBan: async (ids: string[]) => {
        return await axios.delete<IBackendRes<void>>(`${CONFIG_API.USER.INDEX}/${CONFIG_API.USER.DELETE_MULTI}`, {data: {ids}})
    },

    //  trash
    listTrash: async (params: TQueryParams) => {
        const query = buildQueryString(params)
        return await axios.get<IBackendRes<IModelPaginate<IUser>>>(
            `${CONFIG_API.USER.INDEX}/${CONFIG_API.USER.TRASH}?${query}`
        );
    },
    detailTrash: async (id: string) => {
        return await axios.get<IBackendRes<IUser>>(
            `${CONFIG_API.USER.INDEX}/${CONFIG_API.USER.TRASH}/${id}`
        );
    },

    delete: async (id: string) => {
        return await axios.delete<IBackendRes<void>>(`${CONFIG_API.USER.INDEX}/${CONFIG_API.USER.TRASH}/${CONFIG_API.USER.DELETE}/${id}`)
    },
    multiDelete: async (ids: string[]) => {
        return await axios.delete<IBackendRes<void>>(`${CONFIG_API.USER.INDEX}/${CONFIG_API.USER.TRASH}/${CONFIG_API.USER.DELETE_MULTI}`, {data: {ids}})
    },
    restore: async (id: string) => {
        return await axios.patch<IBackendRes<void>>(`${CONFIG_API.USER.INDEX}/${CONFIG_API.USER.RESTORE}/${id}`)
    },
    multiRestore: async (ids: string[]) => {
        return await axios.patch<IBackendRes<void>>(`${CONFIG_API.USER.INDEX}/${CONFIG_API.USER.RESTORE_MULTI}`, {ids})
    },

    // import/export
    import: async (file: File) => {
        const formData = new FormData();
        formData.append("file", file)

        return axios.post<IBackendRes<void>>(`${CONFIG_API.USER.INDEX}/${CONFIG_API.USER.IMPORT}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    },
    export: async (params: TQueryParams) => {
        const query = buildQueryString(params)
        await ExportService.export(`${CONFIG_API.USER.INDEX}/${CONFIG_API.USER.EXPORT}?${query}`, 'danh-sach-nguoi-dung-ztruyen.xlsx')
    },
    exportTemplate: async (fileName = "import_template.xlsx") => {
        await ExportService.export(CONFIG_API.USER.EXPORT_TEMPLATE, fileName);
    },
};
