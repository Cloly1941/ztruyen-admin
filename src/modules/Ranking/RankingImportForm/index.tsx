// ** React
import {useState} from "react";

// ** React hook form
import {useForm} from "react-hook-form";

// ** Zod
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";

// ** Shadcn ui
import {DialogClose, DialogFooter} from "@/components/ui/dialog";
import {Field, FieldError} from "@/components/ui/field";
import {Textarea} from "@/components/ui/textarea";

// ** Component
import Button from "@/components/common/Button";

// ** Hook
import usePostMethod from "@/hooks/common/usePostMethod.ts";

// ** Config
import {CONFIG_QUERY_KEY} from "@/configs/query-key";

// ** Services
import {ComicService} from "@/services/comic";

// ** Icons
import {CheckCircle, ClipboardPaste, XCircle} from "lucide-react";

// ** Type
import type {IImportComic} from "@/types/backend";

export type TImportComicPayload = {
    name: string;
    slug: string;
    thumb_url: string;
    authors: string[];
    status: string;
    genres: string[];
    latest_chapter?: string;
    chapter_api_data?: string;
    country: string;
    rank: number;
};

const formSchema = z.object({
    json: z.string().min(1, "Vui lòng nhập JSON"),
});

type TForm = z.infer<typeof formSchema>;

type TRankingImportJSON = {
    onSuccess?: () => void;
};

const RankingImportJSON = ({onSuccess}: TRankingImportJSON) => {
    const [parseError, setParseError] = useState<string | null>(null);
    const [parsedCount, setParsedCount] = useState<number | null>(null);

    const {mutate, isPending} = usePostMethod<TImportComicPayload[], IImportComic>({
        api: ComicService.import,
        key: [CONFIG_QUERY_KEY.COMIC.RANKING_LIST],
    });

    const form = useForm<TForm>({
        resolver: zodResolver(formSchema),
        defaultValues: {json: ""},
    });

    const handleJsonChange = (value: string) => {
        form.setValue("json", value);
        setParseError(null);
        setParsedCount(null);

        if (!value.trim()) return;

        try {
            const parsed = JSON.parse(value);
            const arr = Array.isArray(parsed) ? parsed : [parsed];
            setParsedCount(arr.length);
        } catch {
            setParseError("JSON không hợp lệ");
        }
    };

    const onSubmit = (values: TForm) => {
        try {
            const parsed = JSON.parse(values.json);
            const payload: TImportComicPayload[] = Array.isArray(parsed) ? parsed : [parsed];
            mutate(payload);
            onSuccess?.();
        } catch {
            setParseError("JSON không hợp lệ, không thể import");
        }
    };

    const jsonValue = form.watch("json");

    return (
        <form
            id="form-import-json-ranking"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
        >
            <Field>
                <div className="flex items-center justify-between">
                    {/* Parse status badge */}
                    {parsedCount !== null && !parseError && (
                        <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                            <CheckCircle className="w-3.5 h-3.5"/>
                            {parsedCount} bản ghi hợp lệ
                        </span>
                    )}
                    {parseError && (
                        <span className="flex items-center gap-1 text-xs text-destructive font-medium">
                            <XCircle className="w-3.5 h-3.5"/>
                            {parseError}
                        </span>
                    )}
                </div>

                <Textarea
                    placeholder={`[\n  {\n    "name": "Tên truyện",\n    "slug": "ten-truyen",\n    "rank": 1,\n    ...\n  }\n]`}
                    rows={12}
                    className="font-mono text-xs resize-y"
                    value={jsonValue}
                    onChange={(e) => handleJsonChange(e.target.value)}
                />

                {form.formState.errors.json && (
                    <FieldError>{form.formState.errors.json.message}</FieldError>
                )}

                <p className="text-xs text-muted-foreground">
                    Chấp nhận mảng object <code className="bg-muted px-1 rounded">[ ... ]</code> hoặc single object <code className="bg-muted px-1 rounded">{"{ ... }"}</code>
                </p>
            </Field>

            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="outline">Huỷ</Button>
                </DialogClose>
                <Button
                    type="submit"
                    form="form-import-json-ranking"
                    isLoading={isPending}
                    disabled={!!parseError || !jsonValue.trim()}
                >
                    <ClipboardPaste className="w-4 h-4"/>
                    Import {parsedCount !== null ? `${parsedCount} bản ghi` : ""}
                </Button>
            </DialogFooter>
        </form>
    );
};

export default RankingImportJSON;