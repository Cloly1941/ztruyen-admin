export const CONFIG_ROUTER = {
    HOME: '/',
    FORBIDDEN: '/403',
    LOGIN: '/login',
    USER: {
        INDEX: '/users',
        BAN: '/ban',
    },
    FRAME: {
        INDEX: '/frames',
    },
    COMMENT: {
        INDEX: '/comments',
    },
    EMOJI: {
        INDEX: '/emojis',
        CATEGORY: '/category',
    }
} as const