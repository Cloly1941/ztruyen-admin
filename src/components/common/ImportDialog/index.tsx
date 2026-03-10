// ** React
import {type ChangeEvent, useRef, useState} from "react";

// ** Tanstack Table
import type {ColumnDef} from "@tanstack/react-table";
import type {QueryKey} from "@tanstack/react-query";

// ** React hot toast
import toast from "react-hot-toast";

// ** Icon
import {Upload} from "lucide-react";

// ** Shadcn ui
import {DialogClose, DialogFooter} from "@/components/ui/dialog.tsx";

// ** Component
import Button from "@/components/common/Button";
import {DataTableClient} from "@/components/common/DataTableClient";

// ** Util
import {parseExcelToJson} from "@/utils/parseExcel.ts";
import {type FieldMapping, mapExcelToBackend} from "@/utils/excelMapping.ts";

// ** Hook
import usePostMethod from "@/hooks/common/usePostMethod.ts";

type TImportDialog<T extends Record<string, unknown>> = {
    fieldMappings: FieldMapping[]
    columns: ColumnDef<T>[];
    importApi: (file: File) => Promise<IBackendRes<void>>;
    exportTemplateApi: () => Promise<void>;
    queryKey: QueryKey;
    onSuccess?: () => void;
}

const ImportDialog = <T extends Record<string, unknown>,>(
    {fieldMappings, columns, onSuccess, importApi, exportTemplateApi, queryKey}: TImportDialog<T>
) => {

    const [jsonData, setJsonData] = useState<T[]>([]);
    const [file, setFile] = useState<File | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const { mutateAsync: created, isPending } = usePostMethod<File, void>({
        api: (file) =>  importApi(file),
        key: queryKey,
    });

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (!selected) return;

        if (!selected.name.endsWith(".xlsx")) {
            toast.error("Vui lòng chọn file Excel (.xlsx) hợp lệ.");
            return;
        }

        setFile(selected)

        try {
            const excelData = await parseExcelToJson(selected);

            const mappedData = excelData.map(row =>
                mapExcelToBackend<T>(row, fieldMappings)
            );

            setJsonData(mappedData);
        } catch (err) {
            console.error(err)
        }
    };

    const handleSubmit = async () => {
        if (!file) {
            toast.error("Vui lòng chọn file trước.");
            return;
        }

        await created(file as File)

        onSuccess?.();
    }

    return (
        <div className="space-y-5">
            {/* Upload Form */}
            <div
                onClick={() => inputRef.current?.click()}
                className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center gap-2 cursor-pointer hover:border-primary hover:bg-accent/50 transition-colors"
            >
                <Upload className="size-8 text-muted-foreground"/>
                <p className="text-sm font-medium">Nhấn để chọn file Excel</p>
                <p className="text-xs text-muted-foreground">.xlsx, .xlsm</p>
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        exportTemplateApi();
                    }
                    }
                    className="text-sm text-primary underline"
                >
                    Mẫu nhập excel
                </button>
                <input
                    ref={inputRef}
                    type="file"
                    accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    className="hidden"
                    onChange={handleFileChange}
                />
            </div>
            <p className="text-sm text-muted-foreground text-center truncate">
                {file?.name}
            </p>

            {/* Table Data Import */}
            <div className='flex justify-center'>
                <DataTableClient
                    data={jsonData}
                    columns={columns}
                    searchField="name"
                    searchPlaceholder="Tìm kiếm theo tên..."
                />
            </div>

            {/* Actions */}
            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="outline">Huỷ</Button>
                </DialogClose>
                <Button onClick={handleSubmit} isLoading={isPending}>
                    Lưu thay đổi
                </Button>
            </DialogFooter>
        </div>
    );
}

export default ImportDialog;