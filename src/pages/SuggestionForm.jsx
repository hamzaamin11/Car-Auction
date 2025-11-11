import axios from "axios";
import React, { useState } from "react";
import { BASE_URL } from "../components/Contant/URL";
import toyotaImg from "../../src/assets/suggestion.jpeg";
import Swal from "sweetalert2";
import CustomButton from "../CustomButton";
const initialState = {
  name: "",
  contactNumber: "",
  email: "",
  suggestion: "",
};

export const SuggestionForm = () => {
  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  // handle contact number change with formatting
  const handleContactChange = (e) => {
    let value = e.target.value.replace(/\D/g, ""); // remove all non-digits

    // Ensure the number always starts with +92
    if (value.startsWith("92")) {
      value = "+" + value;
    } else if (!value.startsWith("+92")) {
      value = "+92" + value;
    }

    // Format like +92-300-1234567
    if (value.length > 3 && value.length <= 6) {
      value = value.slice(0, 3) + "-" + value.slice(3);
    } else if (value.length > 6 && value.length <= 10) {
      value =
        value.slice(0, 3) + "-" + value.slice(3, 6) + "-" + value.slice(6);
    } else if (value.length > 10) {
      value =
        value.slice(0, 3) + "-" + value.slice(3, 6) + "-" + value.slice(6, 15);
    }

    setFormData({ ...formData, contactNumber: value });
  };

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
        className="lg:w-1/3 w-full bg-white bg-opacity-95 p-6 rounded-lg shadow-lg space-y-2"
      >
        <h2 className="text-3xl font-bold text-gray-800 text-center">Send a Suggestion</h2>

        {/* Name */}
        <div>
          <label className="block mb-1 text-sm text-gray-900 font-semibold">
            Name
          </label>
          <input
            type="text"
            name="name"
            placeholder="Your full name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-500 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
            maxLength={20}
          />
        </div>

        {/* Contact Number */}
        <div>
          <label className="block mb-1 text-sm text-gray-900 font-semibold">
            Contact Number
          </label>
          <input
            type="tel"
            name="contactNumber"
            placeholder="+92-300-1234567"
            value={formData.contactNumber}
            onChange={handleContactChange}
            className="w-full border border-gray-400 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
            required
            maxLength={15}
          />
        </div>

        {/* Email */}
        <div>
          <label className="block mb-1 text-sm text-gray-900 font-semibold">
            Email
          </label>
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border border-gray-500 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
            maxLength={30}
          />
        </div>

        {/* Suggestion */}
        <div>
          <label className="block mb-1 text-sm text-gray-900 font-semibold">
            Suggestion
          </label>
          <textarea
            rows="5"
            name="suggestion"
            placeholder="Type your suggestion..."
            value={formData.suggestion}
            onChange={handleChange}
            required
            className="w-full border border-gray-500 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
            maxLength={150}
          />
        </div>

        {/* Submit Button with Loader */}
        <div className="flex items-center justify-center">
          <CustomButton text="Send Suggestion" /> 
        </div>
      </form>
    </div>
  );
};
