import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute() {
    const { user, isLoading } = useAuth();

    if (isLoading)
        return (
            <div className="flex h-dvh items-center justify-center">
                <div className="font-semibold">
                    <p className="text-lg text-neutral-300">Loading...</p>
                </div>
            </div>
        );
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}
