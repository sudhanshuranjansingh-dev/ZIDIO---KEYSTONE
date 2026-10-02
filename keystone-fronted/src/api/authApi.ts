import apiClient from "./apiClient";

export interface LoginRequest {
    userEmail: string;
    password: string;
}

export interface LoginResponse {
    token: string;
}

export const loginUser = async (
    loginData: LoginRequest
): Promise<LoginResponse> => {

    const response = await apiClient.post<LoginResponse>(
        "/api/auth/login",
        loginData
    );

    return response.data;
};