// ** React
import {useState} from "react";

// ** React helmet
import {Helmet} from "react-helmet-async";

// ** Components
import DataTableServer from "@/components/common/DataTableServer";
import AlertDialogActionBtn from "@/components/common/AlertDialogActionBtn";
import DialogActionBtn from "@/components/common/DialogActionBtn";
import Button from "@/components/common/Button";

// ** Module
import {RankingColumns} from "@/modules/Ranking/DataTable/RankingColumns";
import RankingCreate from "@/modules/Ranking/RankingCreateForm";
import RankingImportJSON from "@/modules/Ranking/RankingImportForm";

// ** Services
import {ComicService} from "@/services/comic";

// ** Config
import {CONFIG_QUERY_KEY} from "@/configs/query-key";

// ** Module
import RankingFilterGroup from "@/modules/Ranking/DataTable/RankingFilterGroup";

// ** Icon
import {FileJson} from "lucide-react";

const ListRanking = () => {

    const [importJsonOpen, setImportJsonOpen] = useState(false)

    return (
        <>
            <Helmet>
                <title>Bảng xếp hạng truyện theo quốc gia - ZTruyen Admin</title>
                <meta name="description" content="Bảng xếp hạng truyện theo quốc gia"/>
                <meta name="robots" content="noindex, nofollow"/>
            </Helmet>

            <DataTableServer
                contentAddBtn={(close) => (
                    <RankingCreate onSuccess={close}/>
                )}
                title='truyện'
                queryKey={CONFIG_QUERY_KEY.COMIC.RANKING_LIST}
                queryFn={ComicService.list}
                searchField='title'
                defaultSort={{id: "rank", desc: false}}
                columns={RankingColumns}
                searchPlaceholder='Tìm kiếm theo tên truyện ...'
                columnLabels={{
                    name: "Tên truyện",
                    thumb_url: 'Ảnh bìa',
                    country: 'Quốc gia',
                    rank: 'Top',
                    status: 'Trạng thái',
                    authors: 'Tác giả',
                    genres: 'Thể loại',
                    updatedAt: 'Ngày cập nhật',
                    actions: "Hành động",
                }}
                toolbar={(filters, onFilterChange) => (
                    <RankingFilterGroup
                        filters={filters}
                        onFilterChange={onFilterChange}
                    />
                )}
                deleteMultipleLabel='Xoá'
                deleteMultipleSubLabel='truyện'
                onDeleteMultiple={(selectedIds, onSuccess, open, onOpenChange) => (
                    <AlertDialogActionBtn
                        title='truyện'
                        action='delete-multiple'
                        ids={selectedIds}
                        queryKey={CONFIG_QUERY_KEY.COMIC.RANKING_LIST}
                        api={() => ComicService.multiDelete(selectedIds)}
                        open={open}
                        onOpenChange={onOpenChange}
                        onSuccess={onSuccess}
                    />
                )}
                extraButtons={
                    <>
                        <Button variant="outline" onClick={() => setImportJsonOpen(true)}>
                            <FileJson/> Nhập JSON
                        </Button>

                        <DialogActionBtn
                            title='truyện'
                            render={(close) => <RankingImportJSON onSuccess={close} />}
                            action='importJSON'
                            open={importJsonOpen}
                            onOpenChange={setImportJsonOpen}
                        />
                    </>
                }
            />
        </>
    )
}

export default ListRanking