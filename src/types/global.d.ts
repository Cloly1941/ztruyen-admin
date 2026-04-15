export {};

declare global {
    interface IBackendRes<T> {
        error?: string | string[];
        message: string;
        statusCode: number | string;
        data?: T;
    }

    interface IModelPaginate<T> {
        meta: {
            page: number;
            limit: number;
            totalPages: number;
            totalItems: number;
        },
        result: T[]
    }

    interface BackendError {
        statusCode: number;
        message: string;
    }


    // Otruyen api

    interface IApiOtruyenRes<T> {
        status: number | string;
        message: string;
        data?: {
            items: T;
        };
    }
}

