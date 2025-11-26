/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import axios from "axios";
import Swal from "sweetalert2"; // SweetAlert2 added
import { BASE_URL } from "./Contant/URL";
import LoginImage from "../../src/assets/copart3.jpg";

const RegistrationWithEmail = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    contact: "", // kept if you plan to add phone later
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("contact", formData.contact || "");
    data.append("role", formData.role);

    try {
      await axios.post(`${BASE_URL}/register`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      await Swal.fire({
        title: "Success!",
        text: "Registered successfully!",
        icon: "success",
        confirmButtonColor: "#1d4ed8",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      });

      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);

      Swal.fire({
        title: "Registration Failed",
        text: error.response?.data?.message || "Please check your details and try again.",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center px-4"
      style={{ backgroundImage: `url(${LoginImage})` }}
    >
      {/* Smaller Form */}
      <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-2xl font-extrabold text-[#222] text-center mb-6">
          Create Account
        </h2>

        <form onSubmit={handleRegister} className="space-y-2">
          {/* Role Selection */}
          <div className="md:col-span-2">
            <div className="flex gap-4 flex-wrap">
              <span className="block text-sm font-bold text-gray-700">Select Role</span>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="role"
                  value="customer"
                  checked={formData.role === "customer"}
                  onChange={handleChange}
                  className="mr-2"
                  required
                />
                Customer
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="role"
                  value="seller"
                  checked={formData.role === "seller"}
                  onChange={handleChange}
                  className="mr-2"
                  required
                />
                Seller
              </label>
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="John Doe"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:outline-none text-sm"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:outline-none text-sm"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:outline-none text-sm"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-950 hover:bg-blue-900 text-white font-semibold py-3 rounded-lg shadow-md transition duration-200 text-sm"
          >
            Register
          </button>
        </form>

        <p className="text-center text-xs text-gray-600 mt-6">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-600 font-semibold cursor-pointer hover:underline"
          >
            Login here
          </span>
        </p>
      </div>
    </div>
  );
};

export default RegistrationWithEmail;