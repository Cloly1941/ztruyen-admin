// ** React router
import {useNavigate} from "react-router";

// ** React hot toast
import toast from "react-hot-toast";

// ** React query
import {useMutation} from "@tanstack/react-query";

// ** Services
import {AuthService, type TLoginPayload} from "@/services/auth";

// ** Util
import {handleResponse} from "@/utils/handleResponse.ts";

// ** hook
import {useAuth} from "@/hooks/common/useAuth.ts";

// ** Configs
import {CONFIG_ROLE} from "@/configs/role";
import {MESSAGE_AUTH} from "@/configs/messages/auth";
import {CONFIG_ROUTER} from "@/configs/router";
import {CONFIG_LOCALSTORAGE} from "@/configs/local-storage";

// ** Type
import type {IUserProfile} from "@/types/backend";

export const useLogin = () => {

    const navigate = useNavigate();
    const {setIsAuthenticated, setUser} = useAuth();

    return useMutation({
        mutationFn: async (payload: TLoginPayload) => {
            const res = await AuthService.login(payload)
            return handleResponse(res)
        },

        onSuccess: (res) => {
            if (!res.data) return;

            if (res.data.user.role !== CONFIG_ROLE.ADMIN) {
                toast.error(MESSAGE_AUTH.FORBIDDEN);
                navigate(CONFIG_ROUTER.FORBIDDEN);
                return;
            }

            setIsAuthenticated(true);
            setUser(res.data.user as IUserProfile);
            localStorage.setItem(
                CONFIG_LOCALSTORAGE.ACCESS_TOKEN,
                res.data.access_token
            );

            toast.success(res.message);
            navigate(CONFIG_ROUTER.HOME);
        },

        onError: (err) => {
            toast.error(
                Array.isArray(err?.message)
                    ? err.message[0]
                    : err?.message
            );
        },
    });
};