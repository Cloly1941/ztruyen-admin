// ** Services
import axios from "@/services/axios-customize";

// ** Types
import type {
    IDashboardOverview,
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
    overview: async (params?: IDashboardOverviewParams) => {
        return await axios.get<IBackendRes<IDashboardOverview>>(
            `${CONFIG_API.DASHBOARD.INDEX}/${CONFIG_API.DASHBOARD.OVERVIEW}`,
            { params }
        );
    },

    registrations: async (params?: IDashboardRegistrationParams) => {
        return await axios.get<IBackendRes<IDashboardRegistration[]>>(
            `${CONFIG_API.DASHBOARD.INDEX}/${CONFIG_API.DASHBOARD.REGISTRATIONS}`,
            { params }
        );
    },

    demographics: async () => {
        return await axios.get<IBackendRes<IDashboardDemographic[]>>(
            `${CONFIG_API.DASHBOARD.INDEX}/${CONFIG_API.DASHBOARD.DEMOGRAPHICS}`
        );
    },

    topGenres: async (params?: IDashboardLimitParams) => {
        return await axios.get<IBackendRes<IDashboardTopGenre[]>>(
            `${CONFIG_API.DASHBOARD.INDEX}/${CONFIG_API.DASHBOARD.TOP_GENRES}`,
            { params }
        );
    },

    topComics: async (params?: IDashboardLimitParams) => {
        return await axios.get<IBackendRes<IDashboardTopComic[]>>(
            `${CONFIG_API.DASHBOARD.INDEX}/${CONFIG_API.DASHBOARD.TOP_COMICS}`,
            { params }
        );
    },
};
