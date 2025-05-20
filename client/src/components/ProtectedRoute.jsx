import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = () => {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Force remount when path changes
  return <Outlet key={location.pathname} />;
};

export default ProtectedRoute;
