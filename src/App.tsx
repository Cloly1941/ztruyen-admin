// ** React helmet
import {HelmetProvider} from "react-helmet-async";

// ** React query
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";

// ** Routes
import AppRoutes from "@/routes";

// ** Component
import Toast from "@/components/common/Toast.tsx";

// ** Context
import {AuthProvider} from "@/context/AuthContext.tsx";

// ** theme
import {ThemeCustomizerProvider} from "@/context/ThemeCustomizerContext.tsx";

const queryClient = new QueryClient()

const App = () => {
    return (
        <HelmetProvider>
            <AuthProvider>
                <ThemeCustomizerProvider>
                    <QueryClientProvider client={queryClient}>
                        <AppRoutes/>
                        <Toast/>
                        <ReactQueryDevtools initialIsOpen={false}/>
                    </QueryClientProvider>
                </ThemeCustomizerProvider>
            </AuthProvider>
        </HelmetProvider>
    )
}

export default App