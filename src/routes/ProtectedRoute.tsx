// ** React
import type {ReactNode} from "react";

type TProtectedRoute = {
    children: ReactNode;
}

const ProtectedRoute = ({children}: TProtectedRoute) => {

    return (
        <>
            {children}
        </>
    )
}

export default ProtectedRoute