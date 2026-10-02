import { useEffect, useState } from "react";

import apiClient from "../api/apiClient";

import "./Technicians.css";

interface Permission {
    id: number;
    name: string;
    description: string;
}

interface Role {
    id: number;
    name: string;
    permissions: Permission[];
}

interface Technician {
    id: number;
    firstName: string;
    lastName: string;
    userEmail: string;
    phoneNo: string;
    role: Role;
}

const Technicians = () => {

    const [technicians, setTechnicians] =
        useState<Technician[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [selectedTechnician, setSelectedTechnician] =
        useState<Technician | null>(null);

    const [showView, setShowView] =
        useState(false);

    const [viewLoading, setViewLoading] =
        useState(false);

    const loadTechnicians = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await apiClient.get(
                "/api/technicians"
            );

            setTechnicians(response.data);

        } catch (err) {

            console.error(
                "Failed to load technicians:",
                err
            );

            setError(
                "Failed to load technicians."
            );

        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {

        loadTechnicians();

    }, []);

    const handleView = async (id: number) => {

        try {

            setViewLoading(true);

            const response = await apiClient.get(
                `/api/technicians/${id}`
            );

            setSelectedTechnician(response.data);

            setShowView(true);

        } catch (err) {

            console.error(
                "Failed to load technician:",
                err
            );

            alert(
                "Failed to load technician details."
            );

        } finally {

            setViewLoading(false);
        }
    };

    const handleCloseView = () => {

        setShowView(false);

        setSelectedTechnician(null);
    };

    if (loading) {

        return (
            <div className="technicians-page">

                <h2>Technicians</h2>

                <p>
                    Loading technicians...
                </p>

            </div>
        );
    }

    if (error) {

        return (
            <div className="technicians-page">

                <h2>Technicians</h2>

                <p className="technician-error">
                    {error}
                </p>

                <button
                    className="retry-technicians-button"
                    onClick={loadTechnicians}
                >
                    Retry
                </button>

            </div>
        );
    }

    return (
        <div className="technicians-page">

            <div className="technicians-header">

                <div>

                    <h2>
                        Technicians
                    </h2>

                    <p>
                        View and manage field technicians
                    </p>

                </div>

                <div className="technician-count">

                    Total Technicians:{" "}

                    <strong>
                        {technicians.length}
                    </strong>

                </div>

            </div>

            <div className="technicians-table-container">

                {technicians.length === 0 ? (

                    <div className="empty-technicians">

                        <h3>
                            No Technicians Found
                        </h3>

                        <p>
                            There are currently no
                            technicians in the system.
                        </p>

                    </div>

                ) : (

                    <table className="technicians-table">

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
                                    Permissions
                                </th>

                                <th>
                                    Actions
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {technicians.map(
                                (technician) => (

                                    <tr
                                        key={
                                            technician.id
                                        }
                                    >

                                        <td>
                                            #
                                            {
                                                technician.id
                                            }
                                        </td>

                                        <td>

                                            <strong>

                                                {
                                                    technician.firstName
                                                }{" "}

                                                {
                                                    technician.lastName
                                                }

                                            </strong>

                                        </td>

                                        <td>
                                            {
                                                technician.userEmail
                                            }
                                        </td>

                                        <td>
                                            {
                                                technician.phoneNo
                                            }
                                        </td>

                                        <td>

                                            <span className="technician-role-badge">

                                                {
                                                    technician
                                                        .role
                                                        .name
                                                }

                                            </span>

                                        </td>

                                        <td>

                                            <span className="permission-count">

                                                {
                                                    technician
                                                        .role
                                                        .permissions
                                                        .length
                                                }{" "}

                                                Permissions

                                            </span>

                                        </td>

                                        <td>

                                            <button
                                                className="view-technician-button"
                                                onClick={() =>
                                                    handleView(
                                                        technician.id
                                                    )
                                                }
                                            >
                                                View
                                            </button>

                                        </td>

                                    </tr>

                                )
                            )}

                        </tbody>

                    </table>
                )}

            </div>

            {showView &&
                selectedTechnician && (

                    <div className="modal-overlay">

                        <div className="technician-modal">

                            <div className="technician-modal-header">

                                <div>

                                    <h3>
                                        Technician Details
                                    </h3>

                                    <p>
                                        Technician #
                                        {
                                            selectedTechnician.id
                                        }
                                    </p>

                                </div>

                                <button
                                    className="modal-close-button"
                                    onClick={
                                        handleCloseView
                                    }
                                >
                                    ×
                                </button>

                            </div>

                            <div className="technician-details">

                                <div className="detail-row">

                                    <span>
                                        Name
                                    </span>

                                    <strong>
                                        {
                                            selectedTechnician.firstName
                                        }{" "}
                                        {
                                            selectedTechnician.lastName
                                        }
                                    </strong>

                                </div>

                                <div className="detail-row">

                                    <span>
                                        Email
                                    </span>

                                    <strong>
                                        {
                                            selectedTechnician.userEmail
                                        }
                                    </strong>

                                </div>

                                <div className="detail-row">

                                    <span>
                                        Phone
                                    </span>

                                    <strong>
                                        {
                                            selectedTechnician.phoneNo
                                        }
                                    </strong>

                                </div>

                                <div className="detail-row">

                                    <span>
                                        Role
                                    </span>

                                    <strong>
                                        {
                                            selectedTechnician
                                                .role
                                                .name
                                        }
                                    </strong>

                                </div>

                                <div className="permissions-section">

                                    <h4>
                                        Permissions
                                    </h4>

                                    <div className="permissions-list">

                                        {
                                            selectedTechnician
                                                .role
                                                .permissions
                                                .map(
                                                    (
                                                        permission
                                                    ) => (

                                                        <div
                                                            className="permission-item"
                                                            key={
                                                                permission.id
                                                            }
                                                        >

                                                            <strong>
                                                                {
                                                                    permission.name
                                                                }
                                                            </strong>

                                                            <span>
                                                                {
                                                                    permission.description
                                                                }
                                                            </span>

                                                        </div>

                                                    )
                                                )
                                        }

                                    </div>

                                </div>

                            </div>

                            <div className="technician-modal-actions">

                                <button
                                    className="modal-cancel-button"
                                    onClick={
                                        handleCloseView
                                    }
                                >
                                    Close
                                </button>

                            </div>

                        </div>

                    </div>
                )}

            {viewLoading && (

                <div className="modal-overlay">

                    <div className="technician-loading-modal">

                        <p>
                            Loading technician...
                        </p>

                    </div>

                </div>
            )}

        </div>
    );
};

export default Technicians;