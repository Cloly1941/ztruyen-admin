// ** React router
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";

// ** Routes
import ProtectedRoute from "@/routes/ProtectedRoute";

// ** Config
import {CONFIG_ROUTER} from "@/configs/router";

// ** Layouts
import DefaultLayout from "@/layouts/DefaultLayout";

// ** Pages
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Forbidden from "@/pages/Forbidden";


const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route
                    element={
                        <ProtectedRoute>
                            <DefaultLayout/>
                        </ProtectedRoute>
                    }
                >
                    <Route path={CONFIG_ROUTER.HOME} element={<Dashboard/>}/>
                </Route>
                <Route path={CONFIG_ROUTER.LOGIN} element={<Login/>}/>
                <Route path='/403' element={<Forbidden/>}/>
            </Routes>
        </Router>
    )
}

export default AppRoutes