import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BASE_URL } from "../components/Contant/URL";
import { useSelector } from "react-redux";

const ValidationEmail = () => {
  const { userData } = useSelector((state) => state?.emailValidation);

  const [loadingCheck, setLoadingCheck] = useState(false);

  const id = userData?.id;

  const navigate = useNavigate();

  const handleValidationEmail = async () => {
    try {
      const res = await axios.post(`${BASE_URL}/customer/verifyEmail/${id}`);
      console.log(res.data);
      toast.success(res.data);
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <ToastContainer position="top-center" />
      <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-8">
        <h1 className="text-2xl font-semibold text-gray-800 text-center mb-4">
          Are you verified your email?
        </h1>

        <p className="text-sm text-gray-600 text-center mb-6">
          If you have already verified your email, click{" "}
          <strong>Check Verification</strong>?
        </p>

        <div className="space-y-3">
          <button
            onClick={handleValidationEmail}
            disabled={loadingCheck}
            className={`w-full flex items-center justify-center gap-3 py-3 rounded-lg font-medium transition
              ${
                loadingCheck
                  ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-700 to-blue-800 text-white hover:from-blue-600 hover:to-blue-900 hover:cursor-pointer"
              }`}
          >
            {loadingCheck ? "Checking..." : "Check Verification"}
          </button>

          <button
            onClick={() => navigate("/login")}
            className="w-full text-center mt-1 text-sm text-blue-600 hover:underline hover:cursor-pointer"
            type="button"
          >
            Back to login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ValidationEmail;
