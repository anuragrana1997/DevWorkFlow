import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Login } from "../pages/Login";

export const ProtectedRoute = () => {
    const { isAuthenticated } = useAuth();

    if(!isAuthenticated) {
        return <Navigate to="/login" />
    }

    return <Outlet />
}
