import axios from "axios";
import React, { useState } from "react";
import { BASE_URL } from "../components/Contant/URL";
import toyotaImg from "../../src/assets/suggestion.jpeg";

const initialState = {
  name: "",
  contactNumber: "",
  email: "",
  suggestion: "",
};

export const SuggestionForm = () => {
  const [formData, setFormData] = useState(initialState);
  const [message, setMessage] = useState(""); // ✅ for success/error feedback
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
      setMessage("✅ Thank you! Your suggestion has been submitted.");
      setFormData(initialState);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setMessage("❌ Something went wrong. Please try again later.");
      setLoading(false);
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

        {/* Submit Button */}
        <div className="flex items-center justify-center">
          <button
            disabled={loading}
            type="submit"
            className=" bg-red-600 text-white font-semibold p-3 rounded-lg hover:bg-yellow-500 transition-all "
          >
            {loading ? "Loading..." : "Send Suggestion"}
          </button>
        </div>

        {/* Success / Error Message */}
        {message && (
          <p
            className={`text-center mt-3 font-semibold ${
              message.startsWith("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
};
