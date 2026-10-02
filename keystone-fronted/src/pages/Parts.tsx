import { useEffect, useState } from "react";

import apiClient from "../api/apiClient";

import "./Parts.css";

interface Part {
    id: number;
    partCode: string;
    partName: string;
    description: string;
    quantity: number;
    minimumStock: number;
    unitPrice: number;
}

const Parts = () => {

    const [parts, setParts] = useState<Part[]>([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    // =========================================================
    // CREATE
    // =========================================================

    const [showCreate, setShowCreate] = useState(false);

    const [createLoading, setCreateLoading] = useState(false);

    const [createError, setCreateError] = useState("");

    const [createSuccess, setCreateSuccess] = useState("");

    const [newPartCode, setNewPartCode] = useState("");

    const [newPartName, setNewPartName] = useState("");

    const [newDescription, setNewDescription] = useState("");

    const [newQuantity, setNewQuantity] = useState("0");

    const [newMinimumStock, setNewMinimumStock] = useState("0");

    const [newUnitPrice, setNewUnitPrice] = useState("0");

    // =========================================================
    // VIEW
    // =========================================================

    const [selectedPart, setSelectedPart] =
        useState<Part | null>(null);

    const [showView, setShowView] = useState(false);

    const [viewLoading, setViewLoading] = useState(false);

    // =========================================================
    // EDIT
    // =========================================================

    const [showEdit, setShowEdit] = useState(false);

    const [editLoading, setEditLoading] = useState(false);

    const [editError, setEditError] = useState("");

    const [editSuccess, setEditSuccess] = useState("");

    const [editPartId, setEditPartId] =
        useState<number | null>(null);

    const [editPartCode, setEditPartCode] = useState("");

    const [editPartName, setEditPartName] = useState("");

    const [editDescription, setEditDescription] = useState("");

    const [editQuantity, setEditQuantity] = useState("0");

    const [editMinimumStock, setEditMinimumStock] =
        useState("0");

    const [editUnitPrice, setEditUnitPrice] = useState("0");

    // =========================================================
    // DELETE
    // =========================================================

    const [deleteLoading, setDeleteLoading] =
        useState<number | null>(null);

    // =========================================================
    // STOCK IN
    // =========================================================

    const [showStockIn, setShowStockIn] = useState(false);

    const [stockInPart, setStockInPart] =
        useState<Part | null>(null);

    const [stockInQuantity, setStockInQuantity] =
        useState("1");

    const [stockInLoading, setStockInLoading] =
        useState(false);

    const [stockInError, setStockInError] = useState("");

    const [stockInSuccess, setStockInSuccess] =
        useState("");

    // =========================================================
    // STOCK OUT
    // =========================================================

    const [showStockOut, setShowStockOut] =
        useState(false);

    const [stockOutPart, setStockOutPart] =
        useState<Part | null>(null);

    const [stockOutQuantity, setStockOutQuantity] =
        useState("1");

    const [stockOutLoading, setStockOutLoading] =
        useState(false);

    const [stockOutError, setStockOutError] =
        useState("");

    const [stockOutSuccess, setStockOutSuccess] =
        useState("");

    // =========================================================
    // LOAD PARTS
    // =========================================================

    const loadParts = async () => {

        try {

            setLoading(true);

            setError("");

            const response = await apiClient.get(
                "/api/parts"
            );

            setParts(response.data);

        } catch (err) {

            console.error(
                "Failed to load parts:",
                err
            );

            setError(
                "Failed to load parts."
            );

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {

        loadParts();

    }, []);

    // =========================================================
    // CREATE
    // =========================================================

    const handleOpenCreate = () => {

        setNewPartCode("");

        setNewPartName("");

        setNewDescription("");

        setNewQuantity("0");

        setNewMinimumStock("0");

        setNewUnitPrice("0");

        setCreateError("");

        setCreateSuccess("");

        setShowCreate(true);

    };

    const handleCloseCreate = () => {

        if (createLoading) {
            return;
        }

        setShowCreate(false);

        setCreateError("");

        setCreateSuccess("");

    };

    const handleCreate = async (
        event: React.FormEvent
    ) => {

        event.preventDefault();

        setCreateError("");

        setCreateSuccess("");

        if (!newPartCode.trim()) {

            setCreateError(
                "Part code is required."
            );

            return;
        }

        if (!newPartName.trim()) {

            setCreateError(
                "Part name is required."
            );

            return;
        }

        try {

            setCreateLoading(true);

            await apiClient.post(
                "/api/parts",
                {
                    partCode:
                        newPartCode.trim(),

                    partName:
                        newPartName.trim(),

                    description:
                        newDescription.trim(),

                    quantity:
                        Number(newQuantity),

                    minimumStock:
                        Number(newMinimumStock),

                    unitPrice:
                        Number(newUnitPrice)
                }
            );

            setCreateSuccess(
                "Part created successfully."
            );

            await loadParts();

            setTimeout(() => {

                setShowCreate(false);

                setCreateSuccess("");

            }, 700);

        } catch (err: any) {

            console.error(
                "Failed to create part:",
                err
            );

            setCreateError(
                err?.response?.data?.message ||
                "Failed to create part."
            );

        } finally {

            setCreateLoading(false);

        }
    };

    // =========================================================
    // VIEW
    // =========================================================

    const handleView = async (
        id: number
    ) => {

        try {

            setViewLoading(true);

            const response =
                await apiClient.get(
                    `/api/parts/${id}`
                );

            setSelectedPart(
                response.data
            );

            setShowView(true);

        } catch (err) {

            console.error(
                "Failed to load part:",
                err
            );

            alert(
                "Failed to load part details."
            );

        } finally {

            setViewLoading(false);

        }
    };

    const handleCloseView = () => {

        setShowView(false);

        setSelectedPart(null);

    };

    // =========================================================
    // EDIT
    // =========================================================

    const handleOpenEdit = (
        part: Part
    ) => {

        setEditPartId(part.id);

        setEditPartCode(
            part.partCode
        );

        setEditPartName(
            part.partName
        );

        setEditDescription(
            part.description || ""
        );

        setEditQuantity(
            String(part.quantity)
        );

        setEditMinimumStock(
            String(part.minimumStock)
        );

        setEditUnitPrice(
            String(part.unitPrice)
        );

        setEditError("");

        setEditSuccess("");

        setShowEdit(true);

    };

    const handleCloseEdit = () => {

        if (editLoading) {
            return;
        }

        setShowEdit(false);

        setEditError("");

        setEditSuccess("");

        setEditPartId(null);

    };

    const handleUpdate = async (
        event: React.FormEvent
    ) => {

        event.preventDefault();

        setEditError("");

        setEditSuccess("");

        if (editPartId === null) {

            setEditError(
                "Part ID is missing."
            );

            return;
        }

        if (!editPartCode.trim()) {

            setEditError(
                "Part code is required."
            );

            return;
        }

        if (!editPartName.trim()) {

            setEditError(
                "Part name is required."
            );

            return;
        }

        try {

            setEditLoading(true);

            await apiClient.put(
                `/api/parts/${editPartId}`,
                {
                    partCode:
                        editPartCode.trim(),

                    partName:
                        editPartName.trim(),

                    description:
                        editDescription.trim(),

                    quantity:
                        Number(editQuantity),

                    minimumStock:
                        Number(editMinimumStock),

                    unitPrice:
                        Number(editUnitPrice)
                }
            );

            setEditSuccess(
                "Part updated successfully."
            );

            await loadParts();

            setTimeout(() => {

                setShowEdit(false);

                setEditSuccess("");

            }, 700);

        } catch (err: any) {

            console.error(
                "Failed to update part:",
                err
            );

            setEditError(
                err?.response?.data?.message ||
                "Failed to update part."
            );

        } finally {

            setEditLoading(false);

        }
    };

    // =========================================================
    // DELETE
    // =========================================================

    const handleDelete = async (
        id: number,
        partName: string
    ) => {

        const confirmed =
            window.confirm(
                `Are you sure you want to delete "${partName}"?`
            );

        if (!confirmed) {
            return;
        }

        try {

            setDeleteLoading(id);

            await apiClient.delete(
                `/api/parts/${id}`
            );

            alert(
                "Part deleted successfully."
            );

            await loadParts();

        } catch (err: any) {

            console.error(
                "Failed to delete part:",
                err
            );

            alert(
                err?.response?.data?.message ||
                "Failed to delete part."
            );

        } finally {

            setDeleteLoading(null);

        }
    };

    // =========================================================
    // STOCK IN
    // =========================================================

    const handleOpenStockIn = (
        part: Part
    ) => {

        setStockInPart(part);

        setStockInQuantity("1");

        setStockInError("");

        setStockInSuccess("");

        setShowStockIn(true);

    };

    const handleCloseStockIn = () => {

        if (stockInLoading) {
            return;
        }

        setShowStockIn(false);

        setStockInPart(null);

        setStockInError("");

        setStockInSuccess("");

    };

    const handleStockIn = async (
        event: React.FormEvent
    ) => {

        event.preventDefault();

        setStockInError("");

        setStockInSuccess("");

        if (!stockInPart) {

            setStockInError(
                "Part is missing."
            );

            return;
        }

        const quantity =
            Number(stockInQuantity);

        if (
            !Number.isInteger(quantity) ||
            quantity <= 0
        ) {

            setStockInError(
                "Stock In quantity must be a positive whole number."
            );

            return;
        }

        try {

            setStockInLoading(true);

            await apiClient.post(
                `/api/parts/${stockInPart.id}/stock-in`,
                null,
                {
                    params: {
                        quantity: quantity
                    }
                }
            );

            setStockInSuccess(
                `Stock In successful. Added ${quantity} unit(s).`
            );

            await loadParts();

            setTimeout(() => {

                setShowStockIn(false);

                setStockInPart(null);

                setStockInSuccess("");

            }, 800);

        } catch (err: any) {

            console.error(
                "Failed to stock in:",
                err
            );

            setStockInError(
                err?.response?.data?.message ||
                "Failed to add stock."
            );

        } finally {

            setStockInLoading(false);

        }
    };

    // =========================================================
    // STOCK OUT
    // =========================================================

    const handleOpenStockOut = (
        part: Part
    ) => {

        setStockOutPart(part);

        setStockOutQuantity("1");

        setStockOutError("");

        setStockOutSuccess("");

        setShowStockOut(true);

    };

    const handleCloseStockOut = () => {

        if (stockOutLoading) {
            return;
        }

        setShowStockOut(false);

        setStockOutPart(null);

        setStockOutError("");

        setStockOutSuccess("");

    };

    const handleStockOut = async (
        event: React.FormEvent
    ) => {

        event.preventDefault();

        setStockOutError("");

        setStockOutSuccess("");

        if (!stockOutPart) {

            setStockOutError(
                "Part is missing."
            );

            return;
        }

        const quantity =
            Number(stockOutQuantity);

        if (
            !Number.isInteger(quantity) ||
            quantity <= 0
        ) {

            setStockOutError(
                "Stock Out quantity must be a positive whole number."
            );

            return;
        }

        if (
            quantity >
            stockOutPart.quantity
        ) {

            setStockOutError(
                `Cannot remove ${quantity} units. Current stock is only ${stockOutPart.quantity}.`
            );

            return;
        }

        try {

            setStockOutLoading(true);

            await apiClient.post(
                `/api/parts/${stockOutPart.id}/stock-out`,
                null,
                {
                    params: {
                        quantity: quantity
                    }
                }
            );

            setStockOutSuccess(
                `Stock Out successful. Removed ${quantity} unit(s).`
            );

            await loadParts();

            setTimeout(() => {

                setShowStockOut(false);

                setStockOutPart(null);

                setStockOutSuccess("");

            }, 800);

        } catch (err: any) {

            console.error(
                "Failed to stock out:",
                err
            );

            setStockOutError(
                err?.response?.data?.message ||
                "Failed to remove stock."
            );

        } finally {

            setStockOutLoading(false);

        }
    };

    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (

            <div className="parts-page">

                <h2>
                    Parts & Inventory
                </h2>

                <p>
                    Loading parts...
                </p>

            </div>
        );
    }

    // =========================================================
    // ERROR
    // =========================================================

    if (error) {

        return (

            <div className="parts-page">

                <h2>
                    Parts & Inventory
                </h2>

                <p className="parts-error">
                    {error}
                </p>

            </div>
        );
    }

    // =========================================================
    // MAIN UI
    // =========================================================

    return (

        <div className="parts-page">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="parts-header">

                <div>

                    <h2>
                        Parts & Inventory
                    </h2>

                    <p>
                        Manage parts and inventory
                    </p>

                </div>

                <button
                    className="create-part-button"
                    onClick={handleOpenCreate}
                >
                    + Add Part
                </button>

            </div>

            {/* =================================================
                PARTS TABLE
            ================================================= */}

            <div className="parts-table-container">

                {parts.length === 0 ? (

                    <div className="empty-parts">

                        <h3>
                            No Parts Found
                        </h3>

                        <p>
                            There are currently no
                            parts in the inventory.
                        </p>

                    </div>

                ) : (

                    <table className="parts-table">

                        <thead>

                            <tr>

                                <th>
                                    ID
                                </th>

                                <th>
                                    Part Code
                                </th>

                                <th>
                                    Part Name
                                </th>

                                <th>
                                    Description
                                </th>

                                <th>
                                    Quantity
                                </th>

                                <th>
                                    Minimum Stock
                                </th>

                                <th>
                                    Unit Price
                                </th>

                                <th>
                                    Actions
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {parts.map(
                                (part) => (

                                    <tr
                                        key={part.id}
                                    >

                                        <td>
                                            #{part.id}
                                        </td>

                                        <td>
                                            <strong>
                                                {part.partCode}
                                            </strong>
                                        </td>

                                        <td>
                                            {part.partName}
                                        </td>

                                        <td>
                                            {
                                                part.description ||
                                                "N/A"
                                            }
                                        </td>

                                        <td>
                                            {part.quantity}
                                        </td>

                                        <td>
                                            {
                                                part.minimumStock
                                            }
                                        </td>

                                        <td>
                                            ₹
                                            {Number(
                                                part.unitPrice
                                            ).toFixed(2)}
                                        </td>

                                        <td>

                                            <div className="part-actions">

                                                {/* VIEW */}

                                                <button
                                                    className="view-part-button"
                                                    onClick={() =>
                                                        handleView(
                                                            part.id
                                                        )
                                                    }
                                                >
                                                    View
                                                </button>

                                                {/* EDIT */}

                                                <button
                                                    className="edit-part-button"
                                                    onClick={() =>
                                                        handleOpenEdit(
                                                            part
                                                        )
                                                    }
                                                >
                                                    Edit
                                                </button>

                                                {/* STOCK IN */}

                                                <button
                                                    className="stock-in-button"
                                                    onClick={() =>
                                                        handleOpenStockIn(
                                                            part
                                                        )
                                                    }
                                                >
                                                    Stock In
                                                </button>

                                                {/* STOCK OUT */}

                                                <button
                                                    className="stock-out-button"
                                                    onClick={() =>
                                                        handleOpenStockOut(
                                                            part
                                                        )
                                                    }
                                                >
                                                    Stock Out
                                                </button>

                                                {/* DELETE */}

                                                <button
                                                    className="delete-part-button"
                                                    onClick={() =>
                                                        handleDelete(
                                                            part.id,
                                                            part.partName
                                                        )
                                                    }
                                                    disabled={
                                                        deleteLoading ===
                                                        part.id
                                                    }
                                                >
                                                    {
                                                        deleteLoading ===
                                                        part.id
                                                            ? "Deleting..."
                                                            : "Delete"
                                                    }
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
                CREATE MODAL
            ================================================= */}

            {showCreate && (

                <div className="modal-overlay">

                    <div className="part-modal">

                        <div className="part-modal-header">

                            <div>

                                <h3>
                                    Add New Part
                                </h3>

                                <p>
                                    Enter the part details
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
                                    Part Code
                                </label>

                                <input
                                    type="text"
                                    value={
                                        newPartCode
                                    }
                                    onChange={
                                        (event) =>
                                            setNewPartCode(
                                                event.target.value
                                            )
                                    }
                                />

                            </div>

                            <div className="form-group">

                                <label>
                                    Part Name
                                </label>

                                <input
                                    type="text"
                                    value={
                                        newPartName
                                    }
                                    onChange={
                                        (event) =>
                                            setNewPartName(
                                                event.target.value
                                            )
                                    }
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
                                    onChange={
                                        (event) =>
                                            setNewDescription(
                                                event.target.value
                                            )
                                    }
                                    rows={4}
                                />

                            </div>

                            <div className="parts-form-grid">

                                <div className="form-group">

                                    <label>
                                        Quantity
                                    </label>

                                    <input
                                        type="number"
                                        min="0"
                                        value={
                                            newQuantity
                                        }
                                        onChange={
                                            (event) =>
                                                setNewQuantity(
                                                    event.target.value
                                                )
                                        }
                                    />

                                </div>

                                <div className="form-group">

                                    <label>
                                        Minimum Stock
                                    </label>

                                    <input
                                        type="number"
                                        min="0"
                                        value={
                                            newMinimumStock
                                        }
                                        onChange={
                                            (event) =>
                                                setNewMinimumStock(
                                                    event.target.value
                                                )
                                        }
                                    />

                                </div>

                            </div>

                            <div className="form-group">

                                <label>
                                    Unit Price
                                </label>

                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={
                                        newUnitPrice
                                    }
                                    onChange={
                                        (event) =>
                                            setNewUnitPrice(
                                                event.target.value
                                            )
                                    }
                                />

                            </div>

                            {createError && (

                                <div className="create-part-error">

                                    {createError}

                                </div>

                            )}

                            {createSuccess && (

                                <div className="create-part-success">

                                    {createSuccess}

                                </div>

                            )}

                            <div className="part-modal-actions">

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
                                    className="submit-part-button"
                                    disabled={
                                        createLoading
                                    }
                                >
                                    {
                                        createLoading
                                            ? "Creating..."
                                            : "Create Part"
                                    }
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

            {/* =================================================
                VIEW MODAL
            ================================================= */}

            {showView &&
                selectedPart && (

                    <div className="modal-overlay">

                        <div className="part-modal">

                            <div className="part-modal-header">

                                <div>

                                    <h3>
                                        Part Details
                                    </h3>

                                    <p>
                                        Part #
                                        {
                                            selectedPart.id
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

                            <div className="part-details">

                                <div className="part-detail-row">

                                    <span>
                                        Part Code
                                    </span>

                                    <strong>
                                        {
                                            selectedPart.partCode
                                        }
                                    </strong>

                                </div>

                                <div className="part-detail-row">

                                    <span>
                                        Part Name
                                    </span>

                                    <strong>
                                        {
                                            selectedPart.partName
                                        }
                                    </strong>

                                </div>

                                <div className="part-detail-row">

                                    <span>
                                        Description
                                    </span>

                                    <strong>
                                        {
                                            selectedPart.description ||
                                            "N/A"
                                        }
                                    </strong>

                                </div>

                                <div className="part-detail-row">

                                    <span>
                                        Quantity
                                    </span>

                                    <strong>
                                        {
                                            selectedPart.quantity
                                        }
                                    </strong>

                                </div>

                                <div className="part-detail-row">

                                    <span>
                                        Minimum Stock
                                    </span>

                                    <strong>
                                        {
                                            selectedPart.minimumStock
                                        }
                                    </strong>

                                </div>

                                <div className="part-detail-row">

                                    <span>
                                        Unit Price
                                    </span>

                                    <strong>
                                        ₹
                                        {Number(
                                            selectedPart.unitPrice
                                        ).toFixed(2)}
                                    </strong>

                                </div>

                            </div>

                            <div className="part-modal-actions">

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

            {/* =================================================
                EDIT MODAL
            ================================================= */}

            {showEdit && (

                <div className="modal-overlay">

                    <div className="part-modal">

                        <div className="part-modal-header">

                            <div>

                                <h3>
                                    Edit Part
                                </h3>

                                <p>
                                    Update part details
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
                                handleUpdate
                            }
                        >

                            <div className="form-group">

                                <label>
                                    Part Code
                                </label>

                                <input
                                    type="text"
                                    value={
                                        editPartCode
                                    }
                                    onChange={
                                        (event) =>
                                            setEditPartCode(
                                                event.target.value
                                            )
                                    }
                                />

                            </div>

                            <div className="form-group">

                                <label>
                                    Part Name
                                </label>

                                <input
                                    type="text"
                                    value={
                                        editPartName
                                    }
                                    onChange={
                                        (event) =>
                                            setEditPartName(
                                                event.target.value
                                            )
                                    }
                                />

                            </div>

                            <div className="form-group">

                                <label>
                                    Description
                                </label>

                                <textarea
                                    value={
                                        editDescription
                                    }
                                    onChange={
                                        (event) =>
                                            setEditDescription(
                                                event.target.value
                                            )
                                    }
                                    rows={4}
                                />

                            </div>

                            <div className="parts-form-grid">

                                <div className="form-group">

                                    <label>
                                        Quantity
                                    </label>

                                    <input
                                        type="number"
                                        min="0"
                                        value={
                                            editQuantity
                                        }
                                        onChange={
                                            (event) =>
                                                setEditQuantity(
                                                    event.target.value
                                                )
                                        }
                                    />

                                </div>

                                <div className="form-group">

                                    <label>
                                        Minimum Stock
                                    </label>

                                    <input
                                        type="number"
                                        min="0"
                                        value={
                                            editMinimumStock
                                        }
                                        onChange={
                                            (event) =>
                                                setEditMinimumStock(
                                                    event.target.value
                                                )
                                        }
                                    />

                                </div>

                            </div>

                            <div className="form-group">

                                <label>
                                    Unit Price
                                </label>

                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={
                                        editUnitPrice
                                    }
                                    onChange={
                                        (event) =>
                                            setEditUnitPrice(
                                                event.target.value
                                            )
                                    }
                                />

                            </div>

                            {editError && (

                                <div className="create-part-error">

                                    {editError}

                                </div>

                            )}

                            {editSuccess && (

                                <div className="create-part-success">

                                    {editSuccess}

                                </div>

                            )}

                            <div className="part-modal-actions">

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
                                    className="submit-part-button"
                                    disabled={
                                        editLoading
                                    }
                                >
                                    {
                                        editLoading
                                            ? "Updating..."
                                            : "Update Part"
                                    }
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

            {/* =================================================
                STOCK IN MODAL
            ================================================= */}

            {showStockIn &&
                stockInPart && (

                    <div className="modal-overlay">

                        <div className="part-modal">

                            <div className="part-modal-header">

                                <div>

                                    <h3>
                                        Stock In
                                    </h3>

                                    <p>
                                        Add stock to inventory
                                    </p>

                                </div>

                                <button
                                    className="modal-close-button"
                                    onClick={
                                        handleCloseStockIn
                                    }
                                >
                                    ×
                                </button>

                            </div>

                            <div className="stock-in-current">

                                <span>
                                    Part
                                </span>

                                <strong>
                                    {
                                        stockInPart.partName
                                    }
                                </strong>

                                <span>
                                    Current Stock
                                </span>

                                <strong>
                                    {
                                        stockInPart.quantity
                                    }
                                </strong>

                            </div>

                            <form
                                onSubmit={
                                    handleStockIn
                                }
                            >

                                <div className="form-group">

                                    <label>
                                        Quantity to Add
                                    </label>

                                    <input
                                        type="number"
                                        min="1"
                                        step="1"
                                        value={
                                            stockInQuantity
                                        }
                                        onChange={
                                            (event) =>
                                                setStockInQuantity(
                                                    event.target.value
                                                )
                                        }
                                    />

                                </div>

                                {stockInError && (

                                    <div className="create-part-error">

                                        {stockInError}

                                    </div>

                                )}

                                {stockInSuccess && (

                                    <div className="create-part-success">

                                        {stockInSuccess}

                                    </div>

                                )}

                                <div className="part-modal-actions">

                                    <button
                                        type="button"
                                        className="modal-cancel-button"
                                        onClick={
                                            handleCloseStockIn
                                        }
                                        disabled={
                                            stockInLoading
                                        }
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        className="stock-in-submit-button"
                                        disabled={
                                            stockInLoading
                                        }
                                    >
                                        {
                                            stockInLoading
                                                ? "Adding..."
                                                : "Add Stock"
                                        }
                                    </button>

                                </div>

                            </form>

                        </div>

                    </div>

                )}

            {/* =================================================
                STOCK OUT MODAL
            ================================================= */}

            {showStockOut &&
                stockOutPart && (

                    <div className="modal-overlay">

                        <div className="part-modal">

                            <div className="part-modal-header">

                                <div>

                                    <h3>
                                        Stock Out
                                    </h3>

                                    <p>
                                        Remove stock from inventory
                                    </p>

                                </div>

                                <button
                                    className="modal-close-button"
                                    onClick={
                                        handleCloseStockOut
                                    }
                                >
                                    ×
                                </button>

                            </div>

                            <div className="stock-out-current">

                                <span>
                                    Part
                                </span>

                                <strong>
                                    {
                                        stockOutPart.partName
                                    }
                                </strong>

                                <span>
                                    Current Stock
                                </span>

                                <strong>
                                    {
                                        stockOutPart.quantity
                                    }
                                </strong>

                            </div>

                            <form
                                onSubmit={
                                    handleStockOut
                                }
                            >

                                <div className="form-group">

                                    <label>
                                        Quantity to Remove
                                    </label>

                                    <input
                                        type="number"
                                        min="1"
                                        max={
                                            stockOutPart.quantity
                                        }
                                        step="1"
                                        value={
                                            stockOutQuantity
                                        }
                                        onChange={
                                            (event) =>
                                                setStockOutQuantity(
                                                    event.target.value
                                                )
                                        }
                                    />

                                </div>

                                {stockOutError && (

                                    <div className="create-part-error">

                                        {stockOutError}

                                    </div>

                                )}

                                {stockOutSuccess && (

                                    <div className="create-part-success">

                                        {stockOutSuccess}

                                    </div>

                                )}

                                <div className="part-modal-actions">

                                    <button
                                        type="button"
                                        className="modal-cancel-button"
                                        onClick={
                                            handleCloseStockOut
                                        }
                                        disabled={
                                            stockOutLoading
                                        }
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        className="stock-out-submit-button"
                                        disabled={
                                            stockOutLoading
                                        }
                                    >
                                        {
                                            stockOutLoading
                                                ? "Removing..."
                                                : "Remove Stock"
                                        }
                                    </button>

                                </div>

                            </form>

                        </div>

                    </div>

                )}

            {/* =================================================
                VIEW LOADING
            ================================================= */}

            {viewLoading && (

                <div className="modal-overlay">

                    <div className="service-request-loading-modal">

                        <p>
                            Loading part...
                        </p>

                    </div>

                </div>

            )}

        </div>
    );
};

export default Parts;