import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NonCustomerRoute = () => {

    const { role } = useAuth();

    if (role === "CUSTOMER") {
        return (
            <Navigate
                to="/customer-portal"
                replace
            />
        );
    }

    return <Outlet />;
};

export default NonCustomerRoute;