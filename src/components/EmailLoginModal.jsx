import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { EmailSignUpModal } from "./EmailSignUpModal";

export const EmailLoginModal = ({ handleModal }) => {
  const [isOpen, setIsOpen] = useState(false);

  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = () => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = () => {
    if (!formData.email || !formData.password) {
      alert("Please fill in all fields");
      return;
    }
    console.log("Logging in with:", formData);
    // yahan API call kar sakte ho

    setFormData({ email: "", password: "" });
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div>
      <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm relative">
          {/* Close Button */}
          <button
            className="absolute top-3 right-3 text-gray-600 hover:text-black"
            onClick={() => handleModal()}
          >
            ✕
          </button>
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Login with Email
          </h2>

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
              placeholder="Enter your email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
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
              placeholder="Enter your password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Buttons */}
          <button
            onClick={handleLogin}
            className="w-full bg-blue-700 text-white font-semibold py-3 rounded-lg hover:bg-blue-800 transition"
          >
            Login
          </button>

          {/* Footer */}
          <p className="mt-6 text-center text-gray-700">
            Don’t have an account?{" "}
            <button
              onClick={() => setIsOpen(true)}
              className="text-blue-600 hover:underline font-medium"
            >
              Sign up
            </button>
          </p>

          {/* Close Button */}
        </div>
      </div>

      {isOpen && <EmailSignUpModal setIsOpen={setIsOpen} />}
    </div>
  );
};
