export const BASE_URL = import.meta.env.VITE_API_URL

export const CONFIG_API = {
    AUTH: {
        INDEX: 'auth',
        LOGIN: 'login',
        LOGOUT: 'logout',
    },
    UPLOAD: {
        ONE: 'upload',
        MULTI: 'upload-multiple',
        IMAGE: 'images'
    },
    USER: {
        INDEX: 'user',
        PROFILE: 'profile',
        DETAIL: 'detail',
        DELETE: 'delete',
        DELETE_MULTI: 'delete-multi',
        UPDATE: 'update',
        EXPORT: 'export',
        EXPORT_TEMPLATE: 'template',
        IMPORT: 'import',
        TRASH: 'trash',
        HARD_DELETE: 'trash/delete',
        HARD_DELETE_MULTI: 'trash/delete-multi',
        RESTORE: 'restore',
        RESTORE_MULTI: 'restore-multi',
        CHANGE_PASSWORD: 'change-password',
    }
} as const