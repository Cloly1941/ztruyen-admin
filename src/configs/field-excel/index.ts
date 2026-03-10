// ** Type
import type {FieldMapping} from "@/utils/excelMapping"

export const CONFIG_FIELD_EXCEL: {
    USER: FieldMapping[]
} = {
    USER: [
        {excelKey: "Tên", backendKey: "name"},
        {excelKey: "Email", backendKey: "email"},
        {excelKey: "Tuổi", backendKey: "age"},
        {excelKey: "Ngày sinh", backendKey: "dateOfBirth"},
        {excelKey: "Giới tính", backendKey: "gender"},
        {excelKey: "Vai trò", backendKey: "role"},
        {excelKey: "Giới thiệu", backendKey: "bio"},
        {excelKey: "Loại tài khoản", backendKey: "provider"},
    ],
}