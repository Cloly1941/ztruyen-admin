// ** React helmet
import {HelmetProvider} from "react-helmet-async";

// ** React query
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";

// ** Routes
import AppRoutes from "@/routes";

// ** theme
import {ThemeProvider} from "@/theme/ThemeProvider.tsx";

// ** Component
import Toast from "@/components/common/Toast.tsx";

// ** Context
import {AuthProvider} from "@/context/AuthContext.tsx";

const queryClient = new QueryClient()

const App = () => {
    return (
        <HelmetProvider>
            <AuthProvider>
                <ThemeProvider defaultTheme="light" storageKey="ztc-theme">
                    <QueryClientProvider client={queryClient}>
                        <AppRoutes/>
                        <Toast/>
                        <ReactQueryDevtools initialIsOpen={false}/>
                    </QueryClientProvider>
                </ThemeProvider>
            </AuthProvider>
        </HelmetProvider>
    )
}

export default App