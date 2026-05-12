import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../../store/AuthContext"

export default function ProtectedRoute() {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-950">
                <div className="w-8 h-8 border-2 border-blue-500 rounded-full border-t-transparent animate-spin" />
            </div>
        )
    }
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}