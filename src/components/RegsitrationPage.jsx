/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { BASE_URL } from "./Contant/URL";

const RegistrationPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    cnic: "",
    email: "",
    password: "",
    confirmPassword: "",
    contact: "",
    address: "",
    postcode: "",
    role: "",
    image: null,
    consent: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (name === "image") {
      setFormData((prev) => ({ ...prev, image: files[0] }));
    } else if (name === "consent") {
      setFormData((prev) => ({ ...prev, consent: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handlePhoneChange = (value) => {
    setFormData((prev) => ({ ...prev, contact: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!formData.consent) {
      toast.error("You must agree to the terms.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("cnic", formData.cnic);
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("address", formData.address);
    data.append("contact", formData.contact);
    data.append("postcode", formData.postcode);
    data.append("role", formData.role);
    if (formData.image) data.append("image", formData.image);

    const apiUrl =
      formData.role === "seller"
        ? `${BASE_URL}/register`
        : `${BASE_URL}/register`;

    try {
      const response = await axios.post(apiUrl, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Registered successfully!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed.");
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-start px-4 py-8"
      style={{
        backgroundImage:
          "url('https://t4.ftcdn.net/jpg/07/98/14/53/360_F_798145314_GftvLXWuBwUX1wQLGlXjaIsLPVsx7pUU.jpg')",
      }}
    >
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="p-8 md:p-10 max-w-2xl w-full rounded shadow ml-4">
        <h2 className="text-3xl font-bold text-[#222] mb-6">
          Create Your Account
        </h2>
        <form onSubmit={handleRegister} className="grid gap-6 md:grid-cols-2">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none"
            />
          </div>

          {/* CNIC */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CNIC
            </label>
            <input
              type="text"
              name="cnic"
              value={formData.cnic}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact
            </label>
            <PhoneInput
              country={"pk"}
              value={formData.contact}
              onChange={handlePhoneChange}
              inputStyle={{
                width: "100%",
                height: "42px",
                borderRadius: "8px",
                border: "1px solid ##808080",
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Post Code
            </label>
            <input
              type="text"
              name="postcode"
              value={formData.postcode}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none"
            />
          </div>

          {/* Select Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-white focus:outline-none"
            >
              <option value="">Choose</option>
              <option value="customer">Customer</option>
              <option value="seller">Seller</option>
            </select>
          </div>

          {/* Upload Picture */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Picture
            </label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-600 rounded-lg focus:outline-none"
            />
          </div>

          <div className="md:col-span-2 flex items-center">
            <input
              type="checkbox"
              name="consent"
              checked={formData.consent}
              onChange={handleChange}
              id="consent"
            />
            <label htmlFor="consent" className="ml-2 text-sm text-gray-600">
              I confirm I'm 18+ and agree to terms.
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="md:col-span-2 w-full bg-[#518ecb] text-white py-2 rounded-lg hover:bg-[#b73439] transition"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationPage;
