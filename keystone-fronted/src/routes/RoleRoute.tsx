import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface RoleRouteProps {
    role: string;
}

const RoleRoute = ({
    role,
}: RoleRouteProps) => {

    const { role: currentRole } = useAuth();

    if (currentRole !== role) {
        return (
            <Navigate
                to="/dashboard"
                replace
            />
        );
    }

    return <Outlet />;
};

export default RoleRoute;