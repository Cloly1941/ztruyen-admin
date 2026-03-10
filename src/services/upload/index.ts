// ** Services
import axios from "@/services/axios-customize";

// ** Configs
import {CONFIG_API} from "@/configs/api";

// ** Type
import type {IImage} from "@/types/backend";

export const UploadService = {
    single: async (file: File, caption: string) => {

        const formData = new FormData()
        formData.append("file", file)
        formData.append("caption", caption)

        return await axios.post<IBackendRes<IImage>>(`${CONFIG_API.UPLOAD.ONE}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
    },
}