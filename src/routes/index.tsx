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
import ListUser from "@/pages/User";
import BannedUser from "@/pages/User/Banned";
import ListFrame from "@/pages/Frame";
import ListComment from "@/pages/Comment";
import ListEmoji from "@/pages/Emoji";
import ListEmojiCategory from "@/pages/EmojiCategory";
import ListAnnouncement from "@/pages/Announcement";
import ListRanking from "@/pages/Ranking";
import ListGuide from "@/pages/Guide";

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
                    <Route path={CONFIG_ROUTER.USER.INDEX} element={<ListUser/>}/>
                    <Route path={`${CONFIG_ROUTER.USER.INDEX}${CONFIG_ROUTER.USER.BAN}`} element={<BannedUser/>}/>
                    <Route path={CONFIG_ROUTER.FRAME.INDEX} element={<ListFrame/>}/>
                    <Route path={CONFIG_ROUTER.COMMENT.INDEX} element={<ListComment/>}/>
                    <Route path={CONFIG_ROUTER.EMOJI.INDEX} element={<ListEmoji/>}/>
                    <Route path={`${CONFIG_ROUTER.EMOJI.INDEX}${CONFIG_ROUTER.EMOJI.CATEGORY}`} element={<ListEmojiCategory/>}/>
                    <Route path={`${CONFIG_ROUTER.ANNOUNCEMENT.INDEX}`} element={<ListAnnouncement/>}/>
                    <Route path={`${CONFIG_ROUTER.COMIC.RANKING}`} element={<ListRanking/>}/>
                    <Route path={`${CONFIG_ROUTER.GUIDE.INDEX}`} element={<ListGuide/>}/>
                </Route>
                <Route path={CONFIG_ROUTER.LOGIN} element={<Login/>}/>
                <Route path='/403' element={<Forbidden/>}/>
            </Routes>
        </Router>
    )
}

export default AppRoutes