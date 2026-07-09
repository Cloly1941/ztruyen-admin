// ** Services
import axios from "@/services/axios-customize";

// ** Types
import type {
    IDashboardOverview,
    IDashboardRes,
    IDashboardRegistration,
    IDashboardDemographic,
    IDashboardTopGenre,
    IDashboardTopComic,
    IDashboardOverviewParams,
    IDashboardRegistrationParams,
    IDashboardLimitParams,
} from "@/types/backend";

// ** Configs
import {CONFIG_API} from "@/configs/api";

export const DashboardService = {
    overview: async (params?: IDashboardOverviewParams, signal?: AbortSignal) => {
        return await axios.get<IBackendRes<IDashboardRes<IDashboardOverview>>>(
            `${CONFIG_API.DASHBOARD.INDEX}/${CONFIG_API.DASHBOARD.OVERVIEW}`,
            { params, signal }
        );
    },

    registrations: async (params?: IDashboardRegistrationParams, signal?: AbortSignal) => {
        return await axios.get<IBackendRes<IDashboardRes<IDashboardRegistration[]>>>(
            `${CONFIG_API.DASHBOARD.INDEX}/${CONFIG_API.DASHBOARD.REGISTRATIONS}`,
            { params, signal }
        );
    },

    demographics: async (signal?: AbortSignal) => {
        return await axios.get<IBackendRes<IDashboardRes<IDashboardDemographic[]>>>(
            `${CONFIG_API.DASHBOARD.INDEX}/${CONFIG_API.DASHBOARD.DEMOGRAPHICS}`,
            { signal }
        );
    },

    topGenres: async (params?: IDashboardLimitParams, signal?: AbortSignal) => {
        return await axios.get<IBackendRes<IDashboardRes<IDashboardTopGenre[]>>>(
            `${CONFIG_API.DASHBOARD.INDEX}/${CONFIG_API.DASHBOARD.TOP_GENRES}`,
            { params, signal }
        );
    },

    topComics: async (params?: IDashboardLimitParams, signal?: AbortSignal) => {
        return await axios.get<IBackendRes<IDashboardRes<IDashboardTopComic[]>>>(
            `${CONFIG_API.DASHBOARD.INDEX}/${CONFIG_API.DASHBOARD.TOP_COMICS}`,
            { params, signal }
        );
    },
};
