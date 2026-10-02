import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import "./Login.css";

const Login = () => {
    const navigate = useNavigate();

    const { login } = useAuth();

    const [userEmail, setUserEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (
        event: React.FormEvent
    ) => {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            await login(userEmail, password);

            navigate("/dashboard");

        } catch (error: any) {

            if (error.response?.data?.message) {

                setError(
                    error.response.data.message
                );

            } else {

                setError(
                    "Invalid email or password"
                );
            }

        } finally {

            setLoading(false);
        }
    };

    return (
        <div className="login-page">

            <div className="login-card">

                <div className="login-header">

                    <h1>KEYSTONE</h1>

                    <p>
                        Field Service Management
                    </p>

                </div>

                <form onSubmit={handleLogin}>

                    <div className="form-group">

                        <label>
                            Email
                        </label>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={userEmail}
                            onChange={(event) =>
                                setUserEmail(
                                    event.target.value
                                )
                            }
                            required
                        />

                    </div>

                    <div className="form-group">

                        <label>
                            Password
                        </label>

                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(event) =>
                                setPassword(
                                    event.target.value
                                )
                            }
                            required
                        />

                    </div>

                    {error && (
                        <div className="login-error">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Signing in..."
                            : "Sign In"}
                    </button>

                </form>

                <div className="login-links">

                    <button
                        type="button"
                        className="link-button"
                        onClick={() =>
                            navigate("/register")
                        }
                    >
                        Create New Account
                    </button>

                    <button
                        type="button"
                        className="link-button"
                        onClick={() =>
                            navigate("/forgot-password")
                        }
                    >
                        Forgot Password?
                    </button>

                </div>

            </div>

        </div>
    );
};

export default Login;