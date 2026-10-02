import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";
import "./SLA.css";

interface SLA {
    responseDueAt?: string;
    resolutionDueAt?: string;
    respondedAt?: string;
    resolvedAt?: string;
    status?: string;
}

interface WorkOrder {
    id: number;
    title: string;
}

const SLA = () => {
    const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
    const [selectedWorkOrder, setSelectedWorkOrder] = useState("");

    const [responseHours, setResponseHours] = useState("");
    const [resolutionHours, setResolutionHours] = useState("");

    const [sla, setSla] = useState<SLA | null>(null);

    const [loading, setLoading] = useState(false);
    const [loadingSLA, setLoadingSLA] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        loadWorkOrders();
    }, []);

    const loadWorkOrders = async () => {
        try {
            const response = await apiClient.get(
                "/api/work-orders"
            );

            setWorkOrders(response.data);
        } catch (error) {
            console.error(
                "Failed to load work orders:",
                error
            );

            setError(
                "Unable to load work orders."
            );
        }
    };

    const loadSLA = async (workOrderId: string) => {
        if (!workOrderId) {
            setSla(null);
            return;
        }

        setLoadingSLA(true);
        setError("");
        setSuccess("");

        try {
            const response = await apiClient.get(
                `/api/sla/work-order/${workOrderId}`
            );

            setSla(response.data);
        } catch (error: any) {
            setSla(null);

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
                    "No SLA found for this work order."
                );
            }
        } finally {
            setLoadingSLA(false);
        }
    };

    const handleWorkOrderChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const workOrderId = event.target.value;

        setSelectedWorkOrder(workOrderId);
        setSla(null);
        setError("");
        setSuccess("");

        if (workOrderId) {
            loadSLA(workOrderId);
        }
    };

    const handleCreateSLA = async (
        event: React.FormEvent
    ) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (!selectedWorkOrder) {
            setError(
                "Please select a work order."
            );
            return;
        }

        if (!responseHours || !resolutionHours) {
            setError(
                "Response and resolution hours are required."
            );
            return;
        }

        setLoading(true);

        try {
            const response = await apiClient.post(
                "/api/sla/create",
                null,
                {
                    params: {
                        workOrderId:
                            Number(selectedWorkOrder),
                        responseHours:
                            Number(responseHours),
                        resolutionHours:
                            Number(resolutionHours),
                    },
                }
            );

            setSla(response.data);

            setSuccess(
                "SLA created successfully."
            );

            setResponseHours("");
            setResolutionHours("");

        } catch (error: any) {
            console.error(error);

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
                    "Failed to create SLA."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    const markResponded = async () => {
        if (!selectedWorkOrder) {
            return;
        }

        setError("");
        setSuccess("");

        try {
            const response = await apiClient.post(
                `/api/sla/work-order/${selectedWorkOrder}/respond`
            );

            setSla(response.data);

            setSuccess(
                "Work order marked as responded."
            );
        } catch (error: any) {
            if (error.response?.data?.message) {
                setError(
                    error.response.data.message
                );
            } else {
                setError(
                    "Failed to mark work order as responded."
                );
            }
        }
    };

    const markResolved = async () => {
        if (!selectedWorkOrder) {
            return;
        }

        setError("");
        setSuccess("");

        try {
            const response = await apiClient.post(
                `/api/sla/work-order/${selectedWorkOrder}/resolve`
            );

            setSla(response.data);

            setSuccess(
                "Work order marked as resolved."
            );
        } catch (error: any) {
            if (error.response?.data?.message) {
                setError(
                    error.response.data.message
                );
            } else {
                setError(
                    "Failed to mark work order as resolved."
                );
            }
        }
    };

    return (
        <div className="sla-page">

            <div className="page-header">
                <div>
                    <h2>SLA Management</h2>

                    <p>
                        Manage service level agreements
                        for work orders.
                    </p>
                </div>
            </div>


            <div className="sla-grid">

                {/* CREATE SLA */}

                <div className="sla-card">

                    <h3>
                        Create SLA
                    </h3>

                    <form
                        onSubmit={handleCreateSLA}
                    >

                        <div className="form-group">

                            <label>
                                Work Order
                            </label>

                            <select
                                value={
                                    selectedWorkOrder
                                }
                                onChange={
                                    handleWorkOrderChange
                                }
                                required
                            >

                                <option value="">
                                    Select Work Order
                                </option>

                                {workOrders.map(
                                    (workOrder) => (
                                        <option
                                            key={
                                                workOrder.id
                                            }
                                            value={
                                                workOrder.id
                                            }
                                        >
                                            #
                                            {
                                                workOrder.id
                                            }{" "}
                                            -{" "}
                                            {
                                                workOrder.title
                                            }
                                        </option>
                                    )
                                )}

                            </select>

                        </div>


                        <div className="form-group">

                            <label>
                                Response Time (Hours)
                            </label>

                            <input
                                type="number"
                                min="1"
                                placeholder="Example: 2"
                                value={
                                    responseHours
                                }
                                onChange={(event) =>
                                    setResponseHours(
                                        event.target.value
                                    )
                                }
                                required
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Resolution Time (Hours)
                            </label>

                            <input
                                type="number"
                                min="1"
                                placeholder="Example: 8"
                                value={
                                    resolutionHours
                                }
                                onChange={(event) =>
                                    setResolutionHours(
                                        event.target.value
                                    )
                                }
                                required
                            />

                        </div>


                        {error && (
                            <div className="sla-error">
                                {error}
                            </div>
                        )}


                        {success && (
                            <div className="sla-success">
                                {success}
                            </div>
                        )}


                        <button
                            type="submit"
                            disabled={loading}
                        >
                            {loading
                                ? "Creating..."
                                : "Create SLA"}
                        </button>

                    </form>

                </div>


                {/* SLA DETAILS */}

                <div className="sla-card">

                    <div className="card-header">

                        <h3>
                            SLA Details
                        </h3>

                    </div>


                    {!selectedWorkOrder ? (

                        <div className="empty-state">
                            Select a work order to
                            view its SLA.
                        </div>

                    ) : loadingSLA ? (

                        <div className="empty-state">
                            Loading SLA...
                        </div>

                    ) : !sla ? (

                        <div className="empty-state">
                            No SLA information found.
                        </div>

                    ) : (

                        <div>

                            <table>

                                <tbody>

                                    <tr>
                                        <th>
                                            Response Due
                                        </th>

                                        <td>
                                            {
                                                sla.responseDueAt
                                                    ? new Date(
                                                        sla.responseDueAt
                                                    ).toLocaleString()
                                                    : "-"
                                            }
                                        </td>
                                    </tr>


                                    <tr>
                                        <th>
                                            Resolution Due
                                        </th>

                                        <td>
                                            {
                                                sla.resolutionDueAt
                                                    ? new Date(
                                                        sla.resolutionDueAt
                                                    ).toLocaleString()
                                                    : "-"
                                            }
                                        </td>
                                    </tr>


                                    <tr>
                                        <th>
                                            Responded At
                                        </th>

                                        <td>
                                            {
                                                sla.respondedAt
                                                    ? new Date(
                                                        sla.respondedAt
                                                    ).toLocaleString()
                                                    : "Not responded"
                                            }
                                        </td>
                                    </tr>


                                    <tr>
                                        <th>
                                            Resolved At
                                        </th>

                                        <td>
                                            {
                                                sla.resolvedAt
                                                    ? new Date(
                                                        sla.resolvedAt
                                                    ).toLocaleString()
                                                    : "Not resolved"
                                            }
                                        </td>
                                    </tr>


                                    <tr>
                                        <th>
                                            Status
                                        </th>

                                        <td>
                                            {
                                                sla.status ||
                                                "-"
                                            }
                                        </td>
                                    </tr>

                                </tbody>

                            </table>


                            <div
                                style={{
                                    display: "flex",
                                    gap: "10px",
                                    marginTop: "20px",
                                }}
                            >

                                <button
                                    type="button"
                                    onClick={
                                        markResponded
                                    }
                                >
                                    Mark Responded
                                </button>


                                <button
                                    type="button"
                                    onClick={
                                        markResolved
                                    }
                                >
                                    Mark Resolved
                                </button>

                            </div>

                        </div>

                    )}

                </div>

            </div>

        </div>
    );
};

export default SLA;