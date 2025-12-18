import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export const CustomerProtectedRoute = () => {
  const { currentUser } = useSelector((state) => state.auth);

  // Admin ya Seller ko block karo

  // Admin → Admin Dashboard
  if (currentUser?.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  // Seller → Seller Dashboard
  if (currentUser?.role === "seller") {
    return <Navigate to="/seller/dashboard" replace />;
  }

  // Customer OR null (not logged in) ko allow
  return <Outlet />;
};
