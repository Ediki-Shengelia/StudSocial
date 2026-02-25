import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";
import { path } from "./path";
export default function GuestRoute({ children }) {
  const { user } = useContext(AuthContext);

  // if (loading) return null; // or loading spinner

  if (user) {
    return <Navigate to={path.dashboard} replace />;
  }

  return children;
}