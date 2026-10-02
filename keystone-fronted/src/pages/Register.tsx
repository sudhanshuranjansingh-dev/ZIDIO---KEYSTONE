import { useState } from "react";
import { useNavigate } from "react-router-dom";

import apiClient from "../api/apiClient";

import "./Register.css";

const Register = () => {
    const navigate = useNavigate();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [phoneNo, setPhoneNo] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async (
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
            await apiClient.post("/api/users", {
                firstName,
                lastName,
                userEmail,
                phoneNo,
                password,
            });

            setSuccess(
                "Account created successfully! Redirecting to login..."
            );

            setTimeout(() => {
                navigate("/");
            }, 1500);

        } catch (error: any) {

            if (error.response?.data?.message) {
                setError(
                    error.response.data.message
                );
            } else if (error.response?.data) {
                setError(
                    typeof error.response.data === "string"
                        ? error.response.data
                        : "Registration failed."
                );
            } else {
                setError(
                    "Unable to create account. Please try again."
                );
            }

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-page">

            <div className="register-card">

                <div className="register-header">

                    <h1>KEYSTONE</h1>

                    <p>Create your account</p>

                </div>

                <form onSubmit={handleRegister}>

                    <div className="name-row">

                        <div className="form-group">

                            <label>
                                First Name
                            </label>

                            <input
                                type="text"
                                placeholder="First name"
                                value={firstName}
                                onChange={(event) =>
                                    setFirstName(
                                        event.target.value
                                    )
                                }
                                required
                            />

                        </div>

                        <div className="form-group">

                            <label>
                                Last Name
                            </label>

                            <input
                                type="text"
                                placeholder="Last name"
                                value={lastName}
                                onChange={(event) =>
                                    setLastName(
                                        event.target.value
                                    )
                                }
                                required
                            />

                        </div>

                    </div>

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
                            Phone Number
                        </label>

                        <input
                            type="tel"
                            placeholder="Enter your phone number"
                            value={phoneNo}
                            onChange={(event) =>
                                setPhoneNo(
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
                            placeholder="Create a password"
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
                            placeholder="Confirm your password"
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
                        <div className="register-error">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="register-success">
                            {success}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="register-button"
                        disabled={loading}
                    >
                        {loading
                            ? "Creating Account..."
                            : "Create Account"}
                    </button>

                </form>

                <div className="register-login">

                    <span>
                        Already have an account?
                    </span>

                    <button
                        type="button"
                        onClick={() => navigate("/")}
                    >
                        Sign In
                    </button>

                </div>

            </div>

        </div>
    );
};

export default Register;