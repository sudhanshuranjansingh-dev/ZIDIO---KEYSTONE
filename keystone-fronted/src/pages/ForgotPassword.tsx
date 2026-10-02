import { useState } from "react";
import { useNavigate } from "react-router-dom";

import apiClient from "../api/apiClient";

import "./ForgotPassword.css";

const ForgotPassword = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (
        event: React.FormEvent
    ) => {
        event.preventDefault();

        setError("");
        setSuccess("");
        setLoading(true);

        try {
            await apiClient.post(
                "/api/auth/forgot-password",
                {
                    userEmail: email,
                }
            );

            setSuccess(
                "If an account exists with this email, password reset instructions have been sent."
            );

        } catch (error: any) {

            if (error.response?.data?.message) {
                setError(
                    error.response.data.message
                );
            } else if (typeof error.response?.data === "string") {
                setError(error.response.data);
            } else {
                setError(
                    "Unable to process password reset request."
                );
            }

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="forgot-page">

            <div className="forgot-card">

                <div className="forgot-header">

                    <h1>KEYSTONE</h1>

                    <p>Reset your password</p>

                </div>

                <div className="forgot-description">

                    Enter your registered email address
                    to request a password reset.

                </div>

                <form onSubmit={handleSubmit}>

                    <div className="form-group">

                        <label>
                            Email
                        </label>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(event) =>
                                setEmail(
                                    event.target.value
                                )
                            }
                            required
                        />

                    </div>

                    {error && (
                        <div className="forgot-error">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="forgot-success">
                            {success}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="forgot-button"
                        disabled={loading}
                    >
                        {loading
                            ? "Sending..."
                            : "Send Reset Instructions"}
                    </button>

                </form>

                <div className="forgot-back">

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

export default ForgotPassword;