import axios from "axios";
import React, { useEffect, useState } from "react";

import { BASE_URL } from "./Contant/URL";
import { useDispatch } from "react-redux";
import { authSuccess } from "./Redux/UserSlice";
import { validationUser } from "./Redux/EmailSlice";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const initialState = {
  name: "",
  email: "",
  password: "",
  role: "customer",
};

export const EmailSignUpModal = ({ handleModal }) => {
  const [formData, setFormData] = useState(initialState);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      
    const gmailRegex = /^[a-zA-Z0-9](\.?[a-zA-Z0-9]){0,}@gmail\.com$/;


    if (!gmailRegex.test(formData.email)) {
      Swal.fire({
        title: "Invalid Email",
        text: "Please enter a valid Email address.",
        icon: "error",
        confirmButtonColor: "#9333ea",
      });
      return;
    }

    if (!passwordRegex.test(formData.password)) {
      setError(
        "Password must be at least 8 characters long and include uppercase, lowercase, numbers, and a special character."
      );
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        `${BASE_URL}/customer/registerEmailVerification`,
        formData
      );

      setFormData(initialState);
      dispatch(validationUser(res.data));
      setLoading(false);
      setError("");
      const result = await Swal.fire({
        title: "Success",
        text: "Please Check your Email for verification.",
        icon: "success",
        confirmButtonColor: "#9333ea",
        confirmButtonText: "Okay",
      });

      if (!result.isConfirmed) return;
    } catch (err) {
      console.log(err);
      setLoading(false);
      Swal.fire({
        title: "Error",
        text: err.response.data.message,
        icon: "error",
        confirmButtonColor: "#9333ea",
      });
    }
  };
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="fixed inset-0 backdrop-blur-sm  flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-[28rem] relative h-[35rem]">
        {/* Close Button */}
        <button
          onClick={() => handleModal("")}
          className="absolute top-6 right-7 font-bold text-gray-600 hover:text-red-500"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center ">
          Register With Your Email
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="flex   gap-4">
            <label className="block mb-2 text-gray-700 font-semibold">
              Select Role
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="role"
                value="customer"
                checked={formData.role === "customer"}
                onChange={handleChange}
                className="h-4 w-4 accent-blue-950"
                required
              />
              <span>Customer</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="role"
                value="seller"
                checked={formData.role === "seller"}
                onChange={handleChange}
                className="h-4 w-4 accent-blue-950"
                required
              />
              <span>Seller</span>
            </label>
          </div>

          {/* Username */}
          <div className="mb-4">
            <label className="block mb-1 text-gray-700 font-semibold">
              Username
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your Full Name"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block mb-1 text-gray-700 font-semibold">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter Your Email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="block mb-1 text-gray-700 font-semibold">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter Your Password"
              className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none  ${
                error
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-300 focus:ring-blue-900"
              }`}
              required
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>

          {/* Sign Up Button */}
          <button
            disabled={loading}
            className="w-full bg-blue-950 hover:bg-blue-900 text-white font-semibold py-3 rounded-lg "
          >
            {loading ? "Loading..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
};
