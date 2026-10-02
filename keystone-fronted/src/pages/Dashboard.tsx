import { useEffect, useState } from "react";

import apiClient from "../api/apiClient";

import "./Dashboard.css";

interface DashboardData {
    totalWorkOrders: number;
    openWorkOrders: number;
    inProgressWorkOrders: number;
    completedWorkOrders: number;
    assignedWorkOrders: number;
    onHoldWorkOrders: number;
    totalTechnicians: number;
    totalCustomers: number;
    totalParts: number;
    totalServiceRequests: number;
    openServiceRequests: number;
    lowStockParts: number;
}

const Dashboard = () => {

    const [dashboardData, setDashboardData] =
        useState<DashboardData | null>(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const loadDashboard = async () => {

        setLoading(true);
        setError("");

        try {

            const response = await apiClient.get(
                "/api/dashboard/work-orders"
            );

            setDashboardData(response.data);

        } catch (err) {

            console.error(err);

            setError(
                "Failed to load dashboard data."
            );

        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {
        loadDashboard();
    }, []);

    if (loading) {

        return (
            <div className="dashboard">

                <div className="dashboard-loading">

                    <div className="loading-spinner"></div>

                    <h2>Loading Dashboard</h2>

                    <p>
                        Please wait while we load your
                        field service information...
                    </p>

                </div>

            </div>
        );
    }

    if (error) {

        return (
            <div className="dashboard">

                <div className="dashboard-error-box">

                    <h2>Dashboard</h2>

                    <p>{error}</p>

                    <button
                        onClick={loadDashboard}
                        className="dashboard-retry"
                    >
                        🔄 Try Again
                    </button>

                </div>

            </div>
        );
    }

    return (
        <div className="dashboard">

            {/* Header */}

            <div className="dashboard-header">

                <div>

                    <h2>Dashboard</h2>

                    <p>
                        Overview of your field service
                        operations
                    </p>

                </div>

                <button
                    className="dashboard-refresh"
                    onClick={loadDashboard}
                >
                    🔄 Refresh
                </button>

            </div>

            {/* Main Statistics */}

            <div className="dashboard-cards">

                <div className="dashboard-card">

                    <div className="card-icon">
                        📋
                    </div>

                    <div className="card-content">

                        <div className="card-title">
                            Total Work Orders
                        </div>

                        <div className="card-value">
                            {dashboardData?.totalWorkOrders ?? 0}
                        </div>

                    </div>

                </div>

                <div className="dashboard-card">

                    <div className="card-icon">
                        🔓
                    </div>

                    <div className="card-content">

                        <div className="card-title">
                            Open Work Orders
                        </div>

                        <div className="card-value">
                            {dashboardData?.openWorkOrders ?? 0}
                        </div>

                    </div>

                </div>

                <div className="dashboard-card">

                    <div className="card-icon">
                        👨‍🔧
                    </div>

                    <div className="card-content">

                        <div className="card-title">
                            Technicians
                        </div>

                        <div className="card-value">
                            {dashboardData?.totalTechnicians ?? 0}
                        </div>

                    </div>

                </div>

                <div className="dashboard-card">

                    <div className="card-icon">
                        📦
                    </div>

                    <div className="card-content">

                        <div className="card-title">
                            Parts
                        </div>

                        <div className="card-value">
                            {dashboardData?.totalParts ?? 0}
                        </div>

                    </div>

                </div>

            </div>

            {/* Customer & Service Statistics */}

            <div className="dashboard-cards">

                <div className="dashboard-card">

                    <div className="card-icon">
                        👥
                    </div>

                    <div className="card-content">

                        <div className="card-title">
                            Customers
                        </div>

                        <div className="card-value">
                            {dashboardData?.totalCustomers ?? 0}
                        </div>

                    </div>

                </div>

                <div className="dashboard-card">

                    <div className="card-icon">
                        🔧
                    </div>

                    <div className="card-content">

                        <div className="card-title">
                            Service Requests
                        </div>

                        <div className="card-value">
                            {dashboardData?.totalServiceRequests ?? 0}
                        </div>

                    </div>

                </div>

                <div className="dashboard-card">

                    <div className="card-icon">
                        📬
                    </div>

                    <div className="card-content">

                        <div className="card-title">
                            Open Service Requests
                        </div>

                        <div className="card-value">
                            {dashboardData?.openServiceRequests ?? 0}
                        </div>

                    </div>

                </div>

                <div className="dashboard-card">

                    <div className="card-icon">
                        ⚠️
                    </div>

                    <div className="card-content">

                        <div className="card-title">
                            Low Stock Parts
                        </div>

                        <div className="card-value">
                            {dashboardData?.lowStockParts ?? 0}
                        </div>

                    </div>

                </div>

            </div>

            {/* Work Order Status */}

            <div className="dashboard-section">

                <div className="section-header">

                    <div>

                        <h3>
                            Work Order Status
                        </h3>

                        <p>
                            Current status of all work orders
                        </p>

                    </div>

                </div>

                <div className="status-grid">

                    <div className="status-card">

                        <span className="status-icon">
                            🔄
                        </span>

                        <div>

                            <span>
                                In Progress
                            </span>

                            <strong>
                                {
                                    dashboardData
                                        ?.inProgressWorkOrders ?? 0
                                }
                            </strong>

                        </div>

                    </div>

                    <div className="status-card">

                        <span className="status-icon">
                            ✅
                        </span>

                        <div>

                            <span>
                                Completed
                            </span>

                            <strong>
                                {
                                    dashboardData
                                        ?.completedWorkOrders ?? 0
                                }
                            </strong>

                        </div>

                    </div>

                    <div className="status-card">

                        <span className="status-icon">
                            👤
                        </span>

                        <div>

                            <span>
                                Assigned
                            </span>

                            <strong>
                                {
                                    dashboardData
                                        ?.assignedWorkOrders ?? 0
                                }
                            </strong>

                        </div>

                    </div>

                    <div className="status-card">

                        <span className="status-icon">
                            ⏸️
                        </span>

                        <div>

                            <span>
                                On Hold
                            </span>

                            <strong>
                                {
                                    dashboardData
                                        ?.onHoldWorkOrders ?? 0
                                }
                            </strong>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default Dashboard;