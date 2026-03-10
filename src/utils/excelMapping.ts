export interface FieldMapping {
    excelKey: string;
    backendKey: string;
    transform?: (value: unknown) => unknown;
}

export const mapExcelToBackend = <T extends Record<string, unknown>>(
    excelRow: Record<string, unknown>,
    mappings: FieldMapping[]
): T => {
    const result: Record<string, unknown> = {};

    mappings.forEach(({ excelKey, backendKey, transform }) => {
        const value = excelRow[excelKey];

        if (value !== undefined && value !== null && value !== "") {
            result[backendKey] = transform ? transform(value) : value;
        }
    });

    return result as T;
};