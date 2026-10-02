import {BrowserRouter, Routes,Route, Navigate,} from "react-router-dom";
import RoleRoute from "./RoleRoute";

import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import Dashboard from "../pages/Dashboard";
import WorkOrders from "../pages/WorkOrders";
import ServiceRequests from "../pages/ServiceRequests";
import Parts from "../pages/Parts";
import Technicians from "../pages/Technicians";
import Reports from "../pages/Reports";
import TimeTracking from "../pages/TimeTracking";
import SLA from "../pages/SLA";
import UserManagement from "../pages/UserManagement";
import CustomerPortal from "../pages/CustomerPortal";

import NonCustomerRoute from "./NonCustomerRoute";
import ProtectedRoute from "./ProtectedRoute";
import PermissionRoute from "./PermissionRoute";
import MainLayout from "../layouts/MainLayout";

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>

                {/* ========================= */}
                {/* PUBLIC ROUTES */}
                {/* ========================= */}

                <Route
                    path="/"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/forgot-password"
                    element={<ForgotPassword />}
                />

                <Route
                    path="/reset-password"
                    element={<ResetPassword />}
                />


                {/* ========================= */}
                {/* PROTECTED ROUTES */}
                {/* ========================= */}

                <Route element={<ProtectedRoute />}>

                    <Route element={<MainLayout />}>

                        {/* DASHBOARD */}

						<Route
						    element={
						        <NonCustomerRoute />
						    }
						>
						    <Route
						        element={
						            <PermissionRoute
						                permission="VIEW_DASHBOARD"
						            />
						        }
						    >
						        <Route
						            path="/dashboard"
						            element={<Dashboard />}
						        />
						    </Route>
						</Route>
						
						<Route
						    element={
						        <PermissionRoute
						            permission="MANAGE_USERS"
						        />
						    }
						>
						    <Route
						        path="/users"
						        element={<UserManagement />}
						    />
						</Route>


                        {/* WORK ORDERS */}

						<Route
						    element={
						        <PermissionRoute
						            permission="VIEW_WORK_ORDER"
						        />
						    }
						>
						    <Route
						        path="/service-requests"
						        element={<ServiceRequests />}
						    />
						</Route>

						<Route
						    element={
						        <NonCustomerRoute />
						    }
						>
						    <Route
						        element={
						            <PermissionRoute
						                permission="VIEW_WORK_ORDER"
						            />
						        }
						    >
						        <Route
						            path="/work-orders"
						            element={<WorkOrders />}
						        />

						        <Route
						            path="/technicians"
						            element={<Technicians />}
						        />
						    </Route>
						</Route>
						
						
						<Route
						    element={
						        <RoleRoute role="CUSTOMER" />
						    }
						>
						    <Route
						        path="/customer-portal"
						        element={<CustomerPortal />}
						    />
						</Route>


                        {/* PARTS */}

						<Route
						    element={
						        <NonCustomerRoute />
						    }
						>
						    <Route
						        element={
						            <PermissionRoute
						                permission="MANAGE_PARTS"
						            />
						        }
						    >
						        <Route
						            path="/parts"
						            element={<Parts />}
						        />
						    </Route>
						</Route>


                        {/* REPORTS */}

						<Route
						    element={
						        <NonCustomerRoute />
						    }
						>
						    <Route
						        element={
						            <PermissionRoute
						                permission="VIEW_REPORTS"
						            />
						        }
						    >
						        <Route
						            path="/reports"
						            element={<Reports />}
						        />
						    </Route>
						</Route>


                        {/* TIME TRACKING */}

						<Route
						    element={
						        <NonCustomerRoute />
						    }
						>
						    <Route
						        element={
						            <PermissionRoute
						                permission="TRACK_TIME"
						            />
						        }
						    >
						        <Route
						            path="/time-tracking"
						            element={<TimeTracking />}
						        />
						    </Route>
						</Route>


                        {/* SLA MANAGEMENT */}

						<Route
						    element={
						        <NonCustomerRoute />
						    }
						>
						    <Route
						        element={
						            <PermissionRoute
						                permission="VIEW_DASHBOARD"
						            />
						        }
						    >
						        <Route
						            path="/sla"
						            element={<SLA />}
						        />
						    </Route>
						</Route>

                    </Route>

                </Route>


                {/* ========================= */}
                {/* UNKNOWN URL */}
                {/* ========================= */}

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/"
                            replace
                        />
                    }
                />

            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;