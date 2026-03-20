import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  return isAuthenticated ? <Outlet/>: <Navigate to="/login" />;
};

export default ProtectedRoute;
