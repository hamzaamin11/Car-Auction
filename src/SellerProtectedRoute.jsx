import { useSelector } from "react-redux";

import { Navigate } from "react-router-dom";

const SellerProtectedRoute = ({ children }) => {
  const { currentUser } = useSelector((state) => state?.auth);

  console.log( "hamzamzmazmas",currentUser );

  return currentUser?.role === "seller" ? children : <Navigate to="/login" />; // Redirect to seller login
};

export default SellerProtectedRoute;
