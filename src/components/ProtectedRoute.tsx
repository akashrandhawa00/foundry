import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute() {
    const { user, loading } = useAuth();

    if (loading)
        return (
            <div className="flex h-dvh items-center justify-center">
                <div className="text-lg animate-pulse">Loading...</div>
            </div>
        );
    if (!user) return <Navigate to="/login" replace />;

    return <Outlet />;
}
