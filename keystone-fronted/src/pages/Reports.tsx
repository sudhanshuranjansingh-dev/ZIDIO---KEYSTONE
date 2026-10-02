import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";
import "./Reports.css";

interface ReportData {
    totalWorkOrders: number;
    openWorkOrders: number;
    assignedWorkOrders: number;
    inProgressWorkOrders: number;
    onHoldWorkOrders: number;
    completedWorkOrders: number;
    totalTechnicians: number;
    totalCustomers: number;
    totalParts: number;
    totalServiceRequests: number;
}

const Reports = () => {
    const [report, setReport] = useState<ReportData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadReport = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await apiClient.get<ReportData>(
                "/api/reports/summary"
            );

            setReport(response.data);
        } catch (err) {
            console.error(err);
            setError("Failed to load report data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadReport();
    }, []);

    if (loading) {
        return (
            <div className="reports-page">
                <div className="reports-header">
                    <div>
                        <h2>Reports</h2>
                        <p>KEYSTONE system reports and statistics</p>
                    </div>
                </div>

                <div className="report-message">
                    Loading report data...
                </div>
            </div>
        );
    }

    if (error || !report) {
        return (
            <div className="reports-page">
                <div className="reports-header">
                    <div>
                        <h2>Reports</h2>
                        <p>KEYSTONE system reports and statistics</p>
                    </div>
                </div>

                <div className="report-error">
                    {error || "No report data available."}
                </div>

                <button
                    className="refresh-button"
                    onClick={loadReport}
                >
                    🔄 Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="reports-page">

            <div className="reports-header">
                <div>
                    <h2>Reports</h2>
                    <p>
                        Overview of KEYSTONE field service operations
                    </p>
                </div>

                <button
                    className="refresh-button"
                    onClick={loadReport}
                >
                    🔄 Refresh
                </button>
            </div>

            <div className="report-section">
                <h3>Work Order Summary</h3>

                <div className="report-cards">

                    <div className="report-card">
                        <div className="report-icon">📋</div>
                        <div>
                            <span>Total Work Orders</span>
                            <strong>{report.totalWorkOrders}</strong>
                        </div>
                    </div>

                    <div className="report-card">
                        <div className="report-icon">🟢</div>
                        <div>
                            <span>Open</span>
                            <strong>{report.openWorkOrders}</strong>
                        </div>
                    </div>

                    <div className="report-card">
                        <div className="report-icon">👤</div>
                        <div>
                            <span>Assigned</span>
                            <strong>{report.assignedWorkOrders}</strong>
                        </div>
                    </div>

                    <div className="report-card">
                        <div className="report-icon">🔧</div>
                        <div>
                            <span>In Progress</span>
                            <strong>{report.inProgressWorkOrders}</strong>
                        </div>
                    </div>

                    <div className="report-card">
                        <div className="report-icon">⏸️</div>
                        <div>
                            <span>On Hold</span>
                            <strong>{report.onHoldWorkOrders}</strong>
                        </div>
                    </div>

                    <div className="report-card">
                        <div className="report-icon">✅</div>
                        <div>
                            <span>Completed</span>
                            <strong>{report.completedWorkOrders}</strong>
                        </div>
                    </div>

                </div>
            </div>

            <div className="report-section">
                <h3>System Summary</h3>

                <div className="report-cards">

                    <div className="report-card">
                        <div className="report-icon">👨‍🔧</div>
                        <div>
                            <span>Technicians</span>
                            <strong>{report.totalTechnicians}</strong>
                        </div>
                    </div>

                    <div className="report-card">
                        <div className="report-icon">👥</div>
                        <div>
                            <span>Customers</span>
                            <strong>{report.totalCustomers}</strong>
                        </div>
                    </div>

                    <div className="report-card">
                        <div className="report-icon">📦</div>
                        <div>
                            <span>Parts</span>
                            <strong>{report.totalParts}</strong>
                        </div>
                    </div>

                    <div className="report-card">
                        <div className="report-icon">🔧</div>
                        <div>
                            <span>Service Requests</span>
                            <strong>{report.totalServiceRequests}</strong>
                        </div>
                    </div>

                </div>
            </div>

            <div className="report-section">
                <h3>Work Order Completion</h3>

                <div className="completion-box">

                    <div className="completion-info">
                        <span>Completed Work Orders</span>

                        <strong>
                            {report.completedWorkOrders}
                            {" / "}
                            {report.totalWorkOrders}
                        </strong>
                    </div>

                    <div className="progress-bar">
                        <div
                            className="progress-fill"
                            style={{
                                width:
                                    report.totalWorkOrders > 0
                                        ? `${Math.round(
                                            (report.completedWorkOrders /
                                                report.totalWorkOrders) *
                                            100
                                        )}%`
                                        : "0%",
                            }}
                        />
                    </div>

                    <div className="completion-percentage">
                        {report.totalWorkOrders > 0
                            ? Math.round(
                                (report.completedWorkOrders /
                                    report.totalWorkOrders) *
                                100
                            )
                            : 0}
                        % completed
                    </div>

                </div>
            </div>

        </div>
    );
};

export default Reports;