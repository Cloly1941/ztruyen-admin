import * as XLSX from "xlsx";

type TRow = Record<string, unknown>;

export const parseExcelToJson = async <T extends TRow = TRow>(
    file: File,
    filterMetadata: boolean = true
): Promise<T[]> => {
    if (!file) {
        throw new Error("No file provided");
    }

    try {
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data, { type: "array" });

        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        let json = XLSX.utils.sheet_to_json<TRow>(sheet, { defval: "" });

        // Loại bỏ metadata nếu cần
        if (filterMetadata) {
            const metadataKeywords = ["page", "total"];

            json = json.filter((row) => {
                const rowValues = Object.values(row)
                    .join(" ")
                    .toLowerCase();

                return !metadataKeywords.some((keyword) =>
                    rowValues.includes(keyword)
                );
            });
        }

        // Trim tất cả string values
        const cleaned = json.map((row) => {
            const cleanedRow: TRow = {};

            Object.entries(row).forEach(([key, value]) => {
                cleanedRow[key] =
                    typeof value === "string" ? value.trim() : value;
            });

            return cleanedRow;
        });

        return cleaned as T[];
    } catch (error) {
        console.error("Error parsing Excel file:", error);
        throw new Error("Failed to parse Excel file");
    }
};