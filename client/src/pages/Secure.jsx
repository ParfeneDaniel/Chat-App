import React from "react";
import { useAuthContext } from "../contexts/AuthContext";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const Secure = () => {
  const { isAuth } = useAuthContext();
  const location = useLocation();

  return isAuth ? (
    <Outlet />
  ) : (
    <Navigate to="/signin" state={{ from: location }} replace />
  );
};

export default Secure;
