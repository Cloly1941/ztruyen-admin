export const BASE_URL = import.meta.env.VITE_API_URL

export const CONFIG_API = {
    AUTH: {
        LOGIN: 'auth/login',
        LOGOUT: 'auth/logout',
    },
    UPLOAD: {
        ONE: '/upload-telegram/upload',
        MULTI: '/upload-telegram/upload-multiple',
        IMAGE: '/images'
    },
    USER: {
        INDEX: 'user',
        PROFILE: 'user/profile',
        DETAIL: 'user/detail',
        DELETE: 'user/delete',
        DELETE_MULTI: 'user/delete-multi',
        UPDATE: 'user/update',
        EXPORT: 'user/export',
        EXPORT_TEMPLATE: 'user/template',
        IMPORT: 'user/import',
        TRASH: 'user/trash',
        HARD_DELETE: 'user/trash/delete',
        HARD_DELETE_MULTI: 'user/trash/delete-multi',
        RESTORE: 'user/restore',
        RESTORE_MULTI: 'user/restore-multi',
    }
} as const