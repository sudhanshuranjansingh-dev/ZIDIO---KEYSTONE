import {
    createContext,
    useContext,
    useState,
    type ReactNode,
} from "react";

import { loginUser } from "../api/authApi";

interface AuthContextType {
    token: string | null;
    role: string | null;
    permissions: string[];
    login: (userEmail: string, password: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(
    undefined
);

interface AuthProviderProps {
    children: ReactNode;
};

interface JwtPayload {
    sub?: string;
    role?: string;
    permissions?: string[];
    exp?: number;
}

const decodeToken = (token: string): JwtPayload | null => {
    try {
        const payload = token.split(".")[1];

        if (!payload) {
            return null;
        }

        const decodedPayload = atob(
            payload.replace(/-/g, "+").replace(/_/g, "/")
        );

        return JSON.parse(decodedPayload);
    } catch (error) {
        console.error("Failed to decode JWT:", error);
        return null;
    }
};

export const AuthProvider = ({
    children,
}: AuthProviderProps) => {

    const storedToken = localStorage.getItem("keystone_token");

    const storedPayload = storedToken
        ? decodeToken(storedToken)
        : null;

    const [token, setToken] = useState<string | null>(
        storedToken
    );

    const [role, setRole] = useState<string | null>(
        storedPayload?.role || null
    );

    const [permissions, setPermissions] = useState<string[]>(
        storedPayload?.permissions || []
    );

    const login = async (
        userEmail: string,
        password: string
    ) => {

        const response = await loginUser({
            userEmail,
            password,
        });

        const newToken = response.token;

        localStorage.setItem(
            "keystone_token",
            newToken
        );

        const payload = decodeToken(newToken);

        setToken(newToken);

        setRole(
            payload?.role || null
        );

        setPermissions(
            payload?.permissions || []
        );
    };

    const logout = () => {

        localStorage.removeItem(
            "keystone_token"
        );

        setToken(null);
        setRole(null);
        setPermissions([]);
    };

    return (
        <AuthContext.Provider
            value={{
                token,
                role,
                permissions,
                login,
                logout,
                isAuthenticated: !!token,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {

    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    return context;
};