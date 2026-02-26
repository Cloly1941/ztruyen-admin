// ** React
import type {ReactNode} from "react";

// ** React router
import {Navigate} from "react-router";

// ** Hook
import {useAuth} from "@/hooks/common/useAuth.ts";

// ** Config
import {CONFIG_ROUTER} from "@/configs/router";
import {CONFIG_ROLE} from "@/configs/role";

type TProtectedRoute = {
    children: ReactNode;
}

const ProtectedRoute = ({children}: TProtectedRoute) => {

    const {isAuthenticated, user, isAuthLoading} = useAuth()

    if (isAuthLoading) {
        return <div>Loading...</div>
    }

    if (!isAuthenticated) {
        return <Navigate to={CONFIG_ROUTER.LOGIN} replace/>;
    }

    if (user?.role !== CONFIG_ROLE.ADMIN) {
        return <Navigate to={CONFIG_ROUTER.FORBIDDEN} replace/>;
    }

    return (
        <>
            {children}
        </>
    )
}

export default ProtectedRoute