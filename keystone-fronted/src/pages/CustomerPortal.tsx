import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";
import "./CustomerPortal.css";

interface ServiceRequest {
    id: number;
    title?: string;
    description?: string;
    status?: string;
    createdAt?: string;
}

interface WorkOrder {
    id: number;
    title?: string;
    description?: string;
    priority?: string;
    status?: string;
    scheduledDate?: string;
}

const CustomerPortal = () => {

    const [serviceRequests, setServiceRequests] =
        useState<ServiceRequest[]>([]);

    const [workOrders, setWorkOrders] =
        useState<WorkOrder[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    useEffect(() => {
        loadCustomerData();
    }, []);

    const loadCustomerData = async () => {

        setLoading(true);
        setError("");

        try {

            const requestsResponse =
                await apiClient.get(
                    "/api/service-requests/my"
                );

            setServiceRequests(
                requestsResponse.data
            );

            try {

                const workOrdersResponse =
                    await apiClient.get(
                        "/api/work-orders/my"
                    );

                setWorkOrders(
                    workOrdersResponse.data
                );

            } catch (workOrderError) {

                console.warn(
                    "Customer work orders endpoint unavailable:",
                    workOrderError
                );

                setWorkOrders([]);
            }

        } catch (error: any) {

            console.error(error);

            if (error.response?.data?.message) {
                setError(
                    error.response.data.message
                );
            } else if (
                typeof error.response?.data === "string"
            ) {
                setError(
                    error.response.data
                );
            } else {
                setError(
                    "Unable to load customer information."
                );
            }

        } finally {
            setLoading(false);
        }
    };

    const getStatusClass = (
        status?: string
    ) => {

        if (!status) {
            return "status-default";
        }

        return `status-${status
            .toLowerCase()
            .replace(/\s+/g, "-")}`;
    };

    if (loading) {
        return (
            <div className="customer-page">
                <div className="customer-loading">
                    Loading your service information...
                </div>
            </div>
        );
    }

    return (
        <div className="customer-page">

            <div className="customer-header">

                <div>
                    <h2>Customer Portal</h2>

                    <p>
                        View your service requests
                        and work orders.
                    </p>
                </div>

                <button
                    className="customer-refresh"
                    onClick={loadCustomerData}
                >
                    🔄 Refresh
                </button>

            </div>

            {error && (
                <div className="customer-error">
                    {error}
                </div>
            )}

            <div className="customer-summary">

                <div className="summary-card">
                    <span className="summary-title">
                        Service Requests
                    </span>

                    <strong>
                        {serviceRequests.length}
                    </strong>
                </div>

                <div className="summary-card">
                    <span className="summary-title">
                        Work Orders
                    </span>

                    <strong>
                        {workOrders.length}
                    </strong>
                </div>

                <div className="summary-card">
                    <span className="summary-title">
                        Open Requests
                    </span>

                    <strong>
                        {
                            serviceRequests.filter(
                                (request) =>
                                    request.status !==
                                    "COMPLETED"
                            ).length
                        }
                    </strong>
                </div>

            </div>

            <div className="customer-card">

                <div className="card-title">
                    <h3>
                        My Service Requests
                    </h3>
                </div>

                {serviceRequests.length === 0 ? (

                    <div className="customer-empty">
                        No service requests found.
                    </div>

                ) : (

                    <div className="customer-table-wrapper">

                        <table>

                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Title</th>
                                    <th>Description</th>
                                    <th>Status</th>
                                    <th>Created</th>
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
                                                {request.title ||
                                                    "Service Request"}
                                            </td>

                                            <td>
                                                {request.description ||
                                                    "-"}
                                            </td>

                                            <td>

                                                <span
                                                    className={`status-badge ${getStatusClass(
                                                        request.status
                                                    )}`}
                                                >
                                                    {request.status ||
                                                        "UNKNOWN"}
                                                </span>

                                            </td>

                                            <td>
                                                {request.createdAt
                                                    ? new Date(
                                                        request.createdAt
                                                    ).toLocaleString()
                                                    : "-"}
                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

            <div className="customer-card">

                <div className="card-title">
                    <h3>
                        My Work Orders
                    </h3>
                </div>

                {workOrders.length === 0 ? (

                    <div className="customer-empty">
                        No work orders found.
                    </div>

                ) : (

                    <div className="customer-table-wrapper">

                        <table>

                            <thead>

                                <tr>
                                    <th>ID</th>
                                    <th>Title</th>
                                    <th>Priority</th>
                                    <th>Status</th>
                                    <th>Scheduled Date</th>
                                </tr>

                            </thead>

                            <tbody>

                                {workOrders.map(
                                    (workOrder) => (

                                        <tr
                                            key={workOrder.id}
                                        >

                                            <td>
                                                #{workOrder.id}
                                            </td>

                                            <td>
                                                {workOrder.title ||
                                                    "Work Order"}
                                            </td>

                                            <td>
                                                {workOrder.priority ||
                                                    "-"}
                                            </td>

                                            <td>

                                                <span
                                                    className={`status-badge ${getStatusClass(
                                                        workOrder.status
                                                    )}`}
                                                >
                                                    {workOrder.status ||
                                                        "UNKNOWN"}
                                                </span>

                                            </td>

                                            <td>
                                                {workOrder.scheduledDate
                                                    ? new Date(
                                                        workOrder.scheduledDate
                                                    ).toLocaleString()
                                                    : "-"}
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

export default CustomerPortal;