import { Navigate, useRoutes } from "react-router-dom";
import React, { lazy, Suspense } from "react";
import Login from "./Login/SignUp";
import NotFound from "./NotFound";
import ProtectedRoute from "./ProtectedRoute";
import { getUserRole } from "./utils/auth";

const SupervisorDashboard = lazy(() => import("./Supervisor Assist/Components/SupervisorDashboard"));
const AgentDashboard = lazy(()=> import("./Agent Assist/Components/AgentDashboard"));
// Define role-based routes
const ROUTES = {
  AGENT: [
    { path: "/login", element: <Login /> },
    {
      element: <ProtectedRoute allowedRoles={["AGENT"]} />,
      children: [
        { path: "/calls", element: <SupervisorDashboard /> },
        { path: "/agent-dashboard", element: <AgentDashboard /> },
        { path: "/agent/agent-dashboard", element: <AgentDashboard /> },
      ],
    },
    { path: "/", element: <Navigate to="/agent-dashboard" replace /> },
    { path: "*", element: <NotFound /> },
  ],
  MANAGER: [
    { path: "/login", element: <Login /> },
    {
      element: <ProtectedRoute allowedRoles={["MANAGER"]} />,
      children: [
        { path: "/calls", element: <SupervisorDashboard /> },
        { path: "/supervisor/agent-dashboard", element: <AgentDashboard /> },
      ],
    },
    { path: "/", element: <Navigate to="/calls" replace /> },
    { path: "*", element: <NotFound /> },
  ],
  UNAUTHORIZED: [
    { path: "/login", element: <Login /> },
    { path: "/", element: <Navigate to="/login" replace /> },
    { path: "*", element: <NotFound /> },
  ],
};

// Function to get the appropriate routes based on user role
const getRoutes = () => ROUTES[getUserRole()] || ROUTES.UNAUTHORIZED;

export default function Router() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {useRoutes(getRoutes())}
    </Suspense>
  );
}
