import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useSelector((state) => state?.auth);

  return currentUser?.role === "admin" ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
