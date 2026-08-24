import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function AdminProtectedRoute({ children }) {

    const { token, user } = useSelector(
        state => state.auth
    );

    if (!token) {
        return <Navigate to="/" replace />;
    }

    if (user?.role !== "admin") {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}

export default AdminProtectedRoute;