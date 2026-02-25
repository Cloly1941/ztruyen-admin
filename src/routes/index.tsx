// ** React router
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";

// ** Routes
import ProtectedRoute from "@/routes/ProtectedRoute";

// ** Layouts
import DefaultLayout from "@/layouts/DefaultLayout";

// ** Pages
import Login from "@/pages/Login";

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
                </Route>

                <Route path='/login' element={<Login/>}/>
            </Routes>
        </Router>
    )
}

export default AppRoutes