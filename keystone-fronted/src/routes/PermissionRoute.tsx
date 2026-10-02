import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface PermissionRouteProps {
    permission: string;
}

const PermissionRoute = ({
    permission,
}: PermissionRouteProps) => {

    const { permissions, isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    if (!permissions.includes(permission)) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};

export default PermissionRoute;