import axios from "axios";
import React, { useState } from "react";
import { BASE_URL } from "../components/Contant/URL";
import toyotaImg from "../../src/assets/suggestion.jpeg";
import Swal from "sweetalert2";

const initialState = {
  name: "",
  contactNumber: "",
  email: "",
  suggestion: "",
};

export const SuggestionForm = () => {
  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);

  // handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/customer/giveSuggestion`,
        formData
      );
      console.log(res.data);
      setFormData(initialState);
      setLoading(false);

      // Show SweetAlert success message
      Swal.fire({
        icon: "success",
        title: "Thank You!",
        text: "Your suggestion has been submitted successfully",
        confirmButtonColor: "#dc2626",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.log(error);
      setLoading(false);

      // Show SweetAlert error message
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong. Please try again later.",
        confirmButtonColor: "#dc2626",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-start px-4 py-8"
      style={{
        backgroundImage: `url(${toyotaImg})`,
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="lg:w-1/3 w-full bg-white bg-opacity-95 p-6 rounded-lg shadow-lg space-y-5"
      >
        <h2 className="text-3xl font-bold text-gray-800">Send a Suggestion</h2>

        {/* Name */}
        <div>
          <label className="block mb-1 text-sm text-gray-600">Name</label>
          <input
            type="text"
            name="name"
            placeholder="Your full name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-500 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
        </div>

        {/* Contact Number */}
        <div>
          <label className="block mb-1 text-sm text-gray-600">
            Contact Number
          </label>
          <input
            type="tel"
            name="contactNumber"
            placeholder="+92XXXXXXXXX"
            value={formData.contactNumber}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*$/.test(value)) {
                handleChange(e);
              }
            }}
            required
            className="w-full border border-gray-500 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block mb-1 text-sm text-gray-600">Email</label>
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border border-gray-500 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
        </div>

        {/* Suggestion */}
        <div>
          <label className="block mb-1 text-sm text-gray-600">Suggestion</label>
          <textarea
            rows="5"
            name="suggestion"
            placeholder="Type your suggestion..."
            value={formData.suggestion}
            onChange={handleChange}
            required
            className="w-full border border-gray-500 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
        </div>

        {/* Submit Button with Loader */}
        <div className="flex items-center justify-center">
          <button
            disabled={loading}
            type="submit"
            className="bg-red-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-yellow-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading && (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            )}
            {loading ? "Submitting..." : "Send Suggestion"}
          </button>
        </div>
      </form>
    </div>
  );
};