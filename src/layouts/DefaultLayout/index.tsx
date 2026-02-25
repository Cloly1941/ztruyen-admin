// ** React router
import {Outlet} from "react-router";

const DefaultLayout = () => {
    return (
        <main>
            <Outlet/>
        </main>
    )
}

export default DefaultLayout