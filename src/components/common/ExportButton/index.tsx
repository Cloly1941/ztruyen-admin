// ** React
import {useState} from "react"

// ** React hot toast
import toast from "react-hot-toast";

// ** Component
import Button from "@/components/common/Button"

// ** Icon
import {Download} from "lucide-react"

// ** Type
import type {TQueryParams} from "@/hooks/common/useDataTable.ts"

type TExportButtonProps = {
    onExport: (params: TQueryParams) => void | Promise<void>
    params: TQueryParams
}

const ExportButton = ({onExport, params}: TExportButtonProps) => {
    const [isLoading, setIsLoading] = useState(false)

    const handleExport = async () => {
        try {
            setIsLoading(true)
            await onExport(params)
            toast.success("Xuất dữ liệu người dùng thành công!")
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Button variant="outline" onClick={handleExport} isLoading={isLoading}>
            <Download />
            <span>Xuất</span>
        </Button>
    )
}

export default ExportButton