import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";
import "./TimeTracking.css";

interface TimeEntry {
    id: number;
    workOrderId: number;
    workOrderTitle?: string;
    technicianId: number;
    technicianName?: string;
    startTime?: string;
    endTime?: string;
    durationMinutes?: number;
}

interface WorkOrder {
    id: number;
    title: string;
}

interface Technician {
    id: number;
    firstName: string;
    lastName: string;
}

const TimeTracking = () => {

    const [timeEntries, setTimeEntries] =
        useState<TimeEntry[]>([]);

    const [workOrders, setWorkOrders] =
        useState<WorkOrder[]>([]);

    const [technicians, setTechnicians] =
        useState<Technician[]>([]);

    const [workOrderId, setWorkOrderId] =
        useState("");

    const [technicianId, setTechnicianId] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [loadingEntries, setLoadingEntries] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    useEffect(() => {

        loadWorkOrders();
        loadTechnicians();

    }, []);


    // =========================
    // LOAD WORK ORDERS
    // =========================

    const loadWorkOrders = async () => {

        try {

            const response =
                await apiClient.get(
                    "/api/work-orders"
                );

            setWorkOrders(response.data);

        } catch (error) {

            console.error(
                "Failed to load work orders:",
                error
            );

        }

    };


    // =========================
    // LOAD TECHNICIANS
    // =========================

    const loadTechnicians = async () => {

        try {

            const response =
                await apiClient.get(
                    "/api/technicians"
                );

            setTechnicians(response.data);

        } catch (error) {

            console.error(
                "Failed to load technicians:",
                error
            );

        }

    };


    // =========================
    // LOAD TIME ENTRIES
    // =========================

    const loadTimeEntries = async () => {

        if (!workOrderId) {

            setTimeEntries([]);

            return;
        }

        setLoadingEntries(true);
        setError("");

        try {

            const response =
                await apiClient.get(
                    `/api/time-tracking/work-order/${workOrderId}`
                );

            setTimeEntries(
                response.data
            );

        } catch (error: any) {

            console.error(error);

            if (
                error.response?.data?.message
            ) {

                setError(
                    error.response.data.message
                );

            } else {

                setError(
                    "Unable to load time entries."
                );

            }

        } finally {

            setLoadingEntries(false);

        }

    };


    // =========================
    // SELECT WORK ORDER
    // =========================

    const handleWorkOrderChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {

        const value =
            event.target.value;

        setWorkOrderId(value);

        setTimeEntries([]);

        setError("");
        setSuccess("");

    };


    // =========================
    // START WORK
    // =========================

    const handleStartWork = async () => {

        setError("");
        setSuccess("");

        if (!workOrderId) {

            setError(
                "Please select a work order."
            );

            return;
        }

        if (!technicianId) {

            setError(
                "Please select a technician."
            );

            return;
        }

        setLoading(true);

        try {

            await apiClient.post(
                "/api/time-tracking/start",
                null,
                {
                    params: {
                        workOrderId:
                            Number(workOrderId),

                        technicianId:
                            Number(technicianId),
                    },
                }
            );

            setSuccess(
                "Work started successfully."
            );

            await loadTimeEntries();

        } catch (error: any) {

            console.error(error);

            if (
                error.response?.data?.message
            ) {

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
                    "Failed to start work."
                );

            }

        } finally {

            setLoading(false);

        }

    };


    // =========================
    // STOP WORK
    // =========================

    const handleStopWork = async () => {

        setError("");
        setSuccess("");

        if (!workOrderId) {

            setError(
                "Please select a work order."
            );

            return;
        }

        if (!technicianId) {

            setError(
                "Please select a technician."
            );

            return;
        }

        setLoading(true);

        try {

            await apiClient.post(
                "/api/time-tracking/stop",
                null,
                {
                    params: {
                        workOrderId:
                            Number(workOrderId),

                        technicianId:
                            Number(technicianId),
                    },
                }
            );

            setSuccess(
                "Work stopped successfully."
            );

            await loadTimeEntries();

        } catch (error: any) {

            console.error(error);

            if (
                error.response?.data?.message
            ) {

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
                    "Failed to stop work."
                );

            }

        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="time-page">

            {/* ========================= */}
            {/* PAGE HEADER */}
            {/* ========================= */}

            <div className="page-header">

                <div>

                    <h2>
                        Time Tracking
                    </h2>

                    <p>
                        Track technician time
                        spent on work orders.
                    </p>

                </div>

            </div>


            <div className="time-grid">


                {/* ========================= */}
                {/* TIME CONTROL */}
                {/* ========================= */}

                <div className="time-card">

                    <h3>
                        Time Tracking
                    </h3>


                    {/* WORK ORDER */}

                    <div className="form-group">

                        <label>
                            Work Order
                        </label>

                        <select
                            value={workOrderId}
                            onChange={
                                handleWorkOrderChange
                            }
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


                    {/* TECHNICIAN */}

                    <div className="form-group">

                        <label>
                            Technician
                        </label>

                        <select
                            value={technicianId}
                            onChange={(event) =>
                                setTechnicianId(
                                    event.target.value
                                )
                            }
                        >

                            <option value="">
                                Select Technician
                            </option>

                            {technicians.map(
                                (technician) => (

                                    <option
                                        key={
                                            technician.id
                                        }
                                        value={
                                            technician.id
                                        }
                                    >

                                        {
                                            technician.firstName
                                        }{" "}
                                        {
                                            technician.lastName
                                        }

                                    </option>

                                )
                            )}

                        </select>

                    </div>


                    {/* MESSAGES */}

                    {error && (

                        <div className="time-error">

                            {error}

                        </div>

                    )}


                    {success && (

                        <div className="time-success">

                            {success}

                        </div>

                    )}


                    {/* BUTTONS */}

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
                                handleStartWork
                            }
                            disabled={loading}
                        >

                            {loading
                                ? "Processing..."
                                : "▶ Start Work"}

                        </button>


                        <button
                            type="button"
                            onClick={
                                handleStopWork
                            }
                            disabled={loading}
                        >

                            ⏹ Stop Work

                        </button>

                    </div>


                    {/* LOAD ENTRIES */}

                    {workOrderId && (

                        <button
                            type="button"
                            className="refresh-button"
                            onClick={
                                loadTimeEntries
                            }
                            style={{
                                marginTop: "15px",
                            }}
                        >

                            Refresh Entries

                        </button>

                    )}

                </div>


                {/* ========================= */}
                {/* TIME ENTRIES */}
                {/* ========================= */}

                <div className="time-card">

                    <div className="card-header">

                        <h3>
                            Time Entries
                        </h3>

                    </div>


                    {!workOrderId ? (

                        <div className="empty-state">

                            Select a work order
                            to view time entries.

                        </div>

                    ) : loadingEntries ? (

                        <div className="empty-state">

                            Loading time entries...

                        </div>

                    ) : timeEntries.length === 0 ? (

                        <div className="empty-state">

                            No time entries found
                            for this work order.

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
                                            Work Order
                                        </th>

                                        <th>
                                            Technician
                                        </th>

                                        <th>
                                            Start
                                        </th>

                                        <th>
                                            End
                                        </th>

                                        <th>
                                            Duration
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {timeEntries.map(
                                        (entry) => (

                                            <tr
                                                key={
                                                    entry.id
                                                }
                                            >

                                                <td>
                                                    {
                                                        entry.id
                                                    }
                                                </td>

                                                <td>
                                                    #
                                                    {
                                                        entry.workOrderId
                                                    }

                                                    {" - "}

                                                    {
                                                        entry.workOrderTitle ||
                                                        "-"
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        entry.technicianName ||
                                                        "-"
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        entry.startTime
                                                            ? new Date(
                                                                entry.startTime
                                                            ).toLocaleString()
                                                            : "-"
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        entry.endTime
                                                            ? new Date(
                                                                entry.endTime
                                                            ).toLocaleString()
                                                            : "Running"
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        entry.durationMinutes ??
                                                        "-"
                                                    }{" "}
                                                    min
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

        </div>

    );
};

export default TimeTracking;