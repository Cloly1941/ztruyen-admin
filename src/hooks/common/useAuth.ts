// ** React
import {useContext} from "react";

// ** Context
import {AuthContext} from "@/context/AuthContext.tsx";

export const useAuth = () => {
    const authContext = useContext(AuthContext);

    if (!authContext) {
        throw new Error(
            "useAuthContext has to be used within <AuthProvider>"
        );
    }

    return authContext;
};