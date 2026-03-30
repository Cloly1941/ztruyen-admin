// ** React helmet
import {Helmet} from "react-helmet-async";

// ** Components
// import DataTableServer from "@/components/common/DataTableServer";
// import AlertDialogActionBtn from "@/components/common/AlertDialogActionBtn";

// ** Module
import {EmojiCategoryColumns} from "@/modules/EmojiCategory/DataTable/EmojiCategoryColumns";

// ** Services
import {EmojiCategoryService} from "@/services/emoji-category";

// ** Config
import {CONFIG_QUERY_KEY} from "@/configs/query-key";

// ** Module
import EmojiCategoryCreateForm from "@/modules/EmojiCategory/EmojiCategoryCreateForm";

import DragDropTable from "@/components/common/DragDropTable";
import EmojiCategoryFilterGroup from "@/modules/EmojiCategory/DataTable/EmojiCategoryFilterGroup";


const ListEmojiCategory = () => {
    return (
        <>
            <Helmet>
                <title>Danh sách danh mục emoji - ZTruyen Admin</title>
                <meta name="description" content="Danh sách danh mục emoji của ZTruyen"/>
                <meta name="robots" content="noindex, nofollow"/>
            </Helmet>
            <DragDropTable
                contentAddBtn={(close) => (
                    <EmojiCategoryCreateForm onSuccess={close}/>
                )}
                queryKey={CONFIG_QUERY_KEY.EMOJI_CATEGORY.LIST}
                queryFn={() => EmojiCategoryService.list()}
                reorderFn={(ids) => EmojiCategoryService.reorder({ids})}
                columns={EmojiCategoryColumns}
                title="danh mục emoji"
                searchField="name"
                searchPlaceholder="Tìm kiếm tên danh mục ..."
                columnLabels={{
                    name: "Tên Emoji",
                    image: "Emoji",
                    actions: "Hành động",
                    isActive: "Trạng thái",
                    createdAt: "Ngày tạo",
                    updatedAt: "Ngày cập nhật",
                }}
                toolbar={(filters, onFilterChange) => (
                    <EmojiCategoryFilterGroup
                        filters={filters}
                        onFilterChange={onFilterChange}
                    />
                )}
            />
        </>
    )
}

export default ListEmojiCategory