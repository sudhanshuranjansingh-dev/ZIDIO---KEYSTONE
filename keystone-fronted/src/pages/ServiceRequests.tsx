import { useEffect, useState } from "react";

import apiClient from "../api/apiClient";

import "./ServiceRequests.css";

interface Customer {
    id: number;
    firstName: string;
    lastName: string;
    userEmail: string;
}

interface ServiceRequest {
    id: number;
    title: string;
    description: string;
    priority: string;
    status: string;
    createdAt: string;
    customer?: Customer;
}

const ServiceRequests = () => {

    const [serviceRequests, setServiceRequests] =
        useState<ServiceRequest[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [selectedRequest, setSelectedRequest] =
        useState<ServiceRequest | null>(null);

    const [showView, setShowView] =
        useState(false);

    const [viewLoading, setViewLoading] =
        useState(false);

    // =========================================================
    // Create Service Request States
    // =========================================================

    const [showCreate, setShowCreate] =
        useState(false);

    const [createLoading, setCreateLoading] =
        useState(false);

    const [createError, setCreateError] =
        useState("");

    const [createSuccess, setCreateSuccess] =
        useState("");

    const [newTitle, setNewTitle] =
        useState("");

    const [newDescription, setNewDescription] =
        useState("");

    const [newPriority, setNewPriority] =
        useState("MEDIUM");

    // =========================================================
    // Convert Service Request States
    // =========================================================

    const [convertLoading, setConvertLoading] =
        useState<number | null>(null);

    // =========================================================
    // Load Service Requests
    // =========================================================

    const loadServiceRequests = async () => {

        try {

            setLoading(true);

            setError("");

            const response = await apiClient.get(
                "/api/service-requests"
            );

            setServiceRequests(response.data);

        } catch (err) {

            console.error(
                "Failed to load service requests:",
                err
            );

            setError(
                "Failed to load service requests."
            );

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {

        loadServiceRequests();

    }, []);

    // =========================================================
    // View Service Request
    // =========================================================

    const handleView = async (id: number) => {

        try {

            setViewLoading(true);

            const response = await apiClient.get(
                `/api/service-requests/${id}`
            );

            setSelectedRequest(response.data);

            setShowView(true);

        } catch (err) {

            console.error(
                "Failed to load service request:",
                err
            );

            alert(
                "Failed to load service request details."
            );

        } finally {

            setViewLoading(false);

        }
    };

    // =========================================================
    // Close View Modal
    // =========================================================

    const handleCloseView = () => {

        setShowView(false);

        setSelectedRequest(null);

    };

    // =========================================================
    // Open Create Modal
    // =========================================================

    const handleOpenCreate = () => {

        setNewTitle("");

        setNewDescription("");

        setNewPriority("MEDIUM");

        setCreateError("");

        setCreateSuccess("");

        setShowCreate(true);

    };

    // =========================================================
    // Close Create Modal
    // =========================================================

    const handleCloseCreate = () => {

        if (createLoading) {

            return;

        }

        setShowCreate(false);

        setCreateError("");

        setCreateSuccess("");

    };

    // =========================================================
    // Create Service Request
    // =========================================================

    const handleCreate = async (
        event: React.FormEvent
    ) => {

        event.preventDefault();

        setCreateError("");

        setCreateSuccess("");

        if (!newTitle.trim()) {

            setCreateError(
                "Title is required."
            );

            return;
        }

        if (!newDescription.trim()) {

            setCreateError(
                "Description is required."
            );

            return;
        }

        try {

            setCreateLoading(true);

            await apiClient.post(
                "/api/service-requests",
                {
                    title: newTitle.trim(),
                    description: newDescription.trim(),
                    priority: newPriority
                }
            );

            setCreateSuccess(
                "Service request created successfully."
            );

            setNewTitle("");

            setNewDescription("");

            setNewPriority("MEDIUM");

            await loadServiceRequests();

            setTimeout(() => {

                setShowCreate(false);

                setCreateSuccess("");

            }, 700);

        } catch (err: any) {

            console.error(
                "Failed to create service request:",
                err
            );

            if (
                err?.response?.data?.message
            ) {

                setCreateError(
                    err.response.data.message
                );

            } else {

                setCreateError(
                    "Failed to create service request."
                );

            }

        } finally {

            setCreateLoading(false);

        }
    };

    // =========================================================
    // Convert Service Request To Work Order
    // =========================================================

    const handleConvertToWorkOrder = async (
        serviceRequestId: number
    ) => {

        const confirmed = window.confirm(
            "Convert this Service Request into a Work Order?"
        );

        if (!confirmed) {

            return;

        }

        try {

            setConvertLoading(serviceRequestId);

            await apiClient.post(
                `/api/work-orders/from-service-request/${serviceRequestId}`
            );

            alert(
                "Service Request converted to Work Order successfully."
            );

            await loadServiceRequests();

        } catch (err: any) {

            console.error(
                "Failed to convert service request:",
                err
            );

            if (
                err?.response?.data?.message
            ) {

                alert(
                    err.response.data.message
                );

            } else {

                alert(
                    "Failed to convert Service Request to Work Order."
                );

            }

        } finally {

            setConvertLoading(null);

        }
    };

    // =========================================================
    // Loading
    // =========================================================

    if (loading) {

        return (
            <div className="service-requests-page">

                <h2>
                    Service Requests
                </h2>

                <p>
                    Loading service requests...
                </p>

            </div>
        );

    }

    // =========================================================
    // Error
    // =========================================================

    if (error) {

        return (
            <div className="service-requests-page">

                <h2>
                    Service Requests
                </h2>

                <p className="service-request-error">
                    {error}
                </p>

            </div>
        );

    }

    // =========================================================
    // UI
    // =========================================================

    return (

        <div className="service-requests-page">

            {/* =================================================
                Header
            ================================================= */}

            <div className="service-requests-header">

                <div>

                    <h2>
                        Service Requests
                    </h2>

                    <p>
                        Manage customer service requests
                    </p>

                </div>

                <button
                    className="create-service-request-button"
                    onClick={handleOpenCreate}
                >
                    + Create Service Request
                </button>

            </div>

            {/* =================================================
                Table
            ================================================= */}

            <div className="service-requests-table-container">

                {serviceRequests.length === 0 ? (

                    <div className="empty-service-requests">

                        <h3>
                            No Service Requests Found
                        </h3>

                        <p>
                            There are currently no
                            service requests.
                        </p>

                    </div>

                ) : (

                    <table className="service-requests-table">

                        <thead>

                            <tr>

                                <th>
                                    ID
                                </th>

                                <th>
                                    Title
                                </th>

                                <th>
                                    Description
                                </th>

                                <th>
                                    Priority
                                </th>

                                <th>
                                    Status
                                </th>

                                <th>
                                    Customer
                                </th>

                                <th>
                                    Created
                                </th>

                                <th>
                                    Actions
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {serviceRequests.map(
                                (request) => (

                                    <tr
                                        key={request.id}
                                    >

                                        <td>
                                            #{request.id}
                                        </td>

                                        <td>

                                            <strong>
                                                {request.title}
                                            </strong>

                                        </td>

                                        <td>
                                            {request.description}
                                        </td>

                                        <td>

                                            <span
                                                className={`service-priority-badge service-priority-${request.priority.toLowerCase()}`}
                                            >
                                                {request.priority}
                                            </span>

                                        </td>

                                        <td>

                                            <span
                                                className={`service-status-badge service-status-${request.status.toLowerCase()}`}
                                            >
                                                {request.status}
                                            </span>

                                        </td>

                                        <td>

                                            {request.customer
                                                ? `${request.customer.firstName} ${request.customer.lastName}`
                                                : "Unknown"}

                                        </td>

                                        <td>

                                            {request.createdAt
                                                ? new Date(
                                                      request.createdAt
                                                  ).toLocaleString()
                                                : "N/A"}

                                        </td>

                                        <td>

                                            <div className="service-request-actions">

                                                <button
                                                    className="view-service-request-button"
                                                    onClick={() =>
                                                        handleView(
                                                            request.id
                                                        )
                                                    }
                                                >
                                                    View
                                                </button>

                                                <button
                                                    className="convert-service-request-button"
                                                    onClick={() =>
                                                        handleConvertToWorkOrder(
                                                            request.id
                                                        )
                                                    }
                                                    disabled={
                                                        convertLoading ===
                                                        request.id
                                                    }
                                                >

                                                    {convertLoading ===
                                                    request.id
                                                        ? "Converting..."
                                                        : "Convert"}

                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                )
                            )}

                        </tbody>

                    </table>

                )}

            </div>

            {/* =================================================
                Create Service Request Modal
            ================================================= */}

            {showCreate && (

                <div className="modal-overlay">

                    <div className="service-request-modal">

                        <div className="service-request-modal-header">

                            <div>

                                <h3>
                                    Create Service Request
                                </h3>

                                <p>
                                    Enter the service request details
                                </p>

                            </div>

                            <button
                                className="modal-close-button"
                                onClick={handleCloseCreate}
                            >
                                ×
                            </button>

                        </div>

                        <form
                            onSubmit={handleCreate}
                        >

                            <div className="form-group">

                                <label>
                                    Title
                                </label>

                                <input
                                    type="text"
                                    value={newTitle}
                                    onChange={(event) =>
                                        setNewTitle(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Enter request title"
                                />

                            </div>

                            <div className="form-group">

                                <label>
                                    Description
                                </label>

                                <textarea
                                    value={newDescription}
                                    onChange={(event) =>
                                        setNewDescription(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Enter request description"
                                    rows={5}
                                />

                            </div>

                            <div className="form-group">

                                <label>
                                    Priority
                                </label>

                                <select
                                    value={newPriority}
                                    onChange={(event) =>
                                        setNewPriority(
                                            event.target.value
                                        )
                                    }
                                >

                                    <option value="LOW">
                                        LOW
                                    </option>

                                    <option value="MEDIUM">
                                        MEDIUM
                                    </option>

                                    <option value="HIGH">
                                        HIGH
                                    </option>

                                    <option value="URGENT">
                                        URGENT
                                    </option>

                                </select>

                            </div>

                            {createError && (

                                <div className="create-request-error">
                                    {createError}
                                </div>

                            )}

                            {createSuccess && (

                                <div className="create-request-success">
                                    {createSuccess}
                                </div>

                            )}

                            <div className="service-request-modal-actions">

                                <button
                                    type="button"
                                    className="modal-cancel-button"
                                    onClick={handleCloseCreate}
                                    disabled={createLoading}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="submit-service-request-button"
                                    disabled={createLoading}
                                >

                                    {createLoading
                                        ? "Creating..."
                                        : "Create Request"}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

            {/* =================================================
                View Modal
            ================================================= */}

            {showView && selectedRequest && (

                <div className="modal-overlay">

                    <div className="service-request-modal">

                        <div className="service-request-modal-header">

                            <div>

                                <h3>
                                    Service Request Details
                                </h3>

                                <p>
                                    Request #
                                    {selectedRequest.id}
                                </p>

                            </div>

                            <button
                                className="modal-close-button"
                                onClick={handleCloseView}
                            >
                                ×
                            </button>

                        </div>

                        <div className="service-request-details">

                            <div className="detail-row">

                                <span>
                                    Title
                                </span>

                                <strong>
                                    {selectedRequest.title}
                                </strong>

                            </div>

                            <div className="detail-row">

                                <span>
                                    Description
                                </span>

                                <strong>
                                    {selectedRequest.description}
                                </strong>

                            </div>

                            <div className="detail-row">

                                <span>
                                    Priority
                                </span>

                                <strong>
                                    {selectedRequest.priority}
                                </strong>

                            </div>

                            <div className="detail-row">

                                <span>
                                    Status
                                </span>

                                <strong>
                                    {selectedRequest.status}
                                </strong>

                            </div>

                            <div className="detail-row">

                                <span>
                                    Customer
                                </span>

                                <strong>

                                    {selectedRequest.customer
                                        ? `${selectedRequest.customer.firstName} ${selectedRequest.customer.lastName}`
                                        : "Unknown"}

                                </strong>

                            </div>

                            <div className="detail-row">

                                <span>
                                    Customer Email
                                </span>

                                <strong>

                                    {selectedRequest.customer
                                        ? selectedRequest.customer.userEmail
                                        : "N/A"}

                                </strong>

                            </div>

                            <div className="detail-row">

                                <span>
                                    Created At
                                </span>

                                <strong>

                                    {selectedRequest.createdAt
                                        ? new Date(
                                              selectedRequest.createdAt
                                          ).toLocaleString()
                                        : "N/A"}

                                </strong>

                            </div>

                        </div>

                        <div className="service-request-modal-actions">

                            <button
                                className="modal-cancel-button"
                                onClick={handleCloseView}
                            >
                                Close
                            </button>

                        </div>

                    </div>

                </div>

            )}

            {/* =================================================
                View Loading
            ================================================= */}

            {viewLoading && (

                <div className="modal-overlay">

                    <div className="service-request-loading-modal">

                        <p>
                            Loading service request...
                        </p>

                    </div>

                </div>

            )}

        </div>
    );
};

export default ServiceRequests;