export const BASE_URL = import.meta.env.VITE_API_URL

export const CONFIG_API = {
    COMMON: {
        DETAIL: 'detail',
        DELETE: 'delete',
        DELETE_MULTI: 'delete-multi',
        UPDATE: 'update',
        EXPORT: 'export',
        EXPORT_TEMPLATE: 'template',
        IMPORT: 'import',
        TRASH: 'trash',
        RESTORE: 'restore',
        RESTORE_MULTI: 'restore-multi',
        ADMIN: 'admin',
        TOGGLE: 'toggle',
        REORDER: 'reorder',
    },
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
        FRAME: 'frame',
        UPDATE: 'update',
        EXPORT: 'export',
        EXPORT_TEMPLATE: 'template',
        IMPORT: 'import',
        TRASH: 'trash',
        RESTORE: 'restore',
        RESTORE_MULTI: 'restore-multi',
        CHANGE_PASSWORD: 'change-password',
    },
    FRAME: {
        INDEX: 'frame',
    },
    COMMENT: {
        INDEX: 'comment',
    },
    EMOJI: {
        INDEX: 'emoji'
    },
    EMOJI_CATEGORY: {
        INDEX: 'emoji-category'
    },
    ANNOUNCEMENT: {
        INDEX: 'announcement',
    },
    COMIC: {
        INDEX: 'comic',
    },
    OTRUYEN: {
        CATEGORY: '/the-loai'
    }
} as const