// ** React
import {createContext, type ReactNode, useCallback, useEffect, useState} from "react";

// ** Types
import type {IUserLogin, IUserProfile} from "@/types/backend";

// ** Services
import {UserService} from "@/services/user";
import {CONFIG_LOCALSTORAGE} from "@/configs/local-storage";

type TUser = IUserLogin | IUserProfile;

interface TAuthContext {
    isAuthenticated: boolean;
    setIsAuthenticated: (v: boolean) => void;
    setUser: (v: TUser | null) => void;
    user: TUser | null;
    isAuthLoading: boolean;
    setIsAuthLoading: (v: boolean) => void;
    fetchProfile: () => Promise<void>;
}


// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<TAuthContext | null>(null);

type TAuthProvider = {
    children: ReactNode
}

export const AuthProvider = ({children}: TAuthProvider) => {

    // States
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<TUser | null>(null);
    const [isAuthLoading, setIsAuthLoading] = useState(true);

    const fetchProfile = useCallback(async () => {
        try {
            const token = localStorage.getItem(CONFIG_LOCALSTORAGE.ACCESS_TOKEN);
            if (!token) {
                setIsAuthenticated(false);
                setUser(null);
                setIsAuthLoading(false);
                return;
            }

            const res = await UserService.profile();

            if (res?.data) {
                setUser(res.data);
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
                setUser(null);
                localStorage.removeItem(CONFIG_LOCALSTORAGE.ACCESS_TOKEN);
            }
        } catch (err) {
            console.error("fetchProfile error:", err);
            setIsAuthenticated(false);
            setUser(null);
        } finally {
            setIsAuthLoading(false);
        }
    }, []);

    useEffect(() => {
        const handleTokenRefreshed = () => {
            fetchProfile();
        };

        window.addEventListener("tokenRefreshed", handleTokenRefreshed);

        fetchProfile();

        return () => {
            window.removeEventListener("tokenRefreshed", handleTokenRefreshed);
        };
    }, [fetchProfile]);

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                user,
                setIsAuthenticated,
                setUser,
                isAuthLoading,
                setIsAuthLoading,
                fetchProfile,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}