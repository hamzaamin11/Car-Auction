import { Navigate } from 'react-router-dom';

const SellerProtectedRoute = ({ children }) => {
  const isSeller = localStorage.getItem("isSeller") === "true"; // Check seller flag

  return isSeller ? children : <Navigate to="/login" />; // Redirect to seller login
};

export default SellerProtectedRoute;