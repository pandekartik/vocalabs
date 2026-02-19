import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getUserRole, isAuthenticated } from "./utils/auth";

const ProtectedRoute = ({ allowedRoles }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  const userRole = getUserRole();
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/not-found" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
