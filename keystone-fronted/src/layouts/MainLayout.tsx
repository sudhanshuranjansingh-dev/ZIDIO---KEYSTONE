import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./MainLayout.css";

const MainLayout = () => {
    const navigate = useNavigate();

    const { role, permissions, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const hasPermission = (permission: string) => {
        return permissions.includes(permission);
    };

    return (
        <div className="layout">

            <aside className="sidebar">

                <div className="sidebar-logo">
                    <h2>KEYSTONE</h2>
                    <span>
                        Field Service Management
                    </span>
                </div>

                <nav className="sidebar-menu">

                    {/* DASHBOARD */}

					{role !== "CUSTOMER" &&
					    hasPermission("VIEW_DASHBOARD") && (
					        <Link
					            to="/dashboard"
					            className="menu-item"
					        >
					            🏠 Dashboard
					        </Link>
					    )}


                    {/* WORK ORDERS */}

					{role !== "CUSTOMER" &&
					    hasPermission("VIEW_WORK_ORDER") && (
					        <Link
					            to="/work-orders"
					            className="menu-item"
					        >
					            📋 Work Orders
					        </Link>
					    )}


                    {/* SERVICE REQUESTS */}

                    {hasPermission("VIEW_WORK_ORDER") && (
                        <Link
                            to="/service-requests"
                            className="menu-item"
                        >
                            🔧 Service Requests
                        </Link>
                    )}
					
					{role === "CUSTOMER" && (

					    <Link
					        to="/customer-portal"
					        className="menu-item"
					    >
					        👤 Customer Portal
					    </Link>

					)}


                    {/* PARTS */}

					{role !== "CUSTOMER" &&
					    hasPermission("MANAGE_PARTS") && (
					        <Link
					            to="/parts"
					            className="menu-item"
					        >
					            📦 Parts & Inventory
					        </Link>
					  )}

                    {/* TECHNICIANS */}

					{role !== "CUSTOMER" &&
					    hasPermission("VIEW_WORK_ORDER") && (
					        <Link
					            to="/technicians"
					            className="menu-item"
					        >
					            👨‍🔧 Technicians
					        </Link>
					    )}


                    {/* TIME TRACKING */}

					{role !== "CUSTOMER" &&
					    hasPermission("TRACK_TIME") && (
					        <Link
					            to="/time-tracking"
					            className="menu-item"
					        >
					            ⏱️ Time Tracking
					        </Link>
					    )}


                    {/* SLA MANAGEMENT */}

					{role !== "CUSTOMER" &&
					    hasPermission("VIEW_DASHBOARD") && (
					        <Link
					            to="/sla"
					            className="menu-item"
					        >
					            ⏰ SLA Management
					        </Link>
					    )}


                    {/* REPORTS */}

					{role !== "CUSTOMER" &&
					    hasPermission("VIEW_REPORTS") && (
					        <Link
					            to="/reports"
					            className="menu-item"
					        >
					            📊 Reports
					        </Link>
					    )}
					
					{hasPermission("MANAGE_USERS") && (
					    <Link
					        to="/users"
					        className="menu-item"
					    >
					        👥 User Management
					    </Link>
					)}

                </nav>


                <div className="sidebar-bottom">

                    <button
                        className="logout-button"
                        onClick={handleLogout}
                    >
                        🚪 Logout
                    </button>

                </div>

            </aside>


            <div className="main-area">

                <header className="topbar">

                    <h1>
                        KEYSTONE
                    </h1>

                    <div className="user-info">
                        👤 {role || "User"}
                    </div>

                </header>


                <main className="content">

                    <Outlet />

                </main>

            </div>

        </div>
    );
};

export default MainLayout;