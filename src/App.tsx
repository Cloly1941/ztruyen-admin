// ** Routes
import AppRoutes from "@/routes";

// ** React helmet
import {HelmetProvider} from "react-helmet-async";

const App = () => {
    return (
        <HelmetProvider>
            <AppRoutes/>
        </HelmetProvider>
    )
}

export default App