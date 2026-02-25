import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { path } from "../routes/path";
import { PacmanLoader } from "react-spinners";
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <PacmanLoader />;
  if (!user) return <Navigate to={path.login} replace />;
  return children;
};

export default ProtectedRoute;
