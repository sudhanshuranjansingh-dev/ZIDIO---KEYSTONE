import { useState } from "react";
import { useNavigate } from "react-router-dom";

import apiClient from "../api/apiClient";

import "./ResetPassword.css";

const ResetPassword = () => {
    const navigate = useNavigate();

    const [token, setToken] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleReset = async (
        event: React.FormEvent
    ) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (password.length < 6) {
            setError(
                "Password must be at least 6 characters."
            );
            return;
        }

        setLoading(true);

        try {
            await apiClient.post(
                "/api/auth/reset-password",
                {
                    token,
                    newPassword: password,
                }
            );

            setSuccess(
                "Password reset successfully! Redirecting to login..."
            );

            setTimeout(() => {
                navigate("/");
            }, 1500);

        } catch (error: any) {

            if (error.response?.data?.message) {
                setError(
                    error.response.data.message
                );
            } else if (
                typeof error.response?.data === "string"
            ) {
                setError(error.response.data);
            } else {
                setError(
                    "Unable to reset password."
                );
            }

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="reset-page">

            <div className="reset-card">

                <div className="reset-header">

                    <h1>KEYSTONE</h1>

                    <p>
                        Create a new password
                    </p>

                </div>

                <form onSubmit={handleReset}>

                    <div className="form-group">

                        <label>
                            Reset Token
                        </label>

                        <input
                            type="text"
                            placeholder="Enter reset token"
                            value={token}
                            onChange={(event) =>
                                setToken(
                                    event.target.value
                                )
                            }
                            required
                        />

                    </div>

                    <div className="form-group">

                        <label>
                            New Password
                        </label>

                        <input
                            type="password"
                            placeholder="Enter new password"
                            value={password}
                            onChange={(event) =>
                                setPassword(
                                    event.target.value
                                )
                            }
                            required
                        />

                    </div>

                    <div className="form-group">

                        <label>
                            Confirm Password
                        </label>

                        <input
                            type="password"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(event) =>
                                setConfirmPassword(
                                    event.target.value
                                )
                            }
                            required
                        />

                    </div>

                    {error && (
                        <div className="reset-error">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="reset-success">
                            {success}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="reset-button"
                        disabled={loading}
                    >
                        {loading
                            ? "Resetting..."
                            : "Reset Password"}
                    </button>

                </form>

                <div className="reset-back">

                    <button
                        type="button"
                        onClick={() => navigate("/")}
                    >
                        ← Back to Login
                    </button>

                </div>

            </div>

        </div>
    );
};

export default ResetPassword;