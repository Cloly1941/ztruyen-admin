// ** Services
import axios from "@/services/axios-customize";

// ** Types
import type {IUserProfile} from "@/types/backend";

// ** Configs
import {CONFIG_API} from "@/configs/api";

export const UserService = {
    profile: () => axios.get<IBackendRes<IUserProfile>>(CONFIG_API.USER.PROFILE),
};
