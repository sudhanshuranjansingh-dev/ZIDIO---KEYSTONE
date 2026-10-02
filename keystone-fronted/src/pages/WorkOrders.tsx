import { useEffect, useState } from "react";

import apiClient from "../api/apiClient";
import { useAuth } from "../context/AuthContext";

import "./WorkOrders.css";

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

interface WorkOrder {
    id: number;
    title: string;
    description: string;
    priority: string;
    status: string;
    scheduledDate?: string;
    createdAt?: string;
    completedAt?: string;
    technician?: Technician | null;
}

const WorkOrders = () => {

    const { permissions } = useAuth();

    const hasPermission = (permission: string) => {
        return permissions.includes(permission);
    };

    const [workOrders, setWorkOrders] =
        useState<WorkOrder[]>([]);

    const [technicians, setTechnicians] =
        useState<Technician[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [techniciansLoading, setTechniciansLoading] =
        useState(false);

    // View
    const [selectedWorkOrder, setSelectedWorkOrder] =
        useState<WorkOrder | null>(null);

    const [showView, setShowView] =
        useState(false);

    const [viewLoading, setViewLoading] =
        useState(false);

    // Create
    const [showCreate, setShowCreate] =
        useState(false);

    const [createLoading, setCreateLoading] =
        useState(false);

    const [createError, setCreateError] =
        useState("");

    const [newTitle, setNewTitle] =
        useState("");

    const [newDescription, setNewDescription] =
        useState("");

    const [newPriority, setNewPriority] =
        useState("MEDIUM");

    const [newStatus, setNewStatus] =
        useState("OPEN");

    const [newScheduledDate, setNewScheduledDate] =
        useState("");

    // Edit
    const [showEdit, setShowEdit] =
        useState(false);

    const [editLoading, setEditLoading] =
        useState(false);

    const [editError, setEditError] =
        useState("");

    const [editWorkOrder, setEditWorkOrder] =
        useState<WorkOrder | null>(null);

    // Delete
    const [deleteLoading, setDeleteLoading] =
        useState<number | null>(null);

    // Assign Technician
    const [showAssign, setShowAssign] =
        useState(false);

    const [assignLoading, setAssignLoading] =
        useState(false);

    const [assignError, setAssignError] =
        useState("");

    const [assignWorkOrder, setAssignWorkOrder] =
        useState<WorkOrder | null>(null);

    const [selectedTechnicianId, setSelectedTechnicianId] =
        useState("");

    // Status
    const [showStatus, setShowStatus] =
        useState(false);

    const [statusLoading, setStatusLoading] =
        useState(false);

    const [statusError, setStatusError] =
        useState("");

    const [statusWorkOrder, setStatusWorkOrder] =
        useState<WorkOrder | null>(null);

    const [selectedStatus, setSelectedStatus] =
        useState("");

    /*
     * Load Work Orders
     */
    const loadWorkOrders = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await apiClient.get(
                "/api/work-orders"
            );

            setWorkOrders(response.data);

        } catch (err) {

            console.error(
                "Failed to load work orders:",
                err
            );

            setError(
                "Failed to load work orders."
            );

        } finally {
            setLoading(false);
        }
    };

    /*
     * Load Technicians
     */
    const loadTechnicians = async () => {

        try {

            setTechniciansLoading(true);

            const response = await apiClient.get(
                "/api/technicians"
            );

            setTechnicians(response.data);

        } catch (err) {

            console.error(
                "Failed to load technicians:",
                err
            );

            setAssignError(
                "Failed to load technicians."
            );

        } finally {

            setTechniciansLoading(false);

        }
    };

    /*
     * Initial Load
     */
    useEffect(() => {
        loadWorkOrders();
    }, []);

    /*
     * View Work Order
     */
    const handleView = async (id: number) => {

        try {

            setViewLoading(true);

            const response = await apiClient.get(
                `/api/work-orders/${id}`
            );

            setSelectedWorkOrder(
                response.data
            );

            setShowView(true);

        } catch (err) {

            console.error(
                "Failed to load work order:",
                err
            );

            alert(
                "Failed to load work order details."
            );

        } finally {

            setViewLoading(false);

        }
    };

    const handleCloseView = () => {

        setShowView(false);
        setSelectedWorkOrder(null);

    };

    /*
     * Open Create
     */
    const handleOpenCreate = () => {

        setNewTitle("");
        setNewDescription("");
        setNewPriority("MEDIUM");
        setNewStatus("OPEN");
        setNewScheduledDate("");
        setCreateError("");
        setShowCreate(true);

    };

    /*
     * Close Create
     */
    const handleCloseCreate = () => {

        if (createLoading) {
            return;
        }

        setShowCreate(false);
        setCreateError("");

    };

    /*
     * Create Work Order
     */
    const handleCreate = async (
        event: React.FormEvent
    ) => {

        event.preventDefault();

        setCreateError("");

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
                "/api/work-orders",
                {
                    title: newTitle.trim(),
                    description: newDescription.trim(),
                    priority: newPriority,
                    status: newStatus,
                    scheduledDate:
                        newScheduledDate
                            ? newScheduledDate
                            : null
                }
            );

            setShowCreate(false);

            await loadWorkOrders();

        } catch (err: any) {

            console.error(
                "Failed to create work order:",
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
                    "Failed to create work order."
                );

            }

        } finally {

            setCreateLoading(false);

        }
    };

    /*
     * Open Edit
     */
    const handleOpenEdit = (
        workOrder: WorkOrder
    ) => {

        setEditWorkOrder({
            ...workOrder
        });

        setEditError("");
        setShowEdit(true);

    };

    /*
     * Close Edit
     */
    const handleCloseEdit = () => {

        if (editLoading) {
            return;
        }

        setShowEdit(false);
        setEditWorkOrder(null);
        setEditError("");

    };

    /*
     * Update Work Order
     */
    const handleEdit = async (
        event: React.FormEvent
    ) => {

        event.preventDefault();

        if (!editWorkOrder) {
            return;
        }

        setEditError("");

        if (!editWorkOrder.title.trim()) {

            setEditError(
                "Title is required."
            );

            return;
        }

        if (!editWorkOrder.description.trim()) {

            setEditError(
                "Description is required."
            );

            return;
        }

        try {

            setEditLoading(true);

            await apiClient.put(
                `/api/work-orders/${editWorkOrder.id}`,
                {
                    title:
                        editWorkOrder.title.trim(),

                    description:
                        editWorkOrder.description.trim(),

                    priority:
                        editWorkOrder.priority,

                    status:
                        editWorkOrder.status,

                    scheduledDate:
                        editWorkOrder.scheduledDate
                            ? editWorkOrder.scheduledDate
                            : null
                }
            );

            setShowEdit(false);
            setEditWorkOrder(null);

            await loadWorkOrders();

        } catch (err: any) {

            console.error(
                "Failed to update work order:",
                err
            );

            if (
                err?.response?.data?.message
            ) {

                setEditError(
                    err.response.data.message
                );

            } else {

                setEditError(
                    "Failed to update work order."
                );

            }

        } finally {

            setEditLoading(false);

        }
    };

    /*
     * Delete Work Order
     */
    const handleDelete = async (
        id: number
    ) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this Work Order?"
            );

        if (!confirmed) {
            return;
        }

        try {

            setDeleteLoading(id);

            await apiClient.delete(
                `/api/work-orders/${id}`
            );

            await loadWorkOrders();

        } catch (err: any) {

            console.error(
                "Failed to delete work order:",
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
                    "Failed to delete work order."
                );

            }

        } finally {

            setDeleteLoading(null);

        }
    };

    /*
     * Open Assign Technician
     */
    const handleOpenAssign = async (
        workOrder: WorkOrder
    ) => {

        setAssignWorkOrder(workOrder);

        setAssignError("");

        setSelectedTechnicianId(
            workOrder.technician?.id
                ? String(workOrder.technician.id)
                : ""
        );

        setShowAssign(true);

        await loadTechnicians();

    };

    /*
     * Close Assign Technician
     */
    const handleCloseAssign = () => {

        if (assignLoading) {
            return;
        }

        setShowAssign(false);
        setAssignWorkOrder(null);
        setSelectedTechnicianId("");
        setAssignError("");

    };

    /*
     * Assign Technician
     */
    const handleAssignTechnician = async (
        event: React.FormEvent
    ) => {

        event.preventDefault();

        if (!assignWorkOrder) {
            return;
        }

        setAssignError("");

        if (!selectedTechnicianId) {

            setAssignError(
                "Please select a technician."
            );

            return;
        }

        try {

            setAssignLoading(true);

            await apiClient.put(
                `/api/work-orders/${assignWorkOrder.id}/assign-technician`,
                null,
                {
                    params: {
                        technicianId:
                            Number(
                                selectedTechnicianId
                            )
                    }
                }
            );

            setShowAssign(false);
            setAssignWorkOrder(null);
            setSelectedTechnicianId("");

            await loadWorkOrders();

        } catch (err: any) {

            console.error(
                "Failed to assign technician:",
                err
            );

            if (
                err?.response?.data?.message
            ) {

                setAssignError(
                    err.response.data.message
                );

            } else {

                setAssignError(
                    "Failed to assign technician."
                );

            }

        } finally {

            setAssignLoading(false);

        }
    };

    /*
     * Get Valid Status Transitions
     */
    const getValidNextStatuses = (
        currentStatus: string
    ): string[] => {

        switch (currentStatus) {

            case "OPEN":
                return ["ASSIGNED"];

            case "ASSIGNED":
                return ["IN_PROGRESS"];

            case "IN_PROGRESS":
                return [
                    "ON_HOLD",
                    "COMPLETED"
                ];

            case "ON_HOLD":
                return ["IN_PROGRESS"];

            case "COMPLETED":
                return [];

            default:
                return [];
        }
    };

    /*
     * Open Status Modal
     */
    const handleOpenStatus = (
        workOrder: WorkOrder
    ) => {

        setStatusWorkOrder(workOrder);
        setSelectedStatus("");
        setStatusError("");
        setShowStatus(true);

    };

    /*
     * Close Status Modal
     */
    const handleCloseStatus = () => {

        if (statusLoading) {
            return;
        }

        setShowStatus(false);
        setStatusWorkOrder(null);
        setSelectedStatus("");
        setStatusError("");

    };

    /*
     * Update Status
     */
    const handleUpdateStatus = async (
        event: React.FormEvent
    ) => {

        event.preventDefault();

        if (!statusWorkOrder) {
            return;
        }

        setStatusError("");

        if (!selectedStatus) {

            setStatusError(
                "Please select a status."
            );

            return;
        }

        try {

            setStatusLoading(true);

            await apiClient.put(
                `/api/work-orders/${statusWorkOrder.id}/status`,
                null,
                {
                    params: {
                        status:
                            selectedStatus
                    }
                }
            );

            setShowStatus(false);
            setStatusWorkOrder(null);
            setSelectedStatus("");

            await loadWorkOrders();

        } catch (err: any) {

            console.error(
                "Failed to update status:",
                err
            );

            if (
                err?.response?.data?.message
            ) {

                setStatusError(
                    err.response.data.message
                );

            } else {

                setStatusError(
                    "Failed to update work order status."
                );

            }

        } finally {

            setStatusLoading(false);

        }
    };

    if (loading) {

        return (
            <div className="work-orders-page">

                <h2>
                    Work Orders
                </h2>

                <p>
                    Loading work orders...
                </p>

            </div>
        );
    }

    if (error) {

        return (
            <div className="work-orders-page">

                <h2>
                    Work Orders
                </h2>

                <p className="work-order-error">
                    {error}
                </p>

                <button
                    onClick={loadWorkOrders}
                >
                    Retry
                </button>

            </div>
        );
    }

    return (

        <div className="work-orders-page">

            <div className="work-orders-header">

                <div>

                    <h2>
                        Work Orders
                    </h2>

                    <p>
                        Manage field service work orders
                    </p>

                </div>

                {/* CREATE BUTTON */}
                {hasPermission("CREATE_WORK_ORDER") && (
                    <button
                        className="create-work-order-button"
                        onClick={handleOpenCreate}
                    >
                        + Create Work Order
                    </button>
                )}

            </div>

            <div className="work-orders-table-container">

                {workOrders.length === 0 ? (

                    <div className="empty-work-orders">

                        <h3>
                            No Work Orders Found
                        </h3>

                        <p>
                            There are currently no
                            work orders.
                        </p>

                    </div>

                ) : (

                    <table className="work-orders-table">

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
                                    Technician
                                </th>

                                <th>
                                    Scheduled
                                </th>

                                <th>
                                    Actions
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {workOrders.map(
                                (workOrder) => (

                                    <tr
                                        key={
                                            workOrder.id
                                        }
                                    >

                                        <td>
                                            #
                                            {
                                                workOrder.id
                                            }
                                        </td>

                                        <td>
                                            <strong>
                                                {
                                                    workOrder.title
                                                }
                                            </strong>
                                        </td>

                                        <td>
                                            {
                                                workOrder.description
                                            }
                                        </td>

                                        <td>

                                            <span
                                                className={`priority-badge priority-${workOrder.priority.toLowerCase()}`}
                                            >
                                                {
                                                    workOrder.priority
                                                }
                                            </span>

                                        </td>

                                        <td>

                                            <span
                                                className={`status-badge status-${workOrder.status.toLowerCase()}`}
                                            >
                                                {
                                                    workOrder.status
                                                }
                                            </span>

                                        </td>

                                        <td>

                                            {workOrder.technician ? (

                                                <span>

                                                    {
                                                        workOrder
                                                            .technician
                                                            .firstName
                                                    }{" "}

                                                    {
                                                        workOrder
                                                            .technician
                                                            .lastName
                                                    }

                                                </span>

                                            ) : (

                                                <span className="no-technician">
                                                    Not Assigned
                                                </span>

                                            )}

                                        </td>

                                        <td>

                                            {workOrder.scheduledDate
                                                ? new Date(
                                                      workOrder.scheduledDate
                                                  ).toLocaleString()
                                                : "N/A"}

                                        </td>

                                        <td>

                                            <div className="work-order-actions">

                                                {/* VIEW */}
                                                {hasPermission(
                                                    "VIEW_WORK_ORDER"
                                                ) && (

                                                    <button
                                                        className="view-work-order-button"
                                                        onClick={() =>
                                                            handleView(
                                                                workOrder.id
                                                            )
                                                        }
                                                    >
                                                        View
                                                    </button>

                                                )}

                                                {/* EDIT */}
                                                {hasPermission(
                                                    "UPDATE_WORK_ORDER"
                                                ) && (

                                                    <button
                                                        className="edit-work-order-button"
                                                        onClick={() =>
                                                            handleOpenEdit(
                                                                workOrder
                                                            )
                                                        }
                                                    >
                                                        Edit
                                                    </button>

                                                )}

                                                {/* ASSIGN */}
                                                {hasPermission(
                                                    "ASSIGN_TECHNICIAN"
                                                ) && (

                                                    <button
                                                        className="assign-technician-button"
                                                        onClick={() =>
                                                            handleOpenAssign(
                                                                workOrder
                                                            )
                                                        }
                                                    >
                                                        Assign
                                                    </button>

                                                )}

                                                {/* STATUS */}
                                                {hasPermission(
                                                    "UPDATE_WORK_STATUS"
                                                ) && (

                                                    <button
                                                        className="status-work-order-button"
                                                        onClick={() =>
                                                            handleOpenStatus(
                                                                workOrder
                                                            )
                                                        }
                                                    >
                                                        Status
                                                    </button>

                                                )}

                                                {/* DELETE */}
                                                {hasPermission(
                                                    "DELETE_WORK_ORDER"
                                                ) && (

                                                    <button
                                                        className="delete-work-order-button"
                                                        onClick={() =>
                                                            handleDelete(
                                                                workOrder.id
                                                            )
                                                        }
                                                        disabled={
                                                            deleteLoading ===
                                                            workOrder.id
                                                        }
                                                    >
                                                        {deleteLoading ===
                                                        workOrder.id
                                                            ? "Deleting..."
                                                            : "Delete"}
                                                    </button>

                                                )}

                                            </div>

                                        </td>

                                    </tr>

                                )
                            )}

                        </tbody>

                    </table>

                )}

            </div>

            {/* CREATE MODAL */}

            {showCreate && (

                <div className="modal-overlay">

                    <div className="work-order-modal">

                        <div className="work-order-modal-header">

                            <div>

                                <h3>
                                    Create Work Order
                                </h3>

                                <p>
                                    Enter work order details
                                </p>

                            </div>

                            <button
                                className="modal-close-button"
                                onClick={
                                    handleCloseCreate
                                }
                            >
                                ×
                            </button>

                        </div>

                        <form
                            onSubmit={
                                handleCreate
                            }
                        >

                            <div className="form-group">

                                <label>
                                    Title
                                </label>

                                <input
                                    type="text"
                                    value={
                                        newTitle
                                    }
                                    onChange={(event) =>
                                        setNewTitle(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Enter work order title"
                                />

                            </div>

                            <div className="form-group">

                                <label>
                                    Description
                                </label>

                                <textarea
                                    value={
                                        newDescription
                                    }
                                    onChange={(event) =>
                                        setNewDescription(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Enter work order description"
                                    rows={5}
                                />

                            </div>

                            <div className="form-group">

                                <label>
                                    Priority
                                </label>

                                <select
                                    value={
                                        newPriority
                                    }
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

                            <div className="form-group">

                                <label>
                                    Status
                                </label>

                                <select
                                    value={
                                        newStatus
                                    }
                                    onChange={(event) =>
                                        setNewStatus(
                                            event.target.value
                                        )
                                    }
                                >

                                    <option value="OPEN">
                                        OPEN
                                    </option>

                                    <option value="ASSIGNED">
                                        ASSIGNED
                                    </option>

                                    <option value="IN_PROGRESS">
                                        IN_PROGRESS
                                    </option>

                                    <option value="ON_HOLD">
                                        ON_HOLD
                                    </option>

                                    <option value="COMPLETED">
                                        COMPLETED
                                    </option>

                                </select>

                            </div>

                            <div className="form-group">

                                <label>
                                    Scheduled Date
                                </label>

                                <input
                                    type="datetime-local"
                                    value={
                                        newScheduledDate
                                    }
                                    onChange={(event) =>
                                        setNewScheduledDate(
                                            event.target.value
                                        )
                                    }
                                />

                            </div>

                            {createError && (

                                <div className="form-error">
                                    {createError}
                                </div>

                            )}

                            <div className="work-order-modal-actions">

                                <button
                                    type="button"
                                    className="modal-cancel-button"
                                    onClick={
                                        handleCloseCreate
                                    }
                                    disabled={
                                        createLoading
                                    }
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="submit-work-order-button"
                                    disabled={
                                        createLoading
                                    }
                                >
                                    {createLoading
                                        ? "Creating..."
                                        : "Create Work Order"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

            {/* VIEW MODAL */}

            {showView &&
                selectedWorkOrder && (

                    <div className="modal-overlay">

                        <div className="work-order-modal">

                            <div className="work-order-modal-header">

                                <div>

                                    <h3>
                                        Work Order Details
                                    </h3>

                                    <p>
                                        Work Order #
                                        {
                                            selectedWorkOrder.id
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

                            <div className="work-order-details">

                                <div className="detail-row">

                                    <span>
                                        Title
                                    </span>

                                    <strong>
                                        {
                                            selectedWorkOrder.title
                                        }
                                    </strong>

                                </div>

                                <div className="detail-row">

                                    <span>
                                        Description
                                    </span>

                                    <strong>
                                        {
                                            selectedWorkOrder.description
                                        }
                                    </strong>

                                </div>

                                <div className="detail-row">

                                    <span>
                                        Priority
                                    </span>

                                    <strong>
                                        {
                                            selectedWorkOrder.priority
                                        }
                                    </strong>

                                </div>

                                <div className="detail-row">

                                    <span>
                                        Status
                                    </span>

                                    <strong>
                                        {
                                            selectedWorkOrder.status
                                        }
                                    </strong>

                                </div>

                                <div className="detail-row">

                                    <span>
                                        Technician
                                    </span>

                                    <strong>

                                        {selectedWorkOrder.technician
                                            ? `${selectedWorkOrder.technician.firstName} ${selectedWorkOrder.technician.lastName}`
                                            : "Not Assigned"}

                                    </strong>

                                </div>

                                <div className="detail-row">

                                    <span>
                                        Scheduled Date
                                    </span>

                                    <strong>

                                        {selectedWorkOrder.scheduledDate
                                            ? new Date(
                                                  selectedWorkOrder.scheduledDate
                                              ).toLocaleString()
                                            : "N/A"}

                                    </strong>

                                </div>

                            </div>

                            <div className="work-order-modal-actions">

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

            {/* EDIT MODAL */}

            {showEdit &&
                editWorkOrder && (

                    <div className="modal-overlay">

                        <div className="work-order-modal">

                            <div className="work-order-modal-header">

                                <div>

                                    <h3>
                                        Edit Work Order
                                    </h3>

                                    <p>
                                        Work Order #
                                        {
                                            editWorkOrder.id
                                        }
                                    </p>

                                </div>

                                <button
                                    className="modal-close-button"
                                    onClick={
                                        handleCloseEdit
                                    }
                                >
                                    ×
                                </button>

                            </div>

                            <form
                                onSubmit={
                                    handleEdit
                                }
                            >

                                <div className="form-group">

                                    <label>
                                        Title
                                    </label>

                                    <input
                                        type="text"
                                        value={
                                            editWorkOrder.title
                                        }
                                        onChange={(event) =>
                                            setEditWorkOrder({
                                                ...editWorkOrder,
                                                title:
                                                    event.target.value
                                            })
                                        }
                                    />

                                </div>

                                <div className="form-group">

                                    <label>
                                        Description
                                    </label>

                                    <textarea
                                        value={
                                            editWorkOrder.description
                                        }
                                        onChange={(event) =>
                                            setEditWorkOrder({
                                                ...editWorkOrder,
                                                description:
                                                    event.target.value
                                            })
                                        }
                                        rows={5}
                                    />

                                </div>

                                <div className="form-group">

                                    <label>
                                        Priority
                                    </label>

                                    <select
                                        value={
                                            editWorkOrder.priority
                                        }
                                        onChange={(event) =>
                                            setEditWorkOrder({
                                                ...editWorkOrder,
                                                priority:
                                                    event.target.value
                                            })
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

                                <div className="form-group">

                                    <label>
                                        Status
                                    </label>

                                    <select
                                        value={
                                            editWorkOrder.status
                                        }
                                        onChange={(event) =>
                                            setEditWorkOrder({
                                                ...editWorkOrder,
                                                status:
                                                    event.target.value
                                            })
                                        }
                                    >

                                        <option value="OPEN">
                                            OPEN
                                        </option>

                                        <option value="ASSIGNED">
                                            ASSIGNED
                                        </option>

                                        <option value="IN_PROGRESS">
                                            IN_PROGRESS
                                        </option>

                                        <option value="ON_HOLD">
                                            ON_HOLD
                                        </option>

                                        <option value="COMPLETED">
                                            COMPLETED
                                        </option>

                                    </select>

                                </div>

                                <div className="form-group">

                                    <label>
                                        Scheduled Date
                                    </label>

                                    <input
                                        type="datetime-local"
                                        value={
                                            editWorkOrder.scheduledDate
                                                ? editWorkOrder.scheduledDate.slice(
                                                      0,
                                                      16
                                                  )
                                                : ""
                                        }
                                        onChange={(event) =>
                                            setEditWorkOrder({
                                                ...editWorkOrder,
                                                scheduledDate:
                                                    event.target.value
                                            })
                                        }
                                    />

                                </div>

                                {editError && (

                                    <div className="form-error">
                                        {editError}
                                    </div>

                                )}

                                <div className="work-order-modal-actions">

                                    <button
                                        type="button"
                                        className="modal-cancel-button"
                                        onClick={
                                            handleCloseEdit
                                        }
                                        disabled={
                                            editLoading
                                        }
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        className="submit-work-order-button"
                                        disabled={
                                            editLoading
                                        }
                                    >
                                        {editLoading
                                            ? "Updating..."
                                            : "Update Work Order"}
                                    </button>

                                </div>

                            </form>

                        </div>

                    </div>

                )}

            {/* ASSIGN TECHNICIAN MODAL */}

            {showAssign &&
                assignWorkOrder && (

                    <div className="modal-overlay">

                        <div className="work-order-modal">

                            <div className="work-order-modal-header">

                                <div>

                                    <h3>
                                        Assign Technician
                                    </h3>

                                    <p>
                                        Work Order #
                                        {
                                            assignWorkOrder.id
                                        }
                                    </p>

                                </div>

                                <button
                                    className="modal-close-button"
                                    onClick={
                                        handleCloseAssign
                                    }
                                >
                                    ×
                                </button>

                            </div>

                            <form
                                onSubmit={
                                    handleAssignTechnician
                                }
                            >

                                <div className="assign-technician-info">

                                    <span>
                                        Work Order
                                    </span>

                                    <strong>
                                        {
                                            assignWorkOrder.title
                                        }
                                    </strong>

                                </div>

                                <div className="form-group">

                                    <label>
                                        Select Technician
                                    </label>

                                    {techniciansLoading ? (

                                        <p>
                                            Loading technicians...
                                        </p>

                                    ) : (

                                        <select
                                            value={
                                                selectedTechnicianId
                                            }
                                            onChange={(event) =>
                                                setSelectedTechnicianId(
                                                    event.target.value
                                                )
                                            }
                                        >

                                            <option value="">
                                                -- Select Technician --
                                            </option>

                                            {technicians.map(
                                                (
                                                    technician
                                                ) => (

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
                                                        }{" "}

                                                        (
                                                        {
                                                            technician.userEmail
                                                        }
                                                        )

                                                    </option>

                                                )
                                            )}

                                        </select>

                                    )}

                                </div>

                                {assignError && (

                                    <div className="form-error">
                                        {assignError}
                                    </div>

                                )}

                                <div className="work-order-modal-actions">

                                    <button
                                        type="button"
                                        className="modal-cancel-button"
                                        onClick={
                                            handleCloseAssign
                                        }
                                        disabled={
                                            assignLoading
                                        }
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        className="submit-work-order-button"
                                        disabled={
                                            assignLoading ||
                                            techniciansLoading
                                        }
                                    >
                                        {assignLoading
                                            ? "Assigning..."
                                            : "Assign Technician"}
                                    </button>

                                </div>

                            </form>

                        </div>

                    </div>

                )}

            {/* STATUS MODAL */}

            {showStatus &&
                statusWorkOrder && (

                    <div className="modal-overlay">

                        <div className="work-order-modal">

                            <div className="work-order-modal-header">

                                <div>

                                    <h3>
                                        Update Work Order Status
                                    </h3>

                                    <p>
                                        Work Order #
                                        {
                                            statusWorkOrder.id
                                        }
                                    </p>

                                </div>

                                <button
                                    className="modal-close-button"
                                    onClick={
                                        handleCloseStatus
                                    }
                                >
                                    ×
                                </button>

                            </div>

                            <form
                                onSubmit={
                                    handleUpdateStatus
                                }
                            >

                                <div className="assign-technician-info">

                                    <span>
                                        Current Status
                                    </span>

                                    <strong>
                                        {
                                            statusWorkOrder.status
                                        }
                                    </strong>

                                </div>

                                <div className="form-group">

                                    <label>
                                        New Status
                                    </label>

                                    <select
                                        value={
                                            selectedStatus
                                        }
                                        onChange={(event) =>
                                            setSelectedStatus(
                                                event.target.value
                                            )
                                        }
                                    >

                                        <option value="">
                                            -- Select Status --
                                        </option>

                                        {getValidNextStatuses(
                                            statusWorkOrder.status
                                        ).map(
                                            (
                                                status
                                            ) => (

                                                <option
                                                    key={
                                                        status
                                                    }
                                                    value={
                                                        status
                                                    }
                                                >
                                                    {
                                                        status
                                                    }
                                                </option>

                                            )
                                        )}

                                    </select>

                                </div>

                                {getValidNextStatuses(
                                    statusWorkOrder.status
                                ).length === 0 && (

                                    <div className="form-error">

                                        No valid status
                                        transitions are available.

                                    </div>

                                )}

                                {statusError && (

                                    <div className="form-error">
                                        {statusError}
                                    </div>

                                )}

                                <div className="work-order-modal-actions">

                                    <button
                                        type="button"
                                        className="modal-cancel-button"
                                        onClick={
                                            handleCloseStatus
                                        }
                                        disabled={
                                            statusLoading
                                        }
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        className="submit-work-order-button"
                                        disabled={
                                            statusLoading ||
                                            getValidNextStatuses(
                                                statusWorkOrder.status
                                            ).length === 0
                                        }
                                    >
                                        {statusLoading
                                            ? "Updating..."
                                            : "Update Status"}
                                    </button>

                                </div>

                            </form>

                        </div>

                    </div>

                )}

            {/* VIEW LOADING */}

            {viewLoading && (

                <div className="modal-overlay">

                    <div className="work-order-loading-modal">

                        <p>
                            Loading work order...
                        </p>

                    </div>

                </div>

            )}

        </div>
    );
};

export default WorkOrders;