export const handleResponse = <T>(
    res: IBackendRes<T>
): IBackendRes<T> => {
    if (res.statusCode as number >= 400) {
        throw new Error(res.message);
    }
    return res;
};