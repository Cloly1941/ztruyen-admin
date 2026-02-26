// ** React query
import {useMutation} from "@tanstack/react-query";

// ** Services
import {AuthService, type TLoginPayload} from "@/services/auth";

export const useLogin = () => {

    return useMutation({
        mutationFn: (payload: TLoginPayload) => {
            return AuthService.login(payload)
        },
    });
};