// ** React
import {useEffect} from "react";

// ** React hot toast
import toast from "react-hot-toast";

// ** Component
import AvatarWithFrame from "@/components/common/AvatarWithFrame";

// ** Shadcn ui
import {Separator} from "@/components/ui/separator.tsx";

// ** Hook
import useGetMethod from "@/hooks/common/useGetMethod.ts";

// ** Dayjs
import dayjs from "dayjs";

// ** Util
import {cn} from "@/lib/utils.ts";

// ** Type
import type {IUser} from "@/types/backend";

type TListDetail = {
    key: string;
    value: string | number | undefined;
}

type TUserDetail = {
    id: string;
    queryKey: unknown[];
    api: () => Promise<IBackendRes<IUser>>;
}

const UserDetail = ({id, api, queryKey}: TUserDetail) => {

    const {data, isLoading, error} = useGetMethod<IUser>({
        api,
        key: queryKey,
        enabled: !!id && !!open
    })

    useEffect(() => {
        if (error) {
            toast.error('Không thể tải thông tin người dùng. Vui lòng thử lại sau.')
        }
    }, [error])

    const userDetail = data?.data

    if (isLoading) return (
        <div className="flex items-center justify-center py-10 text-muted-foreground text-sm animate-pulse">
            Đang tải thông tin người dùng...
        </div>
    )

    if (!userDetail) return (
        <div className="flex items-center justify-center py-10 text-muted-foreground text-sm">
            Không tìm thấy thông tin người dùng.
        </div>
    )

    const listDetail: TListDetail[] = [
        {key: 'Email', value: userDetail.email},
        {
            key: 'Giới tính',
            value: userDetail.gender === 'female' ? 'Nữ' : userDetail.gender === 'male' ? 'Nam' : 'LGBT'
        },
        {key: 'Vai trò', value: userDetail.role === 'admin' ? 'Quản trị viên' : 'Người dùng'},
        {key: 'Loại tài khoản', value: userDetail.provider === 'local' ? 'Ztruyen' : userDetail.provider},
        {key: 'Ngày tháng năm sinh', value: dayjs(userDetail.birthday).format("DD-MM-YYYY")},
        {key: 'Tuổi', value: userDetail.age},
        {key: 'Ngày tạo', value: dayjs(userDetail.createdAt).format("DD-MM-YYYY HH:mm:ss")},
        {key: 'Ngày cập nhật', value: dayjs(userDetail.updatedAt).format("DD-MM-YYYY HH:mm:ss")},
    ]

    return (
        <div className="space-y-5">

            {/* Avatar , cover , name */}
            <div className={cn("relative h-32 rounded-md",
                userDetail?.cover?.url
                    ? "bg-cover bg-center"
                    : "bg-gradient-to-r from-blue-400 to-blue-300"
            )}
                 style={
                     userDetail?.cover?.url
                         ? {backgroundImage: `url(${userDetail.cover.url})`}
                         : undefined
                 }>
                <div className="flex items-baseline gap-4 absolute -bottom-[16%] left-[5%]">
                    <AvatarWithFrame
                        classAvatar='size-12'
                        frameUrl={userDetail.avatar_frame?.image.url}
                        frameName={userDetail.avatar_frame?.name}
                        avatarUrl={userDetail?.avatar?.url}
                        avatarName={userDetail?.name}
                    />
                    <p className="font-semibold leading-none">{userDetail.name}</p>
                </div>
            </div>

            <Separator className='mt-9'/>

            {/* Detail */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                {listDetail.map(({key, value}) => (
                    <div key={key} className="space-y-0.5">
                        <p className="text-xs text-muted-foreground">{key}</p>
                        <p className="text-sm font-medium">{value ?? '—'}</p>
                    </div>
                ))}
            </div>

        </div>
    )
}

export default UserDetail