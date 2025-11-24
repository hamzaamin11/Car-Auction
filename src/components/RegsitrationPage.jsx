/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { BASE_URL } from "./Contant/URL";
import LoginImage from "../../src/assets/copart3.jpg";
import CustomButton from "../../src/CustomButton";
import Swal from "sweetalert2";

const RegistrationPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    contact: "",
    role: "customer",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    setError("");
  };

  const handlePhoneChange = (value) => {
    setFormData((prev) => ({ ...prev, contact: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{0,}$/;

    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!formData.contact || formData.contact.trim() === "") {
      toast.error("Please enter your contact number");
      return;
    }

    if (!passwordRegex.test(formData.password)) {
      setError(
        "Password must be at least 8 characters long and include uppercase, lowercase, numbers, and a special character."
      );
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("contact", formData.contact);
    data.append("role", formData.role);

    try {
      await axios.post(`${BASE_URL}/register`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Registered successfully!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.response.data.message,
        icon: "error",
        confirmButtonColor: "#9333ea",
      });
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center px-4"
      style={{ backgroundImage: `url(${LoginImage})` }}
    >
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Smaller Form */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl  max-w-md w-full h-[35rem] my-5 p-8">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Create Account
        </h2>

        <form onSubmit={handleRegister} className="space-y-2">
          {/* Role Selection */}
          <div className="md:col-span-2">
            <div className="flex gap-4">
              <label className="block font-semibold text-gray-800  ">
                Select Role
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="role"
                  value="customer"
                  checked={formData.role === "customer"}
                  onChange={handleChange}
                  className="mr-2 accent-blue-950"
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
                  className="mr-2 accent-blue-950  "
                />
                Seller
              </label>
            </div>
          </div>
          {/* Full Name */}
          <div>
            <label className="block  font-semibold text-gray-800 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Please Enter Your Full Name"
              required
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:outline-none text-sm "
            />
          </div>

          {/* Email */}
          <div>
            <label className="block  font-semibold text-gray-800 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="PLease Enter Your Email"
              required
              className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:outline-none text-sm 
        `}
            />
          </div>

          {/* Contact */}
          <div>
            <label className="block font-semibold text-gray-800 mb-1">
              Contact
            </label>
            <PhoneInput
              country={"pk"}
              value={formData.contact}
              onChange={handlePhoneChange}
              inputStyle={{
                width: "100%",
                height: "40px",
                fontSize: "14px",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
              }}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block font-semibold text-gray-800 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Please Enter Your Password"
              required
              className={`w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:outline-none text-sm   ${
                error
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-300 focus:ring-blue-900"
              }`}
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>

          {/* Submit */}
          <CustomButton text="Register" />
        </form>
      </div>
    </div>
  );
};

export default RegistrationPage;
