// ** React helmet
import { Helmet } from "react-helmet-async";

// ** Hook
import { useAuth } from "@/hooks/common/useAuth.ts";

const Profile = () => {
    const { user } = useAuth();

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-muted-foreground">Không tìm thấy thông tin người dùng.</p>
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>Thông tin cá nhân - ZTruyen Admin</title>
                <meta name="description" content="Thông tin cá nhân của Quản trị viên ZTruyen" />
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            <div>
                <h1 className="text-2xl font-bold tracking-tight">Thông tin cá nhân</h1>
            </div>
        </>
    );
};

export default Profile;
