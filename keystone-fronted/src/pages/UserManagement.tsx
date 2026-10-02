import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";
import "./UserManagement.css";

interface Permission {
    id: number;
    name: string;
    description?: string;
}

interface Role {
    id: number;
    name: string;
    permissions?: Permission[];
}

interface User {
    id: number;
    firstName: string;
    lastName: string;
    userEmail: string;
    phoneNo: string;
    role?: Role | null;
}

const UserManagement = () => {

    const [users, setUsers] = useState<User[]>([]);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");

    const [editingUser, setEditingUser] =
        useState<User | null>(null);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [phoneNo, setPhoneNo] = useState("");
    const [roleId, setRoleId] = useState("");

    const roles = [
        { id: 1, name: "ADMIN" },
        { id: 2, name: "DISPATCHER" },
        { id: 3, name: "TECHNICIAN" },
        { id: 4, name: "CUSTOMER" },
        { id: 5, name: "MANAGER" },
    ];

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {

        setLoading(true);
        setError("");

        try {

            const response =
                await apiClient.get("/api/users");

            setUsers(response.data);

        } catch (error: any) {

            console.error(error);

            if (error.response?.data?.message) {

                setError(
                    error.response.data.message
                );

            } else {

                setError(
                    "Unable to load users."
                );
            }

        } finally {

            setLoading(false);
        }
    };

    const startEdit = (user: User) => {

        setEditingUser(user);

        setFirstName(user.firstName);
        setLastName(user.lastName);
        setUserEmail(user.userEmail);
        setPhoneNo(user.phoneNo);

        setRoleId(
            user.role?.id
                ? String(user.role.id)
                : ""
        );

        setError("");
        setSuccess("");
    };

    const cancelEdit = () => {

        setEditingUser(null);

        setFirstName("");
        setLastName("");
        setUserEmail("");
        setPhoneNo("");
        setRoleId("");

        setError("");
        setSuccess("");
    };

    const handleUpdate = async (
        event: React.FormEvent
    ) => {

        event.preventDefault();

        if (!editingUser) {
            return;
        }

        setError("");
        setSuccess("");
        setLoading(true);

        try {

            await apiClient.put(
                `/api/users/${editingUser.id}`,
                null,
                {
                    params: {
                        firstName,
                        lastName,
                        userEmail,
                        phoneNo,
                        roleId: roleId
                            ? Number(roleId)
                            : undefined,
                    },
                }
            );

            setSuccess(
                "User updated successfully."
            );

            setEditingUser(null);

            await loadUsers();

        } catch (error: any) {

            console.error(error);

            if (error.response?.data?.message) {

                setError(
                    error.response.data.message
                );

            } else if (
                typeof error.response?.data ===
                "string"
            ) {

                setError(
                    error.response.data
                );

            } else {

                setError(
                    "Failed to update user."
                );
            }

        } finally {

            setLoading(false);
        }
    };

    const handleDelete = async (
        user: User
    ) => {

        const confirmed =
            window.confirm(
                `Are you sure you want to delete ${user.firstName} ${user.lastName}?`
            );

        if (!confirmed) {
            return;
        }

        setError("");
        setSuccess("");
        setLoading(true);

        try {

            await apiClient.delete(
                `/api/users/${user.id}`
            );

            setSuccess(
                "User deleted successfully."
            );

            await loadUsers();

        } catch (error: any) {

            console.error(error);

            if (error.response?.data?.message) {

                setError(
                    error.response.data.message
                );

            } else if (
                typeof error.response?.data ===
                "string"
            ) {

                setError(
                    error.response.data
                );

            } else {

                setError(
                    "Failed to delete user."
                );
            }

        } finally {

            setLoading(false);
        }
    };

    return (
        <div className="users-page">

            <div className="page-header">

                <div>

                    <h2>
                        User Management
                    </h2>

                    <p>
                        Manage system users,
                        roles and accounts.
                    </p>

                </div>

            </div>

            {error && (
                <div className="users-error">
                    {error}
                </div>
            )}

            {success && (
                <div className="users-success">
                    {success}
                </div>
            )}

            {editingUser && (

                <div className="user-edit-card">

                    <h3>
                        Edit User
                    </h3>

                    <form
                        onSubmit={handleUpdate}
                    >

                        <div className="user-form-grid">

                            <div className="form-group">

                                <label>
                                    First Name
                                </label>

                                <input
                                    type="text"
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
                                    value={lastName}
                                    onChange={(event) =>
                                        setLastName(
                                            event.target.value
                                        )
                                    }
                                    required
                                />

                            </div>

                            <div className="form-group">

                                <label>
                                    Email
                                </label>

                                <input
                                    type="email"
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
                                    Phone
                                </label>

                                <input
                                    type="text"
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
                                    Role
                                </label>

                                <select
                                    value={roleId}
                                    onChange={(event) =>
                                        setRoleId(
                                            event.target.value
                                        )
                                    }
                                >

                                    <option value="">
                                        Select Role
                                    </option>

                                    {roles.map(
                                        (role) => (
                                            <option
                                                key={
                                                    role.id
                                                }
                                                value={
                                                    role.id
                                                }
                                            >
                                                {
                                                    role.name
                                                }
                                            </option>
                                        )
                                    )}

                                </select>

                            </div>

                        </div>

                        <div className="user-form-actions">

                            <button
                                type="submit"
                                disabled={loading}
                            >
                                {loading
                                    ? "Saving..."
                                    : "Save Changes"}
                            </button>

                            <button
                                type="button"
                                className="cancel-button"
                                onClick={
                                    cancelEdit
                                }
                            >
                                Cancel
                            </button>

                        </div>

                    </form>

                </div>
            )}

            <div className="users-card">

                <div className="card-header">

                    <h3>
                        System Users
                    </h3>

                    <button
                        type="button"
                        className="refresh-button"
                        onClick={loadUsers}
                        disabled={loading}
                    >
                        🔄 Refresh
                    </button>

                </div>

                {loading && users.length === 0 ? (

                    <div className="empty-state">
                        Loading users...
                    </div>

                ) : users.length === 0 ? (

                    <div className="empty-state">
                        No users found.
                    </div>

                ) : (

                    <div className="table-wrapper">

                        <table>

                            <thead>

                                <tr>

                                    <th>
                                        ID
                                    </th>

                                    <th>
                                        Name
                                    </th>

                                    <th>
                                        Email
                                    </th>

                                    <th>
                                        Phone
                                    </th>

                                    <th>
                                        Role
                                    </th>

                                    <th>
                                        Actions
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {users.map(
                                    (user) => (

                                        <tr
                                            key={
                                                user.id
                                            }
                                        >

                                            <td>
                                                {
                                                    user.id
                                                }
                                            </td>

                                            <td>
                                                {
                                                    user.firstName
                                                }{" "}
                                                {
                                                    user.lastName
                                                }
                                            </td>

                                            <td>
                                                {
                                                    user.userEmail
                                                }
                                            </td>

                                            <td>
                                                {
                                                    user.phoneNo
                                                }
                                            </td>

                                            <td>

                                                <span
                                                    className="role-badge"
                                                >
                                                    {
                                                        user.role
                                                            ?.name ||
                                                        "NO ROLE"
                                                    }
                                                </span>

                                            </td>

                                            <td>

                                                <div className="action-buttons">

                                                    <button
                                                        type="button"
                                                        className="edit-button"
                                                        onClick={() =>
                                                            startEdit(
                                                                user
                                                            )
                                                        }
                                                    >
                                                        ✏️ Edit
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="delete-button"
                                                        onClick={() =>
                                                            handleDelete(
                                                                user
                                                            )
                                                        }
                                                    >
                                                        🗑️ Delete
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>
                )}

            </div>

        </div>
    );
};

export default UserManagement;