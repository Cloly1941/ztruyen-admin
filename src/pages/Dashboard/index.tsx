import {Helmet} from "react-helmet-async";
import DashboardStatistics from "@/modules/Dashboard/DashboardStatistics";

const Dashboard = () => {
    return (
        <>
            <Helmet>
                <title>Thống kê tổng quan - ZTruyen Admin</title>
                <meta name="description" content="Thống kê tổng quan hệ thống của ZTruyen"/>
                <meta name="robots" content="noindex, nofollow"/>
            </Helmet>
            <DashboardStatistics />
        </>
    );
};

export default Dashboard;